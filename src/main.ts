import { createApp } from 'vue';
import router from '@/router/index';
import { createPinia } from 'pinia';
import i18n from '@/locales/index';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@/plugin/awesomeIcon';

import nutUi from '@/plugin/nutui';

import '@/assets/remove_default_style.scss';
import 'modern-css-reset/dist/reset.min.css';

import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

nutUi(app);

app
  .use(router)
  .use(pinia)
  .use(i18n)
  .component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
