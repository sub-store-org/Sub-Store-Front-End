import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalStoreState => {
    return {
      isLoading: false,
      fetchResult: false,
      bottomSafeArea: 0,
    };
  },
  getters: {},
  actions: {
    setBottomSafeArea(height: number) {
      this.bottomSafeArea = height;
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
    setFetchResult(fetchResult: boolean) {
      this.fetchResult = fetchResult;
    },
  },
});
