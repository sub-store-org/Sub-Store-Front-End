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
    getFlow: (name: string) => {
      return request({
        url: `/api/sub/flow/${name}`,
        method: 'get',
      });
    },
    deleteSub: (type: string, name: string) => {
      return request({
        url: `/api/${type}/${name}`,
        method: 'delete',
      });
    },
  };
}
