<template>
  <div class="app-layout-wrapper">
    <router-view />
  </div>
  <TabBar />
</template>

<script lang="ts" setup>
  import TabBar from '@/components/TabBar.vue'
</script>

<style scoped lang="scss">
  .app-layout-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
