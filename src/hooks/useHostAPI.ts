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
    if (!query) return await errorCb?.();

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
        return setCurrent(isExist.name);
      }

      const name = url.slice(0, 10) + (Math.random() * 100).toFixed(0);
      await addApi({ name, url });
      setCurrent(name);
      return;
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
        return setCurrent(isExist.name);
      }

      try {
        const name = `Docker_${new Date().getTime()}`;
        await addApi({ name, url: apiUrl });
        setCurrent(name);

        // 设置已配置标志
        localStorage.setItem('magicPathConfigured', 'true');
        return;
      } catch (e) {
        console.error('处理magicPath参数时出错:', e);
      }
    }

    // 如果没有处理任何参数，执行错误回调
    return await errorCb?.();
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
