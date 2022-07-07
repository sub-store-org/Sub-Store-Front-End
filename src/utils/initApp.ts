import { Notify } from '@nutui/nutui';
import { useGlobalStore } from '@/store/global';
import { useSubsStore } from '@/store/subs';
import { useSettingsStore } from '@/store/settings';
import i18n from '@/locales';
import { useArtifactsStore } from '@/store/artifacts';

export const initStores = async (
  needNotify: boolean,
  needFetchFlow: boolean
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
  } catch (e) {
    globalStore.setFetchResult(false);
    subsStore.subs = [];
    subsStore.collections = [];
    isSucceed = false;
  }

  // 更新流量
  if (needFetchFlow) await subsStore.fetchFlows();

  // 发送通知
  if (isSucceed && needNotify) {
    Notify.primary(t('globalNotify.refresh.succeed'), {
      duration: 2000,
    });
  }

  globalStore.setLoading(false);
};
