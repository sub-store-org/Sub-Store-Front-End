import { createApp } from 'vue';
import router from '@/router/index';
import { createPinia } from 'pinia';
import i18n from '@/locales/index';

import nutUi from '@/plugin/nutui';

import 'modern-css-reset/dist/reset.min.css';

import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

nutUi(app);

app.use(router).use(pinia).use(i18n);

app.mount('#app');
