<template>
  <div class="app-layout-wrapper">
    <router-view />
  </div>
  <TabBar v-if="shouldShowTabBar" />
</template>

<script lang="ts" setup>
  import TabBar from '@/components/TabBar.vue';
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useWideScreenNarrowMode } from '@/hooks/useWideScreenNarrowMode';
  import { useGlobalStore } from '@/store/global';
  import router from '@/router';

  const globalStore = useGlobalStore();
  const { bottomSafeArea } = storeToRefs(globalStore);
  const { shouldShowTabBar } = useWideScreenNarrowMode();

  const height = computed(() => {
    if (shouldShowTabBar.value) {
      return 44 + 12 + bottomSafeArea.value + 'px';
    } else {
      return '16px';
    }
  });

  // 每次切换路由后，将页面位置置顶
  router.afterEach(() => {
    document.querySelector('.app-layout-wrapper')?.scrollTo({ top: 0 });
  });
</script>

<style scoped lang="scss">
  .app-layout-wrapper {
    flex: 1;
    padding: 56px 0 v-bind(height) 0;
    overflow: auto;
  }

</style>
