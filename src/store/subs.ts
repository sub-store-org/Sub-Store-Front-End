import { defineStore } from 'pinia';
import { useSubsApi } from '@/api/getData';

const subsApi = useSubsApi();

export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: {},
      collections: {},
    };
  },
  getters: {
    hasSubs: ({ subs }): boolean => Object.keys(subs).length > 0,
    hasCollections: ({ collections }): boolean =>
      Object.keys(collections).length > 0,
  },
  actions: {
    fetchSubsData() {
      this.subs = {};
      this.collections = {};
      return new Promise(async (resolve, reject) => {
        Promise.all([subsApi.getSubs(), subsApi.getCollections()])
          .then((res) => {
            this.subs = res[0].data;
            this.collections = res[1].data;
            resolve('');
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
