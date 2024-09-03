<template>
  <div
    style="overflow: hidden; -webkit-user-select: none; user-select: none"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
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
            <div :key="element.name" class="draggable-item">
              <FileListItem
                :file="element"
                type="file"
                :disabled="swipeDisabled"
              />
            </div>
          </template>
        </draggable>
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
      <router-link to="/edit/files/UNTITLED" class="router-link">
        <nut-button type="primary">
          {{ $t(`filePage.emptySub.btn`) }}
        </nut-button>
      </router-link>
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
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, toRaw } from "vue";
import draggable from "vuedraggable";

import { useAppNotifyStore } from "@/store/appNotify";
// import { Dialog, Toast } from '@nutui/nutui';

import { useSubsApi } from "@/api/subs";
import FileListItem from "@/components/FileListItem.vue";
import { useGlobalStore } from "@/store/global";
import { useSubsStore } from "@/store/subs";
import { useSettingsStore } from '@/store/settings';
import { initStores } from "@/utils/initApp";
import { useI18n } from "vue-i18n";
import { useBackend } from "@/hooks/useBackend";
import { isMobile } from "@/utils/isMobile";

import { useRouter } from "vue-router";
const router = useRouter();

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
  router.push("/edit/files/UNTITLED");
};

const { env } = useBackend();
const { showNotify } = useAppNotifyStore();
const subApi = useSubsApi();
const { t } = useI18n();
const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const { appearanceSetting } = storeToRefs(settingsStore);

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
</script>

<style lang="scss">
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

  .add-sub-panel-title {
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: var(--comment-text-color);
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
}
</style>
