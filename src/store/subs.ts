import { defineStore } from 'pinia';
import { useGetDataApi } from '@/api/getData';

const subsApi = useGetDataApi();

export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: {},
    };
  },
  getters: {},
  actions: {
    async fetchSubs() {
      const response = await subsApi.getSubs();
      this.subs = response.data;
    },
  },
});
