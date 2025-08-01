<template>
  <!-- <GlobalNotify /> -->
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
  <MagicPathDialog
    v-model="showMagicPathDialog"
    :url-api-error="urlApiError"
    :url-api-value="urlApiValue"
    :connection-cycle="connectionCheckCycle"
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
const showMagicPathDialog = ref(false);
// 添加状态变量，用于跟踪后端连接状态的检查过程
const isBackendCheckInProgress = ref(true);
// 添加状态变量，用于跟踪当前的连接检测周期
const connectionCheckCycle = ref(Date.now());

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
const urlApiValue = ref('');

const processUrlApiConfig = async () => {
  // 设置检查状态为进行中
  isBackendCheckInProgress.value = true;

  // 更新连接检测周期
  connectionCheckCycle.value = Date.now();

  const query = window.location.search;
  let hasUrlParams = false;

  // 检查URL参数
  if (query) {

    const hasApiParam = query
      .slice(1)
      .split('&')
      .map(i => i.split('='))
      .find(i => i[0] === 'api');
    const hasMagicPathParam = query
      .slice(1)
      .split('&')
      .map(i => i.split('='))
      .find(i => i[0] === 'magicpath');

    if (hasApiParam) {
      const apiValue = decodeURIComponent(hasApiParam[1]).replace(/\/$/, ''); // 去除末尾斜杠;
      urlApiValue.value = apiValue;
      urlApiError.value = '通过 URL 参数指定的 API 地址连接失败，请检查地址是否正确';
      hasUrlParams = true;
    } else if (hasMagicPathParam) {
      const magicPath = decodeURIComponent(hasMagicPathParam[1]);
      const currentHost = window.location.origin;
      const apiUrl = `${currentHost}/${magicPath.replace(/^\/+/, '')}`;
      urlApiValue.value = apiUrl;
      urlApiError.value = '通过 URL 参数指定的 magicpath 连接失败，请检查路径是否正确';
      hasUrlParams = true;
    }
  }

  // 处理URL参数中的后端配置
  const result = await handleUrlQuery({
    errorCb: async () => {
      try {
        // 检查用户是否跳过了当前连接检测周期
        const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

        // 尝试初始化stores，获取后端环境信息
        await initStores(true, true, false);

        // 检查是否有环境信息
        const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;

        if (hasBackendEnv) {
          showMagicPathDialog.value = false;
          localStorage.setItem('backendConfigured', 'true');
          globalStore.setFetchResult(true);
        } else {
          globalStore.setFetchResult(false);

          if (route.path === '/subs' && skippedCycle !== connectionCheckCycle.value) {
            showMagicPathDialog.value = true;
          }
        }
      } catch (e) {
        console.error('Error initializing stores:', e);
        globalStore.setFetchResult(false);

        // 检查用户是否跳过了当前连接检测周期
        const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

        if (route.path === '/subs' && skippedCycle !== connectionCheckCycle.value) {
          showMagicPathDialog.value = true;
        }
      }
    },
  });

  if (result) {
    // URL参数已处理（无论连接是否成功）
    urlApiConfigSuccess.value = true;

    // 检查连接是否成功
    const fetchResult = globalStore.fetchResult;

    // 检查用户是否跳过了当前连接检测周期
    const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

    if (fetchResult) {
      // 连接成功，清除错误信息并隐藏弹窗
      urlApiError.value = '';
      showMagicPathDialog.value = false;
    } else if (hasUrlParams && skippedCycle !== connectionCheckCycle.value) {
      // 连接失败但已添加到后端列表，显示错误信息
      // 保留urlApiError.value中的错误信息
      if (route.path === '/subs') {
        showMagicPathDialog.value = true;
      }
    }

    // 初始化stores，获取数据
    await initStores(false, true, false);
  } else {
    // URL参数处理失败或没有URL参数
    if (hasUrlParams) {
      // URL参数处理失败
      globalStore.setFetchResult(false);
      const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');
      if (route.path === '/subs' && skippedCycle !== connectionCheckCycle.value) {
        showMagicPathDialog.value = true;
      }
    } else {
      try {
        // 尝试使用默认或已配置的后端
        await initStores(true, true, false);

        const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
        const fetchResult = globalStore.fetchResult;

        // 检查用户是否跳过了当前连接检测周期
        const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

        if (hasBackendEnv && fetchResult) {
          // 连接成功
          showMagicPathDialog.value = false;
          localStorage.setItem('backendConfigured', 'true');
        } else {
          // 连接失败
          if (route.path === '/subs' && skippedCycle !== connectionCheckCycle.value) {
            showMagicPathDialog.value = true;
          }
        }
      } catch (e) {
        console.error('Error initializing stores:', e);
        globalStore.setFetchResult(false);

        // 检查用户是否跳过了当前连接检测周期
        const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

        if (route.path === '/subs' && skippedCycle !== connectionCheckCycle.value) {
          showMagicPathDialog.value = true;
        }
      }
    }
  }

  // 设置检查状态为完成
  isBackendCheckInProgress.value = false;
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
  // 只有当加载完成且后端连接检查也完成时才执行
  if (!globalStore.isLoading && !isBackendCheckInProgress.value) {
    // 使用setTimeout确保DOM已更新
    setTimeout(() => {
      // 检查用户是否跳过了当前连接检测周期
      const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

      // 检查是否有环境信息
      const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
      const fetchResult = globalStore.fetchResult;

      if (hasBackendEnv && fetchResult) {
        // 连接成功
        localStorage.setItem('backendConfigured', 'true');
        showMagicPathDialog.value = false;
      } else if (!fetchResult && skippedCycle !== connectionCheckCycle.value) {
        // 连接失败且用户没有跳过当前连接检测周期
        if (route.path === '/subs') {
          showMagicPathDialog.value = true;
        }
      } else {
        // 其他情况，调用检查函数
        checkAndShowMagicPathDialog();
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
  // 如果后端连接检查仍在进行中，不显示弹窗
  if (isBackendCheckInProgress.value) {
    return;
  }

  // 如果弹窗已经显示，不需要再次检查
  if (showMagicPathDialog.value) {
    return;
  }

  // 检查用户是否跳过了当前连接检测周期
  const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

  // 如果用户跳过了当前连接检测周期，则不显示弹窗
  if (skippedCycle === connectionCheckCycle.value) {
    return;
  }

  // 如果后端连接失败且不在加载状态，显示弹窗
  const fetchResult = globalStore.fetchResult;
  if (!fetchResult && !globalStore.isLoading) {
    if (route.path === '/subs') {
      showMagicPathDialog.value = true;
    }
    return;
  }

  // 检查是否已配置后端
  const backendConfigured = localStorage.getItem('backendConfigured') || localStorage.getItem('magicPathConfigured');
  if (backendConfigured === 'true') {
    // 检查是否有环境信息
    const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;

    // 如果有配置标志但没有环境信息，说明连接失败，需要显示配置弹窗
    if (!hasBackendEnv && !globalStore.isLoading) {
      if (route.path === '/subs') {
        showMagicPathDialog.value = true;
      }
      return;
    } else {
      // 连接成功，不显示弹窗
      return;
    }
  }

  // 如果URL参数指定的后端已处理（无论连接是否成功），检查连接状态
  if (urlApiConfigSuccess.value) {
    // 如果连接失败，显示弹窗
    if (!fetchResult && route.path === '/subs') {
      showMagicPathDialog.value = true;
    }
    return;
  }

  // 如果正在加载中，不显示弹窗
  if (globalStore.isLoading) {
    return;
  }

  // 最终检查是否需要配置
  const needConfiguration = checkNeedConfiguration();
  if (needConfiguration && route.path === '/subs') {
    showMagicPathDialog.value = true;
  } else {
    showMagicPathDialog.value = false;
  }
}

function checkNeedConfiguration() {
  // 如果后端连接检查仍在进行中，不需要配置
  if (isBackendCheckInProgress.value) {
    return false;
  }

  // 检查用户是否跳过了当前连接检测周期
  const skippedCycle = parseInt(sessionStorage.getItem('skippedConnectionCycle') || '0');

  // 如果用户跳过了当前连接检测周期，则不需要配置
  if (skippedCycle === connectionCheckCycle.value) {
    return false;
  }

  const hasBackendEnv = Object.keys(globalStore.env).length > 0 && globalStore.env.backend;
  const fetchResult = globalStore.fetchResult;

  // 如果连接失败，需要配置
  if (!fetchResult) {
    return true;
  }

  // 如果连接成功且有环境信息，不需要配置
  if (hasBackendEnv && fetchResult) {
    localStorage.setItem('backendConfigured', 'true');
    return false;
  }

  // 检查URL参数
  const query = window.location.search;
  if (query) {
    const hasApiParam = query.includes('api=');
    const hasMagicPathParam = query.includes('magicpath=');

    // 如果URL中有参数
    if (hasApiParam || hasMagicPathParam) {
      // 如果URL参数已处理但连接失败，需要配置
      if (urlApiConfigSuccess.value && !fetchResult) {
        return true;
      }

      // 如果URL参数未处理，需要配置
      if (!urlApiConfigSuccess.value) {
        return true;
      }
    }
  }

  // 如果没有环境信息，需要配置
  if (!hasBackendEnv) {
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
  align-items: center;
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
    width: 100%;
    @include responsive-container-width;
  }

  overflow-y: auto;
}

</style>
