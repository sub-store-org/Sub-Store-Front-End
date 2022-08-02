<template>
  <GlobalNotify />
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
</template>

<script setup lang="ts">
  import GlobalNotify from '@/components/GlobalNotify.vue';
  import NavBar from '@/components/NavBar.vue';
  import { useThemes } from '@/hooks/useThemes';
  import { useGlobalStore } from '@/store/global';
  import { useSubsStore } from '@/store/subs';
  import { getFlowsUrlList } from '@/utils/getFlowsUrlList';
  import { initStores } from '@/utils/initApp';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const subsStore = useSubsStore();
  const globalStore = useGlobalStore();
  const { subs, flows } = storeToRefs(subsStore);
  const allLength = ref(null);

  // 处于 pwa 时将底部安全距离写入 global store
  type NavigatorExtend = Navigator & {
    standalone?: boolean;
  };
  const navigator: NavigatorExtend = window.navigator;
  globalStore.setBottomSafeArea(navigator.standalone ? 32 : 6);

  // 引入 inoBounce 禁止过度滑动橡皮筋效果
  onMounted(() => {
    let externalScript = document.createElement('script');
    externalScript.src =
      'https://cdnjs.cloudflare.com/ajax/libs/inobounce/0.2.1/inobounce.min.js';
    document.head.appendChild(externalScript);
  });

  // 初始化应用数据（顶部通知）
  initStores(true, true, false);

  // 初始化颜色主题
  useThemes();

  // 设置流量刷新状态
  watchEffect(() => {
    allLength.value = getFlowsUrlList(subs.value).length;
    const currentLength = Object.keys(flows.value).length;
    globalStore.setFlowFetching(allLength.value !== currentLength);
  });
</script>

<style lang="scss">
  #app {
    font-family: 'Roboto', 'Noto Sans', Arial, 'PingFang SC',
      'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'ST Heiti',
      SimHei, sans-serif;
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    width: 100%;
    background: var(--background-color);

    .page-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
</style>
