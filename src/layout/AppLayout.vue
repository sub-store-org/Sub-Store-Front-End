<template>
  <div class="app-layout-wrapper">
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <!-- <component v-else :is="Component" :key="route.fullPath" /> -->
      </template>
    </router-view>
  </div>
  <TabBar v-if="isNeedTabBar" />
</template>

<script lang="ts" setup>
  import TabBar from '@/components/TabBar.vue';
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/modules/global';
  import router from '@/router';
  import { useAsyncRouteStore } from '@/store/modules/asyncRoute';
  const asyncRouteStore = useAsyncRouteStore();
  const globalStore = useGlobalStore();
  const { bottomSafeArea } = storeToRefs(globalStore);

  const route = useRoute();

  const isNeedTabBar = computed(() => {
    return route.meta?.needTabBar ?? false;
  });

  const height = computed(() => {
    if (route.meta.needTabBar) {
      return 44 + 12 + bottomSafeArea.value + 'px';
    } else {
      return '16px';
    }
  });
  const keepAliveComponents = computed(
    () => asyncRouteStore.keepAliveComponents
  );

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
