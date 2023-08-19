// import request from '@/api';
// import { AxiosPromise } from 'axios';

// export function useEnvApi() {
//   return {
//     getEnv: (): AxiosPromise<MyAxiosRes> => {
//       return request({
//         url: '/api/utils/env',
//         method: 'get',
//       });
//     },
//     refreshCache: (): AxiosPromise<MyAxiosRes> => {
//       return request({
//         url: '/api/utils/refresh',
//         method: 'get',
//       });
//     },
//   };
// }
import request from '@/api';
import { AxiosPromise } from 'axios';

export function useEnvApi() {
  const localStorageKey = 'envCache'; // env 读取加入缓存 重启会自动清理

  return {
    getEnv: (): AxiosPromise<MyAxiosRes> => {
      const cachedData = localStorage.getItem(localStorageKey);

      if (cachedData) {
        const parsedCachedData = JSON.parse(cachedData);

        if (parsedCachedData.expiry > Date.now()) {
          return Promise.resolve(parsedCachedData.data);
        }
      }
      
      const promise = request({
        url: '/api/utils/env',
        method: 'get',
      });

      promise.then(response => {
        const expiry = Date.now() + (60 * 60 * 1000);
        const dataToCache = { data: response, expiry };
        localStorage.setItem(localStorageKey, JSON.stringify(dataToCache));
      });
      return promise;
    },
    refreshCache: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/utils/refresh',
        method: 'get',
      });
    },
  };
}
