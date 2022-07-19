import { useEnvApi } from '@/api/env';
import i18n from '@/locales';
import { useArtifactsStore } from '@/store/artifacts';
import { useGlobalStore } from '@/store/global';
import { useSettingsStore } from '@/store/settings';
import { useSubsStore } from '@/store/subs';
import { Notify } from '@nutui/nutui';

export const initStores = async (
  needNotify: boolean,
  needFetchFlow: boolean,
  needRefreshCache: boolean
) => {
  const globalStore = useGlobalStore();
  const subsStore = useSubsStore();
  const artifactsStore = useArtifactsStore();
  const settingsStore = useSettingsStore();
  const { t } = i18n.global;
  let isSucceed = true;

  globalStore.setLoading(true);
  globalStore.setFetchResult(true);

  // 更新所有数据
  try {
    await subsStore.fetchSubsData();
    await artifactsStore.fetchArtifactsData();
    await settingsStore.fetchSettings();
    await globalStore.setEnv();
    if (needRefreshCache) {
      const { data } = await useEnvApi().refreshCache();
      if (data.status !== 'success') {
        globalStore.setFetchResult(false);
        isSucceed = false;
      }
    }
  } catch (e) {
    globalStore.setFetchResult(false);
    subsStore.subs = [];
    subsStore.collections = [];
    isSucceed = false;
  }

  // 发送通知
  if (isSucceed && needNotify) {
    Notify.primary(t('globalNotify.refresh.succeed'), {
      duration: 2000,
    });
  }

  globalStore.setLoading(false);
  // 更新流量
  if (needFetchFlow) await subsStore.fetchFlows();
};
