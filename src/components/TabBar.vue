<template>
  <div class="tab-bar-wrapper">
    <nut-tabbar
      unactive-color=""
      v-model:visible="activeTab"
      :bottom="true"
      class="tabbar"
      size="22px"
    >
      <nut-tabbar-item
        class="tabbar-item"
        :tab-title="$t(`tabBar.sub`)"
        to="/subs"
        icon="link"
      ></nut-tabbar-item>
      <nut-tabbar-item
        class="tabbar-item"
        :tab-title="$t(`tabBar.sync`)"
        to="/sync"
        icon="refresh2"
      ></nut-tabbar-item>
      <nut-tabbar-item
        class="tabbar-item"
        :tab-title="$t(`tabBar.my`)"
        to="/my"
        icon="my"
      ></nut-tabbar-item>
    </nut-tabbar>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  import { useGlobalStore } from '@/store/global'
  import { storeToRefs } from 'pinia'

  const route = useRoute()
  const routeList = ['/subs', '/sync', '/my']
  const activeTab = routeList.indexOf(route.path)

  const globalStore = useGlobalStore()
  const { bottomSafeArea } = storeToRefs(globalStore)
  const style = {
    height: `${bottomSafeArea.value + 12 + 44}px`,
    paddingBottom: bottomSafeArea.value + 'px',
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .tab-bar-wrapper {
    .tabbar {
      padding-top: 12px;
      padding-bottom: v-bind('style.paddingBottom');
      box-shadow: none;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);

      .dark-mode & {
        background: $dark-tab-bar-color;
        border-top: $dark-divider-color solid 1px;
      }

      .light-mode & {
        background: $light-tab-bar-color;
        border-top: $light-divider-color solid 1px;
      }
    }

    :deep(.tabbar-item) {
      &.nut-tabbar-item__icon--unactive {
        .dark-mode & {
          color: $dark-lowest-text-color;
        }

        .light-mode & {
          color: $light-lowest-text-color;
        }
      }
      & > .nut-tabbar-item_icon-box > .nut-tabbar-item_icon-box_nav-word {
        margin-top: 4px;
        font-weight: 600;
      }
    }
  }
</style>
