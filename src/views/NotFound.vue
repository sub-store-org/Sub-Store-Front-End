<template>
  <div class="wrapper">
    <h3>{{ $t('notFoundPage.title') }}</h3>
    <router-link to="/">{{ $t('notFoundPage.desc') }}</router-link>
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
