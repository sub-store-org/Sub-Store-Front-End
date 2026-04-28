<!-- 图标弹窗 -->
<template>
  <nut-popup
    v-model:visible="isVisible"
    pop-class="icon-popup"
    position="bottom"
    :style="{
      height: `95%`,
      padding: '20px 12px 0 12px',
      backgroundColor: 'var(--background-color)',
    }"
    :lock-scroll="true"
    :safe-area-inset-bottom="true"
    close-icon="close-little"
    z-index="11000"
    closeable
    round
    @close="close"
  >
    <div class="icon-popup-content">
      <div class="icon-popup-top">
        <div class="icon-popup-title">
          {{ $t(`iconCollectionPage.iconCollection`) }}
        </div>
        <div class="icon-info-wrapper">
          <div class="icon-collection-name">
            <h1>{{ form.iconCollectionName }}</h1>
            <p>{{ form.iconCollectionDesc }}</p>
          </div>
          <div class="icon-collection-action">
            <div class="action-btn" @click="handleMoreIconCollection">
              <span>{{ $t(`iconCollectionPage.more`) }}</span>
              <nut-icon name="rect-right" size="12px"></nut-icon>
            </div>
            <div class="action-btn" @click="handleResetDefault">
              <span>{{ $t(`iconCollectionPage.resetDefaultIconCollection`) }}</span>
              <!-- <nut-icon name="rect-right" size="12px"></nut-icon> -->
            </div>
          </div>
        </div>
        <div class="switch-wrapper">
          <div class="switch-item">
            <nut-switch
              v-model="showCustomIconCollection"
              class="my-switch"
              size="mini"
            />
            <span class="label">
              {{ $t(`iconCollectionPage.useCustomIconCollection`) }}
            </span>
          </div>
        </div>
        <div class="icon-collection-search-wrapper">
          <div class="icon-collection-search-content">
            <nut-form>
              <nut-form-item>
                <nut-input
                  v-model="form.iconName"
                  :border="false"
                  text-align="left"
                  :placeholder="$t(`iconCollectionPage.iconNamePlaceholder`)"
                  type="text"
                  clearable
                  @clear="clearIconName"
                ></nut-input>
              </nut-form-item>
              <nut-form-item v-if="showCustomIconCollection">
                <nut-input
                  v-model="form.customIconCollectionUrl"
                  :border="false"
                  text-align="left"
                  :placeholder="$t(`iconCollectionPage.iconCollectionPlaceholder`)"
                  type="text"
                  clearable
                  right-icon="refresh"
                  @clear="clearCustomIconCollectionUrl"
                  @click-right-icon="handleAddCustomIconCollection"
                ></nut-input>
              </nut-form-item>
            </nut-form>
          </div>
        </div>
      </div>
      <div class="icon-list-section">
        <div v-if="fetchStatus === 'loading'" class="icon-state-wrapper">
          <div class="icon-state icon-state-loading">
            <nut-icon name="loading" size="24px" class="loading-icon"></nut-icon>
            <p class="state-title">{{ $t(`iconCollectionPage.loadingTitle`) }}</p>
            <p class="state-desc">{{ $t(`iconCollectionPage.loadingDesc`) }}</p>
          </div>
        </div>
        <div v-else-if="fetchStatus === 'error'" class="icon-state-wrapper">
          <div class="icon-state">
            <nut-empty image="error" class="icon-empty">
              <template #description>
                <h3>{{ $t(`iconCollectionPage.loadFailedTitle`) }}</h3>
                <p>{{ $t(`iconCollectionPage.loadFailedDesc`) }}</p>
              </template>
            </nut-empty>
            <nut-button
              icon="refresh"
              type="primary"
              class="icon-retry-btn"
              @click="refreshIcons"
            >
              {{ $t(`iconCollectionPage.retryBtn`) }}
            </nut-button>
          </div>
        </div>
        <div v-else-if="iconData.length" class="icon-list">
          <div
            v-for="(icon, index) in iconData"
            :key="index"
            class="icon-item"
            @click="handleIcon(icon)"
          >
            <nut-image
              :src="rewriteGithubUrl(icon.url)"
              fit="cover"
              lazy-load
              show-loading
            />
            <p>{{ icon.name }}</p>
          </div>
        </div>
        <div v-else class="icon-state-wrapper">
          <nut-empty image="empty">
            <template #description>
              <h3>{{ $t(`iconCollectionPage.emptyCollectionTitle`) }}</h3>
              <p>{{ $t(`iconCollectionPage.emptyCollectionDesc`) }}</p>
            </template>
          </nut-empty>
        </div>
      </div>
    </div>
    <DesktopPicker
      v-model="defaultIconCollectionValue"
      v-model:visible="showIconCollectionPicker"
      :columns="iconCollectionColumns"
      :title="$t(`iconCollectionPage.collectionPicker.title`)"
      :cancel-text="$t(`iconCollectionPage.collectionPicker.cancel`)"
      :ok-text="$t(`iconCollectionPage.collectionPicker.confirm`)"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    ></DesktopPicker>
  </nut-popup>
