<template>
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
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
      padding-top: 56px;
      height: 100vh;
      width: 100vw;
    }
  }
</style>
