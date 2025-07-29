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
      <nut-tabbar-item v-show="!appearanceSetting.istabBar2" class="tabbar-item" to="/files" icon="category" />

      <nut-tabbar-item
        v-show="!appearanceSetting.istabBar"
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
  import { useSettingsStore } from '@/store/settings';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { onBeforeRouteUpdate, useRoute } from 'vue-router';

  const route = useRoute();
  const routeList = ['/subs', '/files', '/sync', '/my'];
  const activeTab = ref(routeList.indexOf(route.path));



  const globalStore = useGlobalStore();
  const settingsStore = useSettingsStore();
  const { appearanceSetting } = storeToRefs(settingsStore);

  const {
    bottomSafeArea,
    // istabBar,
    // istabBar2,
    env
  } = storeToRefs(globalStore);
  const style = {
    height: `${bottomSafeArea.value + 12 + 44}px`,
    paddingBottom: bottomSafeArea.value + 'px',
  };
  onBeforeRouteUpdate((to, from, next) => {
    activeTab.value = routeList.indexOf(to.path);
    // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    // globalStore.setSavedPositions(from.path, { left: 0, top: scrollTop })
    next();
  });
</script>

<style lang="scss" scoped>
  .tab-bar-wrapper {
    z-index: 101;
    bottom: 0;
    @include centered-fixed-container;

    .tabbar {
      padding-top: 8px;
      padding-bottom: v-bind('style.paddingBottom');
      box-shadow: none;
      backdrop-filter: blur(var(--tab-bar-blur));
      -webkit-backdrop-filter: blur(var(--tab-bar-blur));
      background: var(--tab-bar-color);
      @media screen and (min-width: 768px) {
        border-radius: var(--item-card-radios);
        overflow: hidden;
      }
    }

    :deep(.tabbar-item) {
      cursor: pointer;
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