</template>

<script setup lang="ts">
import DesktopPicker from "@/components/DesktopPicker.vue";
import { Toast } from "@nutui/nutui";
import { useDebounceFn } from "@vueuse/core";
import axios from "axios";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { createGithubProxyUrlRewriter } from "@/utils/githubProxy";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:visible", "setIcon"]);
const { t } = useI18n();
const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const { customIconCollections, defaultIconCollections, defaultIconCollection } =
  storeToRefs(globalStore);
const { githubProxy, githubProxyRegex } = storeToRefs(settingsStore);

const form = reactive({
  iconName: "",
  iconCollectionName: "",
  iconCollectionUrl: "",
  customIconCollectionUrl: "",
  iconCollectionDesc: "",
  iconListKey: "",
  iconItemUrlKey: "",
});

type IconCollectionFetchStatus = "idle" | "loading" | "success" | "error";

const fetchStatus = ref<IconCollectionFetchStatus>("idle");
const iconList = ref([]);
const searchResult = ref([]);

// 创建一个单独的搜索函数
const performSearch = () => {
  if (!form.iconName.trim()) {
    searchResult.value = iconList.value;
  } else {
    const lowercaseTerm = form.iconName.toLowerCase();
    searchResult.value = iconList.value.filter((item) =>
      item.name.toLowerCase().includes(lowercaseTerm),
    );
  }
};

// 使用 useDebounceFn 创建防抖搜索函数
const debouncedSearch = useDebounceFn(performSearch, 500);

const iconData = computed(() => {
  return searchResult.value;
});
const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const rewriteGithubUrl = (url?: string | null) => {
  return githubUrlRewriter.value(url);
};

// 监听 form.iconName 变化以触发搜索
watch(
  () => form.iconName,
  (newValue) => {
    debouncedSearch();
  },
);

// 图标仓库列表
const iconCollectionColumns = computed(() => {
  // 合并自定义和默认图标仓库
  const mergedCollections = [
    ...customIconCollections.value,
    ...defaultIconCollections.value,
  ];
  return mergedCollections;
});

// 默认图标仓库
const defaultIconCollectionValue = ref([""]);

const showIconCollectionPicker = ref(false);

const showCustomIconCollection = ref(false);

const setDefaultIconCollection = (url: string) => {
  globalStore.setDefaultIconCollection(url);
};

const setCustomIconCollections = (collection: any[]) => {
  globalStore.setCustomIconCollections(collection);
};

const fetchIcons = async () => {
  try {
    Toast.loading(t(`globalNotify.refresh.loading`), {
      cover: true,
      id: "icon-collection",
    });
    fetchStatus.value = "loading";
    const { data } = await axios.get(rewriteGithubUrl(form.iconCollectionUrl));
    const collectionKey = form.iconListKey || "icons";
    const iconUrlKey = form.iconItemUrlKey || "url";
    iconList.value = data[collectionKey];
    form.iconCollectionName = data.name || "";
    form.iconCollectionDesc = data.description || "";
    const { name } = data;
    if (iconList.value && iconList.value.length > 0) {
      iconList.value = iconList.value.map((item) => {
        const iconItem = {
          name: item.name || "",
          url: item[iconUrlKey] || "",
        };
        return iconItem;
      });
      // 添加自定义图标仓库，
      const hasCollection = iconCollectionColumns.value.some(
        (item) => item.value === form.iconCollectionUrl,
      );
      console.log("hasCollection", hasCollection);
      if (!hasCollection) {
        const list = [
          {
            text: name,
            value: form.iconCollectionUrl,
          },
          ...customIconCollections.value,
        ];
        setCustomIconCollections(list);
        setDefaultIconCollection(form.iconCollectionUrl);
        defaultIconCollectionValue.value[0] = form.iconCollectionUrl;
      } else {
        setDefaultIconCollection(form.iconCollectionUrl);
        defaultIconCollectionValue.value[0] = form.iconCollectionUrl;
      }
    } else {
      iconList.value = [];
    }
    // 在加载完图标后初始化搜索结果
    searchResult.value = iconList.value;
    fetchStatus.value = "success";
    Toast.hide("icon-collection");
  } catch (error) {
    Toast.hide("icon-collection");
    iconList.value = [];
    searchResult.value = [];
    fetchStatus.value = "error";
    console.error("Error fetching icons:", error);
  }
};

const handleAddCustomIconCollection = () => {
  form.iconCollectionUrl = form.customIconCollectionUrl;
  refreshIcons();
};

const handleIcon = (icon) => {
  console.log("icon", icon);
  hide();
  emit("setIcon", icon);
};

const handleMoreIconCollection = () => {
  showPicker();
};

const showPicker = () => {
  showIconCollectionPicker.value = true;
};

const handleConfirm = ({ selectedValue, selectedOptions }) => {
  form.iconCollectionUrl = selectedValue[0];
  form.customIconCollectionUrl = "";
  showCustomIconCollection.value = false;
  setDefaultIconCollection(form.iconCollectionUrl);
  refreshIcons();
};

