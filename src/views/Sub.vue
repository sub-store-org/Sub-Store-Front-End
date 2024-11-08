<template>
  <div
    style="overflow: hidden"
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
          <p class="add-sub-panel-title">{{ $t(`subPage.addSubTitle`) }}</p>
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
            <router-link to="/edit/subs/UNTITLED" class="router-link">
              <svg-icon name="singleSubs" />
              <span>{{ $t(`specificWord.singleSub`) }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/edit/collections/UNTITLED" class="router-link">
              <svg-icon name="collectionSubs" />
              <span>{{ $t(`specificWord.collectionSub`) }}</span>
            </router-link>
          </li>
        </ul>
      </nut-popup>
    </div>
    <!-- 浮动按钮 -->
    <Teleport to="body">
      <div v-if="hasSubs || hasCollections" class="drag-btn-wrapper">
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
            right: '16px',
            bottom: `${
              bottomSafeArea +
              48 +
              36 +
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
            class="drag-btn"
            @touchmove="onTa"
            @touchend="enTa"
            @click="setaddSubBtnIsVisible"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
          </div>
        </nut-drag>
      </div>
    </Teleport>

    <!-- 页面内容 -->
    <!-- 有数据 -->
    <div class="subs-list-wrapper">
      <div v-if="tags && tags.length > 0" class="radio-wrapper" >
        <!-- <nut-radiogroup v-model="tag" direction="horizontal"> -->
          <!-- <nut-radio v-for="i in tags" shape="button" :label="String(i.value)">{{ i.label }}</nut-radio> -->
          <span v-for="i in tags" :class="{ 'tag': true, 'current': i.value === tag }" @click="setTag(i.value)">{{ i.label }}</span>
        <!-- </nut-radiogroup> -->
      </div>
      <div v-if="filterdSubsCount > 0">
        <div class="sticky-title-wrappers">
          <p class="list-title" @click="toggleFold('sub')">
            <p>{{ $t(`specificWord.singleSub`) + '('+filterdSubsCount+')' }}</p>
            <nut-icon v-if="!isFold('sub')" name="rect-down" size="12px"></nut-icon>
            <nut-icon v-else name="rect-right" size="12px"></nut-icon>
          </p>
        </div>

        <draggable
          v-if="!isFold('sub')"
          v-model="subs"
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
          @change="changeSort('subs', subs)"
          @start="handleDragStart(subs)"
          @end="handleDragEnd(subs)"
        >
          <template #item="{ element }">
            <div :key="element.name" class="draggable-item" v-show="shouldShowElement(element)">
              <SubListItem
                :sub="element"
                type="sub"
                :disabled="swipeDisabled"
                @share="handleShare"
              />
            </div>
          </template>
        </draggable>
      </div>

      <div v-if="filterdColsCount > 0">
        <div class="sticky-title-wrappers">
          <p class="list-title" @click="toggleFold('col')">
            <p>{{ $t(`specificWord.collectionSub`) + '('+filterdColsCount+')'}}</p>
            <nut-icon v-if="!isFold('col')" name="rect-down" size="12px"></nut-icon>
            <nut-icon v-else name="rect-right" size="12px"></nut-icon>
          </p>
        </div>

        <draggable
          v-if="!isFold('col')"
          v-model="collections"
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
          @change="changeSort('collections', collections)"
          @start="handleDragStart(collections)"
          @end="handleDragEnd(collections)"
        >
          <template #item="{ element }">
            <div :key="element.name" class="draggable-item" v-show="shouldShowElement(element)">
              <SubListItem
                :collection="element"
                type="collection"
                :disabled="swipeDisabled"
                @share="handleShare"
              />
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <!-- 没有数据 -->
    <div
      v-if="!isLoading && fetchResult && !hasSubs && !hasCollections"
      class="no-data-wrapper"
    >
      <nut-empty image="empty">
        <template #description>
          <h3>{{ $t(`subPage.emptySub.title`) }}</h3>
          <p>{{ $t(`subPage.emptySub.desc`) }}</p>
        </template>
      </nut-empty>
      <nut-button type="primary" @click="addSubBtnIsVisible = true">
        {{ $t(`subPage.emptySub.btn`) }}
      </nut-button>
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
import { ref, toRaw, computed } from "vue";
import draggable from "vuedraggable";
import SharePopup from "./share/SharePopup.vue";
import { useAppNotifyStore } from "@/store/appNotify";
import { Dialog, Toast } from '@nutui/nutui';

import { useSubsApi } from "@/api/subs";
import SubListItem from "@/components/SubListItem.vue";
import { useGlobalStore } from "@/store/global";
import { useSubsStore } from "@/store/subs";
import { useSettingsStore } from '@/store/settings';
import { initStores } from "@/utils/initApp";
import { useI18n } from "vue-i18n";
import { useBackend } from "@/hooks/useBackend";
import { isMobile } from "@/utils/isMobile";

const { env } = useBackend();
const { showNotify } = useAppNotifyStore();
const subsApi = useSubsApi();
const { t } = useI18n();
const fileInput = ref(null);
const uploadIsLoading = ref(false);
const restoreIsLoading = ref(false);
const addSubBtnIsVisible = ref(false);
// const isSubFold = ref(localStorage.getItem('sub-fold') === '1');
// const isColFold = ref(localStorage.getItem('col-fold') === '1');
const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const { hasSubs, hasCollections, subs, collections } = storeToRefs(subsStore);
const { appearanceSetting } = storeToRefs(settingsStore);
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
const hasLocal = ref(false);
const hasRemote = ref(false);
const getTag = () => {
    return localStorage.getItem('sub-tag') || 'all'
  }
const tag = ref(getTag());
const tags = computed(() => {
  if(!hasSubs.value && !hasCollections.value) return []
  // 从 subs 和 collections 中获取所有的 tag, 去重
  const set = new Set()
  subs.value.forEach(sub => {
    if(sub.source === 'remote') {
      hasRemote.value = true
    } else {
      hasLocal.value = true
    }
    if (Array.isArray(sub.tag) && sub.tag.length > 0) {
      sub.tag.forEach(i => {
        set.add(i)
      });
    } else {
      hasUntagged.value = true
    }
  })
  collections.value.forEach(col => {
    if (Array.isArray(col.tag) && col.tag.length > 0) {
      col.tag.forEach(i => {
        set.add(i)
      });
    } else {
      hasUntagged.value = true
    }
  })

  let tags: any[] = Array.from(set)
  if(tags.length === 0 && !hasRemote.value && !hasLocal.value) return []
  tags = tags.map(i => ({ label: i, value: i }));
  
  const result = [{ label: t("specificWord.all"), value: "all" }, ...tags]
  if(hasRemote.value) result.push({ label: t("editorPage.subConfig.basic.source.remote"), value: "remote" })
  if(hasLocal.value) result.push({ label: t("editorPage.subConfig.basic.source.local"), value: "local" })
  if(tags.length > 0 && hasUntagged.value) result.push({ label: t("specificWord.untagged"), value: "untagged" })

  if (!result.find(i => i.value === tag.value)) {
    tag.value = 'all'
  }
  return result
});
const shareData = ref(null);
const sharePopupVisible = ref(false);
const handleShare = (element, type) => {
  console.log("share", element);
  shareData.value = {
    displayName: element.displayName || "",
    name: element.name,
    type: type as "col" | "sub",
  };
  sharePopupVisible.value = true;
};
const filterdSubsCount = computed(() => {
  if(tag.value === 'all') return subs.value.length
  if(tag.value === 'untagged') return subs.value.filter(i => !Array.isArray(i.tag) || i.tag.length === 0).length
  if(tag.value === 'remote') return subs.value.filter(i => i.source === "remote").length
  if(tag.value === 'local') return subs.value.filter(i => i.source === "local").length
  return subs.value.filter(i => i.tag.includes(tag.value)).length
});
const filterdColsCount = computed(() => {
  if(tag.value === 'all') return collections.value.length
  if(tag.value === 'untagged') return collections.value.filter(i => !Array.isArray(i.tag) || i.tag.length === 0).length
  return collections.value.filter(i => i.tag.includes(tag.value)).length
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

const as = ref(false);

const onTa = () => {
  as.value = true;
};

const enTa = () => {
  setTimeout(() => {
    as.value = false;
  }, 100);
};

const setaddSubBtnIsVisible = () => {
  if (as.value) return;
  addSubBtnIsVisible.value = true;
};

let dragData = null;
const changeSort = async (
  subColl: "subs" | "collections",
  dataValue: any[]
) => {
  try {
    let sortDataRes: any;
    if (env.value.version > "2.14.48") {
      console.log(`new sort > v2.14.48`);
      const nameSortArray = dataValue.map((k: { name: string }) => k.name);
      // console.log(nameSortArray);
      sortDataRes = await subsApi.newSortSub(
        subColl,
        JSON.parse(JSON.stringify(toRaw(nameSortArray)))
      );
    } else {
      console.log(`old sort < v2.14.48 `);
      sortDataRes = await subsApi.sortSub(
        subColl,
        JSON.parse(JSON.stringify(toRaw(dataValue)))
      );
    }
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
function getFoldState() {
  let states = {}
  try {
    let raw = localStorage.getItem('sub-fold')
    states = raw ? JSON.parse(raw) : {}
  } catch (e) {}
  return states;
}
const fold = ref(getFoldState());
const isFold = (type) => {
  return fold.value?.[type]?.[tag.value];
}
const toggleFold = (type) => {
  if (fold.value?.[type]?.[tag.value]) {
    delete fold.value[type][tag.value]
  } else {
    if (!fold.value[type]) {
      fold.value[type] = {}
    }
    fold.value[type][tag.value] = 1
  }
  localStorage.setItem('sub-fold', JSON.stringify(fold.value));
}
// const toggleSubFold = () => {
//   isSubFold.value = !isSubFold.value;
//   if (isSubFold.value) {
//     localStorage.setItem('sub-fold', '1')  
//   } else {
//     localStorage.removeItem('sub-fold')
//   }
// };
// const toggleColFold = () => {
//   isColFold.value = !isColFold.value;
//   if (isColFold.value) {
//     localStorage.setItem('col-fold', '1')  
//   } else {
//     localStorage.removeItem('col-fold')
//   }
// };
const setTag = (current) => {
  tag.value = current
  if (current === 'all') {
    localStorage.removeItem('sub-tag')
  } else {
    localStorage.setItem('sub-tag', current)
  }
};
const shouldShowElement = (element) => {
  if(tag.value === 'all') return true
  if(tag.value === 'untagged') return !Array.isArray(element.tag) || element.tag.length === 0
  if(tag.value === 'remote') return element.source === 'remote'
  if(tag.value === 'local') return element.source === 'local'
  return element.tag.includes(tag.value)
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
      const res = await subsApi.createSub('subs', item);
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
      title: '仅支持 Sub-Store 单条订阅数据',
      content: '订阅管理页面, 在某个单条订阅左滑/右滑的更多项中, 点击导出图标按钮',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
</script>

<style lang="scss" scoped>
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
    padding: 16px 0;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    width: 100%;
    color: var(--second-text-color);

    > li {
      width: 50%;
      display: flex;
      justify-content: center;

      .router-link {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        > svg {
          width: 44px;
          height: 44px;
          color: var(--primary-color);
          margin-bottom: 12px;
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
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding-left: 8px;
  font-weight: bold;
  //padding-left: var(--safe-area-side);
  p {
    margin-right: 6px;
  }
  :deep(.nut-icon) {
    // transform: rotate(270deg);
    font-size: 12px;
    height: 12px;
    opacity: .6;
    margin-top: 3px;
  }
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
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    

    // :deep(.nut-radio__button.false) {
    //   background: var(--divider-color);
    //   border-color: transparent;
    //   color: var(--second-text-color);
    // }
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
