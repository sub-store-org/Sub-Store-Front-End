import '@/assets/styles/fonts.scss';
import '@/assets/styles/global.scss';
import '@/assets/styles/overwritten_css_var.scss';
// import VConsole from 'vconsole';
// const vConsole = new VConsole();
import SvgIcon from '@/components/SvgIcon.vue';
import i18n from '@/locales';
import '@/plugin/awesomeIcon';

import nutUi from '@/plugin/nutui';
import router from '@/router';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'modern-css-reset/dist/reset.min.css';
import { createPinia } from 'pinia';
import 'virtual:svg-icons-register';
import { createApp } from 'vue';

import App from './App.vue';

export function initializeApp() {
  const pinia = createPinia();
  const app = createApp(App);

  nutUi(app);
  app.use(router);
  app.use(pinia);
  app.use(i18n);
  app.component('font-awesome-icon', FontAwesomeIcon);
  app.component('svg-icon', SvgIcon);
  app.mount('#app');
}
