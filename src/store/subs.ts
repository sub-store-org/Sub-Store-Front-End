import { defineStore } from 'pinia';
import { useSubsApi } from '@/api/subs';
import { Notify } from '@nutui/nutui';
import i18n from '@/locales';
import { getFlowsUrlList } from '@/utils/getFlowsUrlList';

const { t } = i18n.global;
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
      Promise.all([subsApi.getSubs(), subsApi.getCollections()]).then(res => {
        if ('data' in res[0].data) {
          this.subs = res[0].data.data;
        }
        if ('data' in res[1].data) {
          this.collections = res[1].data.data;
        }
      });
    },
    async updateOneData(type: string, name: string) {
      let res;
      if (type === 'subs') {
        res = await subsApi.getOne('sub', name);
      } else if (type === 'collections') {
        res = await subsApi.getOne('collection', name);
      }
      if (res.data.status === 'success') {
        const index = this[type].findIndex(item => item.name === name);
        this[type][index] = res.data.data;
      }
    },
    async fetchFlows() {
      this.flows = {};
      const asyncGetFlow = async ([url, name]) => {
        const { data } = await subsApi.getFlow(name);
        this.flows[url] = data;
      };
      getFlowsUrlList(this.subs).forEach(asyncGetFlow);
    },
    async deleteSub(type: SubsType, name: string) {
      const { data } = await subsApi.deleteSub(type, name);
      if (data.status === 'success') {
        await this.fetchSubsData();
        Notify.danger(t('subPage.deleteSub.succeedNotify'), { duration: 1500 });
      }
    },
  },
});
