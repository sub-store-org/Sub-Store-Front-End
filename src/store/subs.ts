import { useSubsApi } from '@/api/subs';
import { useFilesApi } from '@/api/files';
import { useShareApi } from '@/api/share';
import i18n from '@/locales';
import { useAppNotifyStore } from '@/store/appNotify';
import { getFlowsUrlList } from '@/utils/getFlowsUrlList';
import { defineStore } from 'pinia';

const { t } = i18n.global;
const subsApi = useSubsApi();
const filesApi = useFilesApi();
const shareApi = useShareApi();
// class TaskProcessor {
//   #fulfilledIndexes; // 已完成任务的索引集合
//   #results; // 所有任务的执行结果
//   #shouldStopAll; //停止所有任务
//   #stopCount; //已停止任务的数量

//   /**
//    * 状态初始化函数
//    * @private
//    */

//   #initializeState() {
//     this.#fulfilledIndexes = new Set();
//     this.#results = [];
//     this.#shouldStopAll = false;
//     this.#stopCount = 0;
//   }

//   /**
//    * 停止所有任务
//    * @param {string} [message]
//    */
//   stopAll(message = "") {
//     this.#shouldStopAll = true;
//     throw new Error(message);
//   }

//   /**
//    * 停止单个任务
//    * @param {string} [message]
//    */
//   stop(message = "") {
//     this.#stopCount++;
//     throw new Error(message);
//   }

//   /**
//    * 创建延时Promise
//    * @param {number} seconds - 延时秒数
//    * @returns {Promise<void>}
//    */
//   #delay(seconds) {
//     return seconds
//       ? new Promise((resolve) => setTimeout(resolve, seconds * 1000))
//       : Promise.resolve();
//   }

//   /**
//    * 检查值是否为Promise
//    * @param {any} value
//    * @returns {boolean}
//    */
//   #isPromise(value) {
//     return Boolean(value && typeof value.then === "function");
//   }

//   /**
//    * 任务标准化
//    * @param {Function|Promise|any} task
//    * @returns {Function}
//    */
//   #normalizeTask(task) {
//     if (this.#isPromise(task)) return task;
//     if (typeof task === "function") return task;
//     return () => task;
//   }

//   /**
//    * 处理Promise数组，分类收集成功和失败结果
//    * @param {Array<Promise>} promiseArray - Promise数组
//    * @returns {Promise<{resolve?: Array, reject?: Array}>}
//    */
//   async #resolvePromises(promiseArray) {
//     const reject = [];
//     const resolve = [];

//     for (const promise of promiseArray) {
//       try {
//         resolve.push(await promise);
//       } catch (error) {
//         reject.push(error);
//       }
//     }

//     if (resolve.length && !reject.length) return { resolve };
//     if (reject.length && !resolve.length) return { reject };
//     return { resolve, reject };
//   }

//   /**
//    * 执行限制并发数的任务组
//    * @param {Array} tasks - 任务数组
//    * @param {number} concurrencyLimit - 并发限制
//    * @returns {Promise<boolean>} 是否所有任务都已完成
//    */
//   async #executeTasksWithLimit(tasks, concurrencyLimit) {
//     const executing = new Set();

//     for (let i = 0; i < tasks.length; i++) {
//       // 检查是否需要中断所有任务处理
//       if (this.#shouldStopAll) return false;
//       // 如果该任务已完成，继续下一个任务
//       if (this.#fulfilledIndexes.has(i)) continue;

//       const task = tasks[i];
//       const p = this.#isPromise(task) ? task : Promise.resolve().then(task);
//       this.#results[i] = p;

//       const e = p.then(() => {
//         executing.delete(e);
//         this.#fulfilledIndexes.add(i);
//       });

//       executing.add(e);

//       console.log('并发数', executing.size)

//       executing.size >= concurrencyLimit &&
//         (await Promise.race(executing).catch(() => {}));
//     }

//     await Promise.allSettled(this.#results);
//     return this.#fulfilledIndexes.size + this.#stopCount >= tasks.length;
//   }

//   /**
//    * 处理并发任务的主函数
//    * @param {Array} tasks - 任务数组
//    * @param {number} [concurrencyLimit=10] - 并发限制
//    * @param {number} [maxRetry=2] - 最大重试次数
//    * @param {number} [waitTime=0] - 重试等待时间(秒)
//    * @returns {Promise<{resolve?: Array, reject?: Array}>}
//    */
//   async runTasks({ tasks = [], concurrencyLimit = 10, maxRetry = 2, waitTime = 0 }) {
//     this.#initializeState();
//     tasks = tasks.map(this.#normalizeTask, this);

//     while (maxRetry-- && !this.#shouldStopAll) {
//       const isFulfilled = await this.#executeTasksWithLimit(tasks, concurrencyLimit);
//       if (isFulfilled) break;
//       maxRetry && (await this.#delay(waitTime));
//     }

