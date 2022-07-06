import { Notify } from '@nutui/nutui';
import { useGlobalStore } from '@/store/global';
import { useSubsStore } from '@/store/subs';
import { useSettingsStore } from '@/store/settings';
import i18n from '@/locales';

export const initStores = async (
  needNotify: boolean,
  needFetchFlow: boolean
) => {
  const globalStore = useGlobalStore();
  const subsStore = useSubsStore();
  const settingsStore = useSettingsStore();

  const { t } = i18n.global;
  const notify = {
    type: '',
    msg: '',
    duration: 2000,
  };

  globalStore.setLoading(true);
  globalStore.setFetchResult(true);

  // 拉取应用数据
  const fetchAllStoreData = async () => {
    return new Promise((resolve, reject) => {
      // 更新所有数据
      const list = [
        subsStore.fetchSubsData(),
        settingsStore.fetchSettings(),
        globalStore.getEnv(),
      ];
      Promise.all(list)
        .then(async () => {
          if (needFetchFlow) await subsStore.fetchFlows();
          resolve('');
        })
        .catch(e => {
          reject(e);
        });
    });
  };

  try {
    await fetchAllStoreData();
    notify.msg = t('globalNotify.refresh.succeed');
    notify.type = 'primary';
  } catch (e) {
    console.log('e', e);
    notify.type = 'danger';
    globalStore.setFetchResult(false);
    notify.msg = t('globalNotify.refresh.failed');

    if (Array.isArray(e)) {
      const msgList = e.map(i => i?.data?.error?.message ?? '');
      notify.msg += msgList.join('\n');
    } else {
      const code = `Code ${e.status}`;
      const msg = e?.error?.message ?? '';
      notify.msg += msg ? code + ', ' + msg : code;
    }

    subsStore.subs = [];
    subsStore.collections = [];
  }
  globalStore.setLoading(false);

  // 发送通知
  if (needNotify) {
    Notify[notify.type](notify.msg, {
      duration: notify.duration,
    });
  }
};
