import { useSubsApi } from '@/api/subs';
import { useFilesApi } from '@/api/files';
import i18n from '@/locales';
import { useAppNotifyStore } from '@/store/appNotify';
import { getFlowsUrlList } from '@/utils/getFlowsUrlList';
import { defineStore } from 'pinia';

const { t } = i18n.global;
const subsApi = useSubsApi();
const filesApi = useFilesApi();

export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: [],
      collections: [],
      flows: {},
      files: [],
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
    hasFiles: ({ files }): boolean => files.length > 0,
    getOneFile:
      ({ files }): GetOne<any> =>
      (name: string) =>
        files.find(file => file.name === name),
  },
  actions: {
    async fetchSubsData() {
      await Promise.all([subsApi.getSubs(), subsApi.getCollections(), filesApi.getWholeFiles()]).then(res => {
        if ('data' in res[0].data) {
          this.subs = res[0].data.data.map(i => {
            if (!Array.isArray(i.tag)) {
              i.tag = []
            }
            return i
          });
        }
        if ('data' in res[1].data) {
          this.collections = res[1].data.data.map(i => {
            if (!Array.isArray(i.tag)) {
              i.tag = []
            }
            return i
          });
        }
        if ('data' in res[2].data) {
          this.files = res[2].data.data;
        }
      });
    },
    async updateOneData(type: string, name: string) {
      let res;
      if (type === 'subs') {
        res = await subsApi.getOne('sub', name);
      } else if (type === 'collections') {
        res = await subsApi.getOne('collection', name);
      } else if (type === 'files') {
        res = await filesApi.getWholeFile(name);
      }
      if (res?.data?.status === 'success') {
        const index = this[type].findIndex(item => item.name === name);
        this[type][index] = res.data.data;
      }
    },
    async fetchFlows(sub?: Sub[]) {
      type FlowUrlItem = [string, string, boolean, boolean, boolean];
      const asyncGetFlow = async (item: FlowUrlItem) => {
        const [url, name, noFlow, hideExpire, showRemaining] = item;
        if (noFlow) {
          this.flows[url] = { status:'noFlow' };
          return false;
        }
        try {
          const { data } = await subsApi.getFlow(name);
          this.flows[url] = {...data, hideExpire, showRemaining };
        } catch (e) {
          this.flows[url] = { status: 'error' };
        }
      };
      // 并发执行所有请求，每4个请求错开150ms发起
      const flowsUrlList = getFlowsUrlList(sub || this.subs) as FlowUrlItem[];
      const requests: Promise<void>[] = flowsUrlList.map((item, index) => {
        const delay = Math.floor(index / 4) * 150;
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            void asyncGetFlow(item).finally(() => resolve());
          }, delay);
        });
      });

      await Promise.all(requests);
      // 多次反复开启 容易爆内存 尝试分批请求 3/100ms
      // const flowsUrlList = getFlowsUrlList(sub || this.subs);
      // const batches = [];

      // for (let i = 0; i < flowsUrlList.length; i += 4) {
      //   const batch = flowsUrlList.slice(i, i + 4);
      //   batches.push(batch);
      // }

      // for (const batch of batches) {
      //   const promises = batch.map(asyncGetFlow);
      //   await Promise.all(promises);
      //   // await new Promise((resolve) => setTimeout(resolve, 150));
      // }
    },
    async deleteSub(type: SubsType, name: string) {
      const { showNotify } = useAppNotifyStore();

      const { data } = await subsApi.deleteSub(type, name);
      if (data.status === 'success') {
        await this.fetchSubsData();
        showNotify({
          type: 'danger',
          title: t('subPage.deleteSub.succeedNotify'),
        });
      }
    },
    async fetchFiles() {
      Promise.all([filesApi.getWholeFiles()]).then(res => {
        if ('data' in res[0].data) {
          this.files = res[0].data.data;
        }
      });
    },

    async deleteFile(name: string) {
      const { showNotify } = useAppNotifyStore();

      const { data } = await filesApi.deleteFile(name);
      if (data.status === 'success') {
        await this.fetchFiles();
        showNotify({
          type: 'danger',
          title: t('filePage.deleteFile.succeedNotify'),
        });
      }
    },
  },
});
