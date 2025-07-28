<template>
  <Teleport to="#app">
    <div class="compare-page-wrapper">
      <header class="compare-page-header">
        <h1>
          <font-awesome-icon icon="fa-solid fa-eye" />
          <span class="title">{{ $t(`comparePage.title`) }}</span>
          <span class="displayName">
            <font-awesome-icon icon="fa-solid fa-angles-right" />
            {{ displayName }}
          </span>
        </h1>
        <button @click="clickClose">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </button>
      </header>
      <div class="compare-page-body">
        <div class="block-wrapper">
          <!--块标题-->
          <div class="sticky-title-wrapperse compare-title">
            <p>{{ $t(`comparePage.remain.title`) }}({{ remainDesc }}) <small v-if="originalData.length > 0" @click="goToFilterRef">{{ $t(`comparePage.filter.title`) }}({{ filterDesc }})</small></p>
          </div>

          <!--指示器说明-->
          <div class="compare-des">
            <span
              @click="toggleProcessedVisible"
              class="processed-item indicator"
              >{{ $t(`comparePage.remain.afterIndicator`) }}</span
            >
            <span
              @click="toggleOriginalVisible"
              class="original-item indicator"
              >{{ $t(`comparePage.remain.beforeIndicator`) }}</span
            >
          </div>

          <!--表格标题-->
          <ul class="compare-table-head">
            <li v-for="title in titleList" :key="title">
              {{ $t(`comparePage.tableHead.${title}`) }}
            </li>
          </ul>

          <!--表格内容-->
          <table class="compare-table-body">
            <template v-for="[processed = {}, original = {}] in data" :key="processed.id">
              <tr
                v-if="isProcessedVisible"
                class="compare-table-row processed-tr"
                @click="openNodeInfoPanel(processed)"
              >
                <td class="processed-item">
                  <div class="name-wrapper">
                    <div>
                      <nut-tag class="type-tag">{{ processed.type }}</nut-tag
                      >{{ processed.name }}
                    </div>
                    <div>{{ processed.server || processed.addresses?.join(',') }}:{{ processed.port || processed["local-port"] }}</div>
                  </div>
                </td>
                <td>
                  <span :class="processed.udp ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="processed.udp"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span :class="(processed.tfo || processed['fast-open']) ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="(processed.tfo || processed['fast-open'])"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span
                    :class="
                      processed['skip-cert-verify'] ? 'item-true' : 'item-false'
                    "
                    ><font-awesome-icon
                      v-if="processed['skip-cert-verify']"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
                <td>
                  <span :class="processed.aead ? 'item-true' : 'item-false'"
                    ><font-awesome-icon
                      v-if="processed.aead"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
              </tr>
              <tr
                v-if="isOriginalVisible"
                class="compare-table-row original-tr"
                @click="openNodeInfoPanel(original)"
              >
                <td class="original-item">
                  <div class="name-wrapper">
                    <div>
                      {{ original.name }}
                    </div>
                    <div>{{ original.server || original.addresses?.join(',') }}:{{ original.port || original["local-port"] }}</div>
                  </div>
                </td>
                <td>
                  <span :class="original.udp ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="original.udp"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span :class="(original.tfo || original['fast-open']) ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="(original.tfo || original['fast-open'])"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span
                    :class="
                      original['skip-cert-verify'] ? 'item-true' : 'item-false'
                    "
                    ><font-awesome-icon
                      v-if="original['skip-cert-verify']"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
                <td>
                  <span :class="original.aead ? 'item-true' : 'item-false'"
                    ><font-awesome-icon
                      v-if="original.aead"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
              </tr>
            </template>
          </table>
        </div>

        <nut-divider
          v-if="originalData.length > 0"
          class="divider"
          dashed
          hairline
          :style="{
            padding: '0 16px',
          }"
          >{{ $t(`comparePage.divider`) }}
        </nut-divider>

        <div ref="filterRef" class="block-wrapper" v-if="originalData.length > 0">
          <!--块标题-->
          <div class="sticky-title-wrapperse compare-title">
            <p>{{ $t(`comparePage.filter.title`) }}({{ filterDesc }})</p>
          </div>

          <!--表格标题-->
          <ul class="compare-table-head filter-table-head">
            <li v-for="title in titleList" :key="title">
              {{ $t(`comparePage.tableHead.${title}`) }}
            </li>
          </ul>

          <!--表格内容-->
          <table class="compare-table-body">
            <template v-for="node in originalData" :key="node.id">
              <tr
                class="compare-table-row original-tr"
                @click="openNodeInfoPanel(node)"
              >
                <td class="original-item">
                  <div class="name-wrapper">
                    <div>
                      <nut-tag class="type-tag">{{ node.type }} </nut-tag
                      >{{ node.name }}
                    </div>
                    <div>{{ node.server || node.addresses?.join(',') }}:{{ node.port || node["local-port"] }}</div>
                  </div>
                </td>
                <td>
                  <span :class="node.udp ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="node.udp"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span :class="node.tfo ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="node.tfo"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span
                    :class="
                      node['skip-cert-verify'] ? 'item-true' : 'item-false'
                    "
                    ><font-awesome-icon
                      v-if="node['skip-cert-verify']"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
                <td>
                  <span :class="node.aead ? 'item-true' : 'item-false'"
                    ><font-awesome-icon
                      v-if="node.aead"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
    </div>

    <NodeInfoPanel
      :ipApi="ipApi"
      :nodeInfo="nodeInfo"
      v-if="nodeInfoIsVisible"
      @close="closeNodeInfoPanel"
    />
  </Teleport>
