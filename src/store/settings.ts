import { useSettingsApi } from "@/api/settings";
import i18n from "@/locales";
import { useGlobalStore } from '@/store/global';
import { useAppNotifyStore } from "@/store/appNotify";
import { Toast } from "@nutui/nutui";
import { defineStore } from "pinia";
// import { useEnvApi } from '@/api/env';
// import { useSubsStore } from '@/store/subs';

const settingsApi = useSettingsApi();
const { t } = i18n.global;

export const useSettingsStore = defineStore("settingsStore", {
  state: (): SettingsStoreState => {
    return {
      syncPlatform: "",
      gistToken: "",
      githubUser: "",
      defaultUserAgent: "",
      defaultTimeout: "",
      cacheThreshold: "",
      syncTime: 0,
      theme: {
        auto: true,
        name: "light",
        dark: "dark",
        light: "light",
      },
      appearanceSetting: {
        isSimpleMode: false,
      },
      avatarUrl: "",
      artifactStore: "",
      artifactStoreStatus: "",
      // ishostApi: localStorage.getItem('hostApi'),
    };
  },
  getters: {},
  actions: {
    async fetchSettings() {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.getSettings();
      if (res?.data?.status === "success" && res?.data?.data) {
        this.syncPlatform = res.data.data.syncPlatform || "";
        this.gistToken = res.data.data.gistToken || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultUserAgent = res.data.data.defaultUserAgent || "";
        this.defaultTimeout = res.data.data.defaultTimeout || "";
        this.cacheThreshold = res.data.data.cacheThreshold || "";
        this.syncTime = res.data.data.syncTime || 0;
        this.avatarUrl = res.data.data.avatarUrl || "";
        this.artifactStore = res.data.data.artifactStore || "";
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || "";

        this.theme.auto = res.data.data.theme?.auto ?? true;
        this.theme.name = res.data.data.theme?.name ?? "light";
        this.theme.dark = res.data.data.theme?.dark ?? "dark";
        this.theme.light = res.data.data.theme?.light ?? "light";

        this.appearanceSetting.isSimpleMode = res.data.data.appearanceSetting?.isSimpleMode ?? "";
      } else {
        showNotify({
          title: `获取配置失败`,
          type: "danger",
        });
      }
    },
    async editSettings(data: SettingsPostData) {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === "success" && res?.data?.data) {
        this.syncPlatform = res.data.data.syncPlatform || "";
        this.gistToken = res.data.data.gistToken || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultUserAgent = res.data.data.defaultUserAgent || "";
        this.defaultTimeout = res.data.data.defaultTimeout || "";
        this.cacheThreshold = res.data.data.cacheThreshold || "";
        this.avatarUrl = res.data.data.avatarUrl || "";
        this.artifactStore = res.data.data.artifactStore || "";
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || "";
        showNotify({ type: "success", title: t(`myPage.notify.save.succeed`) });
      } else {
        showNotify({
          title: `更新配置失败`,
          type: "danger",
        });
      }
    },
    // 备份本地配置到后端（用于兼容外观设置）
    async syncLocalAppearanceSetting() {
      const globalStore = useGlobalStore();
      const {
        // env,
        isSimpleMode,
        isLeftRight,
        ishostApi,
        isIconColor,
        isDefaultIcon,
        isEditorCommon,
        isSimpleReicon,
        showFloatingRefreshButton,
        istabBar,
        istabBar2,
        subProgressStyle,
      } = globalStore;
      console.log('globalStore', globalStore);
      console.log('isSimpleMode', isSimpleMode);
      console.log('isLeftRight', isLeftRight);
      console.log('ishostApi', ishostApi);
      console.log('isIconColor', isIconColor);
      console.log('isDefaultIcon', isDefaultIcon);
      console.log('isEditorCommon', isEditorCommon);
      console.log('isSimpleReicon', isSimpleReicon);
      console.log('showFloatingRefreshButton', showFloatingRefreshButton);
      console.log('istabBar', istabBar);
      console.log('istabBar2', istabBar2);
      console.log('subProgressStyle', subProgressStyle);
      const data = {
        isSimpleMode,
      };
      await this.changeAppearanceSetting({ appearanceSetting: data });
    },
    async changeTheme(data: SettingsPostData) {
      Toast.loading("切换主题中...", { cover: true, id: "theme__loading" });
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === "success" && res?.data?.data) {
        this.theme = res.data.data.theme;
      } else {
        showNotify({
          title: `切换主题失败`,
          type: "danger",
        });
      }
      Toast.hide("theme__loading");
    },
    async changeAppearanceSetting(data: SettingsPostData) {
      Toast.loading("保存外观设置中...", { cover: true, id: "theme__loading" });
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === "success" && res?.data?.data) {
        this.appearanceSetting = res.data.data.appearanceSetting;
        console.log('appearanceSetting', this.appearanceSetting);
      } else {
        showNotify({
          title: `保存外观设置失败`,
          type: "danger",
        });
      }
      Toast.hide("theme__loading");
    },
  },
});
