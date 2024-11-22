<template>
  <!-- <GlobalNotify /> -->
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
</template>

<script setup lang="ts">
// import GlobalNotify from '@/components/GlobalNotify.vue';
import NavBar from "@/components/NavBar.vue";
import { useThemes } from "@/hooks/useThemes";
import { useGlobalStore } from "@/store/global";
import { useSubsStore } from "@/store/subs";
import { getFlowsUrlList } from "@/utils/getFlowsUrlList";
import { initStores } from "@/utils/initApp";
import { storeToRefs } from "pinia";
import { ref, watchEffect, onMounted } from "vue";
import { useHostAPI } from "@/hooks/useHostAPI"; //onMounted

const subsStore = useSubsStore();

const globalStore = useGlobalStore();

const { subs, flows } = storeToRefs(subsStore);

const allLength = ref(null);

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
