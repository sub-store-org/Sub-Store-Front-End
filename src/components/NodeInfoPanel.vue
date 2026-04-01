<template>
  <div class="tab-panel-wrapper">
    <nut-tabs v-model="currentTab" type="smile" class="auto-tab-panel">
      <nut-tabpane :title="$t('comparePage.nodeInfo.node.title')">
        <ul class="info-ul">
          <li>
            <strong class="node-name">
              <nut-tag class="type-tag">{{ props.nodeInfo.type }} </nut-tag
              >{{ props.nodeInfo.name }}</strong
            >
          </li>
          <li v-for="(value, key) in displayNodeInfo" :key="key">
            <span class="info-key">{{ key }}</span>
            <span class="info-value"> : </span>
            <span class="info-value">{{ value }}</span>
          </li>
        </ul>
      </nut-tabpane>
      <nut-tabpane :title="$t('comparePage.nodeInfo.ipApi.title')">
        <ul v-if="hasIpApiData" class="info-ul">
          <li>
            <strong class="node-name">{{ props.nodeInfo.name }}</strong>
          </li>
          <li>IP: {{ props.ipApi.info.query }}</li>
          <li>Region : {{ city }}</li>
          <li>ISP : {{ props.ipApi.info.isp }}</li>
          <li>Org: {{ props.ipApi.info.org }}</li>
          <li>Timezone : {{ props.ipApi.info.timezone }}</li>
          <li>
            Location :
            {{ 'lon ' + props.ipApi.info.lon + ' - lat ' + props.ipApi.info.lat }}
          </li>
        </ul>
        <div v-else-if="props.ipApiStatus === 'error'" class="ip-api-state">
          <strong class="node-name">{{ props.nodeInfo.name }}</strong>
          <nut-empty image="error" class="ip-api-empty">
            <template #description>
              <h3>{{ $t('comparePage.nodeInfo.ipApi.loadFailed') }}</h3>
            </template>
          </nut-empty>
          <nut-button
            icon="refresh"
            type="primary"
            class="ip-api-retry-btn"
            @click="retryLoadIpApi"
          >
            {{ $t('comparePage.nodeInfo.ipApi.retry') }}
          </nut-button>
        </div>
        <div v-else class="ip-api-state ip-api-loading">
          <strong class="node-name">{{ props.nodeInfo.name }}</strong>
          <p class="state-title">{{ $t('comparePage.nodeInfo.ipApi.loading') }}</p>
        </div>
      </nut-tabpane>
      <nut-tabpane title="JSON">
        <div class="input-wrapper">
          <nut-textarea :model-value="JSON.stringify(props.nodeInfo, null, 2)" :rows="15" readonly/>
        </div>
      </nut-tabpane>
    </nut-tabs>
    <img v-if="showQrCode && qrcode" :src="qrcode" alt="QR Code" class="qrcode" />
  </div>
  <!-- lock-scroll -->
  <nut-overlay
    v-model:visible="overlayVisible"
    :z-index="1001"
    @click="closePanel"
  ></nut-overlay>
</template>

<script lang="ts" setup>
  import { useQRCode } from '@vueuse/integrations/useQRCode';
  import { computed, ref } from 'vue';

  const emit = defineEmits(['close', 'retry']);
  const props = defineProps<{
    ipApi: IpApiData | null;
    ipApiStatus: NodeInfoIpApiStatus;
    nodeInfo: NodeInfo;
  }>();

  const overlayVisible = ref(true);
  const currentTab = ref(0);

  const hasIpApiData = computed(() => {
    return props.ipApiStatus === 'success' && Boolean(props.ipApi);
  });

  const qrcode = useQRCode(computed(() => {
    return hasIpApiData.value ? props.ipApi?.shareUrl || '' : '';
  }));

  const displayNodeInfo = computed(() => {
    const result = {};
    Object.keys(props.nodeInfo).forEach(key => {
      switch (key) {
        case 'id':
        case 'type':
        case 'name':
          break;
        default:
          result[key] = props.nodeInfo[key];
          break;
      }
    });
    return result;
  });

  const city = computed(() => {
    const info = props.ipApi?.info;
    if (!info) {
      return '';
    }

    return info.city === info.country
      ? info.city
      : info.country + ' - ' + info.city;
  });

  const showQrCode = computed(() => {
    return hasIpApiData.value && currentTab.value === 0;
  });

  const retryLoadIpApi = () => {
    emit('retry');
  };

  const closePanel = () => {
    emit('close');
  };
</script>

<style lang="scss" scoped>
  .type-tag {
    color: var(--primary-color) !important;
    border: 1px solid var(--primary-color) !important;
    background: transparent !important;
    margin-right: 4px;
  }

  .node-name {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .info-ul {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    li:first-child {
      margin-bottom: 20px;
    }

    li:not(:first-child) {
      margin-bottom: 8px;
      color: var(--comment-text-color);
    }
  }

  .ip-api-state {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    text-align: center;
  }

  .ip-api-loading {
    color: var(--comment-text-color);
  }

  .state-title {
    margin-top: 16px;
    color: var(--comment-text-color);
  }

  .ip-api-empty {
    padding: 16px 0 8px;
  }

  .ip-api-retry-btn {
    margin-top: 8px;
  }

  .input-wrapper {
    display: flex;
    align-items: center;

    >view.nut-textarea {
      background: transparent;
      padding: 8px 12px;
      // border-bottom: 1px solid;
      color: var(--second-text-color);
      border-color: var(--lowest-text-color);

      :deep(textarea) {
        color: inherit;
      }
    }
  }

  .qrcode {
    width: 92px;
    height: 92px;
    margin: 0 auto;
    opacity: 0.8;
  }
</style>
