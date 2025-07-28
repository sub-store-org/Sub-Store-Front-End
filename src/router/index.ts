import { nextTick } from 'vue';
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
import FilePreview from '@/views/FilePreview.vue';
// import editScript from '@/views/editCode/editScript.vue';
import IconCollection from '@/views/icon/IconCollection.vue';

import Sub from '@/views/Sub.vue';
import SubEditor from '@/views/SubEditor.vue';

import Sync from '@/views/Sync.vue';

import ShareManage from '@/views/share/Share.vue';

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
  // scrollBehavior(to, from, savedPosition) {
  //   // console.log(`scrollBehavior ${from.path} => ${to.path}`)
  //   document.querySelector('html').style['overflow-y'] = '';
  //   document.querySelector('html').style.height = '';
  //   document.body.style.height = '';
  //   document.body.style['overflow-y'] = '';
  //   (document.querySelector('#app') as HTMLElement).style['overflow-y'] = '';
  //   (document.querySelector('#app') as HTMLElement).style.height = '';

  //   if (to.hash) {
  //     return {
  //       el: to.hash,
  //       behavior: 'smooth',
  //     }
  //   }
  //   if (globalStore !== null) {
  //     const savedPositions = toRaw(globalStore.savedPositions);
  //     if (savedPositions[to.path]) {
  //       // console.log(`读取到 ${to.path} 保存的滚动位置：${savedPositions[to.path]?.top}`)
  //       return savedPositions[to.path]
  //     }
  //   }
  //   if (savedPosition) {
  //     // console.log(`接受到 ${to.path} savedPosition 滚动位置：${savedPosition?.top}`)
  //     return savedPosition
  //   } else {
  //     return { top: 0, left: 0 }
  //   }
  // },
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
          path: '/shares',
          component: ShareManage,
          meta: {
            title: 'shareManage',
            needTabBar: false,
            needNavBack: true,
          },
        },
        // {
        //   path: '/edit/Script/:id',
        //   component: editScript,
        //   meta: {
        //     title: 'editScript',
        //     needTabBar: false,
        //     needNavBack: true,
        //   },
        // },
        {
          path: '/preview',
          component: FilePreview,
          meta: {
            title: 'preview',
            needTabBar: false,
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
          path: '/icon/collection',
          component: IconCollection,
          meta: {
            title: 'iconCollection',
            needTabBar: true,
            needNavBack: true,
          },
        },
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
router.afterEach(async (to, from) => {
  document.querySelector('html').style['overflow-y'] = '';
  document.querySelector('html').style.height = '';
  document.body.style.height = '';
  document.body.style['overflow-y'] = '';
  (document.querySelector('#app') as HTMLElement).style['overflow-y'] = '';
  (document.querySelector('#app') as HTMLElement).style.height = '';
  // console.log(`afterEach ${from.path} => ${to.path}`)
  if (to?.path && from?.path !== to?.path) {
    let scrollTop = 0;
    if (to?.meta?.needTabBar && globalStore !== null) {
      const savedPositions = toRaw(globalStore.savedPositions);
      if (savedPositions[to.path]?.top) {
        scrollTop = savedPositions[to.path]?.top
        // console.log(`读取到 ${to.path} 保存的滚动位置：${scrollTop}`)
      }
    }
    // console.log(`${to.path} 滚动到：${scrollTop}`)
    await nextTick()
    window.scrollTo({
      top: scrollTop,
      behavior: "instant" as any
    });
  }
});
router.beforeEach((to, from) => {
  document.title = 'Sub Store';
  // console.log(`beforeEach ${from.path} => ${to.path}`)
  if (!globalStore) {
    globalStore = useGlobalStore();
  }
  if (globalStore) {
    if (from?.meta?.needTabBar && from?.path !== to?.path) {
      // if (from?.meta?.needTabBar) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // console.log(`保存 ${from.path} 滚动位置：${scrollTop}`)
        globalStore.setSavedPositions(from.path, { left: 0, top: scrollTop })
      }
  }
  return true
})
router.beforeResolve(async (to, from) => {
  // document.body.classList.remove('nut-overflow-hidden');
  if (!globalStore) {
    globalStore = useGlobalStore();
  }
  // 路由跳转时查询环境，决定是否更新数据
  if (globalStore !== null) {
    const storeEnv = toRaw(globalStore.env);
    if (storeEnv?.backend && storeEnv?.version) {
      useEnvApi()
      .getEnv()
      .then(async res => {
        const envNow = res;
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
    }
  } else {
    globalStore = useGlobalStore();
  }

  // 进入编辑页面前查询是否存在订阅
  if (to.fullPath.startsWith('/edit/')) {
    const name = to.params.id as string;
    if (!['UNTITLED', 'UNTITLED-mihomoProfile'].includes(name)) {
      try {
        if (to.params.editType === 'subs') {
          await useSubsApi().getOne('sub', name);
        } else if (to.params.editType === 'collections') {
          await useSubsApi().getOne('collection', name);
        }else if (to.params.editType === 'files') {
          await useFilesApi().getWholeFile(name);
        }
      } catch {
        router.replace('/404');
      }
    }
  }

  // console.log(`beforeResolve ${from.path} => ${to.path}`)
  // if (to?.path && from?.path !== to?.path) {
  //   let scrollTop = 0;
  //   if (to?.meta?.needTabBar && globalStore !== null) {
  //     const savedPositions = toRaw(globalStore.savedPositions);
  //     if (savedPositions[to.path]?.top) {
  //       scrollTop = savedPositions[to.path]?.top
  //       console.log(`读取到 ${to.path} 保存的滚动位置：${scrollTop}`)
  //     }
  //   }
  //   console.log(`${to.path} 滚动到：${scrollTop}`)
  //   window.scrollTo({
  //     top: 1000,
  //     behavior: "instant" as any
  //   });
  // }
  // 允许跳转
  return true;
});

export default router;
