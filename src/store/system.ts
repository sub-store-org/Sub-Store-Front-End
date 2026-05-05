import { defineStore } from 'pinia';

export const SIDEBAR_BREAKPOINT = 768;
export const SIDEBAR_EXPANDED_BREAKPOINT = 1220;

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const isAppleStandalonePWA = () => {
  const navigatorWithStandalone = navigator as NavigatorWithStandalone;

  return (
    (navigatorWithStandalone.standalone ||
      window.matchMedia("(display-mode: standalone)").matches) &&
    !/Android/.test(navigator.userAgent)
  ) || false;
};

const isIPadLike = () =>
  /iPad/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isSmallSafeAreaDevice = () =>
  window.innerHeight < 750 || isIPadLike();

const shouldUsePwaTopInset = (state: SystemStoreState) =>
  state.isPWA && (!state.isLandscape || state.isIPadLike);

export const useSystemStore = defineStore('systemStore', {
  state: () => {
    return {
      isPWA: isAppleStandalonePWA(),
      isLandscape: window.innerWidth > window.innerHeight,
      isIPadLike: isIPadLike(),
      isSmall: isSmallSafeAreaDevice(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      statusBarHeight: 0
    };
  },
  getters: {
    navBarHeight: (state) => {
      return shouldUsePwaTopInset(state) ? (state.isSmall ? "78px" : "95px") : "56px";
    },
    navBartop: (state) => {
      return shouldUsePwaTopInset(state) ? (state.isSmall ? "38px" : "55px") : "0px";
    },
    navBartopRight: (state) => {
      return shouldUsePwaTopInset(state) ? (state.isSmall ? "52px" : "65px") : "15px";
    },
    pwaTopPadding: (state) => {
      return shouldUsePwaTopInset(state) ? (state.isSmall ? "20px" : "45px") : "0px";
    }
  },
  actions: {
    handleResize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.isIPadLike = isIPadLike();
      this.isSmall = isSmallSafeAreaDevice();
      this.isLandscape = this.screenWidth > this.screenHeight;
      // console.log(`isPWA: ${this.isPWA}, Screen resized: ${this.screenWidth}x${this.screenHeight}, isSmall: ${this.isSmall}, isLandscape: ${this.isLandscape}`);
    },
    setStatusBarHeight(height: number) {
      this.statusBarHeight = height;
    },
    setIsPWA(isPWA: boolean) {
      this.isPWA = isPWA;
    },
    initSystemState() {
      this.isPWA = isAppleStandalonePWA();
      this.handleResize();
      
      // 监听屏幕尺寸变化
      window.addEventListener("resize", () => this.handleResize());
    }
  },
});
