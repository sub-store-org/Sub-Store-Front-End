<template>
  <div class="wrapper">
    
    <h3 v-if="isBackend">
      <p>{{ $t('notFoundPage.backendDesc') }}</p>
    </h3>
    <h3 v-else>{{ $t('notFoundPage.title') }}</h3>
    <router-link to="/">{{ $t('notFoundPage.desc') }}</router-link>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const isBackend = /\/(api|download|share)\/.+/.test(route.fullPath)
</script>

<style lang="scss" scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: var(--primary-text-color);

    h3 {
      padding: 0 24px 24px 24px;
    }
  }
</style>
