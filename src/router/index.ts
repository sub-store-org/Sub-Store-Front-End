import 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import AppLayout from '@/layout/AppLayout.vue';

import Sub from '@/views/Sub.vue';
import Sync from '@/views/Sync.vue';
import My from '@/views/My.vue';
import SubEditor from '@/views/SubEditor.vue';
import NotFound from '@/views/NotFound.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    needTabBar: boolean;
    needNavBack: boolean;
  }
}

const history = createWebHistory();
export default createRouter({
  history,
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: '/subs',
      children: [
        {
          path: '/subs',
          component: Sub,
          meta: {
            title: 'sub',
            needTabBar: true,
            needNavBack: false,
          },
        },
        {
          path: '/sync',
          component: Sync,
          meta: {
            title: 'sync',
            needTabBar: true,
            needNavBack: false,
          },
        },
        {
          path: '/my',
          component: My,
          meta: {
            title: 'my',
            needTabBar: true,
            needNavBack: false,
          },
        },
        {
          path: '/edit/sub/:name',
          component: SubEditor,
          meta: {
            title: 'subEditor',
            needTabBar: false,
            needNavBack: true,
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
        needNavBack: true,
      },
    },
    {
      path: '/:pathMatch(.*)',
      component: NotFound,
      meta: {
        title: 'notFound',
        needTabBar: false,
        needNavBack: true,
      },
    },
  ],
});
