import request from '@/api';
import { AxiosPromise } from 'axios';

export function useSettingsApi() {
  return {
    getSettings: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/settings',
        method: 'get',
      });
    },
    setSettings: (data: SettingsPostData): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/settings',
        method: 'patch',
        data,
      });
    },
    syncSettings: (query: 'download' | 'upload', options?: { keep?: string[], encode?: 'base64' | 'plaintext' }): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/utils/backup`,
        method: 'get',
        params: {
          action: query,
          keep: options?.keep?.join(','),
          encode: options?.encode
        }
      });
    },
    restoreSettings: (data: StoragePostData): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/storage',
        method: 'post',
        data,
      });
    },
  };
}
