const oneDark = {
  bg: "#282c34",
  fg: "#abb2bf",
  comment: "#5c6370",
  red: "#e06c75",
  orange: "#d19a66",
  yellow: "#e5c07b",
  green: "#98c379",
  cyan: "#56b6c2",
  blue: "#61afef",
  purple: "#c678dd",
  grey: "#7f848e",
  bracket: "#abb2bf",
  template: "#56b6c2",
  regexp: "#56b6c2",
  variable: "#e06c75",
  property: "#61afef",
  operator: "#c678dd",
};

const oneLight = {
  bg: "#fafafa",
  fg: "#383a42",
  comment: "#a0a1a7",
  red: "#e45649",
  orange: "#c18401",
  yellow: "#986801",
  green: "#50a14f",
  cyan: "#0184bc",
  blue: "#4078f2",
  purple: "#a626a4",
  grey: "#7d818c",
  bracket: "#383a42",
  template: "#0184bc",
  regexp: "#0184bc",
  variable: "#e45649",
  property: "#4078f2",
  operator: "#a626a4",
};

const createRichTheme = ({ name, type, colors }) => ({
  name,
  type,
  colors: {
    "editor.background": colors.bg,
    "editor.foreground": colors.fg,
  },
  tokenColors: [
    {
      settings: {
        background: colors.bg,
        foreground: colors.fg,
      },
    },
    {
      scope: [
        "comment",
        "punctuation.definition.comment",
        "string.comment",
      ],
      settings: {
        foreground: colors.comment,
      },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "string.unquoted.plain.out.yaml",
      ],
      settings: {
        foreground: colors.green,
      },
    },
    {
      scope: [
        "string.regexp",
        "constant.other.character-class.regexp",
      ],
      settings: {
        foreground: colors.regexp,
      },
    },
    {
      scope: [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "constant.character.escape",
      ],
      settings: {
        foreground: colors.template,
      },
    },
    {
      scope: [
        "punctuation.definition.string.begin",
        "punctuation.definition.string.end",
      ],
      settings: {
        foreground: colors.grey,
      },
    },
    {
      scope: [
        "constant.numeric",
        "constant.numeric.integer.yaml",
        "constant.numeric.float.yaml",
      ],
      settings: {
        foreground: colors.orange,
      },
    },
    {
      scope: [
        "constant.language.boolean",
        "constant.language.boolean.yaml",
        "constant.language.json",
        "constant.language.null",
        "constant.language.undefined",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      scope: [
        "storage.modifier.async",
        "storage.modifier.static",
        "storage.modifier.access",
      ],
      settings: {
        foreground: colors.orange,
        fontStyle: "italic",
      },
    },
    {
      scope: [
        "keyword.control.conditional",
        "keyword.control.loop",
        "keyword.control.switch",
      ],
      settings: {
        foreground: colors.purple,
        fontStyle: "",
      },
    },
    {
      scope: [
        "keyword.control.flow",
      ],
      settings: {
        foreground: colors.purple,
        fontStyle: "italic",
      },
    },
    {
      scope: [
        "keyword.control.trycatch",
        "keyword.control.import",
        "keyword.control.export",
      ],
      settings: {
        foreground: colors.purple,
        fontStyle: "",
      },
    },
    {
      scope: [
        "storage.type",
        "storage.modifier",
      ],
      settings: {
        foreground: colors.purple,
        fontStyle: "italic",
      },
    },
    {
      scope: [
        "storage.type.function",
        "storage.type.function.arrow",
        "keyword.operator.arrow",
      ],
      settings: {
        foreground: colors.purple,
        fontStyle: "",
      },
    },
    {
      scope: [
        "keyword.operator.assignment",
        "keyword.operator.arithmetic",
        "keyword.operator.comparison",
        "keyword.operator.logical",
        "keyword.operator.ternary",
      ],
      settings: {
        foreground: colors.operator,
      },
    },
    {
      scope: [
        "punctuation.accessor",
        "punctuation.definition.array",
        "punctuation.definition.binding-pattern.object",
        "punctuation.definition.block",
        "punctuation.definition.dictionary",
        "punctuation.definition.entity.ini",
        "punctuation.definition.parameters",
        "punctuation.support.type.property-name",
        "punctuation.separator.comma",
        "punctuation.separator.dictionary",
        "punctuation.separator.key-value.mapping.yaml",
        "punctuation.separator.key-value.ini",
        "punctuation.definition.block.sequence.item.yaml",
        "punctuation.separator",
        "meta.brace",
      ],
      settings: {
        foreground: colors.grey,
      },
    },
    {
      scope: [
        "punctuation.definition.array",
        "punctuation.definition.block",
        "punctuation.definition.dictionary",
        "punctuation.definition.parameters",
        "meta.brace",
      ],
      settings: {
        foreground: colors.bracket,
      },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "support.method",
      ],
      settings: {
        foreground: colors.blue,
      },
    },
    {
      scope: [
        "entity.name.type",
        "support.class",
        "support.type",
      ],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      scope: [
        "entity.name.section.group-title.ini",
        "support.constant",
        "constant.other",
      ],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      scope: [
        "variable.language.this",
        "variable.language.super",
      ],
      settings: {
        foreground: colors.yellow,
      },
    },
    {
      scope: [
        "variable.parameter",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      scope: [
        "variable.other.constant",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      scope: [
        "meta.object-binding-pattern-variable variable.other.constant",
        "meta.object-binding-pattern-variable meta.definition.variable",
      ],
      settings: {
        foreground: colors.property,
      },
    },
    {
      scope: [
        "keyword.other.definition.ini",
      ],
      settings: {
        foreground: colors.property,
      },
    },
    {
      scope: [
        "variable.other.readwrite",
        "variable.other.object",
        "support.variable",
      ],
      settings: {
        foreground: colors.variable,
      },
    },
    {
      scope: [
        "variable.other.property",
        "meta.object-literal.key",
        "meta.property-name",
        "support.variable.property",
      ],
      settings: {
        foreground: colors.property,
      },
    },
    {
      scope: [
        "entity.name.tag.yaml",
        "entity.name.tag",
      ],
      settings: {
        foreground: colors.purple,
      },
    },
    {
      scope: [
        "invalid",
        "invalid.illegal",
      ],
      settings: {
        foreground: colors.red,
      },
    },
  ],
});

export const SHIKI_THEMES = {
  dark: "sub-store-one-dark-rich",
  light: "sub-store-one-light-rich",
};

export const SHIKI_THEME_REGISTRATIONS = [
  createRichTheme({
    name: SHIKI_THEMES.dark,
    type: "dark",
    colors: oneDark,
  }),
  createRichTheme({
    name: SHIKI_THEMES.light,
    type: "light",
    colors: oneLight,
  }),
];

export const YAML_KEY_LEVEL_COLORS = {
  dark: [
    oneDark.purple,
    oneDark.blue,
    oneDark.cyan,
    oneDark.green,
    oneDark.orange,
    oneDark.red,
    oneDark.yellow,
    oneDark.fg,
  ],
  light: [
    oneLight.purple,
    oneLight.blue,
    oneLight.cyan,
    oneLight.green,
    oneLight.orange,
    oneLight.red,
    oneLight.yellow,
    oneLight.fg,
  ],
};
