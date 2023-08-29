import request from '@/api';
import { semverMajorMinorGt } from '@/utils/semver';
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
      }).then(async response => {
        try {
          const latestVersion = (
            await request({
              url: 'https://api.github.com/repos/sub-store-org/Sub-Store/releases/latest',
              method: 'get',
            })
          ).data.tag_name;
          response.data.data.latestVersion = latestVersion;
          response.data.data.hasNewVersion = semverMajorMinorGt(
            latestVersion,
            response.data.data.version
          );
        } catch (e) {
          console.error(e);
        }
        const expiry = Date.now() + 60 * 60 * 1000;
        const dataToCache = { data: response, expiry };
        localStorage.setItem(localStorageKey, JSON.stringify(dataToCache));
        return response;
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
