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
          v-model="isIconColor"
          class="my-switch"
          size="mini"
          @change="setIconColor"
        />
        <span class="label">{{ $t(`moreSettingPage.isIC`) }}</span>
      </div>
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
    <div class="icon-list">
      <div
        v-for="(icon, index) in iconData"
        :key="index"
        class="icon-item"
        @click="handleIcon(icon)"
      >
        <nut-image
          :class="{ 'sub-item-customer-icon': !isIconColor }"
          :src="icon.url"
          fit="cover"
          lazy-load
          show-loading
        />
        <p>{{ icon.name }}</p>
      </div>
    </div>
    <nut-empty v-if="!isLoading && !iconData.length" image="empty">
      <template #description>
        <h3>{{ $t(`iconCollectionPage.emptyCollectionTitle`) }}</h3>
        <p>{{ $t(`iconCollectionPage.emptyCollectionDesc`) }}</p>
      </template>
    </nut-empty>
    <nut-picker
      v-model="defaultIconCollectionValue"
      v-model:visible="showIconCollectionPicker"
      :columns="iconCollectionColumns"
      :title="$t(`iconCollectionPage.collectionPicker.title`)"
      :cancel-text="$t(`iconCollectionPage.collectionPicker.cancel`)"
      :ok-text="$t(`iconCollectionPage.collectionPicker.confirm`)"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    ></nut-picker>
  </nut-popup>
</template>

<script setup lang="ts">
import { Toast } from "@nutui/nutui";
import { useDebounceFn } from "@vueuse/core";
import axios from "axios";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";

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
const { changeAppearanceSetting } = settingsStore;
const { appearanceSetting } = storeToRefs(settingsStore);
const { customIconCollections, defaultIconCollections, defaultIconCollection } =
  storeToRefs(globalStore);

const setIconColor = (isIconColor: boolean) => {
  const data = {
    ...appearanceSetting.value,
    isIconColor,
  };
  changeAppearanceSetting({ appearanceSetting: data });
};
const form = reactive({
  iconName: "",
  iconCollectionName: "",
  iconCollectionUrl: "",
  customIconCollectionUrl: "",
  iconCollectionDesc: "",
  iconListKey: "",
  iconItemUrlKey: "",
});

const isLoading = ref(false);
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

const isIconColor = ref(false);

watchEffect(() => {
  isIconColor.value = appearanceSetting.value.isIconColor;
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
    isLoading.value = true;
    const { data } = await axios.get(form.iconCollectionUrl);
    isLoading.value = false;
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
    Toast.hide("icon-collection");
  } catch (error) {
    Toast.hide("icon-collection");
    iconList.value = [];
    isLoading.value = false;
    console.error("Error fetching icons:", error);
  }
};

const handleAddCustomIconCollection = () => {
  form.iconCollectionUrl = form.customIconCollectionUrl;
  fetchIcons();
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

const init = () => {
  if (defaultIconCollection.value) {
    form.iconCollectionUrl = defaultIconCollection.value;
    defaultIconCollectionValue.value[0] = defaultIconCollection.value;
  } else {
    form.iconCollectionUrl = defaultIconCollections.value[0].value;
    defaultIconCollectionValue.value[0] = defaultIconCollections.value[0].value;
  }
  refreshIcons();
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

onMounted(() => {
  init();
});
const isVisible = ref(props.visible);

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
    console.log("newValue", newValue);
    if (newValue) {
      refreshIcons();
    }
  },
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
  .icon-list {
    display: flex;
    flex-wrap: wrap;
    max-height: 60%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding-top: 20px;
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
</style>
