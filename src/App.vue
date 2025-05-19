<template>
  <!-- <GlobalNotify /> -->
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
  <MagicPathDialog v-model="showMagicPathDialog" />
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

// 如果带有 url 参数配置 api，则将其添加到 api 列表并切换
const { handleUrlQuery } = useHostAPI();
handleUrlQuery({
  errorCb: async () => initStores(true, true, false),
});

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

// 检测是否需要显示后端配置对话框
onMounted(() => {
  // 开发环境下清除之前的配置标记，方便测试
  if (import.meta.env.DEV) {
    localStorage.removeItem('backendConfigured');
    localStorage.removeItem('magicPathConfigured'); // 兼容旧版本
  }

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

// 检查是否需要显示后端配置对话框
function checkAndShowMagicPathDialog() {
  // 检查是否已经配置过后端
  const backendConfigured = localStorage.getItem('backendConfigured') || localStorage.getItem('magicPathConfigured');
  if (backendConfigured === 'true') {
    return;
  }

  // 检查是否已经配置过hostAPI
  const hostAPIConfig = localStorage.getItem('hostAPI');
  if (hostAPIConfig) {
    try {
      const hostAPIData = JSON.parse(hostAPIConfig);
      // 如果已经有配置的API且当前选择了一个API，则认为已配置
      if (hostAPIData.apis && hostAPIData.apis.length > 0 && hostAPIData.current) {
        // 设置已配置标志，避免再次显示配置对话框
        localStorage.setItem('backendConfigured', 'true');
        return;
      }
    } catch (e) {
      console.error('解析hostAPI配置时出错:', e);
    }
  }

  // 检查是否需要配置
  const needConfiguration = checkNeedConfiguration();
  if (needConfiguration && route.path === '/subs') {
    // 在主页面显示配置对话框
    showMagicPathDialog.value = true;

    // 将状态保存到sessionStorage，确保刷新页面后仍然显示对话框
    sessionStorage.setItem('showMagicPathDialog', 'true');
  }
}

// 检测是否需要配置
function checkNeedConfiguration() {
  // 只在特定域名下自动弹窗
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
