<template>
  <div class="app-layout-wrapper">
    <router-view />
  </div>
  <TabBar />
</template>

<script lang="ts" setup>
  import TabBar from '@/components/TabBar.vue'
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '@/store/global'

  const globalStore = useGlobalStore()
  const { bottomSafeArea } = storeToRefs(globalStore)

  const route = useRoute()
  const height = computed(() => {
    if (route.meta.needTabBar) {
      return 56 + bottomSafeArea.value + 'px'
    } else {
      return '56px'
    }
  })
</script>

<style scoped lang="scss">
  .app-layout-wrapper {
    flex: 1;
    padding: 56px 12px v-bind(height) 12px;
    overflow: auto;
  }
</style>
