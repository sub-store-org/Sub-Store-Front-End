import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const isPWA = () => {
  return (
    (window.matchMedia("(display-mode: standalone)").matches &&
      !/Android/.test(navigator.userAgent)) ||
    false
  );
};
export const useAppNotifyStore = defineStore("appNotify", {
  state: (): AppNotifyStoreState => {
    return {
      isVisible: false,
      title: "",
      content: "",
      type: "primary",
      duration: 800,
      navBartop: isPWA() ? 60 : 0,
    };
  },
  getters: {},
  actions: {
    showNotify(settings: NotifySettings) {
      const { title, content, type, duration } = settings;
      // this.title = title;
      // this.content = content || '';
      // this.type = type || 'primary';
      // this.duration = duration || 2500;
      // this.isVisible = true;
      // setTimeout(() => {
      //   this.setVisible(false);
      // }, this.duration); // 防止重复通知 持续时间过长
      let html = `<strong>${title}</strong>`;
      if (content != null && content !== "") {
        html += `<br/>${content}`;
      }
      // primary，success ，danger，warning
      // info, success, warning, error, default
      const types = {
        primary: "INFO",
        success: "SUCCESS",
        danger: "ERROR",
        warning: "WARNING",
      };
      toast(html, {
        theme: "colored",
        type: toast.TYPE[types[type] || "DEFAULT"],
        position: "top-center",
        transition: "slide",
        dangerouslyHTMLString: true,
        closeButton: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        closeOnClick: false,
        autoClose: duration || 2500,
        style: { zIndex: 65535, paddingTop: this.navBartop + "px" },
        // PWA 时添加通知顶部边距
      });
    },
    setVisible(isVisible: boolean) {
      this.isVisible = isVisible;
    },
  },
});
