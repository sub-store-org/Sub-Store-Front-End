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
    syncSettings: (query: 'download' | 'upload', options?: { keep?: string[] }): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/utils/backup?action=${encodeURIComponent(query)}${options?.keep ? `&keep=${encodeURIComponent(options.keep.join(','))}` : ''}`,
        method: 'get'
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
