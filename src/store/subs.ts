import { defineStore } from 'pinia';
import { useSubsApi } from '@/api/subs';

const subsApi = useSubsApi();

export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: [],
      collections: [],
      flows: {},
    };
  },
  getters: {
    hasSubs: ({ subs }): boolean => subs.length > 0,
    hasCollections: ({ collections }): boolean => collections.length > 0,
    getOneSub:
      ({ subs }): GetOne<Sub> =>
      (name: string) =>
        subs.find(sub => sub.name === name),
    getOneCollection:
      ({ collections }): GetOne<Collection> =>
      (name: string): Collection =>
        collections.find(collection => collection.name === name),
  },
  actions: {
    async fetchSubsData() {
      return new Promise(async (resolve, reject) => {
        Promise.all([subsApi.getSubs(), subsApi.getCollections()])
          .then(res => {
            this.subs = res[0].data;
            this.collections = res[1].data;
            resolve('');
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    async updateOneData(type: string, name: string) {
      return new Promise(async (resolve, reject) => {
        try {
          let data;
          if (type === 'subs') {
            data = await subsApi.getOne('sub', name);
          } else if (type === 'collections') {
            data = await subsApi.getOne('collection', name);
          }
          const index = this[type].findIndex(item => item.name === name);
          this[type][index] = data.data;
          resolve('');
        } catch {
          reject('');
        }
      });
    },
    async fetchFlows() {
      // 提取所有的 remote 的 url，储存为 hash 表
      const flowNameHash = {};
      this.subs.forEach(sub => {
        if (sub.source === 'remote') {
          flowNameHash[sub.url]
            ? flowNameHash[sub.url].push(sub.name)
            : (flowNameHash[sub.url] = [sub.name]);
        }
      });

      return new Promise(async resolve => {
        const nameList = [];

        // 取出每个 hash 表里每个 url 的第一个 name
        for (const url in flowNameHash) {
          nameList.push([url, flowNameHash[url][0]]);
        }

        // 用该 name 请求流量信息 并按 url 存入 store 中
        for (let i = 0; i < nameList.length; i++) {
          const [url, name] = nameList[i];
          try {
            this.flows[url] = await subsApi.getFlow(name);
          } catch (e) {
            this.flows[url] = e;
          }
        }
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
          .catch(err => {
            reject(err);
          });
      });
    },
  },
});
