import request from '@/api/index';

export function useGetDataApi() {
  return {
    getData: (params: object) => {
      return request({
        url: '/getData',
        method: 'get',
        params,
      });
    },
  };
}
