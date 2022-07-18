import { useSettingsApi } from '@/api/settings';
import i18n from '@/locales';
import { Notify, Toast } from '@nutui/nutui';
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
        name: 'auto',
        config: {
          dark: 'dark',
          light: 'light',
        },
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

        this.theme.name = res.data.theme?.name ?? 'auto';
        this.theme.config = res.data.theme?.config ?? {
          dark: 'dark',
          light: 'light',
        };
      }
    },
    async editSettings(data: SettingsPostData) {
      const { data: res } = await settingsApi.setSettings(data);
      if (res.status === 'success') {
        this.gistToken = res.data.gistToken || '';
        this.githubUser = res.data.githubUser || '';
        this.avatarUrl = res.data.avatarUrl || '';
        this.artifactStore = res.data.artifactStore || '';
        Notify.success(t(`myPage.notify.save.succeed`));
      }
    },
    async changeTheme(name) {
      Toast.loading('切换主题中...', { cover: true, id: 'theme__loading' });

      const data = {
        theme: {
          name,
          config: this.theme.config,
        },
      };
      const { data: res } = await settingsApi.setSettings(data);
      if (res.status === 'success') {
        this.theme.name = name;
      }
      Toast.hide('theme__loading');
    },
    async editThemeConfig(label, value) {
      Toast.loading('切换主题中...', { cover: true, id: 'theme__loading' });
      const data = {
        theme: {
          name: this.theme.name,
          config: {
            dark: this.theme.config.dark,
            light: this.theme.config.light,
          },
        },
      };
      data.theme.config[label] = value;
      const { data: res } = await settingsApi.setSettings(data);
      if (res.status === 'success') {
        this.theme.config[label] = value;
      }
      Toast.hide('theme__loading');
    },
  },
});
