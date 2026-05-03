import { defineStore } from "pinia";

interface ListSearchStoreState {
  query: string;
  activeRoutePath: string;
  isSearchOpen: boolean;
}

export const useListSearchStore = defineStore("listSearchStore", {
  state: (): ListSearchStoreState => ({
    query: "",
    activeRoutePath: "",
    isSearchOpen: false,
  }),
  getters: {
    normalizedQuery: ({ query }) => query.trim().toLowerCase(),
    hasQuery(): boolean {
      return this.normalizedQuery.length > 0;
    },
  },
  actions: {
    open(routePath: string) {
      this.activeRoutePath = routePath;
      this.isSearchOpen = true;
    },
    close() {
      this.isSearchOpen = false;
      this.query = "";
      this.activeRoutePath = "";
    },
    setQuery(query: string) {
      this.query = query;
    },
    syncRoute(routePath: string, supported: boolean) {
      if (!supported || this.activeRoutePath !== routePath) {
        this.close();
      }
    },
  },
});
