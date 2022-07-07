import axios, { AxiosResponse, AxiosPromise, AxiosError } from 'axios';
import { Notify } from '@nutui/nutui';

const notifyConfig = {
  duration: 3000,
};

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

service.interceptors.response.use(
  (response: AxiosResponse<SucceedResponse>): AxiosPromise<SucceedResponse> => {
    // console.log('ddddddddd', response.data);
    return Promise.resolve(response);
  },
  (e: AxiosError<ErrorResponse>): AxiosPromise<ErrorResponse | undefined> => {
    // console.log('eeeeeeeee', e.response);

    // 流量信息接口的报错,不通知，直接返回
    if (e.config.url.startsWith('/api/sub/flow'))
      return Promise.resolve(e.response);

    let msg = '';
    // 如果是网络错误，则提示网络错误
    if (e.response.status === 0) {
      msg += '网络错误，无法连接后端服务\n';
      msg += 'code: ' + e.response.status + ' msg: ' + e.message;
      Notify.danger(msg, notifyConfig);
      return Promise.reject(e.response);
    } else {
      msg += e.response.data.error?.message + '\n';
      msg += 'type: ' + e.response.data.error?.type + '\n';
      msg += e.response.data.error?.details;
      Notify.danger(msg, notifyConfig);
      return Promise.resolve(e.response);
    }
  }
);

// 导出 axios 实例
export default service;
