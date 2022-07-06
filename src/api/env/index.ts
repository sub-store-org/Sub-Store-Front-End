import request from '@/api';
import { AxiosPromise } from 'axios';

export function useEnvApi() {
  return {
    getEnv: (): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/utils/env',
        method: 'get',
      });
    },
  };
}
