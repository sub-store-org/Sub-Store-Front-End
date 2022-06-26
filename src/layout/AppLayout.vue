<template>
  <div class="app-layout-wrapper">
    <router-view />
  </div>
  <div class="safe-area-bottom">
    <TabBar :safeAreaHeight="tabBarSafeAreaBottom" />
  </div>
</template>

<script lang="ts" setup>
  import TabBar from '@/components/TabBar.vue'

  // 判断处于pwa时增加底部安全距离
  type NavigatorExtend = Navigator & {
    standalone?: boolean
  }
  const navigator: NavigatorExtend = window.navigator
  const tabBarSafeAreaBottom = navigator.standalone ? '32px' : '6px'
</script>

<style lang="scss" scoped>
  .app-layout-wrapper {
    padding: 0 12px calc(57px + v-bind(tabBarSafeAreaBottom) + 12px) 12px;
  }
</style>
