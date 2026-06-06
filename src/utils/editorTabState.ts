import {
  getEditorRouteValue,
  setEditorRouteValue,
} from "@/utils/editorFoldState";

export const getEditorActiveTab = <T extends string>(
  storageKey: string,
  path: string,
  availableTabs: readonly T[],
  defaultTab: T,
) => {
  const rememberedTab = getEditorRouteValue(storageKey, path);

  return availableTabs.includes(rememberedTab as T)
    ? rememberedTab as T
    : defaultTab;
};

export const setEditorActiveTab = (
  storageKey: string,
  path: string,
  value: string,
) => {
  setEditorRouteValue(storageKey, path, value);
};
