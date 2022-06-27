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
    needTabBar: boolean;
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
            needTabBar: true,
          },
        },
        {
          path: '/sync',
          component: Sync,
          meta: {
            title: 'sync',
            needTabBar: true,
          },
        },
        {
          path: '/my',
          component: My,
          meta: {
            title: 'my',
            needTabBar: true,
          },
        },
      ],
    },
    {
      path: '/404',
      component: NotFound,
      meta: {
        title: 'notFound',
        needTabBar: false,
      },
    },
    {
      path: '/:pathMatch(.*)',
      component: NotFound,
      meta: {
        title: 'notFound',
        needTabBar: false,
      },
    },
  ],
});
