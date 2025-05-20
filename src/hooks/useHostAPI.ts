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
  );
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
    return (
      apis.value.find(api => api.name === currentName.value)?.url ?? defaultAPI
    );
  });

  const stopWatchCurrent = watch(currentName, async (newName, oldName) => {
    if (newName !== oldName) {
      setHostAPI({
        ...getHostAPI(),
        current: newName,
      });
      const url =
        apis.value.find(api => api.name === newName)?.url ?? defaultAPI;

      await useGlobalStore().setHostAPI(url);
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

  const addApi = async ({ name, url }: HostAPI) => {
    if (apis.value.find(api => api.name === name)) {
      showNotify({
        title: 'API 名称重复',
        type: 'danger',
      });
      return false;
    } else {
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

    // 优先处理api参数
    if (apiUrl) {
      const url = decodeURIComponent(apiUrl[1]);
      if (!url) return await errorCb?.();

      const isExist = apis.value.find(api => api.url === url);

      if (isExist) {
        if (isExist.name === currentName.value) return await errorCb?.();
        setCurrent(isExist.name);
        // 设置已配置标志，表示用户已通过URL参数成功配置了后端
        localStorage.setItem('backendConfigured', 'true');
        return true; // 返回true表示成功处理了URL参数
      }

      try {
        // 测试API连接是否有效，添加超时处理
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

        const res = await axios.get<{ status: 'success' | 'failed' }>(
          url + '/api/utils/env',
          { signal: controller.signal }
        );

        clearTimeout(timeoutId); // 清除超时计时器

        if (res?.data?.status === 'success') {
          // API连接有效，添加到列表并设置为当前API
          const name = url.slice(0, 10) + (Math.random() * 100).toFixed(0);
          const addResult = await addApi({ name, url });
          if (addResult) {
            setCurrent(name);
            // 设置已配置标志，表示用户已通过URL参数成功配置了后端
            localStorage.setItem('backendConfigured', 'true');
            // 设置fetchResult为true，表示连接成功
            useGlobalStore().setFetchResult(true);
            return true; // 返回true表示成功处理了URL参数
          }
        } else {
          // API连接无效，返回false以便显示配置弹窗
          console.error('URL参数指定的API无效:', url);
          // 设置fetchResult为false，表示连接失败
          useGlobalStore().setFetchResult(false);
          return false;
        }
      } catch (e) {
        // API连接测试失败，返回false以便显示配置弹窗
        console.error('测试URL参数指定的API时出错:', e);
        // 设置fetchResult为false，表示连接失败
        useGlobalStore().setFetchResult(false);
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

      const isExist = apis.value.find(api => api.url === apiUrl);

      if (isExist) {
        if (isExist.name === currentName.value) return await errorCb?.();
        setCurrent(isExist.name);
        // 设置已配置标志
        localStorage.setItem('magicPathConfigured', 'true');
        return true; // 返回true表示成功处理了URL参数
      }

      try {
        // 测试API连接是否有效，添加超时处理
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时

        const res = await axios.get<{ status: 'success' | 'failed' }>(
          apiUrl + '/api/utils/env',
          { signal: controller.signal }
        );

        clearTimeout(timeoutId); // 清除超时计时器

        if (res?.data?.status === 'success') {
          // API连接有效，添加到列表并设置为当前API
          const name = `Custom_${new Date().getTime()}`;
          const addResult = await addApi({ name, url: apiUrl });
          if (addResult) {
            setCurrent(name);
            // 设置已配置标志
            localStorage.setItem('magicPathConfigured', 'true');
            localStorage.setItem('backendConfigured', 'true');
            // 设置fetchResult为true，表示连接成功
            useGlobalStore().setFetchResult(true);
            return true; // 返回true表示成功处理了URL参数
          }
        } else {
          // API连接无效，返回false以便显示配置弹窗
          console.error('URL参数指定的magicpath无效:', apiUrl);
          // 设置fetchResult为false，表示连接失败
          useGlobalStore().setFetchResult(false);
          return false;
        }
      } catch (e) {
        // API连接测试失败，返回false以便显示配置弹窗
        console.error('测试URL参数指定的magicpath时出错:', e);
        // 设置fetchResult为false，表示连接失败
        useGlobalStore().setFetchResult(false);
        return false;
      }
    }

    // 如果没有处理任何参数，执行错误回调
    try {
      await errorCb?.();
      // 检查是否成功连接到后端
      const globalStore = useGlobalStore();
      const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
      if (!hasBackendEnv) {
        // 如果没有连接到后端，设置fetchResult为false
        globalStore.setFetchResult(false);
      }
    } catch (e) {
      console.error('Error in errorCb:', e);
      useGlobalStore().setFetchResult(false);
    }
    return false; // 返回false表示没有成功处理URL参数
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
