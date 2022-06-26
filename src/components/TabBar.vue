<template>
  <nut-tabbar
    v-model:visible="activeTab"
    :bottom="true"
    unactive-color="#c0c4cc"
    class="tabbar"
    size="22px"
  >
    <nut-tabbar-item
      class="tabbar-item"
      tab-title="订阅"
      to="/sub"
      icon="link"
    ></nut-tabbar-item>
    <nut-tabbar-item
      class="tabbar-item"
      tab-title="同步"
      to="/sync"
      icon="refresh2"
    ></nut-tabbar-item>
    <nut-tabbar-item
      class="tabbar-item"
      tab-title="我的"
      to="/my"
      icon="my"
    ></nut-tabbar-item>
  </nut-tabbar>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const routeList = ['/sub', '/sync', '/my']
  const activeTab = routeList.indexOf(route.path)

  const { safeAreaHeight } = defineProps<{
    safeAreaHeight: String
  }>()
</script>

<style lang="scss" scoped>
  .tabbar {
    padding-top: 12px;
    padding-bottom: v-bind(safeAreaHeight);
    box-shadow: none;
    background: #f8f8f8dd;
    border-top: #00000006 solid 1px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  :deep(.tabbar-item) {
    & > .nut-tabbar-item_icon-box > .nut-tabbar-item_icon-box_nav-word {
      margin-top: 4px;
      font-weight: 600;
    }
  }
</style>
