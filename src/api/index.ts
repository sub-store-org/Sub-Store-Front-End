import { useAppNotifyStore } from '@/store/appNotify';
import axios, { AxiosError, AxiosPromise, AxiosResponse } from 'axios';
import { getHostAPIUrl } from '@/hooks/useHostAPI';
import { getApiRequestTimeout } from '@/utils/requestTimeout';

let appNotifyStore = null;

const notifyConfig: { type: 'danger'; duration: number } = {
  type: 'danger',
  duration: 2500,
};

const getText = (value: unknown) => {
  if (typeof value === 'string') {
    const text = value.trim();
    return text || undefined;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return undefined;
};

const stringifyUnknown = (value: unknown) => {
  const text = getText(value);
  if (text)
    return text;

  if (value == null)
    return undefined;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const getResponseTitle = (e: AxiosError<ErrorResponse>) => {
  const backendMessage = getText(e.response?.data?.error?.message);
  if (backendMessage)
    return backendMessage;

  const responseText = getText(e.response?.statusText);
  if (e.response?.status && responseText)
    return `请求失败: ${e.response.status} ${responseText}`;

  if (e.response?.status)
    return `请求失败: ${e.response.status}`;

  return '请求失败';
};

const getResponseContent = (e: AxiosError<ErrorResponse>) => {
  const error = e.response?.data?.error;
  const statusLine = e.response?.status ? `status: ${e.response.status}` : undefined;
  const backendErrorLines = [
    getText(error?.code) ? `code: ${getText(error?.code)}` : undefined,
    getText(error?.type) ? `type: ${getText(error?.type)}` : undefined,
    getText(error?.details),
  ].filter(Boolean);

  if (backendErrorLines.length > 0)
    return [statusLine, ...backendErrorLines].filter(Boolean).join('\n');

  const responseData = stringifyUnknown(e.response?.data);
  if (responseData)
    return [statusLine, responseData].filter(Boolean).join('\n');

  return [statusLine, getText(e.message)].filter(Boolean).join('\n') || undefined;
};

const isCanceledRequestError = (error: AxiosError<ErrorResponse>) => {
  return error.name === 'AbortError'
    || error.name === 'CanceledError'
    || error.code === 'ERR_CANCELED'
    || error.message === 'canceled'
    || axios.isCancel(error);
};

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: getHostAPIUrl(),
  timeout: getApiRequestTimeout(),
  headers: { 'Content-Type': 'application/json' },
});

service.interceptors.response.use(
  (response: AxiosResponse<SucceedResponse>): AxiosPromise<SucceedResponse> => {
    // console.log('ddddddddd', response.data);
    return Promise.resolve(response);
  },
  (e: AxiosError<ErrorResponse>): AxiosPromise<ErrorResponse | undefined> => {
    // console.log(e.config.url);
    const requestUrl = e.config?.url || '';

    if (isCanceledRequestError(e))
      return Promise.reject(e);

    // 流量信息接口的报错,不通知，直接返回
    if (requestUrl.startsWith('/api/sub/flow') || requestUrl.startsWith('https://api.github.com/'))
      return Promise.resolve(e.response);

    if (!appNotifyStore)
      appNotifyStore = useAppNotifyStore();

    // 如果是网络错误，则提示网络错误
    if (!e.response || e.response.status === 0) {
      appNotifyStore.showNotify({
        title: '网络错误或后端异常，无法连接后端服务\n',
        content: [
          `code: ${e.response?.status ?? e.code ?? 'NO_RESPONSE'}`,
          `msg: ${getText(e.message) || '请求没有收到响应'}`,
        ].join('\n'),
        ...notifyConfig,
      });
      return Promise.reject(e.response || e);
    } else {
      appNotifyStore.showNotify({
        title: getResponseTitle(e),
        content: getResponseContent(e),
        ...notifyConfig,
      });
      return Promise.resolve(e.response);
    }
  }
);

// 导出 axios 实例
export default service;
