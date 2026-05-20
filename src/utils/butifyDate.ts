import "dayjs/locale/zh";
import "dayjs/locale/en";
import "dayjs/locale/ru";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { getLocaleConfig, normalizeLocale } from "@/locales/languages";

dayjs.extend(relativeTime);

export const butifyDate = (date: number): string => {
  const locale = normalizeLocale(
    localStorage.getItem("locale") || navigator.language,
  );
  const { dayjsLocale } = getLocaleConfig(locale);
  const diff = date - Date.now();

  if (diff >= 0 && diff <= 60 * 1000) {
    if (locale === "zh") return "刚刚";
    if (locale === "ru") return "только что";
    return "just now";
  }

  return dayjs(date).locale(dayjsLocale).fromNow();
};
