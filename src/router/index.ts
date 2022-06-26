import 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
  }
}

const history = createWebHistory();
export default createRouter({
  history,
  routes: [
    {
      path: '/',
      component: Home,
      redirect: '/sub',
      children: [
        {
          path: '/sub',
          component: Home,
          meta: {
            title: 'sub',
          },
        },
      ],
    },
    {
      path: '/404',
      component: NotFound,
      meta: {
        title: 'notFound',
      },
    },
    {
      path: '/:pathMatch(.*)',
      component: NotFound,
      meta: {
        title: 'notFound',
      },
    },
  ],
});
