<template>
  <nut-notify pop-class="pop-notify" v-model:visible="isVisible" :type="type">
    <p>{{ title }}</p>
    <p v-if="content">{{ content }}</p>
  </nut-notify>
</template>

<script lang="ts" setup>
  import { useAppNotifyStore } from '@/store/appNotify';
  import { storeToRefs } from 'pinia';
  import { watch } from 'vue';

  const appNotifyStore = useAppNotifyStore();

  const { isVisible, title, content, type, duration } =
    storeToRefs(appNotifyStore);

  watch(isVisible, () => {
    if (isVisible.value) {
      setTimeout(() => {
        appNotifyStore.setVisible(false);
      }, duration.value);
    }
  });
</script>

<style lang="scss" scoped></style>
