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
import { toRaw } from 'vue';
import { initStores } from '@/utils/initApp';
import { useGlobalStore } from '@/store/modules/global';
import { Toast } from '@nutui/nutui';
import { useAsyncRouteStoreWidthOut } from '@/store/modules/asyncRoute';

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
          component: () => import('@/views/Sub.vue'),
          name: 'Subs',
          meta: {
            title: 'sub',
            needTabBar: true,
            needNavBack: false,
            keepAlive: false,
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
          name: 'editRoute',
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
  scrollBehavior(to, from, savedPosition) {
    if (from.name === 'editRoute' && to.name === 'Subs') {
      const fromId = from.params.id;
      (document.querySelector(`#${fromId}`) as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  },
});

// 全局前置守卫
router.beforeResolve(async to => {
  // 路由跳转时查询环境，决定是否更新数据
  if (globalStore !== null) {
    useEnvApi()
      .getEnv()
      .then(async res => {
        const envNow = res;
        const storeEnv = toRaw(globalStore.env);
        if (envNow.data.status === 'success') {
          const backend = envNow.data.data.backend;
          const version = envNow.data.data.version;
          if (backend !== storeEnv.backend || version !== storeEnv.version) {
            const fetchLoading = Toast.loading(
              '检测到后端变化，更新数据中...',
              {
                cover: true,
              }
            );
            await initStores(false, true);
            fetchLoading.hide();
          }
        }
      });
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
router.afterEach((to, _, failure) => {
  const asyncRouteStore = useAsyncRouteStoreWidthOut();
  // 在这里设置需要缓存的组件名称
  const keepAliveComponents = asyncRouteStore.keepAliveComponents;
  const currentComName: any = to.matched.find(
    item => item.name == to.name
  )?.name;
  if (
    currentComName &&
    !keepAliveComponents.includes(currentComName) &&
    to.meta?.keepAlive
  ) {
    // 需要缓存的组件
    keepAliveComponents.push(currentComName);
  }
  asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
});

export default router;
