export const DEFAULT_LOCALE = "zh";

export const SUPPORTED_LOCALES = [
  {
    key: "zh",
    labelKey: "navBar.langSwitcher.zh",
    dayjsLocale: "zh",
    datePickerLocale: "zh-CN",
  },
  {
    key: "en",
    labelKey: "navBar.langSwitcher.en",
    dayjsLocale: "en",
    datePickerLocale: "en-US",
  },
  {
    key: "ru",
    labelKey: "navBar.langSwitcher.ru",
    dayjsLocale: "ru",
    datePickerLocale: "ru-RU",
  },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]["key"];

const SUPPORTED_LOCALE_KEYS = SUPPORTED_LOCALES.map((locale) => locale.key);

export const normalizeLocale = (value?: string | null): SupportedLocale => {
  const localePrefix = String(value || "")
    .toLowerCase()
    .split(/[-_]/)[0];

  return SUPPORTED_LOCALE_KEYS.includes(localePrefix as SupportedLocale)
    ? (localePrefix as SupportedLocale)
    : DEFAULT_LOCALE;
};

export const getInitialLocale = (): SupportedLocale => {
  return normalizeLocale(localStorage.getItem("locale") || navigator.language);
};

export const getLocaleConfig = (locale?: string | null) => {
  const normalizedLocale = normalizeLocale(locale);
  return (
    SUPPORTED_LOCALES.find((item) => item.key === normalizedLocale) ||
    SUPPORTED_LOCALES[0]
  );
};
