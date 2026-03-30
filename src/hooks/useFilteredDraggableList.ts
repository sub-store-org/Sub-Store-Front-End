import { computed } from "vue";
import type { Ref } from "vue";

const mergeVisibleOrder = <T>(
  source: T[],
  reorderedVisibleItems: T[],
  shouldInclude: (item: T) => boolean,
) => {
  let visibleIndex = 0;

  return source.map((item) => {
    if (!shouldInclude(item)) {
      return item;
    }

    const reorderedItem = reorderedVisibleItems[visibleIndex];
    visibleIndex += 1;
    return reorderedItem ?? item;
  });
};

export const useFilteredDraggableList = <T>(
  source: Ref<T[]>,
  shouldInclude: (item: T) => boolean,
) => {
  return computed<T[]>({
    get: () => source.value.filter(shouldInclude),
    set: (reorderedVisibleItems) => {
      source.value = mergeVisibleOrder(
        source.value,
        reorderedVisibleItems,
        shouldInclude,
      );
    },
  });
};
