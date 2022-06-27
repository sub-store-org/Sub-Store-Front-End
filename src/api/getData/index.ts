import request from '@/api/index';

export function useGetDataApi() {
  return {
    getSubs: () => {
      return request({
        url: '/api/subs',
        method: 'get',
      });
    },
  };
}
