import fs from "node:fs";
import process from "node:process";
import vm from "node:vm";

const localeFiles = {
  zh: "src/locales/zh.ts",
  en: "src/locales/en.ts",
  ru: "src/locales/ru.ts",
};

const loadLocale = (filePath) => {
  const code = fs
    .readFileSync(filePath, "utf8")
    .replace(/^export default/, "module.exports =");
  const sandbox = {
    module: { exports: {} },
    exports: {},
  };

  vm.runInNewContext(code, sandbox, { filename: filePath });
  return sandbox.module.exports;
};

const flatten = (value, prefix = "", result = new Map()) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      flatten(item, `${prefix}[${index}]`, result),
    );
    return result;
  }

  if (value && typeof value === "object") {
    Object.keys(value).forEach((key) => {
      flatten(value[key], prefix ? `${prefix}.${key}` : key, result);
    });
    return result;
  }

  result.set(prefix, value);
  return result;
};

const getPlaceholders = (value) => {
  if (typeof value !== "string") return [];
  return [...value.matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort();
};

const formatList = (items) => items.map((item) => `  - ${item}`).join("\n");

const locales = Object.fromEntries(
  Object.entries(localeFiles).map(([locale, filePath]) => [
    locale,
    flatten(loadLocale(filePath)),
  ]),
);

let hasError = false;
const baselineLocale = "zh";
const baseline = locales[baselineLocale];
const baselineKeys = [...baseline.keys()].sort();

for (const [locale, entries] of Object.entries(locales)) {
  const keys = [...entries.keys()].sort();
  const missing = baselineKeys.filter((key) => !entries.has(key));
  const extra = keys.filter((key) => !baseline.has(key));

  if (missing.length > 0) {
    hasError = true;
    console.error(
      `${localeFiles[locale]} is missing ${missing.length} locale key(s):\n${formatList(missing)}`,
    );
  }

  if (extra.length > 0) {
    hasError = true;
    console.error(
      `${localeFiles[locale]} has ${extra.length} extra locale key(s):\n${formatList(extra)}`,
    );
  }
}

for (const key of baselineKeys) {
  const expectedPlaceholders = getPlaceholders(baseline.get(key)).join(",");

  for (const [locale, entries] of Object.entries(locales)) {
    if (!entries.has(key)) continue;

    const value = entries.get(key);
    const actualPlaceholders = getPlaceholders(value).join(",");

    if (actualPlaceholders !== expectedPlaceholders) {
      hasError = true;
      console.error(
        `${localeFiles[locale]} has placeholder mismatch at ${key}: expected [${expectedPlaceholders}], got [${actualPlaceholders}]`,
      );
    }
  }
}

const languagesFile = fs.readFileSync("src/locales/languages.ts", "utf8");
for (const locale of Object.keys(localeFiles)) {
  if (!new RegExp(`key:\\s*["']${locale}["']`).test(languagesFile)) {
    hasError = true;
    console.error(
      `src/locales/languages.ts does not register locale key '${locale}'`,
    );
  }
}

if (hasError) {
  process.exit(1);
}

console.log(
  `Locale check passed for ${Object.keys(localeFiles).join(", ")} (${baselineKeys.length} keys).`,
);
