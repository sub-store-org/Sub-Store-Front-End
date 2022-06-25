import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';

const history = createWebHistory();
export default createRouter({
  history,
  routes: [
    { path: '/', component: Home },
    { path: '/404', component: NotFound },
    { path: '/:pathMatch(.*)', component: NotFound },
  ],
});
