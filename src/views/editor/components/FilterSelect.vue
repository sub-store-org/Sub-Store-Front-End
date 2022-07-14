<template>
  <div class="editor-action-card">
    <nut-checkboxgroup class="checkbox-group" v-model="value">
      <nut-checkbox
        :icon-size="16"
        v-for="(item, index) in opt[type]"
        :key="item"
        :label="item"
        >{{
          $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`)
        }}</nut-checkbox
      >
    </nut-checkboxgroup>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref, onMounted } from 'vue';

  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  // 此处 key 需要与 i18n 的 actions 中的 key 相同
  // 值的次序需要与该选项的 options 值 顺序相同
  const opt = {
    'Region Filter': ['HK', 'TW', 'SG', 'JP', 'UK', 'US'],
    'Type Filter': [
      'ss',
      'ssr',
      'vmess',
      'vless',
      'trojan',
      'http',
      'socks5',
      'snell',
    ],
  };

  const value = ref([]);

  // 挂载时将 value 值指针指向 form 对应的数据
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) value.value = item.args;
  });
</script>

<style lang="scss" scoped>
  .checkbox-group {
    display: grid;
    grid-template-columns: 1fr 1fr;

    view {
      margin-bottom: 16px;

      :deep(.nut-checkbox__label) {
        font-size: 14px;
        color: var(--second-text-color);
      }
    }
  }
</style>
