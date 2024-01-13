import { useEnvApi } from '@/api/env';
import { useSubsApi } from '@/api/subs';
import { useFilesApi } from '@/api/files';

import AppLayout from '@/layout/AppLayout.vue';
import { useGlobalStore } from '@/store/global';
import { initStores } from '@/utils/initApp';
import My from '@/views/My.vue';
import NotFound from '@/views/NotFound.vue';

import File from '@/views/File.vue';
import FileEditor from '@/views/FileEditor.vue';

import Sub from '@/views/Sub.vue';
import SubEditor from '@/views/SubEditor.vue';

import Sync from '@/views/Sync.vue';
// import themeSetting from '@/views/themeSetting.vue';
import moreSetting from '@/views/settings/moreSetting.vue';
import { Toast } from '@nutui/nutui';
import { toRaw } from 'vue';
import 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import aboutUs from '@/views/settings/AboutUs.vue';
import APISetting from '@/views/settings/APISetting.vue';

// import { SwipeBack } from 'vue-swipe-back'

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
          path: '/files',
          component: File,
          meta: {
            title: 'file',
            needTabBar: true,
            needNavBack: false,
          },
        },
        {
          path: '/edit/:editType(files)/:id',
          component: FileEditor,
          meta: {
            title: 'fileEditor',
            needTabBar: false,
            needNavBack: true,
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
        // {
        //   path: '/settings/theme',
        //   component: themeSetting,
        //   meta: {
        //     title: 'themeSetting',
        //     needTabBar: false,
        //     needNavBack: true,
        //   },
        // },
        {
          path: '/settings/more',
          component: moreSetting,
          meta: {
            title: 'moreSetting',
            needTabBar: false,
            needNavBack: true,
          },
        },
        {
          path: '/settings/api',
          component: APISetting,
          meta: {
            title: 'apiSetting',
            needTabBar: false,
            needNavBack: true,
          },
        },
        {
          path: '/aboutUs',
          component: aboutUs,
          meta: {
            title: 'aboutUs',
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
    useEnvApi()
      .getEnv()
      .then(async res => {
        const envNow = res;
        const storeEnv = toRaw(globalStore.env);
        if (envNow?.data?.status === 'success') {
          const backend = envNow.data.data.backend;
          const version = envNow.data.data.version;
          const hasNewVersion = envNow.data.data.hasNewVersion;
          const latestVersion = envNow.data.data.latestVersion;
          if (backend !== storeEnv.backend || version !== storeEnv.version) {
            Toast.loading('检测到后端变化，更新数据中...', {
              cover: true,
              id: 'fetchLoading',
            });
            await initStores(false, true, true);
            Toast.hide('fetchLoading');
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
        }else if (to.params.editType === 'files') {
          await useFilesApi().getOneFile(name);
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
