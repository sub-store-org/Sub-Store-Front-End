import { useGlobalStore } from '@/store/global';

export const setColorThemeClass = () => {
  const themeList = ['light-mode', 'dark-mode'];
  const body = document.querySelector('body');
  const mql = window.matchMedia('(prefers-color-scheme: dark)');

  const setTheme = () => {
    if (mql.matches) {
      body.classList.add('dark-mode');
      useGlobalStore().setDarkMode(true);
    } else {
      body.classList.add('light-mode');
      useGlobalStore().setDarkMode(false);
    }
  };

  const event = e => {
    body.classList.remove(...themeList);
    setTheme();
    console.log('dark mode: ', e.matches);
  };

  setTheme();
  if (mql.addEventListener) mql.addEventListener('change', event);
  // 兼容低版本
  if (mql.addListener) mql.addListener(event);
};
