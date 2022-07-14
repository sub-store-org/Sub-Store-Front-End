<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des`) }}
    </p>
    <div class="radio-wrapper options-radio">
      <nut-radiogroup direction="horizontal" v-model="value">
        <nut-radio v-for="(key, index) in opt[type]" :label="key" :key="index"
          >{{
            $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`)
          }}
        </nut-radio>
      </nut-radiogroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, onMounted, ref, watch } from 'vue';

  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  // 此处 key 需要与 i18n 的 actions 中的 key 相同
  // 值的次序需要与该选项的 options 值 顺序相同
  const opt = {
    'Flag Operator': ['add', 'remove'],
    'Sort Operator': ['asc', 'desc', 'random'],
    'Resolve Domain Operator': ['Google', 'IP-API', 'Cloudflare'],
  };

  const value = ref();

  // 挂载时读取当前数据，赋值初始状态
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) {
      switch (type) {
        case 'Flag Operator':
          value.value = item.args?.mode ?? 'add';
          break;
        case 'Sort Operator':
          value.value = item.args ?? 'asc';
          break;
        case 'Resolve Domain Operator':
          value.value = item.args?.provider ?? 'Google';
          break;
      }
    }
  });

  // 值变化时实时修改 form 的数据
  watch(value, () => {
    const item = form.process.find(item => item.id === id);
    switch (type) {
      case 'Flag Operator':
        item.args = {
          mode: value.value,
        };
        break;
      case 'Sort Operator':
        item.args = value.value;
        break;
      case 'Resolve Domain Operator':
        item.args = {
          provider: value.value,
        };
        break;
    }
  });
</script>

<style lang="scss" scoped>
  .des-label {
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--comment-text-color);
  }

  .nut-radiogroup {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>
