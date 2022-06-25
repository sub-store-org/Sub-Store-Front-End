<template>
  <div style="display: flex">
    <div @click="change('zh')">中文</div>
    <div @click="change('en')">English</div>
  </div>
  <router-view />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { locale } = useI18n()

  const change = (type: string) => {
    locale.value = type
  }
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
  }
</style>
