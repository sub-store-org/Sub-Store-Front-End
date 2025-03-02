<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
    </p>
    <nut-radiogroup direction="horizontal" v-model="mode">
      <nut-radio v-for="(key, index) in opt[type].mode" :label="key" :key="index"
        >{{
          $t(`editorPage.subConfig.nodeActions['${type}'].modeOptions[${index}]`)
        }}
      </nut-radio>
    </nut-radiogroup>
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[0]`) }}
    </p>
    <nut-checkboxgroup class="checkbox-group" v-model="value">
      <nut-checkbox
        :icon-size="16"
        v-for="(item, index) in opt[type].value"
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
  import { inject, ref, watch, onMounted } from 'vue';
  import tw from '@/assets/icons/tw.png';
  import semverGt from 'semver/functions/gt';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/global';

  const globalStore = useGlobalStore();
  const { env } = storeToRefs(globalStore);

  const { showNotify } = useAppNotifyStore();

  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  // 此处 key 需要与 i18n 的 actions 中的 key 相同
  // 值的次序需要与该选项的 options 值 顺序相同
  const opt = {
    'Region Filter': {
      mode: [0, 1],
      value: ['HK', 'TW', 'SG', 'JP', 'UK', 'US', 'DE', 'KR']
    },
    'Type Filter': {
      mode: [0, 1],
      value: [
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
        'anytls',
        'wireguard',
        'ssh',
        'external',
        'direct'
      ]
    },
  };

  const value = ref([]);
  const mode = ref();

  // try {
  //   if(!semverGt(env.value.version, '2.16.63')) {
  //     showNotify({
  //       title: `请更新后端, 版本应大于 2.16.63`,
  //       type: 'danger',
  //     });
  //   }
  // } catch (e) {}

  // 挂载时将 value 值指针指向 form 对应的数据
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) {
      let v = item.args?.value || item.args;
      if (!Array.isArray(v)){
        v = [];
      }
      const keep = item.args?.keep ?? true;
      item.args = { keep, value: v };
      value.value = item.args.value;
      mode.value = item.args.keep ? 0 : 1;
    }
  });

  watch(mode, () => {
    const item = form.process.find(item => item.id === id);
    item.args.keep = !mode.value;
  });
</script>

<style lang="scss" scoped>
  .des-label {
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--comment-text-color);

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
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
