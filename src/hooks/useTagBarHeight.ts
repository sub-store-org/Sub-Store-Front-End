import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { WatchSource } from "vue";

export const useTagBarHeight = (sources: WatchSource<unknown>[]) => {
  const tagBarRef = ref<HTMLElement | null>(null);
  const tagBarHeight = ref(0);
  let resizeObserver: ResizeObserver | null = null;

  const updateTagBarHeight = () => {
    nextTick(() => {
      tagBarHeight.value = tagBarRef.value?.offsetHeight || 0;
    });
  };

  const stopObserving = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  const observeTagBar = () => {
    stopObserving();

    const element = tagBarRef.value as unknown as Element | null;

    if (typeof ResizeObserver === "undefined" || !element) {
      return;
    }

    resizeObserver = new ResizeObserver(() => {
      tagBarHeight.value = tagBarRef.value?.offsetHeight || 0;
    });
    resizeObserver.observe(element);
  };

  const handleWindowResize = () => {
    updateTagBarHeight();
  };

  watch(
    tagBarRef,
    () => {
      observeTagBar();
      updateTagBarHeight();
    },
    { flush: "post" },
  );

  watch(
    sources,
    () => {
      updateTagBarHeight();
    },
    { deep: true, immediate: true },
  );

  onMounted(() => {
    observeTagBar();
    updateTagBarHeight();
    window.addEventListener("resize", handleWindowResize);
  });

  onBeforeUnmount(() => {
    stopObserving();
    window.removeEventListener("resize", handleWindowResize);
  });

  return {
    tagBarRef,
    tagBarHeight,
    updateTagBarHeight,
  };
};
