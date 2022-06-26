<template>
  <div class="wrapper">
    <h3>啊哦～ URL 错误！</h3>
    <router-link to="/">回首页</router-link>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    h3 {
      padding-bottom: 24px;
    }
  }
</style>
