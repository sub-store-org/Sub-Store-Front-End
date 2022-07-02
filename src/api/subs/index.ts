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
        url: `/api/collections`,
        method: 'get',
      });
    },
    getOne: (type: string, name: string) => {
      return request({
        url: `/api/${type}/${name}`,
        method: 'get',
      });
    },
    getFlow: (name: string) => {
      return request({
        url: `/api/sub/flow/${name}`,
        method: 'get',
      });
    },
    createSub: (type: string, data: Sub | Collection) => {
      return request({
        url: `/api/${type}`,
        method: 'post',
        data,
      });
    },
    editSub: (type: string, name: string, data: Sub | Collection) => {
      return request({
        url: `/api/${type}/${name}`,
        method: 'patch',
        data,
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
