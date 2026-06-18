import type { Extension } from "@codemirror/state";
import type { LanguageSupport } from "@codemirror/language";
import { javascript } from "@/views/editCode/lang-js";

export type EditorLanguageId =
  | "auto"
  | "javascript"
  | "json"
  | "json5"
  | "yaml"
  | "ini"
  | "plaintext";

export type ActiveEditorLanguageId = Exclude<EditorLanguageId, "auto">;

export interface EditorLanguageOption {
  value: EditorLanguageId;
  label: string;
}

export interface FormatResult {
  ok: boolean;
  code: string;
  error?: unknown;
  reason?: "unsupported" | "invalid";
}

interface EditorLanguageDefinition {
  value: EditorLanguageId;
  label: string;
  canFormat: boolean;
  load?: () => Promise<Extension | LanguageSupport>;
}

type Json5Module = typeof import("json5");
type YamlModule = typeof import("yaml");

interface JsBeautifyModule {
  js_beautify: (source: string, options?: Record<string, unknown>) => string;
}

const SAMPLE_LIMIT = 4000;

const ACTIVE_LANGUAGE_IDS: ActiveEditorLanguageId[] = [
  "javascript",
  "json",
  "json5",
  "yaml",
  "ini",
  "plaintext",
];

const toSample = (code: string) => {
  const trimmed = (code || "").trim();
  if (trimmed.length <= SAMPLE_LIMIT) return trimmed;

  const sample = trimmed.slice(0, SAMPLE_LIMIT);
  const lastLineBreak = sample.lastIndexOf("\n");
  return lastLineBreak > SAMPLE_LIMIT * 0.6
    ? sample.slice(0, lastLineBreak).trimEnd()
    : sample;
};

