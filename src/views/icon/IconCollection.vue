<!-- 图标集合 -->
<template>
  <div class="icon-preview-wrap">
    <div class="icon-preview-container">
      <div class="icon-collection">
        <nut-form class="form" :model-value="form">
          <nut-form-item :label="$t(`iconCollectionPage.iconCollection`)">
            <nut-input
              v-model.trim="form.iconCollectionUrl"
              :placeholder="$t(`iconCollectionPage.iconCollectionPlaceholder`)"
              type="text"
            />
          </nut-form-item>
          <nut-form-item :label="$t(`iconCollectionPage.iconCollectionKey`)">
            <nut-input
              v-model.trim="form.iconListKey"
              :placeholder="$t(`iconCollectionPage.iconCollectionKeyPlaceholder`)"
              type="text"
            />
          </nut-form-item>
          <nut-form-item :label="$t(`iconCollectionPage.iconUrlKey`)">
            <nut-input
              v-model.trim="form.iconItemUrlKey"
              :placeholder="$t(`iconCollectionPage.iconUrlKeyPlaceholder`)"
              type="text"
            />
          </nut-form-item>
        </nut-form>
      </div>
      <div class="icon-list">
        <div
          v-for="(icon, index) in iconList"
          :key="index"
          class="icon-item"
          @click="copyIconUrl(icon)"
        >
          <nut-image
            :src="icon.url"
            fit="cover"
            lazy-load
            :show-loading="true"
          />
          <p>{{ icon.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import axios from "axios";
import { onMounted, reactive, ref, watchEffect } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";

const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t } = useI18n();

const form = reactive({
  iconCollectionUrl:
    "https://raw.githubusercontent.com/cc63/ICON/main/icons.json",
  iconListKey: "",
  iconItemUrlKey: "",
});

const iconList = ref([]);

const fetchIcons = async () => {
  try {
    const { data } = await axios.get(form.iconCollectionUrl);
    const collectionKey = form.iconKey || "icons";
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
  } catch (error) {
    console.error("Error fetching icons:", error);
  }
};

watchEffect(() => {
  if (!form.iconCollectionUrl) {
    return false;
  }
  if (form.iconCollectionUrl && !/^(http|https)/.test(form.iconCollectionUrl)) {
    return Toast.warn(t(`iconCollectionPage.errorIconCollectionUrlTips`));
  }
  if (form.iconCollectionUrl) {
    fetchIcons();
  }
});

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
</script>

<style lang="scss" scoped>
.icon-preview-wrap {
  min-height: 100%;

  .icon-preview-container {
    padding: var(--safe-area-side);

    .icon-collection {
      .nut-input {
        background: transparent;
        padding: 0;
        color: var(--second-text-color);
      }
    }
    .icon-list {
      display: flex;
      flex-wrap: wrap;
      gap: 25px;
      padding-top: 20px;
      .icon-item {
        text-align: center;
        width: 70px;
        .nut-image {
          width: 100%;
          height: auto;
          border-radius: 10px;
          overflow: hidden;
        }

        p {
          margin-top: 10px;
          font-size: 14px;
          color: var(--primary-text-color);
        }
      }
    }
  }
}
</style>
