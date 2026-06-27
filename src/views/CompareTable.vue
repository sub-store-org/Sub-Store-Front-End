<template>
  <Teleport to="#app">
    <div class="compare-page-wrapper">
      <header class="compare-page-header preview-popup-header">
        <div class="btn-groups preview-leading">
          <button type="button" class="btn close" @click="clickClose">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
          <button v-if="showRefresh" type="button" class="btn refresh" @click="emit('refresh')">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
          </button>
        </div>
        <h1 class="preview-popup-title">{{ $t(`comparePage.title`) }}</h1>
        <div class="btn-groups preview-trailing">
          <button
            type="button"
            class="btn logs"
            :aria-label="$t('logsPage.floating.open')"
            :title="$t('logsPage.floating.open')"
            @click.stop="openLogsOverlay"
          >
            <font-awesome-icon icon="fa-solid fa-file-lines" />
          </button>
        </div>
      </header>
      <div class="compare-page-body">
        <div class="block-wrapper">
          <!--块标题-->
          <div class="sticky-title-wrapperse compare-title">
            <p>{{ $t(`comparePage.remain.title`) }}({{ remainDesc }}) <small v-if="filteredOriginalData.length > 0" @click="goToFilterRef">{{ $t(`comparePage.filter.title`) }}({{ filterDesc }})</small></p>
          </div>

          <!--指示器说明-->
          <div class="compare-des">      
            <span class="indicator-group">
              <button
                type="button"
                :aria-disabled="!hasOriginalData"
                :aria-pressed="isOriginalVisible"
                :title="
                  !hasOriginalData
                    ? $t('comparePage.remain.indicatorDisabledTips', {
                        side: $t('comparePage.remain.beforeIndicator'),
                      })
                    : ''
                "
                :class="[
                  'original-item',
                  'indicator',
                  !hasOriginalData && 'is-disabled',
                  isOriginalVisible ? 'is-active' : 'is-inactive',
                ]"
                @click="toggleOriginalVisible"
              >
                {{ $t(`comparePage.remain.beforeIndicator`) }}
              </button>
              <button
                type="button"
                :aria-disabled="!hasOriginalData"
                :class="['node-names-action', !hasOriginalData && 'is-disabled']"
                :title="
                  !hasOriginalData
                    ? $t('comparePage.remain.indicatorDisabledTips', {
                        side: $t('comparePage.remain.beforeIndicator'),
                      })
                    : $t('comparePage.nodeNames.entry')
                "
                @click.stop="openNodeNamesDialog('before')"
              >
                <font-awesome-icon icon="fa-solid fa-clone" />
                {{ $t('comparePage.nodeNames.entry') }}
              </button>
            </span>

            <span class="indicator-group">
              <button
                type="button"
                :aria-disabled="!hasProcessedData"
                :aria-pressed="isProcessedVisible"
                :title="
                  !hasProcessedData
                    ? $t('comparePage.remain.indicatorDisabledTips', {
                        side: $t('comparePage.remain.afterIndicator'),
                      })
                    : ''
                "
                :class="[
                  'processed-item',
                  'indicator',
                  !hasProcessedData && 'is-disabled',
                  isProcessedVisible ? 'is-active' : 'is-inactive',
                ]"
                @click="toggleProcessedVisible"
              >
                {{ $t(`comparePage.remain.afterIndicator`) }}
              </button>
              <button
                type="button"
                :aria-disabled="!hasProcessedData"
                :class="['node-names-action', !hasProcessedData && 'is-disabled']"
                :title="
                  !hasProcessedData
                    ? $t('comparePage.remain.indicatorDisabledTips', {
                        side: $t('comparePage.remain.afterIndicator'),
                      })
                    : $t('comparePage.nodeNames.entry')
                "
                @click.stop="openNodeNamesDialog('after')"
              >
                <font-awesome-icon icon="fa-solid fa-clone" />
                {{ $t('comparePage.nodeNames.entry') }}
              </button>
            </span>
          </div>

          <!--表格标题-->
          <ul class="compare-table-head">
            <li v-for="title in titleList" :key="title">
              {{ $t(`comparePage.tableHead.${title}`) }}
            </li>
          </ul>

          <!--表格内容-->
          <table
            class="compare-table-body"
            :class="{
              'compare-table-body--paired':
                isProcessedVisible && isOriginalVisible,
            }"
          >
            <template v-for="[processed, original] in data" :key="processed.id">
              <tr
                v-if="isProcessedVisible"
                class="compare-table-row processed-tr"
                :class="{ 'processed-tr--unpaired': !hasNodeDisplayInfo(original) }"
                @click="openNodeInfoPanel(processed)"
              >
                <td class="processed-item">
                  <div class="name-wrapper">
                    <div>
                      <nut-tag class="type-tag">{{ processed.type }}</nut-tag
                      >{{ processed.name }}
                    </div>
                    <div v-if="formatNodeEndpoint(processed)">{{ formatNodeEndpoint(processed) }}</div>
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
                v-if="isOriginalVisible && hasNodeDisplayInfo(original)"
                class="compare-table-row original-tr"
                @click="openNodeInfoPanel(original)"
              >
                <td class="original-item">
                  <div class="name-wrapper">
                    <div>
                      {{ original.name }}
                    </div>
                    <div v-if="formatNodeEndpoint(original)">{{ formatNodeEndpoint(original) }}</div>
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
          v-if="filteredOriginalData.length > 0"
          class="divider"
          dashed
          hairline
          :style="{
            padding: '0 16px',
          }"
          >{{ $t(`comparePage.divider`) }}
        </nut-divider>

        <div ref="filterRef" class="block-wrapper" v-if="filteredOriginalData.length > 0">
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
            <template v-for="node in filteredOriginalData" :key="node.id">
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
                    <div v-if="formatNodeEndpoint(node)">{{ formatNodeEndpoint(node) }}</div>
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
      :key="nodeInfoPanelKey"
      :ipApi="ipApi"
      :ip-api-status="ipApiStatus"
      :nodeInfo="nodeInfo"
      v-if="nodeInfoIsVisible"
      @close="closeNodeInfoPanel"
      @retry="retryLoadIpApi"
    />
    <PreviewNodeNamesDialog
      v-if="nodeNamesDialogVisible"
      :side="nodeNamesDialogSide"
      :node-infos="activeNodeInfos"
      @close="closeNodeNamesDialog"
    />
  </Teleport>
