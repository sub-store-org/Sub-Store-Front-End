import request from '@/api';

export function useSubsApi() {
  return {
    getSubs: () => {
      return request({
        url: '/api/subs',
        method: 'get',
      });
    },
    getCollections: () => {
      return request({
        url: '/api/collections',
        method: 'get',
      });
    },
  };
}
