import { ref, watch, computed, onUnmounted } from 'vue';
import { useGlobalStore } from '@/store/global';
import { useAppNotifyStore } from '@/store/appNotify';
import service from '@/api';
import axios from 'axios';

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
  const { showNotify } = useAppNotifyStore();
  const apis = ref(getHostAPI().apis);
  const currentName = ref(getHostAPI().current);
  const currentUrl = computed(() => {
    return (
      apis.value.find(api => api.name === currentName.value) ??
      import.meta.env.VITE_API_URL ??
      'https://sub.store'
    );
  });

  const stopWatchCurrent = watch(currentName, async (newName, oldName) => {
    if (newName !== oldName) {
      setHostAPI({
        ...getHostAPI(),
        current: newName,
      });
      const url =
        apis.value.find(api => api.name === newName)?.url ??
        import.meta.env.VITE_API_URL ??
        'https://sub.store';

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
        const res = await axios.get<{ status: number }>(url + '/api/utils/env');
        if (res && res.status === 200) {
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

  return {
    currentName,
    currentUrl,
    apis,
    setCurrent,
    addApi,
    deleteApi,
    editApi,
  };
};
