import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useSettingsStore } from "@/store/settings";
import { SIDEBAR_BREAKPOINT, useSystemStore } from "@/store/system";

export const WIDE_SCREEN_NARROW_MODE_BREAKPOINT = SIDEBAR_BREAKPOINT;

export const useWideScreenNarrowMode = () => {
  const route = useRoute();
  const settingsStore = useSettingsStore();
  const systemStore = useSystemStore();

  const { appearanceSetting } = storeToRefs(settingsStore);
  const { screenWidth } = storeToRefs(systemStore);

  const supportsWideScreenNarrowMode = computed(() => Boolean(route.meta?.needTabBar));
  const isWideScreen = computed(() => screenWidth.value >= WIDE_SCREEN_NARROW_MODE_BREAKPOINT);
  const storedWideScreenNarrowMode = computed(() => {
    return appearanceSetting.value.useNarrowModeOnWideScreen ?? false;
  });

  const isWideScreenNarrowModeActive = computed(() => {
    return supportsWideScreenNarrowMode.value && isWideScreen.value && storedWideScreenNarrowMode.value;
  });

  const showWideScreenNarrowModeToggle = computed(() => {
    return supportsWideScreenNarrowMode.value && isWideScreen.value;
  });

  const shouldShowTabBar = computed(() => {
    return Boolean(route.meta?.needTabBar) && (!isWideScreen.value || isWideScreenNarrowModeActive.value);
  });

  const shouldShowSideBar = computed(() => {
    if (route.path.startsWith("/preview") || !isWideScreen.value) {
      return false;
    }

    if (!supportsWideScreenNarrowMode.value) {
      return true;
    }

    return !isWideScreenNarrowModeActive.value;
  });

  const setWideScreenNarrowMode = async (enabled: boolean) => {
    await settingsStore.changeAppearanceSetting({
      appearanceSetting: {
        ...appearanceSetting.value,
        useNarrowModeOnWideScreen: enabled,
      },
    });
  };

  const toggleWideScreenNarrowMode = async () => {
    if (!showWideScreenNarrowModeToggle.value) {
      return;
    }

    await setWideScreenNarrowMode(!storedWideScreenNarrowMode.value);
  };

  return {
    isWideScreen,
    supportsWideScreenNarrowMode,
    storedWideScreenNarrowMode,
    isWideScreenNarrowModeActive,
    showWideScreenNarrowModeToggle,
    shouldShowTabBar,
    shouldShowSideBar,
    setWideScreenNarrowMode,
    toggleWideScreenNarrowMode,
  };
};
