import { defineStore } from 'pinia';
import { useGetDataApi } from '@/api/getData';

const subsApi = useGetDataApi();

export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: {},
      collections: {},
    };
  },
  getters: {
    hasSubs: (state): boolean => Object.keys(state.subs).length > 0,
    hasCollections: (state): boolean =>
      Object.keys(state.collections).length > 0,
  },
  actions: {
    fetchSubsData() {
      return new Promise(async (resolve, reject) => {
        try {
          const subsRes = await subsApi.getSubs();
          const collectionsRes = await subsApi.getCollections();
          this.subs = subsRes.data;
          this.collections = collectionsRes.data;
          resolve('');
        } catch (e) {
          reject({ msg: e.message });
        }
      });
    },
  },
});
