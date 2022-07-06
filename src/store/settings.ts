import { defineStore } from 'pinia';
import { useSettingsApi } from '@/api/settings';
import { Notify } from '@nutui/nutui';
import i18n from '@/locales';

const settingsApi = useSettingsApi();
const { t } = i18n.global;

export const useSettingsStore = defineStore('settingsStore', {
  state: (): SettingsStoreState => {
    return {
      gistToken: '',
      githubUser: '',
      syncTime: 0,
      theme: {
        darkMode: false,
      },
      avatarUrl: '',
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
        this.theme = res.data.theme || { darkMode: false };
        this.avatarUrl = res.data.avatarUrl || '';
      }
    },
    async editSettings(data: SettingsPostData) {
      const { data: res } = await settingsApi.setSettings(data);
      if (res.status === 'success') {
        this.gistToken = res.data.gistToken || '';
        this.githubUser = res.data.githubUser || '';
        this.avatarUrl = res.data.avatarUrl || '';
        Notify.success(t(`myPage.notify.save.succeed`));
      }
    },
  },
});
