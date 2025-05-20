import { useEnvApi } from "@/api/env";
import i18n from "@/locales";
import { useAppNotifyStore } from "@/store/appNotify";
import { useArtifactsStore } from "@/store/artifacts";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
// import { Toast } from '@nutui/nutui';

export const initStores = async (
  needNotify: boolean,
  needFetchFlow: boolean,
  needRefreshCache: boolean
) => {
  const { showNotify } = useAppNotifyStore();
  const globalStore = useGlobalStore();
  const subsStore = useSubsStore();
  const artifactsStore = useArtifactsStore();
  const settingsStore = useSettingsStore();

  const { t } = i18n.global;
  let isSucceed = true;
  if (needRefreshCache) {
    showNotify({ title: t("globalNotify.refresh.loading"), type: "primary" });
  }
  // Toast.loading(t('globalNotify.refresh.loading'), {
  // cover: true,
  // id: 'refresh',
  // });
  globalStore.setLoading(true);
  globalStore.setFetchResult(true);

  // Toast.hide('refresh');
  // 更新所有数据
  try {
    localStorage.removeItem("envCache");

    // 尝试获取后端环境信息，这是判断后端连接是否成功的关键
    try {
      // 设置超时，如果3秒内无法连接，则认为连接失败
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Backend connection timeout'));
        }, 3000); // 3秒超时
      });

      // 尝试获取环境信息
      const envPromise = globalStore.setEnv();

      // 使用Promise.race，哪个先完成就用哪个结果
      await Promise.race([envPromise, timeoutPromise]);

      // 检查是否成功获取到后端环境信息
      const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
      if (!hasBackendEnv) {
        // 如果没有获取到后端环境信息，说明连接失败
        console.error('Failed to get backend environment info');
        globalStore.setFetchResult(false);
        isSucceed = false;
        throw new Error('Failed to get backend environment info');
      }
    } catch (envError) {
      console.error('Error getting backend environment:', envError);
      globalStore.setFetchResult(false);
      isSucceed = false;
      throw envError; // 重新抛出异常，中断后续操作
    }

    // 只有在成功获取环境信息后才继续获取其他数据
    await subsStore.fetchSubsData();
    await new Promise((resolve) => setTimeout(resolve, 50));
    await artifactsStore.fetchArtifactsData();
    await settingsStore.syncLocalAppearanceSetting();
    await settingsStore.fetchSettings();

    if (needRefreshCache) {
      const { data } = await useEnvApi().refreshCache();
      if (data.status !== "success") {
        globalStore.setFetchResult(false);
        isSucceed = false;
      }
    }
  } catch (e) {
    console.error('Error initializing stores:', e);
    globalStore.setFetchResult(false);
    subsStore.subs = [];
    subsStore.collections = [];
    isSucceed = false;
  }

  // 发送通知
  if (isSucceed && needNotify) {
    showNotify({ title: t("globalNotify.refresh.succeed"), type: "primary" });
  }

  globalStore.setLoading(false);
  // 更新流量
  if (needFetchFlow) await subsStore.fetchFlows();
};
