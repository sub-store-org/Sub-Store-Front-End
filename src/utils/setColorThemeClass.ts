import { useGlobalStore } from '@/store/global';

export const setColorThemeClass = () => {
  const themeList = ['light-mode', 'dark-mode'];
  const body = document.querySelector('body');

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
    useGlobalStore().setDarkMode(true);
  } else {
    body.classList.add('light-mode');
    useGlobalStore().setDarkMode(false);
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
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
};