const handleCancel = () => {
  // showIconCollectionPicker.value = false;
  console.log("cancel");
};

const syncIconCollectionState = () => {
  if (defaultIconCollection.value) {
    form.iconCollectionUrl = defaultIconCollection.value;
    defaultIconCollectionValue.value[0] = defaultIconCollection.value;
  } else {
    form.iconCollectionUrl = defaultIconCollections.value[0].value;
    defaultIconCollectionValue.value[0] = defaultIconCollections.value[0].value;
  }
};

const clearIconName = () => {
  form.iconName = "";
};

const clearCustomIconCollectionUrl = () => {
  form.customIconCollectionUrl = "";
};

const refreshIcons = () => {
  if (!form.iconCollectionUrl) {
    return Toast.warn(t(`iconCollectionPage.errorIconCollectionUrlTips`));
  }
  if (form.iconCollectionUrl && !/^(http|https)/.test(form.iconCollectionUrl)) {
    return Toast.warn(t(`iconCollectionPage.errorIconCollectionUrlTips`));
  }
  if (form.iconCollectionUrl) {
    fetchIcons();
  }
};

const handleResetDefault = () => {
  setCustomIconCollections([]);
  showCustomIconCollection.value = false;
  form.customIconCollectionUrl = "";
  form.iconCollectionUrl = defaultIconCollections.value[0].value;
  defaultIconCollectionValue.value[0] = defaultIconCollections.value[0].value;
  refreshIcons();
};

const isVisible = ref(props.visible);

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
    if (newValue) {
      syncIconCollectionState();
      refreshIcons();
    }
  },
  { immediate: true },
);

const show = () => {
  isVisible.value = true;
  emit("update:visible", true);
};
const close = () => {
  clearIconName();
  hide();
};
const hide = () => {
  isVisible.value = false;
  emit("update:visible", false);
};
// 暴露方法给父组件
defineExpose({ show, hide, close });
</script>

<style lang="scss" scoped>
.icon-popup {
  background: var(--background-color);

  .icon-popup-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .icon-popup-top {
    flex: 0 0 auto;
  }

  .icon-popup-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    color: var(--primary-text-color);
    font-size: 18px;
    font-weight: bold;
  }
  .icon-collection-search-wrapper {
    .icon-collection-search-content {
      padding: 10px 0;
      .nut-input {
        background: transparent;
        padding: 0;
        color: var(--second-text-color);
      }
    }
  }
  .icon-info-wrapper {
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon-collection-name {
      h1 {
        font-size: 18px;
        color: var(--primary-text-color);
        font-weight: bold;
      }
      p {
        font-size: 14px;
        color: var(--primary-text-color);
        word-break: break-all;
      }
    }
    .icon-collection-action {
      padding-left: 60px;
      flex-shrink: 0;
      .action-btn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-bottom: 10px;
        cursor: pointer;
        span {
          font-size: 14px;
          color: var(--comment-text-color);
        }
        i {
          color: var(--comment-text-color);
        }
      }
    }
  }
  .switch-wrapper {
    padding-top: 20px;
    .switch-item {
      margin-bottom: 10px;
      .my-switch {
        height: 22px;
        width: 45px;
        min-width: 40px;

        :deep(.switch-button) {
          width: 18px;
          height: 18px;
        }
      }
      flex-direction: row;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      padding: 0 8px 0 8px;
      .label {
        margin-left: 10px;
        color: var(--comment-text-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .icon-list-section {
    flex: 1 1 auto;
    min-height: 0;
    padding-top: 20px;
  }
  .icon-state-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 0;
  }
  .icon-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 20px;
  }
  .icon-state-loading {
    color: var(--comment-text-color);
  }
  .loading-icon {
    animation: rotation 1.2s linear infinite;
  }
  .state-title {
    margin: 16px 0 8px;
    color: var(--comment-text-color);
    font-size: 15px;
    font-weight: 600;
  }
  .state-desc {
    margin: 0;
    color: var(--comment-text-color);
    font-size: 13px;
    line-height: 1.5;
  }
  .icon-empty {
    padding: 0 0 8px;
  }
  .icon-retry-btn {
    margin-top: 8px;
  }
  .icon-list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 20px;
    .icon-item {
      text-align: center;
      width: 24%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      &:not(:nth-child(4n)) {
        margin-right: calc(4% / 3);
      }
      .nut-image {
        cursor: pointer;
        width: 50px;
        height: 50px;
        border-radius: 10px;
        overflow: hidden;
      }
      .sub-item-customer-icon {
        :deep(img) {
          & {
            opacity: 0.8;
            filter: brightness(var(--img-brightness));
          }
        }
      }
      p {
        font-size: 12px;
        color: var(--primary-text-color);
        word-break: break-all;
      }
    }
  }
  .nut-empty {
    h3,
    p {
      color: var(--comment-text-color);
    }
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
