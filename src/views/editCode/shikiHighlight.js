import { RangeSetBuilder, StateEffect } from "@codemirror/state";
import { Decoration, ViewPlugin } from "@codemirror/view";
import {
  SHIKI_THEMES,
  SHIKI_THEME_REGISTRATIONS,
  YAML_KEY_LEVEL_COLORS,
} from "@/views/editCode/shikiThemes";

const LANGUAGE_LOADERS = {
  javascript: () =>
    import("shiki/langs/javascript.mjs").then((module) => module.default),
  json: () => import("shiki/langs/json.mjs").then((module) => module.default),
  json5: () =>
    import("shiki/langs/json5.mjs").then((module) => module.default),
  yaml: () => import("shiki/langs/yaml.mjs").then((module) => module.default),
  ini: () => import("shiki/langs/ini.mjs").then((module) => module.default),
};

const shikiRefreshEffect = StateEffect.define();
const loadedLanguages = new Set();
const languageLoadPromises = new Map();

let highlighterPromise;

const getHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
    ]).then(
      ([
        { createHighlighterCore },
        { createJavaScriptRegexEngine },
      ]) =>
        createHighlighterCore({
          themes: SHIKI_THEME_REGISTRATIONS,
          langs: [],
          engine: createJavaScriptRegexEngine(),
        })
    );
  }

  return highlighterPromise;
};

const ensureLanguageLoaded = async (language) => {
  const loadLanguage = LANGUAGE_LOADERS[language];
  if (!loadLanguage) return null;

  const highlighter = await getHighlighter();
  if (loadedLanguages.has(language)) return highlighter;

  if (!languageLoadPromises.has(language)) {
    languageLoadPromises.set(
      language,
      loadLanguage()
        .then((grammar) => highlighter.loadLanguage(grammar))
        .then(() => {
          loadedLanguages.add(language);
        })
        .catch((error) => {
          languageLoadPromises.delete(language);
          throw error;
        })
    );
  }

  await languageLoadPromises.get(language);
  return highlighter;
};

const getYamlKeyLevel = (doc, from, to) => {
  const line = doc.lineAt(from);
  if (to > line.to) return undefined;

  const text = line.text;
  const match = text.match(/^(\s*)(?:-\s*)?([^#\s][^:]*?)\s*:/);
  if (!match) return undefined;

  const keyStart = line.from + match[0].indexOf(match[2]);
  const keyEnd = keyStart + match[2].length;
  if (from < keyStart || to > keyEnd) return undefined;

  return Math.floor(match[1].length / 2);
};

const tokenStyle = (token, colorOverride) => {
  const styles = [];
  const textDecorations = [];
  const fontStyle = token.fontStyle;

  if (colorOverride || token.color) {
    styles.push(`color: ${colorOverride || token.color} !important`);
  }

  if (typeof fontStyle === "number" && fontStyle > 0) {
    if (fontStyle & 1) styles.push("font-style: italic !important");
    if (fontStyle & 2) styles.push("font-weight: 700 !important");
    if (fontStyle & 4) textDecorations.push("underline");
    if (fontStyle & 8) textDecorations.push("line-through");
  }

  if (textDecorations.length) {
    styles.push(`text-decoration: ${textDecorations.join(" ")} !important`);
  }

  return styles.join("; ");
};

const buildDecorations = (doc, tokenLines, { language, dark }) => {
  const builder = new RangeSetBuilder();
  let fallbackOffset = 0;
  const yamlKeyColors =
    language === "yaml" ? YAML_KEY_LEVEL_COLORS[dark ? "dark" : "light"] : null;

  for (const line of tokenLines) {
    for (const token of line) {
      const content = token.content || "";
      const from =
        typeof token.offset === "number" ? token.offset : fallbackOffset;
      const to = from + content.length;
      fallbackOffset = to;

      if (!content || !/\S/.test(content) || from >= to || to > doc.length) {
        continue;
      }

      const yamlKeyLevel = yamlKeyColors
        ? getYamlKeyLevel(doc, from, to)
        : undefined;
      const colorOverride =
        yamlKeyLevel === undefined
          ? undefined
          : yamlKeyColors[yamlKeyLevel % yamlKeyColors.length];
      const style = tokenStyle(token, colorOverride);
      if (!style) continue;

      builder.add(
        from,
        to,
        Decoration.mark({
          class: "cm-shiki-token",
          attributes: { style },
        })
      );
    }

    fallbackOffset += 1;
  }

  return builder.finish();
};

const shikiHighlightPlugin = ViewPlugin.fromClass(
  class {
    constructor(view, options) {
      this.options = options;
      this.decorations = Decoration.none;
      this.destroyed = false;
      this.requestId = 0;
      this.timer = undefined;
      this.schedule(view, 0);
    }

    update(update) {
      if (update.docChanged) {
        this.decorations = this.decorations.map(update.changes);
        this.schedule(update.view, 80);
      }
    }

    destroy() {
      this.destroyed = true;
      this.requestId += 1;
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
      }
    }

    schedule(view, delay) {
      const requestId = ++this.requestId;
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.highlight(view, requestId);
      }, delay);
    }

    async highlight(view, requestId) {
      const language = this.options.language;
      const theme = this.options.dark ? SHIKI_THEMES.dark : SHIKI_THEMES.light;
      const code = view.state.doc.toString();

      if (!code) {
        this.setDecorations(view, requestId, Decoration.none);
        return;
      }

      try {
        const highlighter = await ensureLanguageLoaded(language);
        if (!highlighter) return;

        const result = highlighter.codeToTokens(code, { lang: language, theme });
        this.setDecorations(
          view,
          requestId,
          buildDecorations(view.state.doc, result.tokens, {
            language,
            dark: this.options.dark,
          })
        );
      } catch (error) {
        console.error("Shiki highlight failed", error);
        this.setDecorations(view, requestId, Decoration.none);
      }
    }

    setDecorations(view, requestId, decorations) {
      if (this.destroyed || requestId !== this.requestId) return;

      this.decorations = decorations;
      view.dispatch({
        effects: shikiRefreshEffect.of(null),
      });
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  }
);

export const shikiHighlight = ({ language, dark }) => {
  if (!LANGUAGE_LOADERS[language]) return [];

  return shikiHighlightPlugin.of({
    language,
    dark,
  });
};
