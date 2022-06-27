<template>
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
  import { provide } from 'vue'

  // 判断处于pwa时增加底部安全距离，提供给子组件
  type NavigatorExtend = Navigator & {
    standalone?: boolean
  }
  const navigator: NavigatorExtend = window.navigator
  const tabBarSafeAreaBottom = navigator.standalone ? '32px' : '6px'
  provide('tabBarSafeAreaBottom', tabBarSafeAreaBottom)
</script>

<style lang="scss">
  #app {
    font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica,
      'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC',
      'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC',
      'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei',
      'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp',
      sans-serif;
    color: #303133;

    .page-body {
      padding: 12px;
    }
  }
</style>
