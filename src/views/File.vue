<template>
  <div
    style="overflow: hidden; -webkit-user-select: none; user-select: none"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- 添加订阅弹窗 -->
    <!-- lock-scroll -->
    <div>
      <nut-popup
        v-model:visible="addSubBtnIsVisible"
        pop-class="add-sub-popup"
        position="bottom"
        :style="{
          height: `${bottomSafeArea + 200}px`,
          padding: '20px 12px 0 12px',
        }"
        close-icon="close-little"
        z-index="11000"
        closeable
        round
      >
        <div class="title-btn">
          <p class="add-sub-panel-title">{{ $t(`filePage.addFileTitle`) }}</p>
          <p class="add-sub-panel-title or">{{ $t(`specificWord.or`) }}</p>
          <input type="file" ref="fileInput" accept="application/json,text/json,.json" @change="fileChange" style="display: none">
          <nut-button
            class="upload-btn"
            plain
            type="primary"
            size="small"
            :disabled="restoreIsLoading"
            :loading="restoreIsLoading"
            @click="upload()"
          >
            <font-awesome-icon
              icon="fa-solid fa-file-import"
              v-if="!uploadIsLoading"
            />
            {{ $t(`subPage.import.label`) }}
          </nut-button>
          <nut-icon name="tips" @click="importTips"></nut-icon>
        </div>
        <ul class="add-sub-panel-list">
          <li>
            <router-link to="/edit/files/UNTITLED" class="router-link">
              <svg-icon name="file" />
              <span>{{ $t(`specificWord.file`) }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/edit/files/UNTITLED-mihomoProfile" class="router-link">
              <img src="@/assets/icons/clashmeta_color.png" alt="">
              <span>{{ $t(`filePage.type.mihomoProfile`) }}</span>
              <small>{{ $t(`filePage.type.mihomoProfileTips`) }}</small>
            </router-link>
          </li>
        </ul>
      </nut-popup>
    </div>
    <!-- 浮动按钮 -->
    <Teleport to="body">
      <div v-if="hasFiles" class="drag-btn-wrapper">
        <nut-drag
          :attract="true"
          :boundary="{
            top: 56 + 8,
            left: 16,
            bottom: bottomSafeArea + 48 + 12 + 8,
            right: 16,
          }"
          :style="{
            cursor: 'pointer',
            left: '15px',
            bottom: `${
              bottomSafeArea +
              48 + 36 + 
              (!isMobile() ? (appearanceSetting.isSimpleMode ? 44 : 48) : 0)
            }px`,
          }"
        >
          <!-- 刷新 -->
          <div
            v-if="appearanceSetting.showFloatingRefreshButton"
            class="drag-btn refresh"
            @click="refresh"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
          </div>

          <!-- 加号 -->
          <div
            v-if="appearanceSetting.showFloatingAddButton"
            @touchmove="onTa"
            @touchend="enTa"
            @click="editFile"
            class="router-link"
          >
            <div class="drag-btn">
              <font-awesome-icon icon="fa-solid fa-plus" />
            </div>
          </div>
        </nut-drag>
      </div>
    </Teleport>

    <!-- 页面内容 -->
    <!-- 有数据 -->
    <div class="subs-list-wrapper">
      <div v-if="tags && tags.length > 0" ref="radioWrapperRef" class="radio-wrapper" >
        <!-- <nut-radiogroup v-model="tag" direction="horizontal"> -->
          <!-- <nut-radio v-for="i in tags" shape="button" :label="String(i.value)">{{ i.label }}</nut-radio> -->
          <span v-for="i in tags" class="tag" :class="{ 'current': i.value === tag }" @click="setTag(i.value)">{{ i.label }}</span>
        <!-- </nut-radiogroup> -->
      </div>
      <div class="subs-list-container" :style="{ paddingTop: `${radioWrapperHeight}px` }">
        <div v-if="hasFiles">
          <draggable
            v-model="files"
            item-key="name"
            :scroll-sensitivity="200"
            :force-fallback="true"
            :scroll-speed="8"
            :scroll="true"
            v-bind="{
              animation: 200,
              disabled: false,
              delay: 200,
              chosenClass: 'chosensub',
              handle: 'div',
            }"
            @change="changeSort('files', files)"
            @start="handleDragStart(files)"
            @end="handleDragEnd(files)"
          >
            <template #item="{ element }">
              <div v-show="shouldShowElement(element)" :key="element.name" class="draggable-item">
                <FileListItem
                  :file="element"
                  type="file"
                  :disabled="swipeDisabled"
                  @share="handleShare"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <!-- 没有数据 -->
    <div v-if="!isLoading && fetchResult && !hasFiles" class="no-data-wrapper">
      <nut-empty image="empty">
        <template #description>
          <h3>{{ $t(`filePage.emptySub.title`) }}</h3>
          <p>{{ $t(`filePage.emptySub.desc`) }}</p>
        </template>
      </nut-empty>
      <!-- <router-link to="/edit/files/UNTITLED" class="router-link"> -->
        <nut-button type="primary" @click="addSubBtnIsVisible = true">
          {{ $t(`filePage.emptySub.btn`) }}
        </nut-button>
      <!-- </router-link> -->
    </div>

    <!-- 数据加载失败 -->
    <div v-if="!isLoading && !fetchResult" class="no-data-wrapper">
      <nut-empty image="error" style="padding: 32px 30px">
        <template #description>
          <h3>{{ $t(`subPage.loadFailed.title`) }}</h3>
          <p>{{ $t(`subPage.loadFailed.desc`) }}</p>
          <p>{{ $t(`subPage.loadFailed.followOfficialChannel`) }}</p>
          <p>
            {{ $t(`subPage.loadFailed.officialChannel`) }}
            <a
              href="https://t.me/cool_scripts"
              style="color: var(--primary-color)"
            >
              Cool Scripts
            </a>
          </p>
        </template>
      </nut-empty>
      <nut-button icon="refresh" type="primary" @click="refresh">
        {{ $t(`subPage.loadFailed.btn`) }}
      </nut-button>
      <a
        href="https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46"
        target="_blank"
      >
        <span>{{ $t(`subPage.loadFailed.doc`) }}</span>
        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
      </a>
    </div>
    <SharePopup
      v-model:visible="sharePopupVisible"
      :data="shareData"
      action="add"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, toRaw, onMounted, computed, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import SharePopup from "./share/SharePopup.vue";

