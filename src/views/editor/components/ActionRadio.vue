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
    <template v-if="type === 'Resolve Domain Operator' && newVersion">
      <div class="radio-wrapper options-radio">
        <p class="des-label">解析类型</p>
        <nut-radiogroup direction="horizontal" v-model="rdoType">
          <nut-radio v-for="(key, index) in rdoTypeOpt" :label="key" :key="index"
            >{{
              $t(`editorPage.subConfig.nodeActions['${type}'].types[${index}]`)
            }}
          </nut-radio>
        </nut-radiogroup>
      </div>
      <div class="radio-wrapper options-radio">
        <p class="des-label">过滤结果</p>
        <nut-radiogroup direction="horizontal" v-model="rdoFilter">
          <nut-radio v-for="(key, index) in rdoFilterOpt" :label="key" :key="index"
            >{{
              $t(`editorPage.subConfig.nodeActions['${type}'].filters[${index}]`)
            }}
          </nut-radio>
        </nut-radiogroup>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import semverGt from 'semver/functions/gt';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/global';
  import { inject, onMounted, ref, watch } from 'vue';

  const globalStore = useGlobalStore();

  const { showNotify } = useAppNotifyStore();

  const { env } = storeToRefs(globalStore);

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
    'Resolve Domain Operator': ['Google', 'IP-API', 'Cloudflare', 'Ali', 'Tencent'],
  };

  const rdoTypeOpt = ['IPv4', 'IPv6'];
  const rdoFilterOpt = ['disabled', 'removeFailed', 'IPOnly', 'IPv4Only', 'IPv6Only'];

  const value = ref();
  const newVersion = ref(false);

  try {
    newVersion.value = semverGt(env.value.version, '2.14.184')
  } catch (e) {}

  const rdoType = ref('IPv4');
  const rdoFilter = ref('disabled');

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
          rdoType.value = item.args?.type ?? 'IPv4';
          rdoFilter.value = item.args?.filter ?? 'disabled';
          break;
      }
    }
  });

  // 值变化时实时修改 form 的数据
  watch([value, rdoFilter, rdoType], () => {
    if (rdoType.value === 'IPv6' && ['IP-API'].includes(value.value)) {
      showNotify({
        title: `${value.value} 不支持 IPv6`,
        type: 'danger',
      });
    }
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
          type: rdoType.value,
          filter: rdoFilter.value,
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
