<template>
  <div class="tab-bar-wrapper">
    <nut-tabbar
      unactive-color=""
      v-model:visible="activeTab"
      :bottom="true"
      class="tabbar"
      size="22px"
    >
      <nut-tabbar-item class="tabbar-item" to="/subs" icon="link" />
      <nut-tabbar-item class="tabbar-item" to="/files" icon="category" />

      <nut-tabbar-item
        v-show="!istabBar"
        class="tabbar-item"
        to="/sync"
        icon="refresh2"
      />

      <nut-tabbar-item class="tabbar-item" to="/my" icon="setting" :dot="env.hasNewVersion"/>
    </nut-tabbar>
  </div>
</template>

<script lang="ts" setup>
  import { useGlobalStore } from '@/store/global';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { onBeforeRouteUpdate, useRoute } from 'vue-router';

  const route = useRoute();
  const routeList = ['/subs', '/files', '/sync', '/my'];
  const activeTab = ref(routeList.indexOf(route.path));

  onBeforeRouteUpdate((to, from, next) => {
    activeTab.value = routeList.indexOf(to.path);
    next();
  });

  const globalStore = useGlobalStore();
  const { bottomSafeArea, istabBar, env } = storeToRefs(globalStore);
  const style = {
    height: `${bottomSafeArea.value + 12 + 44}px`,
    paddingBottom: bottomSafeArea.value + 'px',
  };
</script>

<style lang="scss" scoped>
  .tab-bar-wrapper {
    z-index: 101;
    .tabbar {
      padding-top: 8px;
      padding-bottom: v-bind('style.paddingBottom');
      box-shadow: none;
      backdrop-filter: blur(var(--tab-bar-blur));
      -webkit-backdrop-filter: blur(var(--tab-bar-blur));
      background: var(--tab-bar-color);
    }

    :deep(.tabbar-item) {
      &.nut-tabbar-item__icon--unactive {
        color: var(--lowest-text-color);
      }
      & > .nut-tabbar-item_icon-box > .nut-tabbar-item_icon-box_nav-word {
        margin-top: 8px;
        font-weight: 600;
      }
    }
  }
</style>