import { useAppNotifyStore } from "@/store/appNotify";
import { Dialog, Toast } from '@nutui/nutui';

import { useSubsApi } from "@/api/subs";
import { useFilesApi } from '@/api/files';
import FileListItem from "@/components/FileListItem.vue";
import { useGlobalStore } from "@/store/global";
import { useSubsStore } from "@/store/subs";
import { useSettingsStore } from '@/store/settings';
import { useSystemStore } from "@/store/system";
import { useMethodStore } from '@/store/methodStore';
import { initStores } from "@/utils/initApp";
import { useI18n } from "vue-i18n";
import { useBackend } from "@/hooks/useBackend";
import { isMobile } from "@/utils/isMobile";

import { useRouter } from "vue-router";
const router = useRouter();
const methodStore = useMethodStore();

const as = ref(false);

const onTa = () => {
  as.value = true;
};

const enTa = () => {
  setTimeout(() => {
    as.value = false;
  }, 100);
};

const editFile = () => {
  if (as.value) return;
  addSubBtnIsVisible.value = true;
};

const { env } = useBackend();
const { showNotify } = useAppNotifyStore();
const subApi = useSubsApi();
const filesApi = useFilesApi();
const { t } = useI18n();
const fileInput = ref(null);
const uploadIsLoading = ref(false);
const restoreIsLoading = ref(false);
const addSubBtnIsVisible = ref(false);
const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const systemStore = useSystemStore();
const settingsStore = useSettingsStore();
const { appearanceSetting } = storeToRefs(settingsStore);
const { navBarHeight } = storeToRefs(systemStore);
const { hasFiles, files } = storeToRefs(subsStore);
const {
  // isSimpleMode,
  isLoading,
  fetchResult,
  bottomSafeArea,
  // showFloatingRefreshButton,
} = storeToRefs(globalStore);
const swipeDisabled = ref(false);
const touchStartY = ref(null);
const touchStartX = ref(null);
const sortFailed = ref(false);
const hasUntagged = ref(false);
const getTag = () => {
    return localStorage.getItem('file-tag') || 'all';
  };
const tag = ref(getTag());
const tags = computed(() => {
  if(!hasFiles.value) return [];
  const set = new Set();
  files.value.forEach(sub => {
    
    if (Array.isArray(sub.tag) && sub.tag.length > 0) {
      sub.tag.forEach(i => {
        set.add(i);
      });
    } else {
      hasUntagged.value = true;
    }
  });

  let tags: any[] = Array.from(set);
  // if(tags.length === 0) return [];
  tags = tags.map(i => ({ label: i, value: i }));
  
  const result = [{ label: t("specificWord.all"), value: "all" }, ...tags];
  if(tags.length > 0 && hasUntagged.value) result.push({ label: t("specificWord.untagged"), value: "untagged" });

  if (!result.find(i => i.value === tag.value)) {
    tag.value = 'all';
  }
  return result;
});
const radioWrapperRef = ref(null);
const radioWrapperHeight = ref(0);

