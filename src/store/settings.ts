import { useSettingsApi } from '@/api/settings';
import i18n from '@/locales';
import { useAppNotifyStore } from '@/store/appNotify';
import { Toast } from '@nutui/nutui';
import { defineStore } from 'pinia';

const settingsApi = useSettingsApi();
const { t } = i18n.global;

export const useSettingsStore = defineStore('settingsStore', {
  state: (): SettingsStoreState => {
    return {
      gistToken: '',
      githubUser: '',
      syncTime: 0,
      theme: {
        auto: true,
        name: 'light',
        dark: 'dark',
        light: 'light',
      },
      avatarUrl: '',
      artifactStore: '',
    };
  },
  getters: {},
  actions: {
    async fetchSettings() {
      const { data: res } = await settingsApi.getSettings();
      if (res.status === 'success') {
        this.gistToken = res.data.gistToken || '';
        this.githubUser = res.data.githubUser || '';
        this.syncTime = res.data.syncTime || 0;
        this.avatarUrl = res.data.avatarUrl || '';
        this.artifactStore = res.data.artifactStore || '';

        this.theme.auto = res.data.theme?.auto ?? true;
        this.theme.name = res.data.theme?.name ?? 'light';
        this.theme.dark = res.data.theme?.dark ?? 'dark';
        this.theme.light = res.data.theme?.light ?? 'light';
      }
    },
    async editSettings(data: SettingsPostData) {
      const { showNotify } = useAppNotifyStore();

      const { data: res } = await settingsApi.setSettings(data);
      if (res.status === 'success') {
        this.gistToken = res.data.gistToken || '';
        this.githubUser = res.data.githubUser || '';
        this.avatarUrl = res.data.avatarUrl || '';
        this.artifactStore = res.data.artifactStore || '';
        showNotify({ type: 'success', title: t(`myPage.notify.save.succeed`) });
      }
    },
    async changeTheme(data: SettingsPostData) {
      Toast.loading('切换主题中...', { cover: true, id: 'theme__loading' });
      const { data: res } = await settingsApi.setSettings(data);
      if (res.status === 'success') {
        this.theme = res.data.theme;
      }
      Toast.hide('theme__loading');
    },
  },
});
