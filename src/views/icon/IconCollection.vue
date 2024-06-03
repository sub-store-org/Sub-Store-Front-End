<!-- 图标集合 -->
<template>
  <div class="icon-preview-wrapper">
    <div class="icon-preview-container">
      <div class="icon-collection">
        <nut-form class="form" :model-value="form">
          <nut-form-item
            required
            :label="$t(`iconCollectionPage.iconCollection`)"
          >
            <nut-textarea
              v-model="form.iconCollectionUrl"
              :border="false"
              text-align="left"
              :autosize="{ maxHeight: 110, minHeight: 50 }"
              :placeholder="$t(`iconCollectionPage.iconCollectionPlaceholder`)"
              type="text"
            />
          </nut-form-item>
          <div class="form-button-wrapper">
            <nut-button
              type="primary"
              :plain="true"
              size="small"
              @click="showPicker"
            >
              {{ $t(`iconCollectionPage.selectCollectionBtn`) }}
            </nut-button>
            <nut-button type="primary" size="small" @click="refreshIcons">
              {{ $t(`iconCollectionPage.refreshBtn`) }}
            </nut-button>
          </div>
        </nut-form>
      </div>
      <div class="switch-wrapper">
        <nut-switch
          v-model="isIconColor"
          class="my-switch"
          size="mini"
          @change="setIconColor"
        />
        <span class="label">{{ $t(`moreSettingPage.isIC`) }}</span>
      </div>
      <div class="icon-list">
        <div
          v-for="(icon, index) in iconList"
          :key="index"
          class="icon-item"
          @click="copyIconUrl(icon)"
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
      <nut-empty v-if="!isLoading && !iconList.length" image="empty">
        <template #description>
          <h3>{{ $t(`iconCollectionPage.emptyCollectionTitle`) }}</h3>
          <p>{{ $t(`iconCollectionPage.emptyCollectionDesc`) }}</p>
        </template>
      </nut-empty>
    </div>
    <nut-picker
      v-model="defaultIconCollection"
      v-model:visible="showIconCollectionPicker"
      :columns="defaultIconCollectionColumns"
      :title="$t(`iconCollectionPage.collectionPicker.title`)"
      :cancel-text="$t(`iconCollectionPage.collectionPicker.cancel`)"
      :ok-text="$t(`iconCollectionPage.collectionPicker.confirm`)"
      @confirm="handleConfirm"
    ></nut-picker>
  </div>
</template>

<script setup lang="ts">
import { Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import axios from "axios";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";

import { useGlobalStore } from "@/store/global";

const globalStore = useGlobalStore();
const { isIconColor } = storeToRefs(globalStore);
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t } = useI18n();
const setIconColor = (isIconColor: boolean) => {
  globalStore.setIconColor(isIconColor);
};

// 图标仓库列表
const defaultIconCollectionColumns = ref([
  {
    text: "cc63/ICON",
    value: "https://raw.githubusercontent.com/cc63/ICON/main/icons.json",
  },
  {
    text: "Koolson/QureColor",
    value:
      "https://raw.githubusercontent.com/Koolson/Qure/master/Other/QureColor.json",
  },
  {
    text: "Koolson/QureColor-All",
    value:
      "https://raw.githubusercontent.com/Koolson/Qure/master/Other/QureColor-All.json",
  },
  {
    text: "Orz-3/mini",
    value: "https://raw.githubusercontent.com/Orz-3/mini/master/mini.json",
  },
  {
    text: "Orz-3/mini+",
    value: "https://raw.githubusercontent.com/Orz-3/mini/master/mini%2B.json",
  },
  {
    text: "Orz-3/miniColor",
    value: "https://raw.githubusercontent.com/Orz-3/mini/master/miniColor.json",
  },
  {
    text: "Orz-3/Color+",
    value: "https://raw.githubusercontent.com/Orz-3/mini/master/Color%2B.json",
  },
]);

// 默认图标仓库
const defaultIconCollection = ref([
  "https://raw.githubusercontent.com/cc63/ICON/main/icons.json",
]);

const showIconCollectionPicker = ref(false);

const form = reactive({
  iconCollectionUrl: defaultIconCollection.value[0],
  iconListKey: "",
  iconItemUrlKey: "",
});

const isLoading = ref(false);
const iconList = ref([]);

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
    if (iconList.value && iconList.value.length > 0) {
      iconList.value = iconList.value.map((item) => {
        const iconItem = {
          name: item.name || "",
          url: item[iconUrlKey] || "",
        };
        return iconItem;
      });
    }
    Toast.hide("icon-collection");
  } catch (error) {
    Toast.hide("icon-collection");
    iconList.value = [];
    isLoading.value = false;
    console.error("Error fetching icons:", error);
  }
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

const copyIconUrl = async (icon) => {
  const iconUrl = icon.url;
  if (!iconUrl) {
    return false;
  }
  if (isSupported) {
    await copy(iconUrl);
  } else {
    await copyFallback(iconUrl);
  }
  Toast.text(t(`iconCollectionPage.copySuccessTips`));
};

const showPicker = () => {
  showIconCollectionPicker.value = true;
};

const handleConfirm = ({ selectedValue, selectedOptions }) => {
  // console.log(selectedValue[0], selectedOptions[0]);
  form.iconCollectionUrl = selectedValue[0];
  refreshIcons();
};

onMounted(() => {
  refreshIcons();
});
</script>

<style lang="scss" scoped>
.icon-preview-wrapper {
  min-height: 100%;

  .icon-preview-container {
    padding: var(--safe-area-side);

    .icon-collection {
      .nut-input {
        background: transparent;
        padding: 0;
        color: var(--second-text-color);
      }
      .form-button-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 10px;
        .nut-button {
          margin-right: 10px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .switch-wrapper {
      padding-top: 20px;
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
    .icon-list {
      display: flex;
      flex-wrap: wrap;
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
          width: 70px;
          height: 70px;
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
  }
}
</style>
