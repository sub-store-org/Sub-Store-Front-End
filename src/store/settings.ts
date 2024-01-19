import { useSettingsApi } from '@/api/settings';
import i18n from '@/locales';
import { useAppNotifyStore } from '@/store/appNotify';
import { Toast } from '@nutui/nutui';
import { defineStore } from 'pinia';
// import { useEnvApi } from '@/api/env';
import { useSubsStore } from '@/store/subs';

const settingsApi = useSettingsApi();
const { t } = i18n.global;

export const useSettingsStore = defineStore('settingsStore', {
  state: (): SettingsStoreState => {
    return {
      gistToken: '',
      githubUser: '',
      defaultUserAgent: '',
      defaultTimeout: '',
      syncTime: 0,
      theme: {
        auto: true,
        name: 'light',
        dark: 'dark',
        light: 'light',
      },
      avatarUrl: '',
      artifactStore: '',
      artifactStoreStatus: '',
      autoDownloadGistSync: false,
      // ishostApi: localStorage.getItem('hostApi'),
    };
  },
  getters: {},
  actions: {
    async fetchSettings() {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.getSettings();
      if (res?.data?.status === 'success' && res?.data?.data) {
        this.gistToken = res.data.data.gistToken || '';
        this.githubUser = res.data.data.githubUser || '';
        this.defaultUserAgent = res.data.data.defaultUserAgent || '';
        this.defaultTimeout = res.data.data.defaultTimeout || '';
        this.syncTime = res.data.data.syncTime || 0;
        this.avatarUrl = res.data.data.avatarUrl || '';
        this.artifactStore = res.data.data.artifactStore || '';
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || '';

        this.theme.auto = res.data.data.theme?.auto ?? true;
        this.theme.name = res.data.data.theme?.name ?? 'light';
        this.theme.dark = res.data.data.theme?.dark ?? 'dark';
        this.theme.light = res.data.data.theme?.light ?? 'light';
        let ressss = res.data.data.autoDownloadGistSync ?? false;
        if (ressss) {
          console.log("启动时自动下载 Gist 成功");
            const syncRes = await settingsApi.syncSettings('download');
            if (syncRes?.data?.status === 'success') {
              console.log('自动下载 Gist 成功');
              const subsStore = useSubsStore();
              await subsStore.fetchSubsData();
            }
        }
        this.autoDownloadGistSync = ressss;
      } else {
        showNotify({
          title: `获取配置失败`,
          type: 'danger',
        });
      }
    },
    async editSettings(data: SettingsPostData) {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === 'success' && res?.data?.data) {
        this.gistToken = res.data.data.gistToken || '';
        this.githubUser = res.data.data.githubUser || '';
        this.defaultUserAgent = res.data.data.defaultUserAgent || '';
        this.defaultTimeout = res.data.data.defaultTimeout || '';
        this.avatarUrl = res.data.data.avatarUrl || '';
        this.artifactStore = res.data.data.artifactStore || '';
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || '';
        showNotify({ type: 'success', title: t(`myPage.notify.save.succeed`) });
      } else {
        showNotify({
          title: `更新配置失败`,
          type: 'danger',
        });
      }
    },
    async changeTheme(data: SettingsPostData) {
      Toast.loading('切换主题中...', { cover: true, id: 'theme__loading' });
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === 'success' && res?.data?.data) {
        this.theme = res.data.data.theme;
      } else {
        showNotify({
          title: `切换主题失败`,
          type: 'danger',
        });
      }
      Toast.hide('theme__loading');
    },
    async changeAutoDownloadGist(data: SettingsPostData) {
      const { showNotify } = useAppNotifyStore();
      Toast.loading('同步 Gist Config 配置中...', { cover: true, id: 'isAutoDownloadGistSync__loading' });
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === 'success' && res?.data?.data) {
        let tfvalue = res.data.data.autoDownloadGistSync;
        this.autoDownloadGistSync = tfvalue;
        // const syncRes = await settingsApi.syncSettings('upload');
        // if (syncRes?.data?.status === 'success') {
        //   // console.log('上载')
        //   // const syncRes = await settingsApi.syncSettings('download');
        //   // if (syncRes?.data?.status === 'success') {
        //   //   console.log('下载')
        //   //   showNotify({ type: 'primary', duration:500, title: t(`同步成功 状态：${tfvalue}`) });
        //   //   const subsStore = useSubsStore();
        //   //   await subsStore.fetchSubsData();
        //   //   Toast.hide('isAutoDownloadGistSync__loading');
        //   // }
        //   Toast.hide('isAutoDownloadGistSync__loading');
        //   showNotify({ type: 'primary', duration:800, title: t(`同步成功 重启时自动加载状态：${tfvalue}`) });
        // }
        Toast.hide('isAutoDownloadGistSync__loading');
      } else {
        showNotify({
          title: `同步 Gist Config 配置失败`,
          type: 'danger',
        });
      }
    },
  },
  
});