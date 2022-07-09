import { defineStore } from 'pinia';
import { store } from '@/store';

export const useAsyncRouteStore = defineStore({
  id: 'app-async-route',
  state: () => ({
    keepAliveComponents: [],
    editRoute: null, // 保存编辑页面的路由
  }),
  getters: {},
  actions: {
    setKeepAliveComponents(compNames) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
    setEditRoute(route) {
      this.editRoute = route;
    },
  },
});

// Need to be used outside the setup
export function useAsyncRouteStoreWidthOut() {
  return useAsyncRouteStore(store);
}
