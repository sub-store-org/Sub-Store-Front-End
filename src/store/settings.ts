import { defineStore } from 'pinia';
import { useSettingsApi } from '@/api/settings';

const settingsApi = useSettingsApi();

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
      const { data } = await settingsApi.getSettings();
      this.gistToken = data.gistToken || '';
      this.githubUser = data.githubUser || '';
      this.syncTime = data.syncTime || 0;
      this.theme = data.theme || { darkMode: false };
      this.avatarUrl = data.avatarUrl || '';
    },
    async editSettings(data: SettingsPostData) {
      const { data: res } = await settingsApi.setSettings(data);
      console.log(res);
      this.gistToken = res.gistToken || '';
      this.githubUser = res.githubUser || '';
      this.syncTime = res.syncTime || 0;
      this.theme = res.theme || { darkMode: false };
      this.avatarUrl = res.avatarUrl || '';
    },
  },
});
