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
export const getHostAPIBearerToken = (): string => {
  const { current, apis } = getHostAPI();
  return (
    apis.find(api => api.name === current)?.bearer_token ||
    ''
  );
};
export const getHostAPIDToken = (): string => {
  const { current, apis } = getHostAPI();
  return (
    apis.find(api => api.name === current)?.d_token ||
    ''
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

  const addApi = async ({ name, url, bearer_token, d_token }: HostAPI) => {
    if (apis.value.find(api => api.name === name)) {
      showNotify({
        title: 'API 名称重复',
        type: 'danger',
      });
      return false;
    } else {
      try {
        // 配置后端通信密钥
        const reqConfig = bearer_token !== '' ? { headers: {Authorization: 'Bearer ' + bearer_token }} : {};
        const res = await axios.get<{ status: 'success' | 'failed' }>(
          url + '/api/utils/env',
          reqConfig
        );
        if (res && res.data && res.data.status === 'success') {
          apis.value.push({ name, url, bearer_token, d_token });
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

  const editApi = ({ name, url, bearer_token, d_token }: HostAPI) => {
    const index = apis.value.findIndex(api => api.name === name);
    if (index === -1) return;
    apis.value[index].url = url;
    apis.value[index].bearer_token = bearer_token;
    apis.value[index].d_token = d_token;
  };

  const handleUrlQuery = async ({
    errorCb,
  }: {
    errorCb?: () => Promise<void>;
  }) => {
    const query = new URLSearchParams(window.location.search);
    if (!query) return await errorCb?.();

    const url = query.get('api');
    if (!url) return await errorCb?.();

    const isExist = apis.value.find(api => api.url === url);

    if (isExist) {
      if (isExist.name === currentName.value) return await errorCb?.();
      return setCurrent(isExist.name);
    }

    const bearer_token = query.get('bearer_token') ?? '';
    const d_token = query.get('d_token') ?? '';
    const name = url.slice(0, 10) + (Math.random() * 100).toFixed(0);
    await addApi({ name, url, bearer_token, d_token });
    setCurrent(name);
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
