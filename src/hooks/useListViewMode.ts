import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useListPageViewStore } from "@/store/listPageView";
import { useSettingsStore } from "@/store/settings";
import { SIDEBAR_EXPANDED_BREAKPOINT, useSystemStore } from "@/store/system";

export const LIST_VIEW_MODE_BREAKPOINT = SIDEBAR_EXPANDED_BREAKPOINT;

export const useListViewMode = () => {
  const route = useRoute();
  const listPageViewStore = useListPageViewStore();
  const settingsStore = useSettingsStore();
  const systemStore = useSystemStore();

  const { singleColumnLockRoutePath } = storeToRefs(listPageViewStore);
  const { appearanceSetting } = storeToRefs(settingsStore);
  const { screenWidth } = storeToRefs(systemStore);

  const supportsListViewMode = computed(() => Boolean(route.meta?.supportsListViewMode));
  const isWideListViewport = computed(() => screenWidth.value >= LIST_VIEW_MODE_BREAKPOINT);
  const showListViewToggle = computed(() => supportsListViewMode.value && isWideListViewport.value);
  const isListViewModeLocked = computed(() => {
    return showListViewToggle.value && singleColumnLockRoutePath.value === route.path;
  });
  const canToggleListView = computed(() => showListViewToggle.value && !isListViewModeLocked.value);

  const storedListViewMode = computed<ListPageViewMode | undefined>(() => {
    return appearanceSetting.value.listPageViewMode;
  });

  const effectiveListViewMode = computed<ListPageViewMode>(() => {
    if (!supportsListViewMode.value || !isWideListViewport.value || isListViewModeLocked.value) {
      return "single-column";
    }

    return storedListViewMode.value ?? "dual-column";
  });

  const nextListViewMode = computed<ListPageViewMode>(() => {
    return effectiveListViewMode.value === "dual-column" ? "single-column" : "dual-column";
  });

  const setListViewMode = async (mode: ListPageViewMode) => {
    if (!supportsListViewMode.value) {
      return;
    }

    await settingsStore.changeAppearanceSetting({
      appearanceSetting: {
        ...appearanceSetting.value,
        listPageViewMode: mode,
      },
    });
  };

  const toggleListViewMode = async () => {
    if (!canToggleListView.value) {
      return;
    }

    await setListViewMode(nextListViewMode.value);
  };

  return {
    supportsListViewMode,
    isWideListViewport,
    showListViewToggle,
    isListViewModeLocked,
    canToggleListView,
    storedListViewMode,
    effectiveListViewMode,
    nextListViewMode,
    setListViewMode,
    toggleListViewMode,
  };
};