// 更新标签栏高度
const updateRadioWrapperHeight = () => {
  nextTick(() => {
    if (radioWrapperRef.value) {
      radioWrapperHeight.value = radioWrapperRef.value.offsetHeight;
    } else {
      radioWrapperHeight.value = 0;
    }
  });
};

const tagNavBarHeight = computed(() => {
  return navBarHeight.value;
});

watch(tag, () => {
  updateRadioWrapperHeight();
});

watch(() => tags.value, () => {
  updateRadioWrapperHeight();
}, { deep: true, immediate: true });
onMounted(() => {
  methodStore.registerMethod("addFile", editFile);
});
const onTouchStart = (event: TouchEvent) => {
  touchStartY.value = Math.abs(event.touches[0].clientY);
  touchStartX.value = Math.abs(event.touches[0].clientX);
};

const onTouchMove = (event: TouchEvent) => {
  const deltaY = Math.abs(event.changedTouches[0].clientY - touchStartY.value);
  const deltaX = Math.abs(event.changedTouches[0].clientX - touchStartX.value);

  const isScrollingUp = deltaX > 2;
  const isScrollingUps = deltaY < 10;

  if (isScrollingUp && isScrollingUps) {
    event.preventDefault();
  }
};

const onTouchEnd = () => {
  touchStartY.value = null;
  touchStartX.value = null;
};

const refresh = () => {
  initStores(true, true, true);
};

let dragData = null;
const changeSort = async (subColl: "files", dataValue: any[]) => {
  try {
    let sortDataRes: any;

    const nameSortArray = dataValue.map((k: { name: string }) => k.name);
    // console.log(nameSortArray);
    sortDataRes = await subApi.newSortSub(
      subColl,
      JSON.parse(JSON.stringify(toRaw(nameSortArray)))
    );
    // console.log(JSON.stringify(sortDataRes))
    if (sortDataRes?.data?.status !== "success") {
      sortFailed.value = true;
      showNotify({
        title: t("notify.sortsub.failed"),
        type: "danger",
        content: JSON.stringify(sortDataRes),
      });
    }
  } catch (error) {
    sortFailed.value = true;
  }
};

const handleDragStart = (dataValue: any) => {
  swipeDisabled.value = true;
  dragData = dataValue.value;
};

const handleDragEnd = (dataValue: any) => {
  if (sortFailed.value) {
    dataValue.value = dragData;
  } else {
    dragData = null;
  }
  swipeDisabled.value = false;
};

const shareData = ref(null);
const sharePopupVisible = ref(false);
const handleShare = (element, type) => {
  console.log("share", element);
  shareData.value = {
    displayName: element.displayName || "",
    name: element.name,
    type: type as "file",
  };
  sharePopupVisible.value = true;
};
const upload = async() => {
  try {
    fileInput.value.click()
  } catch (e) {
    console.error(e);
  }
}

const fileChange = async (event) => {
  const file = event.target.files[0];
  if(!file) return
  try {
    restoreIsLoading.value = true;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const item = JSON.parse(String(reader.result))
      const suffix = new Date().getTime()
      item.name += `_${suffix}`
      item.displayName += `_${suffix}`
      item['display-name'] = item.displayName
      const res = await filesApi.createFile(item);
      // await subsStore.fetchSubsData();
      
      // const res = await useSettingsApi().restoreSettings({ content: String(reader.result) });
      if (res?.data?.status === "success") {
        await initStores(false, true, true);
        showNotify({
          type: "success",
          title: t(`subPage.import.succeed`),
        });
        addSubBtnIsVisible.value = false
      } else {
        throw new Error('restore failed')
      }
    }

    reader.onerror = e => {
      throw e
    }
    
  } catch (e) {
    showNotify({
      type: "danger",
      title: t(`subPage.import.failed`, { e: e.message ?? e }),
    });
    console.error(e);
  } finally {
    restoreIsLoading.value = false;
  }
};
const importTips = () => {
  addSubBtnIsVisible.value = false
  Dialog({
      title: t(`filePage.importFileTitle`),
      content: t(`filePage.importFileTips`),
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const scrollToTop = () => {
  const scrollPosition = 0;
  
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth"
  });
};

const setTag = (current) => {
  tag.value = current;
  if (current === 'all') {
    localStorage.removeItem('file-tag');
  } else {
    localStorage.setItem('file-tag', current);
  }
  // 增加滚动到顶部
  scrollToTop();
};
const shouldShowElement = (element) => {
  if(tag.value === 'all') return true;
  if(tag.value === 'untagged') return !Array.isArray(element.tag) || element.tag.length === 0;
  return element.tag?.includes(tag.value);
};
</script>

<style lang="scss" scoped>
  .title-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    .nut-icon {
      color: var(--comment-text-color);
    }
    :deep(.nut-icon-tips:before) {
      cursor: pointer;
      margin-left: 4px;
    }
  }