</template>

<script lang="ts" setup>
  import { useSubsApi } from '@/api/subs';
  import NodeInfoPanel from '@/components/NodeInfoPanel.vue';
  import { useSubsStore } from '@/store/subs';
  import { Toast } from '@nutui/nutui';
  import { computed, ref, toRaw } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const subsStore = useSubsStore();
  const { compareData, name } = defineProps<{
    compareData: any;
    name: string;
  }>();

  const titleList = ['name', 'udp', 'tfo', 'skip-cert-verify', 'aead'];

  const emit = defineEmits(['closeCompare']);

  const filterRef = ref(null);
  const isOriginalVisible = ref(true);
  const isProcessedVisible = ref(true);

  const nodeInfoIsVisible = ref(false);
  const ipApi = ref<IpApiData>(null);
  const nodeInfo = ref<NodeInfo>(null);

  const displayName = computed(() => {
    const sub = subsStore.getOneSub(name) || subsStore.getOneCollection(name);
    return sub?.displayName || sub?.['display-name'] || name;
  });

  const toggleProcessedVisible = () => {
    if (isProcessedVisible.value && !isOriginalVisible.value) {
      isOriginalVisible.value = true;
    } else if (isProcessedVisible.value && isOriginalVisible.value) {
      isOriginalVisible.value = false;
    } else if (!isProcessedVisible.value && isOriginalVisible.value) {
      isProcessedVisible.value = true;
      isOriginalVisible.value = false;
    }
  };

  const toggleOriginalVisible = () => {
    if (!isProcessedVisible.value && isOriginalVisible.value) {
      isProcessedVisible.value = true;
    } else if (isProcessedVisible.value && isOriginalVisible.value) {
      isProcessedVisible.value = false;
    } else if (isProcessedVisible.value && !isOriginalVisible.value) {
      isProcessedVisible.value = false;
      isOriginalVisible.value = true;
    }
  };

  const originalData = compareData.original;
  const processedData = compareData.processed;
  const data = computed(() => {
    const result = [];
    for (let i = 0; i < processedData.length; i++) {
      const item = [];
      item.push(processedData[i]);
      const id = processedData[i].id;
      const originalIndex = originalData.findIndex(item => item.id === id);
      item.push(originalData[originalIndex]);
      result.push(item);
      originalData.splice(originalIndex, 1);
    }
    return result;
  });

  const remainDesc = computed(() => {
    const remainSize = processedData?.length || 0
    const filterSize = originalData?.length || 0
    const totalSize = remainSize + filterSize
    if (!remainSize) {
      return 0
    }
    return filterSize > 0 ? `${remainSize}/${totalSize}` : remainSize
  });
  const filterDesc = computed(() => {
    const remainSize = processedData?.length || 0
    const filterSize = originalData?.length || 0
    const totalSize = remainSize + filterSize
    if (!filterSize) {
      return 0
    }
    return remainSize > 0 ? `${filterSize}/${totalSize}` : filterSize
  });

  const goToFilterRef = () => {
    filterRef.value?.scrollIntoView()
  }

  const clickClose = () => {
    emit('closeCompare');
  };

  const closeNodeInfoPanel = () => {
    nodeInfoIsVisible.value = false;
  };

  const openNodeInfoPanel = async val => {
    Toast.loading(t('comparePage.nodeInfo.loading'), {
      cover: true,
      id: 'nodeInfoLoading',
    });
    const nodeData = toRaw(val);
    const res = await useSubsApi().getSubInfo(nodeData);
    if (res?.data?.status === 'success') {
      ipApi.value = res.data.data;
      nodeInfo.value = nodeData;
      nodeInfoIsVisible.value = true;
    } else {
      Toast.fail(t('comparePage.nodeInfo.loadFailed'));
    }
    Toast.hide('nodeInfoLoading');
  };
