<template>
  <div class="editor-action-card">
    <nut-checkboxgroup class="checkbox-group" v-model="value">
      <nut-checkbox
        :icon-size="16"
        v-for="(item, index) in opt[type]"
        :key="item"
        :label="item"
        >
      <span class="item" v-if="type === 'Region Filter' && item === 'TW'">
        <img :src="tw" alt="">&nbsp;{{ item }}
      </span>
      <span v-else>{{ $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`) }}</span>
      </nut-checkbox>
    </nut-checkboxgroup>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref, onMounted } from 'vue';
  import tw from '@/assets/icons/tw.png';

  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  // 此处 key 需要与 i18n 的 actions 中的 key 相同
  // 值的次序需要与该选项的 options 值 顺序相同
  const opt = {
    'Region Filter': ['HK', 'TW', 'SG', 'JP', 'UK', 'US', 'DE', 'KR'],
    'Type Filter': [
      'ss',
      'ssr',
      'vmess',
      'vless',
      'trojan',
      'http',
      'socks5',
      'snell',
      'tuic',
      'hysteria',
      'hysteria2',
      'juicity',
      'mieru',
      'wireguard',
      'ssh',
      'external',
      'direct'
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
    .item {
      display: flex;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
      }
    }

    view {
      margin-bottom: 16px;

      :deep(.nut-checkbox__label) {
        font-size: 14px;
        color: var(--second-text-color);
      }
    }
  }
</style>