.drag-btn-wrapper {
  position: relative;
  z-index: 999;

  .drag-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-image: linear-gradient(
      to bottom right,
      var(--primary-color),
      var(--primary-color-end)
    );
    box-shadow: 0 4px 8px #0003;
    display: flex;
    justify-content: center;
    align-items: center;

    &.refresh {
      background: var(--second-color);
      margin-bottom: 12px;
    }

    > svg {
      width: 20px;
      height: 20px;
      color: #fffb;
    }
  }
}

.add-sub-popup {
  background-color: var(--popup-color);
  // position: relative;
  .title-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    .nut-icon {
      color: var(--comment-text-color);
    }
    :deep(.nut-icon-tips:before) {
      cursor: pointer;
      margin-left: 4px;
    }
  }
  .add-sub-panel-title {
    width: auto;
    text-align: center;
    font-size: 16px;
    color: var(--second-text-color);
    &.or {
      margin: 0 4px;
      color: var(--comment-text-color);
    }
  }

  .add-sub-panel-list {
    padding: 10px 0;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    width: 100%;
    color: var(--second-text-color);

    > li {
      flex: 1;
      display: flex;
      justify-content: center;

      .router-link {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        > svg, > img {
          width: 44px;
          height: 44px;
          color: var(--primary-color);
          margin-bottom: 12px;
        }
        span {
          font-size: 14px;
        }
        small {
          font-size: 12px;
          color: var(--comment-text-color);
        }
      }
    }
  }
}

.no-data-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h3 {
    font-size: 18px;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  p {
    font-size: 14px;
    color: var(--comment-text-color);
  }

  a {
    font-size: 14px;
    margin-top: 24px;
    color: var(--comment-text-color);

    span {
      margin-right: 4px;
    }
  }
}

.list-title {
  padding-left: 8px;
  font-weight: bold;
  //padding-left: var(--safe-area-side);
}

.sticky-title-wrappers {
  margin-top: var(--safe-area-side);
  // backdrop-filter: blur(var(--sticky-title-blur));
  // -webkit-backdrop-filter: blur(var(--sticky-title-blur));
  color: var(--comment-text-color);
  // background-color: var(--nav-bar-color);
}

.desc-about {
  display: block;
  padding: 100px 30px 50px;
  color: var(--comment-text-color);
  font-size: 12px;
  line-height: 20px;
  margin-top: 8px;
  margin-bottom: 20px;
  text-align: left;
}

.desc-about span {
  display: inline-block;
  padding: 6px 0 0 0;
}

.desc-title a,
.desc-about a {
  color: var(--primary-color);
}

.draggable-item {
  margin-top: 12px;
  margin-bottom: 12px;
  // overflow: hidden;
}

.chosensub {
  box-shadow: 0 0 10px var(--primary-color);
  border-radius: var(--item-card-radios);
  overflow: hidden;
}

.subs-list-wrapper {
  width: calc(100% - 1.5rem);
  margin-left: auto;
  margin-right: auto;
  .radio-wrapper {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    padding: 10px;
    top: v-bind(tagNavBarHeight);
    z-index: 10;
    backdrop-filter: blur(var(--nav-bar-blur));
    -webkit-backdrop-filter: blur(var(--nav-bar-blur));
    background: var(--nav-bar-color);
    @include centered-fixed-container;
      @media screen and (min-width: 768px) {
        border-radius: var(--item-card-radios);
        overflow: hidden;
      }
    .tag {
      font-size: 12px;
      color: var(--second-text-color);
      margin: 0px 5px;
      padding: 7.5px 2.5px 4px;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      border-bottom: 1px solid transparent;
    }
    .current {
      border-bottom: 1px solid var(--primary-color);
      color: var(--primary-color);
    }
  }
}
</style>