</template>

<script lang="ts" setup>
  import { useSubsApi } from '@/api/subs';
  import NodeInfoPanel from '@/components/NodeInfoPanel.vue';
  import PreviewNodeNamesDialog from '@/components/PreviewNodeNamesDialog.vue';
  import { useLogsOverlayStore } from '@/store/logsOverlay';
  import { useSubsStore } from '@/store/subs';
  import { extractPreviewNodeInfos, PreviewNodeNameSide } from '@/utils/previewNodeNames';
  import { computed, ref, toRaw, watch } from 'vue';

  const { getSubInfo } = useSubsApi();
  const logsOverlayStore = useLogsOverlayStore();
  const subsStore = useSubsStore();
  const props = defineProps<{
    compareData: any;
    name: string;
    showRefresh?: boolean;
  }>();

  const showRefresh = computed(() => props.showRefresh !== false);

  const titleList = ['name', 'udp', 'tfo', 'skip-cert-verify', 'aead'];

  const emit = defineEmits(['closeCompare', 'refresh']);

  const filterRef = ref(null);
  const isOriginalVisible = ref(false);
  const isProcessedVisible = ref(true);

  const nodeInfoIsVisible = ref(false);
  const nodeInfoPanelKey = ref(0);
  const ipApi = ref<IpApiData>(null);
  const ipApiStatus = ref<NodeInfoIpApiStatus>('idle');
  const nodeInfo = ref<NodeInfo>(null);
  const currentIpApiRequestId = ref(0);
  const nodeNamesDialogVisible = ref(false);
  const nodeNamesDialogSide = ref<PreviewNodeNameSide>('after');

  const displayName = computed(() => {
    const sub = subsStore.getOneSub(props.name) || subsStore.getOneCollection(props.name);
    return sub?.displayName || sub?.['display-name'] || props.name;
  });

  const toggleVisibility = (
    currentVisible: { value: boolean },
    otherVisible: { value: boolean },
    hasData: boolean,
  ) => {
    if (currentVisible.value) {
      if (!otherVisible.value) {
        return;
      }

      currentVisible.value = false;
      return;
    }

    if (!hasData) {
      return;
    }

    currentVisible.value = true;
  };

  const toggleProcessedVisible = () => {
    toggleVisibility(
      isProcessedVisible,
      isOriginalVisible,
      processedData.value.length > 0,
    );
  };

  const toggleOriginalVisible = () => {
    toggleVisibility(
      isOriginalVisible,
      isProcessedVisible,
      originalData.value.length > 0,
    );
  };

  const processedData = computed(() => props.compareData?.processed || []);
  const originalData = computed(() => props.compareData?.original || []);
  const hasProcessedData = computed(() => processedData.value.length > 0);
  const hasOriginalData = computed(() => originalData.value.length > 0);

  watch(
    () => props.compareData,
    () => {
      isOriginalVisible.value = hasOriginalData.value;
      isProcessedVisible.value = hasProcessedData.value;
    },
    { immediate: true },
  );

  const processedNodeInfos = computed(() => extractPreviewNodeInfos(processedData.value));
  const originalNodeInfos = computed(() => extractPreviewNodeInfos(originalData.value));
  const hasNodeNamesData = (side: PreviewNodeNameSide) => {
    return side === 'after' ? hasProcessedData.value : hasOriginalData.value;
  };
  const activeNodeInfos = computed(() => {
    return nodeNamesDialogSide.value === 'after'
      ? processedNodeInfos.value
      : originalNodeInfos.value;
  });
  const data = computed(() => {
    const original = originalData.value;
    const result = [];
    for (let i = 0; i < processedData.value.length; i++) {
      const item = [];
      item.push(processedData.value[i]);
      const id = processedData.value[i].id;
      const originalItem = original.find(item => item.id === id);
      item.push(originalItem);
      result.push(item);
    }
    return result;
  });

  const normalizeEndpointPart = (value: unknown) => {
    if (value == null) {
      return '';
    }

    if (Array.isArray(value)) {
      return value
        .map(item => normalizeEndpointPart(item))
        .filter(Boolean)
        .join(',');
    }

    return String(value).trim();
  };

  const formatNodeEndpoint = (node: Record<string, any> | null | undefined) => {
    const host = normalizeEndpointPart(node?.server)
      || normalizeEndpointPart(node?.addresses);
    const port = normalizeEndpointPart(node?.port ?? node?.['local-port']);

    if (host && port) {
      return `${host}:${port}`;
    }

    return host || port;
  };

  const hasNodeDisplayInfo = (node: Record<string, any> | null | undefined) => {
    return Boolean(node?.name || node?.type || formatNodeEndpoint(node));
  };

  // 被过滤掉的节点：original 中未被 processed 匹配到的
  const filteredOriginalData = computed(() => {
    const original = originalData.value;
    const processedIds = new Set(processedData.value.map(item => item.id));
    return original.filter(item => !processedIds.has(item.id));
  });

  const remainDesc = computed(() => {
    const remainSize = processedData.value?.length || 0
    const filterSize = filteredOriginalData.value?.length || 0
    const totalSize = remainSize + filterSize
    if (!remainSize) {
      return 0
    }
    return filterSize > 0 ? `${remainSize}/${totalSize}` : remainSize
  });
  const filterDesc = computed(() => {
    const remainSize = processedData.value?.length || 0
    const filterSize = filteredOriginalData.value?.length || 0
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

  const openLogsOverlay = () => {
    logsOverlayStore.open();
  };

  const openNodeNamesDialog = (side: PreviewNodeNameSide) => {
    if (!hasNodeNamesData(side)) {
      return;
    }

    nodeNamesDialogSide.value = side;
    nodeNamesDialogVisible.value = true;
  };

  const closeNodeNamesDialog = () => {
    nodeNamesDialogVisible.value = false;
  };

  const invalidateIpApiRequest = () => {
    currentIpApiRequestId.value += 1;
  };

  const resetIpApiState = (status: NodeInfoIpApiStatus = 'idle') => {
    ipApi.value = null;
    ipApiStatus.value = status;
  };

  const loadIpApi = async (nodeData: NodeInfo) => {
    invalidateIpApiRequest();
    const requestId = currentIpApiRequestId.value;
    resetIpApiState('loading');

    try {
      const res = await getSubInfo(nodeData);
      if (requestId !== currentIpApiRequestId.value || !nodeInfoIsVisible.value) {
        return;
      }

      if (res?.data?.status === 'success') {
        ipApi.value = res.data.data;
        ipApiStatus.value = 'success';
      } else {
        ipApiStatus.value = 'error';
      }
    } catch (error) {
      if (requestId !== currentIpApiRequestId.value || !nodeInfoIsVisible.value) {
        return;
      }

      ipApiStatus.value = 'error';
    }
  };

  const closeNodeInfoPanel = () => {
    invalidateIpApiRequest();
    nodeInfoIsVisible.value = false;
    nodeInfo.value = null;
    resetIpApiState();
  };

  const openNodeInfoPanel = (val: NodeInfo) => {
    const nodeData = toRaw(val);
    nodeInfo.value = nodeData;
    nodeInfoIsVisible.value = true;
    nodeInfoPanelKey.value += 1;
    void loadIpApi(nodeData);
  };

  const retryLoadIpApi = () => {
    if (!nodeInfo.value) {
      return;
    }

    void loadIpApi(toRaw(nodeInfo.value));
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
    flex: 1;
    width: 100%;
    min-width: 0;

    > div {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: break-all;
    }
  }

  .compare-table-body {
    width: 100%;

    .compare-table-row {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--divider-color);
    }

    &--paired {
      .processed-tr {
        padding-bottom: 0;
        border-bottom: none;
      }

      .processed-tr--unpaired {
        padding-bottom: 20px;
        border-bottom: 1px solid var(--divider-color);
      }

      .original-tr {
        padding-top: 10px;
      }
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
      min-width: 0;
    }

    li:first-child,
    td:first-child {
      justify-content: start;
    }
  }

  .compare-table-head {
    position: sticky;
    z-index: 7;
    top: calc(var(--compare-header-offset) + 62px);
    border-bottom: 1px solid var(--divider-color);
    font-weight: bold;
    background: var(--background-color);
    color: var(--comment-text-color);

    &.filter-table-head {
      top: calc(var(--compare-header-offset) + 28px);
    }
  }

  .processed-item,
  .original-item {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;

    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 10px;
      background: var(--primary-color);
      flex-shrink: 0;
    }
  }

  .indicator-group {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-right: 24px;
    min-width: 0;

    .processed-item,
    .original-item {
      width: auto;
    }
  }

  .indicator {
    display: inline-flex;
    align-items: center;
    width: auto;
    padding: 4px 8px;
    border: none;
    border-radius: var(--item-card-radios);
    background: transparent;
    color: var(--comment-text-color);
    font: inherit;
    line-height: 1;
    cursor: pointer;
    flex-shrink: 0;

    &.is-active {
      background: var(--compare-item-background-color);
      box-shadow: inset 0 0 0 1px var(--divider-color);
    }

    &.is-inactive {
      opacity: 0.45;
    }

    &.is-disabled {
      opacity: 0.25;
      cursor: not-allowed;
      box-shadow: none;
    }

    &.original-item.is-active {
      color: var(--primary-color);
    }

    &.processed-item.is-active {
      color: var(--third-color);
    }

    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  }

  .node-names-action {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    padding: 2px 0;
    border: none;
    background: none;
    color: var(--comment-text-color);
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;

    &.is-disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    :deep(svg) {
      width: 12px;
      height: 12px;
      color: var(--icon-nav-bar-right);
      flex-shrink: 0;
    }
  }

  .processed-item::before {
    background: var(--third-color);
  }

  .block-wrapper {
    position: relative;
    background: var(--compare-item-background-color);

    .compare-title {
      padding: 0 var(--safe-area-side);
      z-index: 9;
      margin-top: 0;
      top: var(--compare-header-offset);
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
      flex-wrap: wrap;
      gap: 8px 0;
      position: sticky;
      top: calc(var(--compare-header-offset) + 32px);
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
    padding: env(safe-area-inset-top) var(--safe-area-side) 0;
    position: sticky;
    top: 0;
    z-index: 19;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
    min-height: var(--compare-header-offset);
    box-sizing: border-box;
    border-bottom: 1px solid;
    color: var(--primary-text-color);
    background: var(--background-color);
    border-color: var(--divider-color);
    width: 100%;

    &.preview-popup-header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 0;
    }

    .title {
      white-space: nowrap;
      flex-shrink: 0;
    }
    .displayName {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
      overflow: hidden;
      flex: 0 1 40vw;
      
      @media screen and (min-width: 768px) {
        flex-basis: 300px;
      }
      
      @media screen and (min-width: 1024px) {
        flex-basis: 400px;
      }

      > svg {
        flex-shrink: 0;
      }

      .displayNameText {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
      margin: 0;
      font-size: 20px;
      line-height: 1;
      font-weight: 500;

      > svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      span {
        font-size: 14px;
        color: var(--second-text-color);

        > svg {
          color: var(--comment-text-color);
        }
      }
    }
    .btn-groups {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 10px;
    }
    button {
      cursor: pointer;
      background: none;
      border: none;
      font-size: 20px;
      padding: 8px;
      color: var(--lowest-text-color);
      margin: 0;
      &.refresh {
        font-size: 18px;
      }
    }
  }

  .compare-page-header .preview-leading {
    gap: 0;
    justify-content: flex-start;
  }

  .compare-page-header .preview-trailing {
    grid-column: 3;
    justify-self: end;
    gap: 0;
    justify-content: flex-end;
  }

  .compare-page-header .preview-leading button,
  .compare-page-header .preview-trailing button {
    width: 32px;
    height: 32px;
    padding: 0;
    color: var(--icon-nav-bar-right);
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      width: 14px;
      height: 14px;
      font-size: 14px;
    }
  }

  .compare-page-header .preview-popup-title {
    grid-column: 2;
    justify-self: center;
    display: block;
    flex: none;
    margin: 0;
    min-width: 20px;
    font-size: 18px;
    line-height: 1;
    font-weight: 600;
    color: var(--primary-text-color);
    text-align: center;
    overflow: hidden;
  }

  .compare-page-wrapper {
    --compare-header-height: 56px;
    --compare-header-offset: calc(var(--compare-header-height) + env(safe-area-inset-top));
    position: fixed;
    inset: 0;
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
