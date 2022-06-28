import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalStoreState => {
    return {
      bottomSafeArea: 0,
    };
  },
  getters: {},
  actions: {
    setBottomSafeArea(height: number) {
      this.bottomSafeArea = height;
    },
  },
});
