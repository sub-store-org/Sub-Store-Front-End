import request from '@/api';
import { AxiosPromise } from 'axios';

export function useLogsApi() {
  return {
    getLogs: (params: DebugLogQuery = {}): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/logs',
        method: 'get',
        params,
      });
    },
    clearLogs: (params?: { traceId?: string }): AxiosPromise<MyAxiosRes> => {
      return request({
        url: '/api/logs',
        method: 'delete',
        params,
      });
    },
  };
}
