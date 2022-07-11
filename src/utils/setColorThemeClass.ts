import { useGlobalStore } from '@/store/global';

export const setColorThemeClass = () => {
  const themeList = ['light-mode', 'dark-mode'];
  const body = document.querySelector('body');

  // 判断 safari 版本
  const Sys = { safari: '' };
  const ua = navigator.userAgent.toLowerCase();
  let s;
  (s = ua.match(/version\/([\d\.]+).*safari/)) ? (Sys.safari = s[1]) : 0;

  // 不对 safari 13 及以下使用自动 dark-mode
  if (Sys.safari > '14.0') {
    if (window?.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark-mode');
      useGlobalStore().setDarkMode(true);
    } else {
      body.classList.add('light-mode');
      useGlobalStore().setDarkMode(false);
    }

    window
      ?.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        body.classList.remove(...themeList);
        if (e.matches) {
          body.classList.add('dark-mode');
          useGlobalStore().setDarkMode(true);
        } else {
          body.classList.add('light-mode');
          useGlobalStore().setDarkMode(false);
        }
        console.log('dark mode: ', e.matches);
      });
  }
};
