import { ref, watch, computed, onUnmounted } from 'vue';
import { useGlobalStore } from '@/store/global';
import { useAppNotifyStore } from '@/store/appNotify';
import axios from 'axios';

const lsKey = 'hostAPI';

const createEmptyHostAPI = (): HostAPIStorage => ({
  current: '',
  apis: [],
});

const normalizeHostAPIUrl = (url: string) => {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';

  try {
    return new URL(trimmed).toString().replace(/\/+$/, '');
  } catch {
    const normalizedPath = trimmed.replace(/\/+$/, '');
    return normalizedPath || (trimmed.startsWith('/') ? '/' : '');
  }
};

const isSameHostAPIUrl = (left: string, right: string) =>
  normalizeHostAPIUrl(left) === normalizeHostAPIUrl(right);

const getDefaultHostAPIUrl = (): string =>
  normalizeHostAPIUrl(import.meta.env.VITE_API_URL || 'https://sub.store');

const isDefaultHostAPIUrl = (url: string): boolean =>
  isSameHostAPIUrl(url, getDefaultHostAPIUrl());

const normalizeHostAPIStorage = (hostAPI: HostAPIStorage): HostAPIStorage => {
  const current = hostAPI?.current || '';
  const apiRecords = new Map<string, { api: HostAPI; index: number }>();

  (Array.isArray(hostAPI?.apis) ? hostAPI.apis : []).forEach((api, index) => {
    if (!api?.name || !api?.url) return;

    const normalizedUrl = normalizeHostAPIUrl(api.url);
    if (!normalizedUrl) return;
    if (isDefaultHostAPIUrl(normalizedUrl)) return;

    const key = normalizedUrl;
    const normalizedApi = { ...api, url: normalizedUrl };
    const existing = apiRecords.get(key);

    if (!existing) {
      apiRecords.set(key, { api: normalizedApi, index });
    } else if (api.name === current) {
      existing.api = normalizedApi;
    }
  });

  const apis = Array.from(apiRecords.values())
    .sort((left, right) => left.index - right.index)
    .map(({ api }) => api);

  return {
    current: apis.find(api => api.name === current) ? current : '',
    apis,
  };
};

const setHostAPI = (hostAPI: HostAPIStorage) => {
  localStorage.setItem(lsKey, JSON.stringify(normalizeHostAPIStorage(hostAPI)));
};

const getHostAPI = (): HostAPIStorage => {
  const item = localStorage.getItem(lsKey);
  if (item) {
    try {
      const hostAPI = normalizeHostAPIStorage(JSON.parse(item));
      if (JSON.stringify(hostAPI) !== item) {
        setHostAPI(hostAPI);
      }
      return hostAPI;
    } catch {
      const emptyHostAPI = createEmptyHostAPI();
      setHostAPI(emptyHostAPI);
      return emptyHostAPI;
    }
  } else {
    setHostAPI(createEmptyHostAPI());
    return getHostAPI();
  }
};
export const getHostAPIUrl = (): string => {
  const { current, apis } = getHostAPI();
  return (
    apis.find(api => api.name === current)?.url ||
    getDefaultHostAPIUrl()
  ).replace(/\/$/, ''); // 去除末尾斜杠;
};

