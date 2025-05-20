<template>
  <!-- <GlobalNotify /> -->
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
  <MagicPathDialog
    v-model="showMagicPathDialog"
    :url-api-error="urlApiError"
  />
</template>

<script setup lang="ts">
// import GlobalNotify from '@/components/GlobalNotify.vue';
import NavBar from "@/components/NavBar.vue";
import MagicPathDialog from "@/components/MagicPathDialog.vue";
import { useThemes } from "@/hooks/useThemes";
import { useGlobalStore } from "@/store/global";
import { useSubsStore } from "@/store/subs";
import { getFlowsUrlList } from "@/utils/getFlowsUrlList";
import { initStores } from "@/utils/initApp";
import { storeToRefs } from "pinia";
import { ref, watchEffect, onMounted } from "vue";
import { useHostAPI } from "@/hooks/useHostAPI"; //onMounted
import { useRoute, useRouter } from "vue-router";

const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();

const { subs, flows } = storeToRefs(subsStore);

const allLength = ref(null);
// 初始化时检查sessionStorage中是否有保存的状态
const showMagicPathDialog = ref(sessionStorage.getItem('showMagicPathDialog') === 'true');

// 处于 pwa 且屏幕底部有小白条时将底部安全距离写入 global store
type NavigatorExtend = Navigator & {
  standalone?: boolean;
};
const navigator: NavigatorExtend = window.navigator;

// 判断是否为非全面屏设备
function isLegacyDevices() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  if (
    (screenWidth === 375 && screenHeight === 667) ||
    (screenWidth === 414 && screenHeight === 736)
  ) {
    return true;
  }
  return false;
}

globalStore.setBottomSafeArea(
  navigator.standalone && !isLegacyDevices() ? 18 : 0
);

const { handleUrlQuery } = useHostAPI();
const urlApiConfigSuccess = ref(false);
const urlApiError = ref('');

const processUrlApiConfig = async () => {
  const query = window.location.search;
  let hasUrlParams = false;

  if (query) {
    const hasApiParam = query.includes('api=');
    const hasMagicPathParam = query.includes('magicpath=');

    if (hasApiParam) {
      urlApiError.value = '通过URL参数指定的API地址连接失败，请检查地址是否正确';
      hasUrlParams = true;
    } else if (hasMagicPathParam) {
      urlApiError.value = '通过URL参数指定的magicpath连接失败，请检查路径是否正确';
      hasUrlParams = true;
    }
  }

  const backendConfigured = localStorage.getItem('backendConfigured') || localStorage.getItem('magicPathConfigured');

  if (backendConfigured !== 'true' && route.path === '/subs' && !hasUrlParams) {
    showMagicPathDialog.value = true;
    sessionStorage.setItem('showMagicPathDialog', 'true');
  }

  const result = await handleUrlQuery({
    errorCb: async () => {
      try {
        await initStores(true, true, false);
        // 只检查是否有环境信息，不再要求必须有数据
        const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
        if (hasBackendEnv) {
          showMagicPathDialog.value = false;
          sessionStorage.removeItem('showMagicPathDialog');
          localStorage.setItem('backendConfigured', 'true');
        } else {
          globalStore.setFetchResult(false);
          localStorage.removeItem('backendConfigured');
          localStorage.removeItem('magicPathConfigured');
          if (route.path === '/subs') {
            showMagicPathDialog.value = true;
            sessionStorage.setItem('showMagicPathDialog', 'true');
          }
        }
      } catch (e) {
        console.error('Error initializing stores:', e);
        globalStore.setFetchResult(false);
        localStorage.removeItem('backendConfigured');
        localStorage.removeItem('magicPathConfigured');
        if (route.path === '/subs') {
          showMagicPathDialog.value = true;
          sessionStorage.setItem('showMagicPathDialog', 'true');
        }
      }
    },
  });

  if (result) {
    urlApiConfigSuccess.value = true;
    urlApiError.value = '';

    showMagicPathDialog.value = false;
    sessionStorage.removeItem('showMagicPathDialog');

    await initStores(false, true, false);
  } else {
    if (hasUrlParams) {
      globalStore.setFetchResult(false);
      localStorage.removeItem('backendConfigured');
      localStorage.removeItem('magicPathConfigured');
      if (route.path === '/subs') {
        showMagicPathDialog.value = true;
        sessionStorage.setItem('showMagicPathDialog', 'true');
      }
    }
    try {
      await initStores(true, true, false);
      const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
      const fetchResult = globalStore.fetchResult;
      if (hasBackendEnv && fetchResult) {
        showMagicPathDialog.value = false;
        sessionStorage.removeItem('showMagicPathDialog');
        localStorage.setItem('backendConfigured', 'true');
      } else {
        localStorage.removeItem('backendConfigured');
        localStorage.removeItem('magicPathConfigured');
        if (route.path === '/subs') {
          showMagicPathDialog.value = true;
          sessionStorage.setItem('showMagicPathDialog', 'true');
        }
      }
    } catch (e) {
      console.error('Error initializing stores:', e);
      globalStore.setFetchResult(false);
      localStorage.removeItem('backendConfigured');
      localStorage.removeItem('magicPathConfigured');
      if (route.path === '/subs') {
        showMagicPathDialog.value = true;
        sessionStorage.setItem('showMagicPathDialog', 'true');
      }
    }
  }
}

