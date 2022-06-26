import 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import AppLayout from '@/layout/AppLayout.vue';

import Sub from '@/views/Sub.vue';
import Sync from '@/views/Sync.vue';
import My from '@/views/My.vue';
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
      component: AppLayout,
      redirect: '/sub',
      children: [
        {
          path: '/sub',
          component: Sub,
          meta: {
            title: 'sub',
          },
        },
        {
          path: '/sync',
          component: Sync,
          meta: {
            title: 'sync',
          },
        },
        {
          path: '/my',
          component: My,
          meta: {
            title: 'my',
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
