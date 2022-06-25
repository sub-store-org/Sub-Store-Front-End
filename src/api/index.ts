import axios from 'axios';

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

// // 添加请求拦截器
// service.interceptors.request.use(
//   (config) => {
//     // 在发送请求之前
//     if (Session.get('token')) {
//       (<any>config.headers).common['Authorization'] = `${Session.get('token')}`;
//     }
//     return config;
//   },
//   (error) => {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }
// );

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
  }
);

// 导出 axios 实例
export default service;
