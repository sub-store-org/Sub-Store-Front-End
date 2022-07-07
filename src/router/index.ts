import 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

import AppLayout from '@/layout/AppLayout.vue';

import Sub from '@/views/Sub.vue';
import Sync from '@/views/Sync.vue';
import My from '@/views/My.vue';
import SubEditor from '@/views/SubEditor.vue';
import NotFound from '@/views/NotFound.vue';
import { useSubsApi } from '@/api/subs';
import { useEnvApi } from '@/api/env';
import { useGlobalStore } from '@/store/global';
import { toRaw } from 'vue';
import { initStores } from '@/utils/initApp';

let globalStore = null;

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    needTabBar: boolean;
    needNavBack: boolean;
  }
}

const history = createWebHistory();
const router = createRouter({
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
          path: '/edit/:editType(subs|collections)/:id',
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

// 全局前置守卫
router.beforeResolve(async to => {
  // 路由跳转时查询环境，决定是否更新数据
  if (globalStore !== null) {
    const envNow = await useEnvApi().getEnv();
    const storeEnv = toRaw(globalStore.env);

    if (envNow.data.status === 'success') {
      const backend = envNow.data.data.backend;
      const version = envNow.data.data.version;
      if (backend !== storeEnv.backend || version !== storeEnv.version) {
        await initStores(false, true);
      }
    }
  } else {
    globalStore = useGlobalStore();
  }

  // 进入编辑页面前查询是否存在订阅
  if (to.fullPath.startsWith('/edit/')) {
    const name = to.params.id as string;
    if (name !== 'UNTITLED') {
      try {
        if (to.params.editType === 'subs') {
          await useSubsApi().getOne('sub', name);
        } else if (to.params.editType === 'collections') {
          await useSubsApi().getOne('collection', name);
        }
      } catch {
        router.replace('/404');
      }
    }
  }

  // 允许跳转
  return true;
});

export default router;
