import { defineStore } from 'pinia';

export const useSystemStore = defineStore('systemStore', {
  state: () => {
    return {
      isPWA: (window.matchMedia("(display-mode: standalone)").matches &&
        !/Android/.test(navigator.userAgent)) || false,
      isLandscape: window.innerWidth > window.innerHeight,
      isSmall: window.innerHeight < 750 || /iPad/.test(navigator.userAgent),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      statusBarHeight: 0
    };
  },
  getters: {
    navBarHeight: (state) => {
      return state.isPWA && !state.isLandscape ? (state.isSmall ? "78px" : "95px") : "56px";
    },
    navBartop: (state) => {
      return state.isPWA && !state.isLandscape ? (state.isSmall ? "38px" : "55px") : "0px";
    },
    navBartopRight: (state) => {
      return state.isPWA && !state.isLandscape ? (state.isSmall ? "52px" : "65px") : "15px";
    },
    pwaTopPadding: (state) => {
      return state.isPWA ? (state.isSmall ? "20px" : "45px") : "45px";
    }
  },
  actions: {
    handleResize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.isSmall = this.screenHeight < 750 || /iPad/.test(navigator.userAgent);
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
      this.isPWA = (window.matchMedia("(display-mode: standalone)").matches &&
        !/Android/.test(navigator.userAgent)) || false;
      this.handleResize();
      
      // 监听屏幕尺寸变化
      window.addEventListener("resize", () => this.handleResize());
    }
  },
});
