<template>
  <div class="sub-item-wrapper">
    <div class="sub-img-wrapper">
      <nut-avatar
        size="56"
        shape="square"
        color="rgb(245, 106, 0)"
        bg-color="rgb(253, 227, 207)"
        :icon="icon"
      ></nut-avatar>
    </div>
    <div class="sub-item-content">
      <h3>{{ props.sub.name }}</h3>
      {{ props.sub }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import icon from '@/assets/icons/logo.png'

  const props = defineProps<{
    sub: SubsData
  }>()
</script>

<style lang="scss" scoped>
  .sub-item-wrapper {
    width: 100%;
    background: #f2f2f2;
    border-radius: 12px;
    padding: 16px;
    display: flex;

    > .sub-img-wrapper {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      margin-right: 20px;
      border-radius: 8px;
      overflow: hidden;
    }

    > .sub-item-content {
      color: #303133;
    }
  }
</style>