const getSignificantLines = (text: string) =>
  text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .filter((line) => !/^\s*[#!;]/.test(line));

const hasJsonContainerShape = (text: string) =>
  /^[\[{]/.test(text) && /[\]}]$/.test(text);

const getYamlSignalScore = (text: string) =>
  getSignificantLines(text).reduce((score, line) => {
    const trimmed = line.trim();
    let lineScore = 0;

    if (/^---(?:\s|$)/.test(trimmed)) lineScore += 2;
    if (/^\s*-\s+\S/.test(line)) lineScore += 2;
    if (/^\s{2,}\S.*:\s*(?:\S|$)/.test(line)) lineScore += 2;
    if (/^\s*(?:"[^"]+"|'[^']+'|[\w.-][\w .-]*)\s*:\s*(?:\S|$)/.test(line)) {
      lineScore += 1;
    }
    if (/(?:^|\s)<<:\s*\*\w/.test(line) || /[&*][A-Za-z0-9_-]+/.test(line)) {
      lineScore += 2;
    }
    if (/:\s*[\[{]/.test(line)) lineScore += 1;

    return score + Math.min(lineScore, 3);
  }, 0);

const hasYamlIndicators = (text: string) => getYamlSignalScore(text) > 0;

const hasStrongYamlShape = (text: string) => getYamlSignalScore(text) >= 3;

const isPlainRecord = (value: unknown) =>
  Object.prototype.toString.call(value) === "[object Object]";

const isStructuredValue = (value: unknown) =>
  Array.isArray(value) || isPlainRecord(value);

const loadJson5 = async (): Promise<Json5Module> => {
  const module = (await import("json5")) as Json5Module & {
    default?: Json5Module;
  };

  return module.parse ? module : module.default ?? module;
};

const loadJsBeautify = async (): Promise<JsBeautifyModule> => {
  const module = (await import("js-beautify")) as JsBeautifyModule & {
    default?: JsBeautifyModule;
  };

  return module.js_beautify ? module : module.default ?? module;
};

const loadYaml = async (): Promise<YamlModule> => import("yaml");

const ensureTrailingNewline = (value: string) =>
  value.endsWith("\n") ? value : `${value}\n`;

const isValidJson = (text: string) => {
  if (!text || !hasJsonContainerShape(text)) return false;

  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

const isLikelyJson5 = async (text: string) => {
  if (!text || !hasJsonContainerShape(text)) return false;

  try {
    const JSON5 = await loadJson5();
    JSON5.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

const isLikelyIni = (text: string) => {
  if (!text || /^\{/.test(text)) return false;

  const rawLines = getSignificantLines(text);
  const hasYamlOnlySyntax = rawLines.some(
    (line) =>
      /^\s+\S/.test(line) ||
      /^\s*-\s+\S/.test(line) ||
      /(?:^|\s)<<:\s*\*\w/.test(line) ||
      /[&*][A-Za-z0-9_-]+/.test(line) ||
      /:\s*[\[{]/.test(line)
  );

  if (hasYamlOnlySyntax) return false;

  const lines = rawLines.map((line) => line.trim());

  if (!lines.length) return false;

  const hasSection = lines.some((line) => /^\[[^\]]+\]$/.test(line));
  const equalKeyValueCount = lines.filter((line) =>
    /^[A-Za-z0-9_.-]+\s*=\s*.+$/.test(line)
  ).length;
  const colonKeyValueCount = lines.filter((line) =>
    /^[A-Za-z0-9_.-]+\s*:\s*.+$/.test(line)
  ).length;

  return hasSection
    ? equalKeyValueCount + colonKeyValueCount > 0
    : equalKeyValueCount >= 2;
};

const isLikelyYaml = async (text: string) => {
  if (!text || !hasYamlIndicators(text)) return false;

  try {
    const YAML = await loadYaml();
    const document = YAML.parseDocument(text, { prettyErrors: false });
    if (document.errors.length) return hasStrongYamlShape(text);

    return isStructuredValue(document.toJS());
  } catch (error) {
    return hasStrongYamlShape(text);
  }
};

const getJavaScriptSignalScore = (text: string) => {
  let score = 0;

  if (/^\s*(?:async\s+)?function\s+[$A-Z_a-z][$\w]*\s*\(/m.test(text)) {
    score += 4;
  }
  if (/^\s*(?:const|let|var)\s+(?:[$A-Z_a-z][$\w]*|[{\[])/m.test(text)) {
    score += 3;
  }
  if (/^\s*(?:import|export)\s+/m.test(text)) score += 3;
  if (/(?:^|[^\w])=>/.test(text)) score += 3;
  if (/\$(?:server|options)\b/.test(text)) score += 3;
  if (/^\s*return(?:\s+|;|$)/m.test(text)) score += 2;
  if (/^\s*(?:if|for|while|switch)\s*\(/m.test(text)) score += 2;
  if (/^\s*(?:try|catch|finally)\b/m.test(text)) score += 2;
  if (/\bconsole\.[A-Za-z_$][\w$]*\s*\(/.test(text)) score += 2;
  if (/^\s*[$A-Z_a-z][$\w.[\]'"]*\s*=\s*.+/m.test(text)) score += 2;

  return score;
};

const isLikelyJavaScript = (text: string) => {
  if (!text) return false;

  return getJavaScriptSignalScore(text) >= 3;
};

export const EDITOR_LANGUAGE_OPTIONS: EditorLanguageOption[] = [
  { value: "auto", label: "Auto" },
  { value: "javascript", label: "JavaScript" },
  { value: "json", label: "JSON" },
  { value: "json5", label: "JSON5" },
  { value: "yaml", label: "YAML" },
  { value: "ini", label: "INI" },
  { value: "plaintext", label: "Plain Text" },
];

export const EDITOR_LANGUAGES: Record<
  EditorLanguageId,
  EditorLanguageDefinition
> = {
  auto: {
    value: "auto",
    label: "Auto",
    canFormat: false,
  },
  javascript: {
    value: "javascript",
    label: "JavaScript",
    canFormat: true,
    load: async () => javascript(),
  },
  json: {
    value: "json",
    label: "JSON",
    canFormat: true,
    load: async () => {
      const { json } = await import("@codemirror/lang-json");
      return json();
    },
  },
  json5: {
    value: "json5",
    label: "JSON5",
    canFormat: true,
    load: async () => javascript(),
  },
  yaml: {
    value: "yaml",
    label: "YAML",
    canFormat: true,
    load: async () => {
      const { yaml } = await import("@codemirror/lang-yaml");
      return yaml();
    },
  },
  ini: {
    value: "ini",
    label: "INI",
    canFormat: false,
    load: async () => {
      const [{ StreamLanguage }, { properties }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/properties"),
      ]);
      return StreamLanguage.define(properties);
    },
  },
  plaintext: {
    value: "plaintext",
    label: "Plain Text",
    canFormat: false,
  },
};

export const normalizeEditorLanguage = (
  value: unknown,
  fallback: EditorLanguageId = "auto"
): EditorLanguageId => {
  if (
    typeof value === "string" &&
    (value === "auto" || ACTIVE_LANGUAGE_IDS.includes(value as ActiveEditorLanguageId))
  ) {
    return value as EditorLanguageId;
  }

  return fallback;
};

export const getEditorLanguage = (value: unknown) =>
  EDITOR_LANGUAGES[normalizeEditorLanguage(value, "plaintext")];

export const canFormatEditorLanguage = (value: unknown) =>
  getEditorLanguage(value).canFormat;

export const detectEditorLanguage = async (
  code: string
): Promise<ActiveEditorLanguageId> => {
  const sample = toSample(code);
  if (!sample) return "plaintext";

  if (isValidJson(sample)) return "json";
  if (await isLikelyJson5(sample)) return "json5";
  if (isLikelyJavaScript(sample)) return "javascript";
  if (await isLikelyYaml(sample)) return "yaml";
  if (isLikelyIni(sample)) return "ini";

  return "plaintext";
};

export const loadEditorLanguageExtension = async (
  value: ActiveEditorLanguageId
) => {
  const definition = EDITOR_LANGUAGES[value];
  if (!definition?.load) return [];
  return definition.load();
};

export const formatEditorCode = async (
  value: ActiveEditorLanguageId,
  code: string
): Promise<FormatResult> => {
  try {
    if (value === "javascript") {
      const beautify = await loadJsBeautify();
      return {
        ok: true,
        code: beautify
          .js_beautify(code, { indent_size: 2 })
          .replace(/^\s*[\r\n]/gm, "\n"),
      };
    }

    if (value === "json") {
      return {
        ok: true,
        code: `${JSON.stringify(JSON.parse(code), null, 2)}\n`,
      };
    }

    if (value === "json5") {
      const [JSON5, beautify] = await Promise.all([
        loadJson5(),
        loadJsBeautify(),
      ]);
      JSON5.parse(code);
      return {
        ok: true,
        code: `${beautify
          .js_beautify(code, { indent_size: 2 })
          .replace(/^\s*[\r\n]/gm, "\n")}\n`,
      };
    }

    if (value === "yaml") {
      const YAML = await loadYaml();
      const document = YAML.parseDocument(code, { prettyErrors: false });
      if (document.errors.length) throw document.errors[0];
      if (!document.contents) {
        return {
          ok: true,
          code: code.trim() ? ensureTrailingNewline(code.trimEnd()) : "",
        };
      }

      const formatted = document.toString({
        indent: 2,
        lineWidth: 0,
      });
      return {
        ok: true,
        code: ensureTrailingNewline(formatted),
      };
    }

    return {
      ok: false,
      code,
      reason: "unsupported",
    };
  } catch (error) {
    return {
      ok: false,
      code,
      error,
      reason: "invalid",
    };
  }
};
