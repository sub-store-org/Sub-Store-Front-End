import { ref, watch, computed, onUnmounted } from 'vue';
import { useGlobalStore } from '@/store/global';
import { useAppNotifyStore } from '@/store/appNotify';
import service from '@/api';
import axios from 'axios';
import { initStores } from '@/utils/initApp';

const lsKey = 'hostAPI';

const getHostAPI = (): HostAPIStorage => {
  const item = localStorage.getItem(lsKey);
  if (item) {
    return JSON.parse(item);
  } else {
    setHostAPI({
      current: '',
      apis: [],
    });
    return getHostAPI();
  }
};
export const getHostAPIUrl = (): string => {
  const { current, apis } = getHostAPI();
  return (
    apis.find(api => api.name === current)?.url ||
    import.meta.env.VITE_API_URL ||
    'https://sub.store'
  ).replace(/\/$/, ''); // 去除末尾斜杠;
};

const setHostAPI = (hostAPI: HostAPIStorage) => {
  localStorage.setItem(lsKey, JSON.stringify(hostAPI));
};
export const useHostAPI = () => {
  const defaultAPI = import.meta.env.VITE_API_URL || 'https://sub.store';

  const { showNotify } = useAppNotifyStore();
  const apis = ref(getHostAPI().apis);
  const currentName = ref(getHostAPI().current);
  const currentUrl = computed(() => {
    const url = apis.value.find(api => api.name === currentName.value)?.url ?? defaultAPI
    return url.startsWith('/') ? `${window.location.origin}${url}` : url;
  });

  const stopWatchCurrent = watch(currentName, async (newName, oldName) => {
    if (newName !== oldName) {
      // 保存新的API配置
      setHostAPI({
        ...getHostAPI(),
        current: newName,
      });

      // 获取新API的URL
      const url =
        apis.value.find(api => api.name === newName)?.url ?? defaultAPI;

      // 清除旧的连接状态
      const globalStore = useGlobalStore();
      globalStore.setFetchResult(false);

      // 设置新的API URL并初始化stores
      await globalStore.setHostAPI(url);
    }
  });
  const stopWatchApis = watch(
    apis,
    newApis => {
      setHostAPI({
        ...getHostAPI(),
        apis: newApis,
      });
    },
    { deep: true }
  );
  onUnmounted(() => {
    stopWatchCurrent();
    stopWatchApis();
  });

  const setCurrent = (name: string) => {
    if (name !== '' && !apis.value.find(api => api.name === name)) {
      return;
    }
    currentName.value = name;
  };

  const addApi = async ({ name, url }: HostAPI, skipConnectionCheck = false) => {
    if (apis.value.find(api => api.name === name)) {
      showNotify({
        title: 'API 名称重复',
        type: 'danger',
      });
      return false;
    } else {
      // 如果跳过连接检查，直接添加API
      if (skipConnectionCheck) {
        apis.value.push({ name, url });
        return true;
      }

      try {
        const res = await axios.get<{ status: 'success' | 'failed' }>(
          url + '/api/utils/env'
        );
        if (res?.data?.status === 'success') {
          apis.value.push({ name, url });
          return true;
        } else {
          showNotify({
            title: '无效的 API 地址，请检查',
            type: 'danger',
          });
          return false;
        }
      } catch {
        showNotify({
          title: '无效的 API 地址，请检查',
          type: 'danger',
        });
        return false;
      }
    }
  };

  const deleteApi = (name: string) => {
    const index = apis.value.findIndex(api => api.name === name);
    if (index === -1) return;
    apis.value.splice(index, 1);
    if (currentName.value === name) {
      currentName.value = apis.value[0]?.name || '';
    }
  };

  const editApi = ({ name, url }: HostAPI) => {
    const index = apis.value.findIndex(api => api.name === name);
    if (index === -1) return;
    apis.value[index].url = url;
  };

  const handleUrlQuery = async ({
    errorCb,
  }: {
    errorCb?: () => Promise<void>;
  }) => {
    const query = window.location.search;
    if (!query) {
      await errorCb?.();
      return false; // 没有URL参数，返回false
    }

    // 处理api参数
    const apiUrl = query
      .slice(1)
      .split('&')
      .map(i => i.split('='))
      .find(i => i[0] === 'api');

    // 处理magicpath参数
    const magicPathParam = query
      .slice(1)
      .split('&')
      .map(i => i.split('='))
      .find(i => i[0] === 'magicpath');

    // 获取全局状态管理
    const globalStore = useGlobalStore();

    // 优先处理api参数
    if (apiUrl) {
      const url = decodeURIComponent(apiUrl[1]).replace(/\/$/, ''); // 去除末尾斜杠;
      if (!url) return await errorCb?.();

      // 检查是否已存在相同URL的API
      const isExist = apis.value.find(api => api.url === url);

      if (isExist) {
        // 如果已存在且不是当前API，则切换到该API
        if (isExist.name === currentName.value) {
          // 如果是当前API，尝试重新连接
          try {
            // 测试API连接是否有效
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

            const res = await axios.get<{ status: 'success' | 'failed' }>(
              url + '/api/utils/env',
              { signal: controller.signal }
            );

            clearTimeout(timeoutId); // 清除超时计时器

            if (res?.data?.status === 'success') {
              // 连接成功
              globalStore.setFetchResult(true);
              localStorage.setItem('backendConfigured', 'true');
              return true;
            } else {
              // 连接失败
              globalStore.setFetchResult(false);
              return false;
            }
          } catch (e) {
            // 连接失败
            console.error('测试当前API连接时出错:', e);
            globalStore.setFetchResult(false);
            return false;
          }
        }

        // 清除旧的连接状态
        globalStore.setFetchResult(false);

        // 切换到新API
        setCurrent(isExist.name);

        // 设置已配置标志，表示用户已通过URL参数成功配置了后端
        localStorage.setItem('backendConfigured', 'true');
        return true; // 返回true表示成功处理了URL参数
      }

      try {
        // 生成API名称
        const name = url.slice(0, 10) + (Math.random() * 100).toFixed(0);

        // 无论连接是否成功，都先添加到列表并设置为当前API
        // 使用skipConnectionCheck=true跳过连接检查直接添加
        const addResult = await addApi({ name, url }, true);
        if (addResult) {
          // 设置为当前API
          setCurrent(name);

          // 清除旧的连接状态
          globalStore.setFetchResult(false);

          // 测试API连接是否有效，添加超时处理
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

          try {
            const res = await axios.get<{ status: 'success' | 'failed' }>(
              url + '/api/utils/env',
              { signal: controller.signal }
            );

            clearTimeout(timeoutId); // 清除超时计时器

            if (res?.data?.status === 'success') {
              // 设置已配置标志，表示用户已通过URL参数成功配置了后端
              localStorage.setItem('backendConfigured', 'true');
              // 设置fetchResult为true，表示连接成功
              globalStore.setFetchResult(true);
            } else {
              // API连接无效，但已添加到列表
              console.error('URL参数指定的API无效:', url);
              // 设置fetchResult为false，表示连接失败
              globalStore.setFetchResult(false);
            }
          } catch (connectionError) {
            // API连接测试失败，但已添加到列表
            console.error('测试URL参数指定的API时出错:', connectionError);
            // 设置fetchResult为false，表示连接失败
            globalStore.setFetchResult(false);
          }

          // 无论连接是否成功，都返回true表示已处理URL参数
          return true;
        }

        // 如果添加API失败（例如名称重复），返回false
        return false;
      } catch (e) {
        // 处理过程中出现其他错误
        console.error('处理URL参数指定的API时出错:', e);
        // 设置fetchResult为false，表示连接失败
        globalStore.setFetchResult(false);
        return false;
      }
    }

    // 处理magicpath参数
    if (magicPathParam) {
      const magicPath = decodeURIComponent(magicPathParam[1]);
      if (!magicPath) return await errorCb?.();

      // 构建完整的API URL
      const currentHost = window.location.origin;
      const apiUrl = `${currentHost}/${magicPath.replace(/^\/+/, '')}`;

      // 检查是否已存在相同URL的API
      const isExist = apis.value.find(api => api.url === apiUrl);

      if (isExist) {
        // 如果已存在且不是当前API，则切换到该API
        if (isExist.name === currentName.value) {
          // 如果是当前API，尝试重新连接
          try {
            // 测试API连接是否有效
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

            const res = await axios.get<{ status: 'success' | 'failed' }>(
              apiUrl + '/api/utils/env',
              { signal: controller.signal }
            );

            clearTimeout(timeoutId); // 清除超时计时器

            if (res?.data?.status === 'success') {
              // 连接成功
              globalStore.setFetchResult(true);
              localStorage.setItem('backendConfigured', 'true');
              localStorage.setItem('magicPathConfigured', 'true');
              return true;
            } else {
              // 连接失败
              globalStore.setFetchResult(false);
              return false;
            }
          } catch (e) {
            // 连接失败
            console.error('测试当前magicpath连接时出错:', e);
            globalStore.setFetchResult(false);
            return false;
          }
        }

        // 清除旧的连接状态
        globalStore.setFetchResult(false);

        // 切换到新API
        setCurrent(isExist.name);

        // 设置已配置标志
        localStorage.setItem('magicPathConfigured', 'true');
        localStorage.setItem('backendConfigured', 'true');
        return true; // 返回true表示成功处理了URL参数
      }

      try {
        // 生成API名称
        const name = `Custom_${new Date().getTime()}`;

        // 无论连接是否成功，都先添加到列表并设置为当前API
        // 使用skipConnectionCheck=true跳过连接检查直接添加
        const addResult = await addApi({ name, url: apiUrl }, true);
        if (addResult) {
          // 设置为当前API
          setCurrent(name);

          // 清除旧的连接状态
          globalStore.setFetchResult(false);

          // 测试API连接是否有效，添加超时处理
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

          try {
            const res = await axios.get<{ status: 'success' | 'failed' }>(
              apiUrl + '/api/utils/env',
              { signal: controller.signal }
            );

            clearTimeout(timeoutId); // 清除超时计时器

            if (res?.data?.status === 'success') {
              // 设置已配置标志
              localStorage.setItem('magicPathConfigured', 'true');
              localStorage.setItem('backendConfigured', 'true');
              // 设置fetchResult为true，表示连接成功
              globalStore.setFetchResult(true);
            } else {
              // API连接无效，但已添加到列表
              console.error('URL参数指定的magicpath无效:', apiUrl);
              // 设置fetchResult为false，表示连接失败
              globalStore.setFetchResult(false);
            }
          } catch (connectionError) {
            // API连接测试失败，但已添加到列表
            console.error('测试URL参数指定的magicpath时出错:', connectionError);
            // 设置fetchResult为false，表示连接失败
            globalStore.setFetchResult(false);
          }

          // 无论连接是否成功，都返回true表示已处理URL参数
          return true;
        }

        // 如果添加API失败（例如名称重复），返回false
        return false;
      } catch (e) {
        // 处理过程中出现其他错误
        console.error('处理URL参数指定的magicpath时出错:', e);
        // 设置fetchResult为false，表示连接失败
        globalStore.setFetchResult(false);
        return false;
      }
    }

    // 如果没有处理任何参数，执行错误回调
    try {
      // 执行错误回调，通常是尝试使用默认或已配置的后端
      await errorCb?.();

      // 检查是否成功连接到后端
      const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;

      if (!hasBackendEnv) {
        // 如果没有连接到后端，设置fetchResult为false
        globalStore.setFetchResult(false);
        return false;
      } else {
        // 如果成功连接到后端，设置fetchResult为true
        globalStore.setFetchResult(true);
        return true;
      }
    } catch (e) {
      console.error('Error in errorCb:', e);
      globalStore.setFetchResult(false);
      return false;
    }
  };

  return {
    currentName,
    currentUrl,
    apis,
    setCurrent,
    addApi,
    deleteApi,
    editApi,
    handleUrlQuery,
    defaultAPI,
  };
};
