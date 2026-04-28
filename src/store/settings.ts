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
const LIST_PAGE_VIEW_MODE_STORAGE_KEY = "appearanceSetting.listPageViewMode";
const NARROW_MODE_LIST_PAGE_VIEW_MODE_STORAGE_KEY = "appearanceSetting.listPageViewModeInWideScreenNarrowMode";
const WIDE_SCREEN_NARROW_MODE_STORAGE_KEY = "appearanceSetting.useNarrowModeOnWideScreen";

const normalizeSettingInputValue = (value: unknown) => {
  return value === null || value === undefined ? "" : String(value);
};

const getCachedListPageViewMode = (storageKey: string): ListPageViewMode | undefined => {
  const cachedMode = localStorage.getItem(storageKey);
  if (cachedMode === "single-column" || cachedMode === "dual-column") {
    return cachedMode;
  }

  return undefined;
};

const syncCachedListPageViewMode = (storageKey: string, mode?: ListPageViewMode) => {
  if (mode) {
    localStorage.setItem(storageKey, mode);
  } else {
    localStorage.removeItem(storageKey);
  }
};

const getCachedWideScreenNarrowMode = () => {
  return localStorage.getItem(WIDE_SCREEN_NARROW_MODE_STORAGE_KEY) === "1";
};

export const useSettingsStore = defineStore("settingsStore", {
  state: (): SettingsStoreState => {
    return {
      syncPlatform: "",
      gistToken: "",
      githubProxy: "",
      githubProxyRegex: "",
      githubUser: "",
      defaultUserAgent: "",
      defaultFlowUserAgent: "",
      defaultProxy: "",
      defaultTimeout: "",
      cacheThreshold: "",
      resourceCacheTtl: "",
      headersCacheTtl: "",
      scriptCacheTtl: "",
      logsMaxCount: "",
      syncTime: 0,
      theme: {
        auto: true,
        name: "light",
        dark: "dark",
        light: "light",
      },
      appearanceSetting: {
        isSimpleMode: true,
        isLeftRight: false,
        isDefaultIcon: false,
        isIconColor: false,
        isShowIcon: true,
        isSimpleShowRemark: false,
        isEditorCommon: true,
        isSimpleReicon: false,
        isSubItemMenuFold: true,
        showFloatingRefreshButton: false,
        showFloatingLogsButton: true,
        showFloatingAddButton: false,
        createItemPosition: "bottom",
        displayPreviewInWebPage: true,
        invalidShareFakeNode: false,
        istabBar: false,
        istabBar2: false,
        subProgressStyle: "hidden",
        listPageViewMode: getCachedListPageViewMode(LIST_PAGE_VIEW_MODE_STORAGE_KEY),
        listPageViewModeInWideScreenNarrowMode: getCachedListPageViewMode(NARROW_MODE_LIST_PAGE_VIEW_MODE_STORAGE_KEY),
        useNarrowModeOnWideScreen: getCachedWideScreenNarrowMode(),
      },
      gistUpload: "base64",
      avatarUrl: "",
      artifactStore: "",
      artifactStoreStatus: "",
      // ishostApi: localStorage.getItem('hostApi'),
    };
  },
  getters: {},
  actions: {
    applyAppearanceSetting(appearanceSetting?: SettingsPostData["appearanceSetting"]) {
      const cachedNarrowModeListPageViewMode = getCachedListPageViewMode(
        NARROW_MODE_LIST_PAGE_VIEW_MODE_STORAGE_KEY,
      );

      this.appearanceSetting.isSimpleMode = appearanceSetting?.isSimpleMode ?? true;
      this.appearanceSetting.isLeftRight = appearanceSetting?.isLeftRight ?? "";
      this.appearanceSetting.isDefaultIcon = appearanceSetting?.isDefaultIcon ?? "";
      this.appearanceSetting.isIconColor = appearanceSetting?.isIconColor ?? "";
      this.appearanceSetting.isShowIcon = appearanceSetting?.isShowIcon ?? true;
      this.appearanceSetting.isSimpleShowRemark = appearanceSetting?.isSimpleShowRemark ?? "";
      this.appearanceSetting.isEditorCommon = appearanceSetting?.isEditorCommon ?? true;
      this.appearanceSetting.isSimpleReicon = appearanceSetting?.isSimpleReicon ?? "";
      this.appearanceSetting.isSubItemMenuFold = appearanceSetting?.isSubItemMenuFold ?? true;
      this.appearanceSetting.showFloatingRefreshButton = appearanceSetting?.showFloatingRefreshButton ?? "";
      this.appearanceSetting.showFloatingLogsButton = appearanceSetting?.showFloatingLogsButton ?? true;
      this.appearanceSetting.showFloatingAddButton = appearanceSetting?.showFloatingAddButton ?? false;
      this.appearanceSetting.createItemPosition = appearanceSetting?.createItemPosition ?? "bottom";
      this.appearanceSetting.displayPreviewInWebPage = appearanceSetting?.displayPreviewInWebPage ?? true;
      this.appearanceSetting.invalidShareFakeNode = appearanceSetting?.invalidShareFakeNode ?? false;
      this.appearanceSetting.istabBar = appearanceSetting?.istabBar ?? "";
      this.appearanceSetting.istabBar2 = appearanceSetting?.istabBar2 ?? "";
      this.appearanceSetting.subProgressStyle = appearanceSetting?.subProgressStyle ?? "hidden";
      this.appearanceSetting.listPageViewMode = appearanceSetting?.listPageViewMode;
      this.appearanceSetting.listPageViewModeInWideScreenNarrowMode =
        appearanceSetting?.listPageViewModeInWideScreenNarrowMode ?? cachedNarrowModeListPageViewMode;
      this.appearanceSetting.useNarrowModeOnWideScreen = appearanceSetting?.useNarrowModeOnWideScreen ?? false;

      syncCachedListPageViewMode(LIST_PAGE_VIEW_MODE_STORAGE_KEY, this.appearanceSetting.listPageViewMode);
      syncCachedListPageViewMode(
        NARROW_MODE_LIST_PAGE_VIEW_MODE_STORAGE_KEY,
        this.appearanceSetting.listPageViewModeInWideScreenNarrowMode,
      );

      if (this.appearanceSetting.useNarrowModeOnWideScreen) {
        localStorage.setItem(WIDE_SCREEN_NARROW_MODE_STORAGE_KEY, "1");
      } else {
        localStorage.removeItem(WIDE_SCREEN_NARROW_MODE_STORAGE_KEY);
      }
    },
    async fetchSettings() {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.getSettings();
      if (res?.data?.status === "success" && res?.data?.data) {
        this.syncPlatform = res.data.data.syncPlatform || "";
        this.gistToken = res.data.data.gistToken || "";
        this.githubProxy = res.data.data.githubProxy || "";
        this.githubProxyRegex = res.data.data.githubProxyRegex || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultProxy = res.data.data.defaultProxy || "";
        this.defaultUserAgent = res.data.data.defaultUserAgent || "";
        this.defaultFlowUserAgent = res.data.data.defaultFlowUserAgent || "";
        this.defaultTimeout = res.data.data.defaultTimeout || "";
        this.cacheThreshold = res.data.data.cacheThreshold || "";
        this.resourceCacheTtl = res.data.data.resourceCacheTtl || "";
        this.headersCacheTtl = res.data.data.headersCacheTtl || "";
        this.scriptCacheTtl = res.data.data.scriptCacheTtl || "";
        this.logsMaxCount = normalizeSettingInputValue(res.data.data.logsMaxCount);
        this.syncTime = res.data.data.syncTime || 0;
        this.avatarUrl = res.data.data.avatarUrl || "";
        this.artifactStore = res.data.data.artifactStore || "";
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || "";

        this.theme.auto = res.data.data.theme?.auto ?? true;
        this.theme.name = res.data.data.theme?.name ?? "light";
        this.theme.dark = res.data.data.theme?.dark ?? "dark";
        this.theme.light = res.data.data.theme?.light ?? "light";

        this.applyAppearanceSetting(res.data.data.appearanceSetting);
        this.gistUpload = res.data.data?.gistUpload ?? "base64";
      } else {
        showNotify({
          title: `获取配置失败`,
          type: "danger",
        });
      }
    },
    async changeSettings(data: SettingsPostData) {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === "success" && res?.data?.data) {
        this.syncPlatform = res.data.data.syncPlatform || "";
        this.gistToken = res.data.data.gistToken || "";
        this.githubProxy = res.data.data.githubProxy || "";
        this.githubProxyRegex = res.data.data.githubProxyRegex || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultProxy = res.data.data.defaultProxy || "";
        this.defaultUserAgent = res.data.data.defaultUserAgent || "";
        this.defaultFlowUserAgent = res.data.data.defaultFlowUserAgent || "";
        this.defaultTimeout = res.data.data.defaultTimeout || "";
        this.cacheThreshold = res.data.data.cacheThreshold || "";
        this.resourceCacheTtl = res.data.data.resourceCacheTtl || "";
        this.headersCacheTtl = res.data.data.headersCacheTtl || "";
        this.scriptCacheTtl = res.data.data.scriptCacheTtl || "";
        this.logsMaxCount = normalizeSettingInputValue(res.data.data.logsMaxCount);
        this.avatarUrl = res.data.data.avatarUrl || "";
        this.artifactStore = res.data.data.artifactStore || "";
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || "";
        this.gistUpload = res.data.data.gistUpload || "";
        showNotify({ type: "success", title: t(`myPage.notify.save.succeed`) });
        return true;
      } else {
        showNotify({
          title: `更新配置失败`,
          type: "danger",
        });
        return false;
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
        gistUpload,
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
        gistUpload: gistUpload ?? "base64",
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
        this.applyAppearanceSetting(res.data.data.appearanceSetting);
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
