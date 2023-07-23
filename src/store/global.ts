import { defineStore } from 'pinia';
import { useEnvApi } from '@/api/env';

const envApi = useEnvApi();

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalStoreState => {
    return {
      isLoading: true,
      isFlowFetching: true,
      fetchResult: false,
      bottomSafeArea: 0,
      isDarkMode: false,
      env: {},
      isSimpleMode: localStorage.getItem('isSimpleMode') === 'on',
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
    setFlowFetching(isFlowFetching: boolean) {
      this.isFlowFetching = isFlowFetching;
    },
    setFetchResult(fetchResult: boolean) {
      this.fetchResult = fetchResult;
    },
    setDarkMode(isDarkMode: boolean) {
      this.isDarkMode = isDarkMode;
    },
    setSimpleMode(isSimpleMode: boolean) {
      if (isSimpleMode) {
        localStorage.setItem('isSimpleMode', 'on');
      } else {
        localStorage.removeItem('isSimpleMode');
      }
      this.isSimpleMode = isSimpleMode;
    },
    async setEnv() {
      const res = await envApi.getEnv();
      if (res.data.status === 'success') {
        this.env = res.data.data;
      }
    },
  },
});
