<template>
  <div class="tab-panel-wrapper">
    <nut-tabs v-model="currentTab" type="smile" class="auto-tab-panel">
      <nut-tabpane :title="$t('comparePage.nodeInfo.node.title')">
        <ul class="info-ul">
          <li>
            <strong class="node-name">
              <nut-tag class="type-tag">{{ nodeInfo.type }} </nut-tag
              >{{ nodeInfo.name }}</strong
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
        <ul class="info-ul">
          <li>
            <strong class="node-name">{{ nodeInfo.name }}</strong>
          </li>
          <li>IP: {{ ipApi.info.query }}</li>
          <li>Region : {{ city }}</li>
          <li>ISP : {{ ipApi.info.isp }}</li>
          <li>Org: {{ ipApi.info.org }}</li>
          <li>Timezone : {{ ipApi.info.timezone }}</li>
          <li>
            Location :
            {{ 'lon ' + ipApi.info.lon + ' - lat ' + ipApi.info.lat }}
          </li>
        </ul>
      </nut-tabpane>
    </nut-tabs>
    <img :src="qrcode" alt="QR Code" class="qrcode" />
  </div>
  <nut-overlay
    v-model:visible="overlayVisible"
    :z-index="1001"
    lock-scroll
    @click="closePanel"
  ></nut-overlay>
</template>

<script lang="ts" setup>
  import { useQRCode } from '@vueuse/integrations/useQRCode';
  import { computed, ref } from 'vue';

  const emit = defineEmits(['close']);
  const { ipApi, nodeInfo } = defineProps<{
    ipApi: IpApiData;
    nodeInfo: NodeInfo;
  }>();

  const overlayVisible = ref(true);
  const currentTab = ref(0);

  const qrcode = useQRCode(ipApi.shareUrl);
  const info = ipApi.info;

  const displayNodeInfo = computed(() => {
    const result = {};
    Object.keys(nodeInfo).forEach(key => {
      switch (key) {
        case 'id':
        case 'type':
        case 'name':
          break;
        default:
          result[key] = nodeInfo[key];
          break;
      }
    });
    return result;
  });

  const city = computed(() => {
    return ipApi.info.city === ipApi.info.country
      ? info.city
      : info.country + ' - ' + info.city;
  });
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

  .qrcode {
    width: 92px;
    height: 92px;
    margin: 0 auto;
    opacity: 0.8;
  }
</style>
