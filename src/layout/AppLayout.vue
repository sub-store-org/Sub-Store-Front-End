<template>
  <div class="app-layout-wrapper">
    <router-view />
  </div>
  <TabBar v-if="isNeedTabBar" />
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

  const isNeedTabBar = computed(() => {
    return route.meta?.needTabBar ?? false
  })

  const height = computed(() => {
    if (route.meta.needTabBar) {
      return 44 + bottomSafeArea.value + 'px'
    } else {
      return '16px'
    }
  })
</script>

<style scoped lang="scss">
  .app-layout-wrapper {
    flex: 1;
    padding: 56px 0 v-bind(height) 0;
    overflow: auto;
  }
</style>
