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
      githubProxy: "",
      githubUser: "",
      defaultUserAgent: "",
      defaultProxy: "",
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
        isLeftRight: false,
        isDefaultIcon: false,
        isIconColor: false,
        isShowIcon: true,
        isSimpleShowRemark: false,
        isEditorCommon: true,
        isSimpleReicon: false,
        isSubItemMenuFold: true,
        showFloatingRefreshButton: false,
        showFloatingAddButton: false,
        displayPreviewInWebPage: true,
        istabBar: false,
        istabBar2: false,
        subProgressStyle: "hidden",
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
        this.githubProxy = res.data.data.githubProxy || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultProxy = res.data.data.defaultProxy || "";
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
        this.appearanceSetting.isLeftRight = res.data.data.appearanceSetting?.isLeftRight ?? "";
        this.appearanceSetting.isDefaultIcon = res.data.data.appearanceSetting?.isDefaultIcon ?? "";
        this.appearanceSetting.isIconColor = res.data.data.appearanceSetting?.isIconColor ?? "";
        this.appearanceSetting.isShowIcon = res.data.data.appearanceSetting?.isShowIcon ?? true;
        this.appearanceSetting.isSimpleShowRemark = res.data.data.appearanceSetting?.isSimpleShowRemark ?? "";
        this.appearanceSetting.isEditorCommon = res.data.data.appearanceSetting?.isEditorCommon ?? true;
        this.appearanceSetting.isSimpleReicon = res.data.data.appearanceSetting?.isSimpleReicon ?? "";
        this.appearanceSetting.isSubItemMenuFold = res.data.data.appearanceSetting?.isSubItemMenuFold ?? true;
        this.appearanceSetting.showFloatingRefreshButton = res.data.data.appearanceSetting?.showFloatingRefreshButton ?? "";
        this.appearanceSetting.showFloatingAddButton = res.data.data.appearanceSetting?.showFloatingAddButton ?? false;
        this.appearanceSetting.istabBar = res.data.data.appearanceSetting?.istabBar ?? "";
        this.appearanceSetting.istabBar2 = res.data.data.appearanceSetting?.istabBar2 ?? "";
        this.appearanceSetting.subProgressStyle = res.data.data.appearanceSetting?.subProgressStyle ?? "hidden";
      } else {
        showNotify({
          title: `获取配置失败`,
          type: "danger",
        });
      }
    },
    async editGistSettings(data: SettingsPostData) {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === "success" && res?.data?.data) {
        this.syncPlatform = res.data.data.syncPlatform || "";
        this.gistToken = res.data.data.gistToken || "";
        this.githubProxy = res.data.data.githubProxy || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultProxy = res.data.data.defaultProxy || "";
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
        isSimpleMode,
        isLeftRight,
        isIconColor,
        isDefaultIcon,
        isEditorCommon,
        isSimpleReicon,
        showFloatingRefreshButton,
        istabBar,
        istabBar2,
        subProgressStyle,
      } = globalStore;
      const data = {
        isSimpleMode: isSimpleMode ?? false,
        isLeftRight: isLeftRight ?? false,
        isIconColor: isIconColor ?? false,
        isDefaultIcon: isDefaultIcon ?? false,
        isEditorCommon: isEditorCommon ?? true,
        isSimpleReicon: isSimpleReicon ?? false,
        showFloatingRefreshButton: showFloatingRefreshButton ?? false,
        istabBar: istabBar ?? false,
        istabBar2: istabBar2 ?? false,
        subProgressStyle: subProgressStyle ?? "hidden",
      };
      const list = Object.keys(data) as (keyof SettingsPostData)[];
      // 判断是否有本地持久化的外观设置
      const hasLocalAppearanceSetting = list.some((key) => {
        return localStorage.getItem(key) !== null
      })
      // 如果有本地持久化的外观设置，则将其同步到后端
      if (hasLocalAppearanceSetting) {
        await this.changeAppearanceSetting({ appearanceSetting: data });
        this.removeLocalAppearanceSetting(); 
      }
    },
    // 清除本地持久化的外观设置
    removeLocalAppearanceSetting() {
      const globalStore = useGlobalStore();
      globalStore.setSimpleMode(false);
      globalStore.setLeftRight(false);
      globalStore.setIconColor(false);
      globalStore.setIsDefaultIcon(false);
      globalStore.setEditorCommon(false);
      globalStore.setSimpleReicon(false);
      globalStore.setShowFloatingRefreshButton(false);
      globalStore.settabBar(false);
      globalStore.settabBar2(false);
      globalStore.setSubProgressStyle('hidden');
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
