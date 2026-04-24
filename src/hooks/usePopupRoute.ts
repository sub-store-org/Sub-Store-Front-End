import { watch, Ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import {
  clearFloatingLogsPreviousRoute,
  getFloatingLogsPreviousRoute,
} from '@/utils/floatingLogs';

export const usePopupRoute = (popupController: Ref<boolean>) => {
  // 监听打开弹窗，添加一条路由记录
  watch(popupController, newValue => {
    if (newValue) {
      history.pushState(
        {
          ...(history.state || {}),
          subStorePopup: true,
        },
        '',
        '',
      );
    }
  });

  // 监听浏览器的 popstate 事件关闭弹窗
  useEventListener(window, 'popstate', () => {
    if (getFloatingLogsPreviousRoute()) {
      window.setTimeout(clearFloatingLogsPreviousRoute, 0);
      return;
    }

    if (popupController.value) {
      popupController.value = false;
    }
  });
};
