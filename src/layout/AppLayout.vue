<template>
  <div class="app-layout-wrapper">
    <router-view />
  </div>
  <TabBar />
</template>

<script lang="ts" setup>
  import TabBar from '@/components/TabBar.vue'
</script>
