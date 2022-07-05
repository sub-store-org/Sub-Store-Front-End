import { defineStore } from 'pinia';
import { useEnvApi } from '@/api/env';

const envApi = useEnvApi();

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalStoreState => {
    return {
      isLoading: true,
      fetchResult: false,
      bottomSafeArea: 0,
      isDarkMode: false,
      env: {},
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
    setDarkMode(isDarkMode: boolean) {
      this.isDarkMode = isDarkMode;
    },
    async getEnv() {
      const { data } = await envApi.getEnv();
      this.env = data;
    },
  },
});
