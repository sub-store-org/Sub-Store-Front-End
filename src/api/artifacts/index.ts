import request from '@/api';
import { AxiosPromise } from 'axios';

export function useArtifactsApi() {
  return {
    getArtifacts: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/artifacts',
        method: 'get',
      });
    },
    getOneArtifact: (name: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/artifact/${encodeURIComponent(name)}`,
        method: 'get',
      });
    },
    syncOneArtifact: (name: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/sync/artifact/${encodeURIComponent(name)}`,
        method: 'get',
      });
    },
    createArtifact: (data: Artifact): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/artifacts',
        method: 'post',
        data,
      });
    },
    editArtifact: (name: string, data: Artifact): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/artifact/${encodeURIComponent(name)}`,
        method: 'patch',
        data,
      });
    },
    deleteArtifact: (name: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/artifact/${encodeURIComponent(name)}`,
        method: 'delete',
      });
    },
    syncAllArtifact: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/sync/artifacts',
        method: 'get',
      });
    },
    restoreArtifacts: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/artifacts/restore',
        method: 'get',
      });
    },
  };
}