export const useHostAPI = () => {
  const defaultAPI = getDefaultHostAPIUrl();

  const { showNotify } = useAppNotifyStore();
  const hostAPI = getHostAPI();
  const apis = ref(hostAPI.apis);
  const currentName = ref(hostAPI.current);
  const currentUrl = computed(() => {
    const url = apis.value.find(api => api.name === currentName.value)?.url ?? defaultAPI
    return url.startsWith('/') ? `${window.location.origin}${url}` : url;
  });

  const getAPIByUrl = (url: string, list = getHostAPI().apis) =>
    list.find(api => isSameHostAPIUrl(api.url, url));

  const createAPIName = (url: string, list = getHostAPI().apis) => {
    const baseName = url.slice(0, 10) || 'Custom';
    let name = baseName;
    let index = 1;

    while (list.find(api => api.name === name)) {
      name = `${baseName}_${index}`;
      index += 1;
    }

    return name;
  };

  const testAPIConnection = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), localStorage.getItem('timeout') ? parseInt(localStorage.getItem('timeout') as string, 10) : 3000); // 3秒超时

    try {
      const res = await axios.get<{ status: 'success' | 'failed' }>(
        `${url}/api/utils/env`,
        { signal: controller.signal }
      );

      return res?.data?.status === 'success';
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleDefaultAPIUrl = async (url: string): Promise<boolean> => {
    const latestHostAPI = getHostAPI();
    apis.value = latestHostAPI.apis;

    setCurrent('');
    const globalStore = useGlobalStore();
    globalStore.setFetchResult(false);

    try {
      const isValid = await testAPIConnection(url);

      if (isValid) {
        localStorage.setItem('backendConfigured', 'true');
        globalStore.setFetchResult(true);
        return true;
      }

      globalStore.setFetchResult(false);
      return false;
    } catch (e) {
      console.error('测试默认API连接时出错:', e);
      globalStore.setFetchResult(false);
      return false;
    }
  };

  const stopWatchCurrent = watch(currentName, async (newName, oldName) => {
    if (newName !== oldName) {
      const latestHostAPI = getHostAPI();

      // 保存新的API配置
      setHostAPI({
        ...latestHostAPI,
        current: newName,
      });

      // 获取新API的URL
      const url =
        latestHostAPI.apis.find(api => api.name === newName)?.url ?? defaultAPI;

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
    const latestHostAPI = getHostAPI();

    if (name !== '' && !latestHostAPI.apis.find(api => api.name === name)) {
      return;
    }

    apis.value = latestHostAPI.apis;

    if (currentName.value === name) {
      setHostAPI({
        ...latestHostAPI,
        current: name,
      });
      return;
    }

    currentName.value = name;
  };

  const addApi = async ({ name, url }: HostAPI, skipConnectionCheck = false, silentDuplicate = false) => {
    const normalizedUrl = normalizeHostAPIUrl(url);
    const latestHostAPI = getHostAPI();

    apis.value = latestHostAPI.apis;

    if (!normalizedUrl) {
      if (!silentDuplicate) {
        showNotify({
          title: '无效的 API 地址，请检查',
          type: 'danger',
        });
      }
      return false;
    }

    if (latestHostAPI.apis.find(api => api.name === name)) {
      if (!silentDuplicate) {
        showNotify({
          title: 'API 名称重复',
          type: 'danger',
        });
      }
      return false;
    }

    if (isDefaultHostAPIUrl(normalizedUrl) || getAPIByUrl(normalizedUrl, latestHostAPI.apis)) {
      if (!silentDuplicate) {
        showNotify({
          title: 'API 地址重复',
          type: 'danger',
        });
      }
      return false;
    }

    const saveApi = () => {
      const storage = getHostAPI();
      const nextHostAPI = normalizeHostAPIStorage({
        ...storage,
        apis: [...storage.apis, { name, url: normalizedUrl }],
      });

      setHostAPI(nextHostAPI);
      apis.value = nextHostAPI.apis;
      return true;
    };

    // 如果跳过连接检查，直接添加API
    if (skipConnectionCheck) {
      return saveApi();
    }

    try {
      const isValid = await testAPIConnection(normalizedUrl);
      if (isValid) {
        return saveApi();
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
  };

  const deleteApi = (name: string) => {
    const latestHostAPI = getHostAPI();
    const nextApis = latestHostAPI.apis.filter(api => api.name !== name);
    if (nextApis.length === latestHostAPI.apis.length) return;

    const nextCurrentName = latestHostAPI.current === name
      ? nextApis[0]?.name || ''
      : latestHostAPI.current;

    setHostAPI({
      current: nextCurrentName,
      apis: nextApis,
    });

    apis.value = nextApis;
    currentName.value = nextCurrentName;
  };

  const editApi = ({ name, url }: HostAPI) => {
    const latestHostAPI = getHostAPI();
    const index = latestHostAPI.apis.findIndex(api => api.name === name);
    if (index === -1) return;

    latestHostAPI.apis[index].url = normalizeHostAPIUrl(url);
    const nextHostAPI = normalizeHostAPIStorage(latestHostAPI);
    setHostAPI(nextHostAPI);
    apis.value = nextHostAPI.apis;
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

    const queryParams = new URLSearchParams(query);

    // 处理 concurrency 参数
    const concurrency = queryParams.get('concurrency');
    if (concurrency !== null) {
      const value = parseInt(concurrency, 10);
      if (!isNaN(value)) {
        if (value >= 1) {
          console.log(`设置并发数 ${value}`)
          localStorage.setItem('concurrency', value.toString());
        } else {
          console.log(`清除并发数设置`)
          localStorage.removeItem('concurrency');
        }
      }
    }
    // 处理 timeout 参数
    const timeout = queryParams.get('timeout');
    if (timeout !== null) {
      const value = Number(timeout);
      if (!isNaN(value)) {
        if (value > 0) {
          console.log(`设置超时 ${value}`)
          localStorage.setItem('timeout', value.toString());
        } else {
          console.log(`清除超时设置`)
          localStorage.removeItem('timeout');
        }
      }
    }

    // 处理api参数
    const apiUrl = queryParams.get('api');

    // 处理magicpath参数
    const magicPathParam = queryParams.get('magicpath');

    // 获取全局状态管理
    const globalStore = useGlobalStore();

    // 优先处理api参数
    if (apiUrl !== null) {
      const url = normalizeHostAPIUrl(apiUrl);
      if (!url) return await errorCb?.();
      if (isDefaultHostAPIUrl(url)) return await handleDefaultAPIUrl(url);

      // 检查是否已存在相同URL的API
      const latestHostAPI = getHostAPI();
      const isExist = getAPIByUrl(url, latestHostAPI.apis);
      apis.value = latestHostAPI.apis;

      if (isExist) {
        // 如果已存在且不是当前API，则切换到该API
        if (isExist.name === latestHostAPI.current) {
          // 如果是当前API，尝试重新连接
          try {
            const isValid = await testAPIConnection(url);

            if (isValid) {
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
        const name = createAPIName(url, latestHostAPI.apis);

        // 无论连接是否成功，都先添加到列表并设置为当前API
        // 使用skipConnectionCheck=true跳过连接检查直接添加
        const addResult = await addApi({ name, url }, true, true);
        const targetAPI = getAPIByUrl(url);

        if (addResult || targetAPI) {
          // 设置为当前API
          setCurrent(targetAPI?.name || name);

          // 清除旧的连接状态
          globalStore.setFetchResult(false);

          try {
            const isValid = await testAPIConnection(url);

            if (isValid) {
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
    if (magicPathParam !== null) {
      const magicPath = magicPathParam;
      if (!magicPath) return await errorCb?.();

      // 构建完整的API URL
      const currentHost = window.location.origin;
      const apiUrl = normalizeHostAPIUrl(`${currentHost}/${magicPath.replace(/^\/+/, '')}`);
      if (isDefaultHostAPIUrl(apiUrl)) {
        const isHandled = await handleDefaultAPIUrl(apiUrl);
        if (isHandled) localStorage.setItem('magicPathConfigured', 'true');
        return isHandled;
      }

      // 检查是否已存在相同URL的API
      const latestHostAPI = getHostAPI();
      const isExist = getAPIByUrl(apiUrl, latestHostAPI.apis);
      apis.value = latestHostAPI.apis;

      if (isExist) {
        // 如果已存在且不是当前API，则切换到该API
        if (isExist.name === latestHostAPI.current) {
          // 如果是当前API，尝试重新连接
          try {
            const isValid = await testAPIConnection(apiUrl);

            if (isValid) {
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
        const addResult = await addApi({ name, url: apiUrl }, true, true);
        const targetAPI = getAPIByUrl(apiUrl);

        if (addResult || targetAPI) {
          // 设置为当前API
          setCurrent(targetAPI?.name || name);

          // 清除旧的连接状态
          globalStore.setFetchResult(false);

          try {
            const isValid = await testAPIConnection(apiUrl);

            if (isValid) {
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
