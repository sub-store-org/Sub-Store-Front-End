import request from '@/api';

export function useSettingsApi() {
  return {
    getSettings: () => {
      return request({
        url: '/api/settings',
        method: 'get',
      });
    },
    setSettings: (data: SettingsPostData) => {
      return request({
        url: '/api/settings',
        method: 'patch',
        data,
      });
    },
    syncSettings: (query: 'download' | 'upload') => {
      return request({
        url: '/api/utils/backup?action=' + query,
        method: 'get',
      });
    },
  };
}
