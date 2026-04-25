import { defineStore } from "pinia";

import {
  isLogsOverlayHistoryState,
  pushLogsOverlayHistoryState,
} from "@/utils/popupHistory";

type LogsOverlayStore = {
  isOpen: boolean;
  openFromHistory: () => void;
  closeFromHistory: () => void;
};

let activeStore: LogsOverlayStore | null = null;
let isPopstateListenerRegistered = false;

const handleLogsOverlayPopstate = (event: PopStateEvent) => {
  if (!activeStore) return;
  if (isLogsOverlayHistoryState(event.state)) {
    activeStore.openFromHistory();
    return;
  }

  if (!activeStore.isOpen) return;

  activeStore.closeFromHistory();
};

const ensurePopstateListener = (store: LogsOverlayStore) => {
  activeStore = store;

  if (isPopstateListenerRegistered || typeof window === "undefined") return;

  window.addEventListener("popstate", handleLogsOverlayPopstate, {
    capture: true,
  });
  isPopstateListenerRegistered = true;
};

export const useLogsOverlayStore = defineStore("logsOverlay", {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    open() {
      ensurePopstateListener(this);

      if (this.isOpen) return;

      this.isOpen = true;
      pushLogsOverlayHistoryState();
    },
    close() {
      ensurePopstateListener(this);

      if (!this.isOpen) return;

      if (isLogsOverlayHistoryState()) {
        this.isOpen = false;
        window.history.back();
        return;
      }

      this.isOpen = false;
    },
    openFromHistory() {
      this.isOpen = true;
    },
    closeFromHistory() {
      window.setTimeout(() => {
        this.isOpen = false;
      }, 0);
    },
    toggle() {
      if (this.isOpen) {
        this.close();
        return;
      }

      this.open();
    },
  },
});
