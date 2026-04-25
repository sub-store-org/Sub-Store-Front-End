<template>
  <Teleport to="body">
    <div
      v-if="shouldShowFloatingLogsButton"
      ref="layerRef"
      class="floating-logs-layer"
    >
      <button
        ref="buttonRef"
        type="button"
        class="floating-logs-button"
        :style="buttonStyle"
        :aria-label="buttonLabel"
        :title="buttonLabel"
        @pointerdown="startDrag"
        @click="toggleLogs"
        @dragstart.prevent
      >
        <font-awesome-icon icon="fa-solid fa-file-lines" />
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useGlobalStore } from "@/store/global";
import { useLogsOverlayStore } from "@/store/logsOverlay";
import { useSettingsStore } from "@/store/settings";
import { LOGS_PATH } from "@/utils/popupHistory";

const route = useRoute();
const { t } = useI18n();
const globalStore = useGlobalStore();
const logsOverlayStore = useLogsOverlayStore();
const settingsStore = useSettingsStore();
const { bottomSafeArea } = storeToRefs(globalStore);
const { isOpen: isLogsOverlayOpen } = storeToRefs(logsOverlayStore);
const { appearanceSetting } = storeToRefs(settingsStore);

const FLOATING_BUTTON_SIZE = 48;
const FLOATING_BUTTON_EDGE_GAP = 16;
const DRAG_CANCEL_CLICK_DISTANCE = 3;
const DRAG_CLICK_SUPPRESS_MS = 150;

type DragPosition = {
  x: number;
  y: number;
};

type DragStart = {
  pointerId: number;
  pointerX: number;
  pointerY: number;
  buttonX: number;
  buttonY: number;
  hasMoved: boolean;
};

const layerRef = ref<HTMLElement>();
const buttonRef = ref<HTMLButtonElement>();
const dragPosition = ref<DragPosition | null>(null);
const dragStart = ref<DragStart | null>(null);
const suppressClick = ref(false);
let suppressClickTimer: ReturnType<typeof setTimeout> | null = null;

const isLogsRoute = computed(() => route.path === LOGS_PATH);
const shouldShowFloatingLogsButton = computed(
  () =>
    appearanceSetting.value.showFloatingLogsButton !== false &&
    !isLogsOverlayOpen.value &&
    !isLogsRoute.value,
);
const buttonLabel = computed(() => t("logsPage.floating.open"));
const buttonBottom = computed(() => `${bottomSafeArea.value + 104}px`);
const dragBoundary = computed(() => ({
  top: 56 + 8,
  left: FLOATING_BUTTON_EDGE_GAP,
  bottom: bottomSafeArea.value + 48 + 12 + 8,
  right: FLOATING_BUTTON_EDGE_GAP,
}));
const buttonStyle = computed(() => {
  if (!dragPosition.value) {
    return {
      right: "max(16px, env(safe-area-inset-right))",
      bottom: buttonBottom.value,
    };
  }

  return {
    left: `${dragPosition.value.x}px`,
    top: `${dragPosition.value.y}px`,
  };
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

const clampPosition = (position: DragPosition): DragPosition => {
  const layer = layerRef.value;

  if (!layer) return position;

  const boundary = dragBoundary.value;
  return {
    x: clamp(
      position.x,
      boundary.left,
      layer.clientWidth - FLOATING_BUTTON_SIZE - boundary.right,
    ),
    y: clamp(
      position.y,
      boundary.top,
      layer.clientHeight - FLOATING_BUTTON_SIZE - boundary.bottom,
    ),
  };
};

const syncPositionFromDom = () => {
  const layer = layerRef.value;
  const button = buttonRef.value;

  if (!layer || !button) return;

  const layerRect = layer.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  dragPosition.value = clampPosition({
    x: buttonRect.left - layerRect.left,
    y: buttonRect.top - layerRect.top,
  });
};

const ensurePosition = () => {
  if (dragPosition.value) return;

  syncPositionFromDom();
};

const stopDrag = (event?: PointerEvent) => {
  const button = buttonRef.value;
  const start = dragStart.value;

  if (button && start && button.hasPointerCapture?.(start.pointerId)) {
    button.releasePointerCapture?.(start.pointerId);
  }

  if (event && start?.hasMoved) {
    event.preventDefault();
  }

  dragStart.value = null;
};

const startDrag = (event: PointerEvent) => {
  if (event.button !== 0) return;

  ensurePosition();

  const position = dragPosition.value;
  if (!position) return;

  dragStart.value = {
    pointerId: event.pointerId,
    pointerX: event.clientX,
    pointerY: event.clientY,
    buttonX: position.x,
    buttonY: position.y,
    hasMoved: false,
  };
  buttonRef.value?.setPointerCapture?.(event.pointerId);
};

const moveDrag = (event: PointerEvent) => {
  const start = dragStart.value;
  if (!start || event.pointerId !== start.pointerId) return;

  const deltaX = event.clientX - start.pointerX;
  const deltaY = event.clientY - start.pointerY;

  if (
    !start.hasMoved &&
    Math.hypot(deltaX, deltaY) > DRAG_CANCEL_CLICK_DISTANCE
  ) {
    start.hasMoved = true;
    suppressClick.value = true;
  }

  if (start.hasMoved) {
    event.preventDefault();
    dragPosition.value = clampPosition({
      x: start.buttonX + deltaX,
      y: start.buttonY + deltaY,
    });
  }
};

const endDrag = (event: PointerEvent) => {
  const moved = dragStart.value?.hasMoved;

  stopDrag(event);

  if (!moved) return;

  if (suppressClickTimer) {
    clearTimeout(suppressClickTimer);
  }

  suppressClickTimer = setTimeout(() => {
    suppressClick.value = false;
    suppressClickTimer = null;
  }, DRAG_CLICK_SUPPRESS_MS);
};

watch(
  () => shouldShowFloatingLogsButton.value,
  async (isVisible) => {
    if (!isVisible) return;
    await nextTick();

    if (dragPosition.value) {
      dragPosition.value = clampPosition(dragPosition.value);
      return;
    }

    ensurePosition();
  },
  { immediate: true },
);

watch(bottomSafeArea, () => {
  if (!dragPosition.value) return;
  dragPosition.value = clampPosition(dragPosition.value);
});

onMounted(() => {
  if (typeof window === "undefined") return;

  window.addEventListener("pointermove", moveDrag);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  window.addEventListener("resize", syncPositionFromDom);
});

onBeforeUnmount(() => {
  if (typeof window === "undefined") return;

  window.removeEventListener("pointermove", moveDrag);
  window.removeEventListener("pointerup", endDrag);
  window.removeEventListener("pointercancel", endDrag);
  window.removeEventListener("resize", syncPositionFromDom);

  if (suppressClickTimer) {
    clearTimeout(suppressClickTimer);
  }
});

const toggleLogs = (event?: MouseEvent) => {
  if (suppressClick.value) {
    event?.preventDefault();
    event?.stopPropagation();
    return;
  }

  logsOverlayStore.open();
};
</script>

<style scoped lang="scss">
.floating-logs-layer {
  @include centered-fixed-container;
  top: 0;
  bottom: 0;
  z-index: 1006;
  pointer-events: none;
}

.floating-logs-button {
  position: absolute;
  right: max(16px, env(safe-area-inset-right));
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-image: linear-gradient(
    to bottom right,
    var(--primary-color),
    var(--primary-color-end)
  );
  box-shadow: 0 4px 8px #0003;
  color: #fffb;
  cursor: pointer;
  pointer-events: auto;
  touch-action: none;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }

  &:focus {
    outline: none;
  }
}
</style>
