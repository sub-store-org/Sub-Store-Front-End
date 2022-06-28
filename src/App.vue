<template>
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
  import { useGlobalStore } from '@/store/global'
  import { setColorThemeClass } from '@/utils/setColorThemeClass'

  // 判断处于 pwa 时将底部安全距离写入全局 store
  const globalStore = useGlobalStore()
  type NavigatorExtend = Navigator & {
    standalone?: boolean
  }
  const navigator: NavigatorExtend = window.navigator
  globalStore.setBottomSafeArea(navigator.standalone ? 32 : 6)

  setColorThemeClass()
</script>

<style lang="scss">
  @import '@/assets/custom_theme_variables.scss';

  #app {
    font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica,
      'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC',
      'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC',
      'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei',
      'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp',
      sans-serif;
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    width: 100%;

    .light-mode & {
      color: $light-primary-text-color;
      background: $light-background-color;
    }

    .dark-mode & {
      color: $dark-primary-text-color;
      background: $dark-background-color;
    }

    .page-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .dark-mode & img {
      filter: brightness(0.6);
    }
  }
</style>
