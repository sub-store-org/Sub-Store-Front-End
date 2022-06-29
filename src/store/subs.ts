import { defineStore } from 'pinia';
import { useSubsApi } from '@/api/getData';

const subsApi = useSubsApi();

export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: {},
      collections: {},
      flows: {},
    };
  },
  getters: {
    hasSubs: ({ subs }): boolean => Object.keys(subs).length > 0,
    hasCollections: ({ collections }): boolean =>
      Object.keys(collections).length > 0,
  },
  actions: {
    async fetchSubsData() {
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
    async fetchFlows() {
      return new Promise(async (resolve, reject) => {
        const remoteSubsName = [];
        const errList = [];

        for (const name in this.subs) {
          if (this.subs[name].source === 'remote') {
            remoteSubsName.push(name);
          }
        }

        for (let i = 0; i < remoteSubsName.length; i++) {
          const name = remoteSubsName[i];
          try {
            this.flows[name] = await subsApi.getFlow(name);
          } catch (e) {
            this.flows[name] = e;
            errList.push(e);
          }
        }

        if (errList.length > 0) reject(errList);
        resolve('');
      });
    },
    async deleteSub(type: SubsType, name: string) {
      return new Promise(async (resolve, reject) => {
        subsApi
          .deleteSub(type, name)
          .then(() => {
            resolve('删除成功');
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
  },
});
