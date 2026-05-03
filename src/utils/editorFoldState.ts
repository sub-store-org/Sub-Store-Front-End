type StoredEditorFoldState = {
  path?: string;
  state?: "folded" | "unfolded";
  isFold?: boolean | number;
  value?: string;
};

const MAX_FOLD_STATE_COUNT = 50;

const readFoldStates = (storageKey: string): StoredEditorFoldState[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    const states = raw ? JSON.parse(raw) : [];
    return Array.isArray(states) ? states : [];
  } catch (e) {
    return [];
  }
};

export const getEditorFoldState = (storageKey: string, path: string) => {
  const item = readFoldStates(storageKey).find((state) => state.path === path);

  if (item?.state === "folded" || item?.state === "unfolded") {
    return item.state;
  }

  return item?.isFold ? "folded" : undefined;
};

export const getEditorIsFolded = (
  storageKey: string,
  path: string,
  defaultFolded: boolean,
) => {
  const state = getEditorFoldState(storageKey, path);
  if (state === "folded") return true;
  if (state === "unfolded") return false;

  return defaultFolded;
};

export const setEditorFoldState = (
  storageKey: string,
  path: string,
  isFolded: boolean,
) => {
  const states = readFoldStates(storageKey).filter((state) => state.path !== path);

  states.unshift({
    path,
    state: isFolded ? "folded" : "unfolded",
  });

  if (states.length > MAX_FOLD_STATE_COUNT) {
    states.length = MAX_FOLD_STATE_COUNT;
  }

  localStorage.setItem(storageKey, JSON.stringify(states));
};

export const getEditorRouteValue = (storageKey: string, path: string) => {
  const item = readFoldStates(storageKey).find((state) => state.path === path);

  return typeof item?.value === "string" ? item.value : undefined;
};

export const setEditorRouteValue = (
  storageKey: string,
  path: string,
  value: string,
) => {
  const states = readFoldStates(storageKey).filter((state) => state.path !== path);

  states.unshift({
    path,
    value,
  });

  if (states.length > MAX_FOLD_STATE_COUNT) {
    states.length = MAX_FOLD_STATE_COUNT;
  }

  localStorage.setItem(storageKey, JSON.stringify(states));
};
