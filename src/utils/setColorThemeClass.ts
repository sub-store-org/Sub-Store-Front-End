export const setColorThemeClass = () => {
  const themeList = ['light-mode', 'dark-mode'];
  const body = document.querySelector('body');

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
  } else {
    body.classList.add('light-mode');
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      body.classList.remove(...themeList);
      if (e.matches) {
        body.classList.add('dark-mode');
      } else {
        body.classList.add('light-mode');
      }
      console.log('dark mode: ', e.matches);
    });
};