</script>

<style lang="scss" scoped>
  .type-tag {
    padding: 1px 4px;
    line-height: 1;
    margin-right: 3px;
    color: var(--compare-tag-text-color);
    background: var(--compare-tag-background-color);
  }

  .item-true {
    color: var(--primary-color);
  }

  .item-false {
    width: 8px;
    height: 1px;
    border-radius: 2px;
    background: var(--lowest-text-color);
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
  }

  .compare-table-body {
    width: 100%;

    .processed-tr {
      padding-top: 20px;
      padding-bottom: 0;
    }

    .original-tr {
      padding-top: 10px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--divider-color);
    }
  }

  .compare-table-row {
    padding: 0 var(--safe-area-side);
    width: 100%;
    cursor: pointer;
  }

  .compare-table-head {
    padding: 10px var(--safe-area-side);
  }

  .compare-table-head,
  .compare-table-row {
    margin: 0;
    display: grid;
    grid-template-columns: 46% 1fr 1fr 1fr 1fr;

    li,
    td {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    li:first-child,
    td:first-child {
      justify-content: start;
    }
  }

  .compare-table-head {
    position: sticky;
    z-index: 7;
    top: 118px;
    border-bottom: 1px solid var(--divider-color);
    font-weight: bold;
    background: var(--background-color);
    color: var(--comment-text-color);

    &.filter-table-head {
      top: 84px;
    }
  }

  .processed-item,
  .original-item {
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 10px;
      background: var(--primary-color);
    }
  }

  .indicator {
    margin-right: 24px;
  }

  .processed-item::before {
    background: var(--third-color);
    flex-shrink: 0;
  }

  .block-wrapper {
    position: relative;
    background: var(--compare-item-background-color);

    .compare-title {
      padding: 0 var(--safe-area-side);
      z-index: 9;
      margin-top: 0;
      top: 56px;
      background: var(--background-color);
      small {
        cursor: pointer;
        text-decoration: underline;
      }
    }

    .compare-des {
      padding: 6px var(--safe-area-side);
      z-index: 8;
      display: flex;
      position: sticky;
      top: 88px;
      background: var(--background-color);
      color: var(--comment-text-color);
    }
  }

  .compare-page-body {
    font-size: 12px;
    background: inherit;
    color: var(--comment-text-color);
    width: 100%;
    flex: 1;
  }

  .compare-page-header {
    padding: var(--safe-area-side);
    position: sticky;
    top: 0;
    z-index: 19;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    border-bottom: 1px solid;
    color: var(--primary-text-color);
    background: var(--background-color);
    border-color: var(--divider-color);
    width: 100%;
    .title {
      white-space: nowrap;
    }
    .displayName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 40vw;
      
      @media screen and (min-width: 768px) {
        max-width: 300px;
      }
      
      @media screen and (min-width: 1024px) {
        max-width: 400px;
      }
    }
    h1 {
      display: flex;
      align-items: center;
      font-size: 20px;
      line-height: 1;
      font-weight: 500;

      > svg {
        margin-right: 6px;
        width: 20px;
        height: 20px;
      }

      span {
        margin-left: 8px;
        font-size: 14px;
        color: var(--second-text-color);

        > svg {
          margin-right: 4px;
          color: var(--comment-text-color);
        }
      }
    }

    button {
      cursor: pointer;
      background: none;
      border: none;
      font-size: 20px;
      padding: 8px;
      color: var(--lowest-text-color);
    }
  }

  .compare-page-wrapper {
    width: 100%;
    height: 100vh;
    z-index: 1000;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: var(--background-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    
    @media screen and (min-width: 768px) {
      .compare-page-header,
      .compare-page-body {
        width: 85%;
        max-width: 800px;
      }
    }
    
    @media screen and (min-width: 900px) {
      .compare-page-header,
      .compare-page-body {
        width: 80%;
        max-width: 900px;
      }
    }
    
    @media screen and (min-width: 1200px) {
      .compare-page-header,
      .compare-page-body {
        width: 75%;
        max-width: 1000px;
      }
    }
  }

  .divider,
  .divider::before,
  .divider::after {
    color: var(--lowest-text-color);
    border-color: var(--lowest-text-color);
  }
</style>
