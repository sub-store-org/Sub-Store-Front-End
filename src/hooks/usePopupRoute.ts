import { useEventListener } from "@vueuse/core";
import type { Ref } from "vue";
import { watch } from "vue";

import { useLogsOverlayStore } from "@/store/logsOverlay";
import {
  isPopupHistoryState,
  pushPopupHistoryState,
} from "@/utils/popupHistory";

export const usePopupRoute = (popupController: Ref<boolean>) => {
  const logsOverlayStore = useLogsOverlayStore();

  // 监听打开弹窗，添加一条路由记录
  watch(popupController, (newValue) => {
    if (newValue) {
      pushPopupHistoryState();
    }
  });

  // 监听浏览器的 popstate 事件关闭弹窗
  useEventListener(window, "popstate", (event) => {
    if (!popupController.value) return;
    if (logsOverlayStore.isOpen) return;

    // 回退后若历史 state 仍处于弹窗层级（例如刚关闭的是叠加在弹窗之上的
    // 日志 overlay），则保持弹窗打开，仅当真正退出弹窗 entry 时才关闭。
    if (isPopupHistoryState((event as PopStateEvent).state ?? {})) return;

    popupController.value = false;
  });
};
