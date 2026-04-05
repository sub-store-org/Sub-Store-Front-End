import { defineStore } from "pinia";

export const useListPageViewStore = defineStore("listPageViewStore", {
  state: () => {
    return {
      singleColumnLockRoutePath: "",
    };
  },
  getters: {
    hasSingleColumnLock: (state) => {
      return Boolean(state.singleColumnLockRoutePath);
    },
  },
  actions: {
    lockToSingleColumn(routePath: string) {
      this.singleColumnLockRoutePath = routePath;
    },
    unlockSingleColumn(routePath?: string) {
      if (!routePath || this.singleColumnLockRoutePath === routePath) {
        this.singleColumnLockRoutePath = "";
      }
    },
  },
});
