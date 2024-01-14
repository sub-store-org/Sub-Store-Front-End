import request from '@/api';
import { AxiosPromise } from 'axios';

export function useFilesApi() {
  return {
    getFiles: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/files',
        method: 'get',
      });
    },
    getWholeFiles: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/wholeFiles',
        method: 'get',
      });
    },
    getFile: (name: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/file/${encodeURIComponent(name)}`,
        method: 'get',
      });
    },
    getWholeFile: (name: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/wholeFile/${encodeURIComponent(name)}`,
        method: 'get',
      });
    },
    createFile: (data: any): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/files',
        method: 'post',
        data,
      });
    },
    editFile: (name: string, data: any): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/file/${encodeURIComponent(name)}`,
        method: 'patch',
        data,
      });
    },
    deleteFile: (name: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/file/${encodeURIComponent(name)}`,
        method: 'delete',
      });
    },
  };
}
