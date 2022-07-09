import { createApp } from 'vue';
import router from '@/router';
import i18n from '@/locales';

import SvgIcon from '@/components/SvgIcon.vue';
import 'virtual:svg-icons-register';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@/plugin/awesomeIcon';

import nutUi from '@/plugin/nutui';

import '@/assets/remove_default_style.scss';
import 'modern-css-reset/dist/reset.min.css';
import '@/assets/fonts.scss';
import '@/assets/global_overwritten_nutui.scss';

import App from './App.vue';
import { setupStore } from './store';

const app = createApp(App);

nutUi(app);
setupStore(app);
app
  .use(router)
  .use(i18n)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('svg-icon', SvgIcon);
// // 挂载状态管理
// setupStore(app);
app.mount('#app');