processUrlApiConfig();

// 初始化颜色主题
useThemes();

// 初始化应用数据（顶部通知）
//   initStores(true, true, false);

// 设置流量刷新状态
watchEffect(() => {
  allLength.value = getFlowsUrlList(subs.value).length;
  const currentLength = Object.keys(flows.value).length;
  globalStore.setFlowFetching(allLength.value !== currentLength);
});

watchEffect(() => {
  if (!globalStore.isLoading) {
    setTimeout(() => {
      // 只检查是否有环境信息，不再要求必须有数据
      const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
      const fetchResult = globalStore.fetchResult;

      if (hasBackendEnv && fetchResult) {
        localStorage.setItem('backendConfigured', 'true');
        showMagicPathDialog.value = false;
        sessionStorage.removeItem('showMagicPathDialog');
      } else {
        if (!fetchResult) {
          localStorage.removeItem('backendConfigured');
          localStorage.removeItem('magicPathConfigured');

          if (route.path === '/subs') {
            showMagicPathDialog.value = true;
            sessionStorage.setItem('showMagicPathDialog', 'true');
          }
        } else {
          checkAndShowMagicPathDialog();
        }
      }
    }, 100);
  }
});

// 检测是否需要显示后端配置对话框
onMounted(() => {
  // 添加路由守卫，确保在每次路由变化时检查是否需要显示magicpath对话框
  router.afterEach((to) => {
    // 只在主页面（/subs）显示对话框
    if (to.path === '/subs') {
      checkAndShowMagicPathDialog();
    }
  });

  // 初始检查
  checkAndShowMagicPathDialog();
});

function checkAndShowMagicPathDialog() {
  if (showMagicPathDialog.value) {
    return;
  }

  const fetchResult = globalStore.fetchResult;
  if (!fetchResult && !globalStore.isLoading) {
    localStorage.removeItem('backendConfigured');
    localStorage.removeItem('magicPathConfigured');

    if (route.path === '/subs') {
      showMagicPathDialog.value = true;
      sessionStorage.setItem('showMagicPathDialog', 'true');
    }
    return;
  }

  const backendConfigured = localStorage.getItem('backendConfigured') || localStorage.getItem('magicPathConfigured');
  if (backendConfigured === 'true') {
    // 只检查是否有环境信息，不再要求必须有数据
    const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;

    // 如果有配置标志但没有环境信息，仍然需要显示配置弹窗
    if (!hasBackendEnv && !globalStore.isLoading) {
      localStorage.removeItem('backendConfigured');
      localStorage.removeItem('magicPathConfigured');
    } else {
      return;
    }
  }

  if (urlApiConfigSuccess.value) {
    return;
  }

  if (globalStore.isLoading) {
    return;
  }

  const needConfiguration = checkNeedConfiguration();
  if (needConfiguration && route.path === '/subs') {
    showMagicPathDialog.value = true;

    sessionStorage.setItem('showMagicPathDialog', 'true');
  } else {
    showMagicPathDialog.value = false;
    sessionStorage.removeItem('showMagicPathDialog');
  }
}

function checkNeedConfiguration() {
  const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
  const fetchResult = globalStore.fetchResult;

  if (!fetchResult) {
    return true;
  }

  if (hasBackendEnv && fetchResult) {
    localStorage.setItem('backendConfigured', 'true');
    return false;
  }

  const query = window.location.search;
  if (query) {
    const hasApiParam = query.includes('api=');
    const hasMagicPathParam = query.includes('magicpath=');

    if (hasApiParam || hasMagicPathParam) {
      if (!urlApiConfigSuccess.value) {
        return true;
      }
    }
  }

  if (!hasBackendEnv) {
    return true;
  }

  const hostname = window.location.hostname;
  if (hostname !== 'sub-store.vercel.app') {
    return true;
  }
  return false;
}
</script>

<style lang="scss">
#app {
  font-family: "Roboto", "nutui-iconfont", "Noto Sans", Arial, "PingFang SC",
    "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "ST Heiti",
    SimHei, sans-serif;
  display: flex;
  flex-direction: column;
  position: absolute;
  min-height: 100%;
  width: 100%;
  background: var(--background-color);
  overflow: hidden;

  .page-body {
    // overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  overflow-y: auto;
}

</style>
