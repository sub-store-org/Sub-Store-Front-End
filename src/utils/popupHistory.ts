export const LOGS_PATH = "/logs";
export const POPUP_HISTORY_KEY = "subStorePopup";
export const LOGS_OVERLAY_HISTORY_KEY = "subStoreLogsOverlay";

const getHistoryState = () => {
  if (typeof window === "undefined") return {};
  return window.history.state || {};
};

export const pushPopupHistoryState = () => {
  if (typeof window === "undefined") return;

  window.history.pushState(
    {
      ...getHistoryState(),
      [POPUP_HISTORY_KEY]: true,
    },
    "",
    "",
  );
};

export const isLogsOverlayHistoryState = (state = getHistoryState()) => {
  return Boolean(state?.[LOGS_OVERLAY_HISTORY_KEY]);
};

export const isPopupHistoryState = (state = getHistoryState()) => {
  return Boolean(state?.[POPUP_HISTORY_KEY]);
};

export const pushLogsOverlayHistoryState = () => {
  if (typeof window === "undefined") return;

  if (isLogsOverlayHistoryState()) return;

  window.history.pushState(
    {
      ...getHistoryState(),
      [LOGS_OVERLAY_HISTORY_KEY]: true,
    },
    "",
    "",
  );
};
