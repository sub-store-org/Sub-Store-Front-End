<template>
  <Teleport to="#app" :disabled="!!url">
    <div
      class="compare-page-wrapper"
      :class="{ 'compare-page-wrapper-overlay': !url }"
      :style="{ height: url ? 'calc(100vh - 80px)' : '100vh' }"
    >
      <header class="compare-page-header" :class="{ 'preview-popup-header': !url }">
        <template v-if="url">
          <h1>
            <span class="title" @click="copyUrl"><font-awesome-icon class="copy" icon="fa-solid fa-clone" @click="copyUrl" /><span class="titleText">点击复制, 在外部资源中使用:</span></span>
            <span class="displayName">
              <a class="url" :href="url" target="_blank">{{ url }}</a>
            </span>
          </h1>
        </template>
        <template v-else>
          <div class="btn-groups preview-leading">
            <button type="button" class="btn close" @click="clickClose">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
            <button v-if="showRefresh" type="button" class="btn refresh" @click="emit('refresh')">
              <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
            </button>
          </div>
          <h1 class="preview-popup-title">{{ $t(`comparePage.title`) }}</h1>
        </template>
      </header>
      <cmView :isReadOnly="false" id="filePreview" />
      <!-- <div class="compare-page-body">
        <div class="block-wrapper">
          <div class="input-wrapper">
            <nut-textarea
              v-model="processedData"
              :rows="23"
              autosize
              placeholder=" "
              readonly
            /> 
          </div>
        </div>
      </div> -->
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { useSubsApi } from "@/api/subs";
import { useSubsStore } from "@/store/subs";
import { Toast } from "@nutui/nutui";
import { computed, ref, toRaw, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useClipboard } from "@vueuse/core";
import useV3Clipboard from "vue-clipboard3";
import { useAppNotifyStore } from "@/store/appNotify";
import cmView from "@/views/editCode/cmView.vue";
import { useCodeStore } from "@/store/codeStore";
import { useRoute } from 'vue-router';

const cmStore = useCodeStore();
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();

const { t } = useI18n();
const subsStore = useSubsStore();

const route = useRoute();
const { url } = route.query as { url: string };

const processedData = ref('')

watchEffect(async () => {
  if (url) {
    try {
      cmStore.setEditCode('filePreview', 'Loading...')
      const response = await axios.get(url as string, {
        responseType: 'text',
        transformResponse: [(data) => data],
      })
      console.log(typeof response.data)
      processedData.value = response.data
      cmStore.setEditCode('filePreview', processedData.value || '')
    } catch (error) {
      let data = error.response?.data
      if (data) {
        try {
          data = JSON.stringify(JSON.parse(error.response?.data), null, 2)
        } catch (e) {
          
        }
      }
      console.error('Error fetching URL:', error, data)
      cmStore.setEditCode('filePreview', `Error: ${
      error.response ? `${error.response.status} ${error.response.statusText}\n\n${data}` : error.message
      }`)
      showNotify({ title: `加载失败: ${error.message}` })
    }
  }
  if (route.query.name) {
    document.title = `${route.query.name} - Sub Store`
  }
})

const props = defineProps<{
  previewData: any;
  name: string;
  showRefresh?: boolean;
}>(); 

const showRefresh = computed(() => props.showRefresh !== false);

const emit = defineEmits(["closePreview", "refresh"]);

const isOriginalVisible = ref(true);
const isProcessedVisible = ref(true);

const displayName = computed(() => {
  if(route.query.name) return route.query.name
  const sub = subsStore.getOneFile(props.name);
  return sub?.displayName || sub?.["display-name"] || props.name;
});

watch(() => props.previewData?.processed, (val) => {
  if (!url && val != null) {
    cmStore.setEditCode('filePreview', val)
  }
}, { immediate: true });

 
const clickClose = () => {
  emit("closePreview");
};
const copyUrl = async () => {
  if (isSupported) {
    await copy(url);
  } else {
    await copyFallback(url);
  }
  showNotify({ title: `已复制链接: ${url}` });
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
  top: 114px;
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
  width: 100%;
  min-width: 0;

  &::before {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 10px;
    background: var(--primary-color);
    flex-shrink: 0;
  }
}

.indicator {
  margin-right: 24px;
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
    top: 56px;
    background: var(--background-color);
  }

  .compare-des {
    padding: 6px var(--safe-area-side);
    z-index: 8;
    display: flex;
    position: sticky;
    top: 84px;
    background: var(--background-color);
    color: var(--comment-text-color);
  }
}

.compare-page-body {
  font-size: 12px;
  background: inherit;
  color: var(--comment-text-color);
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
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    cursor: pointer;
    min-width: 0;

    .titleText {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .displayName {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
    flex: 1;
    .displayNameText,
    .url {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .displayNameText,
    .url {
      display: block;
    }
    > svg {
      flex-shrink: 0;
    }
    .copy {
      cursor: pointer;
      font-size: 16px;
      flex-shrink: 0;
    }
    .url {
      text-decoration: underline;
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

  button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 20px;
    padding: 8px;
    color: var(--lowest-text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    &.refresh {
      font-size: 18px;
    }
  }
  .btn-groups {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 10px;
  }
}

.compare-page-header .preview-leading {
  gap: 0;
  justify-content: flex-start;

  button {
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
  // top: 0;
  // left: 0;
  // position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--background-color);
  .cmviewRef {
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    .compare-page-header,
    .compare-page-body,
    .cmviewRef {
      width: 85%;
      max-width: 800px;
    }
  }
  
  @media screen and (min-width: 900px) {
    .compare-page-header,
    .compare-page-body,
    .cmviewRef {
      width: 80%;
      max-width: 900px;
    }
  }
  
  @media screen and (min-width: 1200px) {
    .compare-page-header,
    .compare-page-body,
    .cmviewRef {
      width: 75%;
      max-width: 1000px;
    }
  }
}

.compare-page-wrapper-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
}

.divider,
.divider::before,
.divider::after {
  color: var(--lowest-text-color);
  border-color: var(--lowest-text-color);
}
.input-wrapper {
  display: flex;
  align-items: center;

  > view.nut-textarea {
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
</style>
