<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des`) }}
    </p>
    <div class="radio-wrapper options-radio">
      <nut-radiogroup direction="horizontal" v-model="value">
        <nut-radio v-for="(key, index) in opt[type]" :label="key" :key="index"
          >
          <div class="input-wrapper" v-if="type === 'Resolve Domain Operator' && value==='Custom' && key==='Custom'">
            <nut-input placeholder="目前仅支持 DoH" v-model="rdoUrl" />
          </div>
          <div v-else>
            {{
            $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`)
          }}
          </div>
        </nut-radio>
      </nut-radiogroup>
    </div>
    <template v-if="type === 'Resolve Domain Operator' && rdoNewVersion">
      <div class="radio-wrapper options-radio">
        <p class="des-label">EDNS(Google, Ali, Tencent, 自定义 DoH 会携带此参数, 可能会影响解析结果)</p>
        <div class="input-wrapper">
            <nut-input placeholder="请输入纯 IP, 默认为 223.6.6.6" v-model="rdoEdns" />
          </div>
      </div>
      <div class="radio-wrapper options-radio">
        <p class="des-label">解析类型</p>
        <nut-radiogroup direction="horizontal" v-model="rdoType">
          <nut-radio v-for="(key, index) in rdoTypeOpt" :label="key" :key="index"
            >{{
              $t(`editorPage.subConfig.nodeActions['${type}'].types[${index}]`)
            }}
            <font-awesome-icon v-if="key === 'IP4P'" @click="rdoTypeInfo" icon="fa-solid fa-circle-question"/>
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
      <div class="radio-wrapper options-radio">
        <p class="des-label">缓存</p>
        <nut-radiogroup direction="horizontal" v-model="rdoCache">
          <nut-radio v-for="(key, index) in rdoCacheOpt" :label="key" :key="index"
            >{{
              $t(`editorPage.subConfig.nodeActions['${type}'].cache[${index}]`)
            }}
          </nut-radio>
        </nut-radiogroup>
      </div>
    </template>
    <template v-if="type === 'Flag Operator' && foNewVersion && value === 'add'">
      <div class="radio-wrapper options-radio">
        <p class="des-label flag-operator" @click="showTwTips">
            <span>识别为</span>
            <img :src="tw" alt="">
            <span>时</span>
            <nut-icon name="tips" size="12px"></nut-icon>
        </p>
        <nut-radiogroup direction="horizontal" v-model="foTw">
          <nut-radio v-for="(key, index) in foTwOpt" :label="key" :key="index"
            >{{
              $t(`editorPage.subConfig.nodeActions['${type}'].twOptions[${index}]`)
            }}
          </nut-radio>
        </nut-radiogroup>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { Toast, Dialog } from "@nutui/nutui";
  import semverGt from 'semver/functions/gt';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/global';
  import { inject, onMounted, ref, watch } from 'vue';
  import tw from '@/assets/icons/tw.png';

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
    'Resolve Domain Operator': ['Google', 'IP-API', 'Cloudflare', 'Ali', 'Tencent', 'Custom'],
  };

  const foTwOpt = ['cn', 'ws', 'tw'];
  const rdoTypeOpt = ['IPv4', 'IPv6', 'IP4P'];
  const rdoFilterOpt = ['disabled', 'removeFailed', 'IPOnly', 'IPv4Only', 'IPv6Only'];
  const rdoCacheOpt = ['enabled' , 'disabled'];

  const value = ref();
  const rdoNewVersion = ref(true);
  const foNewVersion = ref(true);
  
  // const rdoNewVersion = ref(false);
  // const foNewVersion = ref(false);

  // try {
  //   rdoNewVersion.value = semverGt(env.value.version, '2.14.184')
  // } catch (e) {}
  // try {
  //   foNewVersion.value = semverGt(env.value.version, '2.14.119')
  // } catch (e) {}

  const foTw = ref('cn');
  const rdoType = ref('IPv4');
  const rdoFilter = ref('disabled');
  const rdoCache = ref('enabled');
  const rdoUrl = ref('');
  const rdoEdns = ref('');

  const showTwTips = () => {
    Toast.text('免责声明: 本操作仅将 Emoji 旗帜进行替换以便于显示, 不包含任何政治意味');
  };
  const rdoTypeInfo = () => {
    Dialog({
      title: 'IP4P 地址格式',
      content: '来自 NATMap, 将 IPv4 地址和端口同时编码在 DNS AAAA 记录中\n\n使用场景: STUN 内网穿透, 无需公网服务器即可获得 IPv4 公网地址',
      popClass: 'auto-dialog',
      okText: '更多说明',
      cancelText: '取消',
      // @ts-ignore
      closeOnClickOverlay: true,
      onOk: async () => {
        window.open('https://github.com/heiher/natmap/wiki/faq#%E5%9F%9F%E5%90%8D%E8%AE%BF%E9%97%AE%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E7%9A%84')
      },
      // onCancel: async () => {
        
      // },
      closeOnPopstate: true,
      lockScroll: false,
    });
  };

  // 挂载时读取当前数据，赋值初始状态
  onMounted(() => {
    const item = form.process.find(item => item.id === id);

    if (item) {
      switch (type) {
        case 'Flag Operator':
          value.value = item.args?.mode ?? 'add';
          foTw.value = item.args?.tw ?? 'cn';
          break;
        case 'Sort Operator':
          value.value = item.args ?? 'asc';
          break;
        case 'Resolve Domain Operator':
          value.value = item.args?.provider ?? 'Google';
          rdoType.value = item.args?.type ?? 'IPv4';
          rdoFilter.value = item.args?.filter ?? 'disabled';
          rdoCache.value = item.args?.cache ?? 'enabled';
          rdoUrl.value = item.args?.url ?? '';
          rdoEdns.value = item.args?.edns;
          break;
      }
    }
  });

  // 值变化时实时修改 form 的数据
  watch([value, rdoFilter, rdoCache, rdoUrl, rdoEdns, rdoType, foTw], () => {
    if (['IPv6', 'IP4P'].includes(rdoType.value) && ['IP-API'].includes(value.value)) {
      showNotify({
        title: `${value.value} 不支持 ${rdoType.value}`,
        type: 'danger',
      });
    }
    const item = form.process.find(item => item.id === id);
    switch (type) {
      case 'Flag Operator':
        item.args = {
          mode: value.value,
          tw: foTw.value,
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
          cache: rdoCache.value,
          url: rdoUrl.value,
          edns: rdoEdns.value,
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
    &.flag-operator {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 14px;
        height: 14px;
      }
      span {
        margin: 0 4px;
      }
    }
  }

  .nut-radiogroup {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .input-wrapper {
    display: flex;
    align-items: center;

    > view.nut-input {
      background: transparent;
      padding: 8px 12px;
      margin-right: 16px;
      border-bottom: 1px solid var(--lowest-text-color);
      color: var(--second-text-color);
    }
  }
</style>
