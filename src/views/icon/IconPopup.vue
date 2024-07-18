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
    @close="hide"
  >
    <div class="icon-popup-title">
      {{ $t(`iconCollectionPage.iconCollection`) }}
    </div>
    <div class="icon-info-wrapper">
      <div class="icon-collection-name">
        <h1>{{ form.iconCollectionName }}</h1>
        <p>{{ form.iconCollectionDesc }}</p>
      </div>
      <div class="icon-collection-action" >
        <div class="action-btn" @click="handleMoreIconCollection">
          <span>{{ $t(`iconCollectionPage.more`) }}</span>
          <nut-icon name="rect-right" size="12px" ></nut-icon>
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
        <span class="label">{{ $t(`iconCollectionPage.useCustomIconCollection`) }}</span>
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
              v-model="form.iconCollectionUrl"
              :border="false"
              text-align="left"
              :placeholder="$t(`iconCollectionPage.iconCollectionPlaceholder`)"
              type="text"
              clearable
              @clear="clearCustomIconCollectionUrl"
              right-icon="refresh"
              @click-right-icon="refreshIcons"
            >
            </nut-input> 
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
      :columns="defaultIconCollectionColumns"
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
import axios from "axios";
import { ref, watch, computed, reactive, onMounted } from 'vue'
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/store/global";
import { useI18n } from "vue-i18n";
import { useDebounceFn } from '@vueuse/core'

const { t } = useI18n();
const globalStore = useGlobalStore();
const {
  bottomSafeArea,
  isIconColor,
  defaultIconCollection
} = storeToRefs(globalStore);

const setIconColor = (isIconColor: boolean) => {
  globalStore.setIconColor(isIconColor);
};
const form = reactive({
  iconName: "",
  iconCollectionName: "",
  iconCollectionUrl: "",
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
    searchResult.value = iconList.value.filter(item => 
      item.name.toLowerCase().includes(lowercaseTerm)
    );
  }
};

// 使用 useDebounceFn 创建防抖搜索函数
const debouncedSearch = useDebounceFn(performSearch, 500);

const iconData = computed(() => {
  return searchResult.value;
});

// 监听 form.iconName 变化以触发搜索
watch(() => form.iconName, (newValue) => {
  debouncedSearch();
});

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
  {
    text: "Twoandz9/TheMagic-Icons",
    value:
      "https://raw.githubusercontent.com/Twoandz9/TheMagic-Icons/main/TheRaw.json",
  },
]);

// 默认图标仓库
const defaultIconCollectionValue = ref([""]);

const showIconCollectionPicker = ref(false);

const showCustomIconCollection = ref(false);

const handleCustomIconCollection = () => {
  showCustomIconCollection.value = !showCustomIconCollection.value;
};

const setDefaultIconCollection = (url: string) => {
  globalStore.setDefaultIconCollection(url);
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
    if (iconList.value && iconList.value.length > 0) {
      iconList.value = iconList.value.map((item) => {
        const iconItem = {
          name: item.name || "",
          url: item[iconUrlKey] || "",
        };
        return iconItem;
      });
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

const handleIcon = (icon) => {
  console.log('icon', icon)
  hide()
  emit("setIcon", icon)
}

const handleMoreIconCollection = () => {
  showPicker();
}

const showPicker = () => {
  showIconCollectionPicker.value = true;
};

const handleConfirm = ({ selectedValue, selectedOptions }) => {
  form.iconCollectionUrl = selectedValue[0];
  setDefaultIconCollection(form.iconCollectionUrl);
  refreshIcons();
};

const handleCancel = () => {
  // showIconCollectionPicker.value = false;
  console.log('cancel')
};

const init = () => {
  if (defaultIconCollection.value) {
    form.iconCollectionUrl = defaultIconCollection.value;
    defaultIconCollectionValue.value[0] = defaultIconCollection.value;
  } else {
    form.iconCollectionUrl = defaultIconCollectionColumns.value[0].value;
    defaultIconCollectionValue.value[0] =
      defaultIconCollectionColumns.value[0].value;
  }
  refreshIcons();
};

const clearIconName = () => {
  form.iconName = "";
};

const clearCustomIconCollectionUrl = () => {
  form.iconCollectionUrl = "";
}

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


onMounted(() => {
  init();
})
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:visible', 'setIcon'])

const isVisible = ref(props.visible)

watch(() => props.visible, (newValue) => {
  isVisible.value = newValue
  console.log('newValue', newValue)
  if (newValue) {
    refreshIcons()
  }
})

const show = () => {
  isVisible.value = true
  emit('update:visible', true)
}

const hide = () => {
  isVisible.value = false
  emit('update:visible', false)
}
// 暴露方法给父组件
defineExpose({ show, hide })
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
      padding-left: 20px;
      flex-shrink: 0;
      .action-btn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
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