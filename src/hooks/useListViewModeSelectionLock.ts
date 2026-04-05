import { onBeforeUnmount, watch, type Ref } from "vue";
import { useRoute } from "vue-router";

import { useListPageViewStore } from "@/store/listPageView";

export const useListViewModeSelectionLock = (isSelectionMode: Ref<boolean>) => {
  const route = useRoute();
  const listPageViewStore = useListPageViewStore();

  watch(
    isSelectionMode,
    (isLocked) => {
      if (isLocked) {
        listPageViewStore.lockToSingleColumn(route.path);
        return;
      }

      listPageViewStore.unlockSingleColumn(route.path);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    listPageViewStore.unlockSingleColumn(route.path);
  });
};
