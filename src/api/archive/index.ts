import type { AxiosPromise } from 'axios';

import request from '@/api';

export function useArchiveApi() {
  return {
    getEntries: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/archives',
        method: 'get',
      });
    },
    restoreEntry: (id: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/archives/${encodeURIComponent(id)}/restore`,
        method: 'post',
      });
    },
    deleteEntry: (id: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/archives/${encodeURIComponent(id)}`,
        method: 'delete',
      });
    },
    sortEntries: (data: string[]): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/sort/archives',
        method: 'post',
        data,
      });
    },
  };
}
