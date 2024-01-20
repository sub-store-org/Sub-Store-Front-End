import { useAppNotifyStore } from '@/store/appNotify';
import axios, { AxiosError, AxiosPromise, AxiosResponse } from 'axios';
import { getHostAPIUrl } from '@/hooks/useHostAPI';

let appNotifyStore = null;

const notifyConfig: { type: 'danger'; duration: number } = {
  type: 'danger',
  duration: 2500,
};

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: getHostAPIUrl(),
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

service.interceptors.response.use(
  (response: AxiosResponse<SucceedResponse>): AxiosPromise<SucceedResponse> => {
    // console.log('ddddddddd', response.data);
    return Promise.resolve(response);
  },
  (e: AxiosError<ErrorResponse>): AxiosPromise<ErrorResponse | undefined> => {
    // console.log(e.config.url);

    // 流量信息接口的报错,不通知，直接返回
    if (e.config.url.startsWith('/api/sub/flow') || e.config.url.startsWith('https://api.github.com/'))
      return Promise.resolve(e.response);

    if (appNotifyStore) {
      // 如果是网络错误，则提示网络错误
      if (e.response.status === 0) {
        appNotifyStore.showNotify({
          title: '网络错误或后端异常，无法连接后端服务\n',
          content: 'code: ' + e.response.status + ' msg: ' + e.message,
          ...notifyConfig,
        });
        return Promise.reject(e.response);
      } else {
        let content = 'type: ' + e.response.data.error?.type;
        if (e.response.data.error?.details)
          content += '\n' + e.response.data.error.details;
        appNotifyStore.showNotify({
          title: e.response.data.error?.message,
          content,
          ...notifyConfig,
        });
        return Promise.resolve(e.response);
      }
    } else {
      appNotifyStore = useAppNotifyStore();
    }
  }
);

// 导出 axios 实例
export default service;
