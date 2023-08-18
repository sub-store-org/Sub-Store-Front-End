import { createApp } from 'vue';
// import First from './First.vue';
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });

const First = {template: '<div></div>'};
const splashApp = createApp(First);
splashApp.mount('#app');

setTimeout(() => {
  splashApp.unmount();
  import('./main').then(({ initializeApp }) => {
    initializeApp();
  });
}, 20);