//     return this.#resolvePromises(this.#results);
//   }
// }
function executeAsyncTasks(tasks, { wrap = false, result = false, concurrency = 1 } = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      let running = 0
      const results = []

      let index = 0

      function executeNextTask() {
        while (index < tasks.length && running < concurrency) {
          const taskIndex = index++
          const currentTask = tasks[taskIndex]
          running++

          currentTask()
            .then(data => {
              if (result) {
                results[taskIndex] = wrap ? { data } : data
              }
            })
            .catch(error => {
              if (result) {
                results[taskIndex] = wrap ? { error } : error
              }
            })
            .finally(() => {
              running--
              executeNextTask()
            })
        }

        if (running === 0) {
          return resolve(result ? results : undefined)
        }
      }

      await executeNextTask()
    } catch (e) {
      reject(e)
    }
  })
}
export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: [],
      collections: [],
      flows: {},
      files: [],
      shares: [],
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
    hasShares: ({ shares }): boolean => shares.length > 0,
    getOneShare:
      ({ shares }): GetOne<Share> =>
      (token: string) =>
        shares.find(share => share.token === token),
  },
  actions: {
    async fetchSubsData() {
      await Promise.all([subsApi.getSubs(), subsApi.getCollections(), filesApi.getWholeFiles(), shareApi.getShares()]).then(res => {
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
        if ('data' in res[3].data) {
          this.shares = res[3].data.data;
        }
      }).catch((err) => {
        console.log('fetchSubsData err', err);
      });
    },
    async updateOneData(type: string, name: string) {
      try {
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
      } catch (error) {
        console.log('updateOneData error', error);
      }
    },
    async fetchFlows(sub?: Sub[]) {
      type FlowUrlItem = [string, string, boolean, boolean, boolean];
      const asyncGetFlow = async ([url, name, noFlow, hideExpire, showRemaining], index) => {
        console.log(`[START] ${index} ${url}fetching flow`)
        if (noFlow) {
          this.flows[url] = { status:'noFlow' };
        } else {
          try {
            const { data } = await subsApi.getFlow(name);
            this.flows[url] = {...data, hideExpire, showRemaining };
          } catch (e) {
          }
        }
        // await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`[END] ${index} ${url} fetching flow`)
      };
      // const subs = sub || this.subs;
      // getFlowsUrlList(subs).forEach(asyncGetFlow);
      // 多次反复开启 容易爆内存 尝试分批请求 3/100ms
      const flowsUrlList = getFlowsUrlList(sub || this.subs) as FlowUrlItem[];
      // const processor = new TaskProcessor();
      // await processor.runTasks({
      //   tasks: flowsUrlList.map((item, index) => async() => {
      //     await asyncGetFlow(item, index);
      //   }),
      //   concurrencyLimit: 3,
      //   maxRetry: 1,
      //   waitTime: 0,
      // });

      await executeAsyncTasks(
        flowsUrlList.map((item, index) => () =>  asyncGetFlow(item, index)),
        { concurrency: localStorage.getItem('concurrency') ? parseInt(localStorage.getItem('concurrency') as string, 10) : 3 }
      )
  
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
      try {
        const { showNotify } = useAppNotifyStore();

        const { data } = await subsApi.deleteSub(type, name);
        if (data.status === 'success') {
          await this.fetchSubsData();
          showNotify({
            type: 'danger',
            title: t('subPage.deleteSub.succeedNotify'),
          });
        } 
      } catch (error) {
        console.log('deleteSub error', error);
      }
    },
    async fetchFiles() {
      Promise.all([filesApi.getWholeFiles()]).then(res => {
        if ('data' in res[0].data) {
          this.files = res[0].data.data;
        }
      }).catch((err) => {
        console.log('fetchFiles err', err);
      });
    },
    async deleteFile(name: string) {
      try {
        const { showNotify } = useAppNotifyStore();

        const { data } = await filesApi.deleteFile(name);
        if (data.status === 'success') {
          await this.fetchFiles();
          showNotify({
            type: 'danger',
            title: t('filePage.deleteFile.succeedNotify'),
          });
        } 
      } catch (error) {
        console.log('deleteFile error', error);
      }
    },
    async fetchShareData() {
      Promise.all([shareApi.getShares()]).then((res) => {
        if ("data" in res[0].data) {
          console.log('res[0].data.data', res[0].data.data);
          this.shares = res[0].data.data;
        }
      }).catch((err) => {
        console.log('fetchShareData err', err);
      });
    },
    async deleteShare(token: string, type: string, name: string, isShowNotify: boolean = true) {
      try {
        const { showNotify } = useAppNotifyStore();

        const { data } = await shareApi.deleteShare(token, type, name);
        if (data.status === "success") {
          await this.fetchShareData();
          isShowNotify && showNotify({
            type: "danger",
            title: t("sharePage.deleteShare.succeedNotify"),
          });
        }
      } catch (error) {
        console.log('deleteShare error', error);
      }
    },
    async updateShare(token: string, type: string, name:string, data: ShareToken) {
      const { showNotify } = useAppNotifyStore();
      try {
        await shareApi.deleteShare(token, type, name);
        await shareApi.createShare(data);
        await this.fetchShareData();
      } catch (error) {
        console.log('updateShare error', error);
        showNotify({
          type: "danger",
          title: t("sharePage.deleteShare.failNotify"),
        });
      }
    },
  },
});
