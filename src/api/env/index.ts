import request from '@/api';

export function useEnvApi() {
  return {
    getEnv: () => {
      return request({
        url: '/api/utils/env',
        method: 'get',
      });
    },
  };
}
