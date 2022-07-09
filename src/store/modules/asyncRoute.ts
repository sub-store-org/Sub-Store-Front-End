import { defineStore } from 'pinia';
import { store } from '@/store';

export const useAsyncRouteStore = defineStore({
  id: 'app-async-route',
  state: () => ({
    keepAliveComponents: [],
  }),
  getters: {},
  actions: {
    setKeepAliveComponents(compNames) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
  },
});

// Need to be used outside the setup
export function useAsyncRouteStoreWidthOut() {
  return useAsyncRouteStore(store);
}
