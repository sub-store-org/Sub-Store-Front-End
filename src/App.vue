<template>
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
  import { provide, computed } from 'vue'
  import { useRoute } from 'vue-router'

  // 判断处于pwa时增加底部安全距离，提供给子组件
  type NavigatorExtend = Navigator & {
    standalone?: boolean
  }
  const navigator: NavigatorExtend = window.navigator
  const tabBarSafeAreaBottom = navigator.standalone ? 32 : 6
  provide('tabBarSafeAreaBottom', tabBarSafeAreaBottom)

  const route = useRoute()
  const height = computed(() => {
    if (route.meta.needTabBar) {
      return 56 + 44 + 12 + tabBarSafeAreaBottom + 'px'
    } else {
      return '56px'
    }
  })
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
      height: calc(100vh - v-bind(height));
      padding: 12px;
      overflow: hidden;
    }
  }
</style>
