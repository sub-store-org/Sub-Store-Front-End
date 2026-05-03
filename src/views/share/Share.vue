<template>
  <div
    style="overflow: hidden; -webkit-user-select: none; user-select: none"
  >
    <Teleport to="body">
      <div v-if="hasShares" class="share-nav-action-layer">
        <button
          v-if="!appearanceSetting.showFloatingAddButton"
          type="button"
          class="share-top-create-button"
          :style="{ top: shareTopSelectionOffset }"
          :aria-label="$t(`sharePage.emptyShare.btn`)"
          :title="$t(`sharePage.emptyShare.btn`)"
          @click="addShare"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
        <button
          type="button"
          class="share-top-selection-toggle"
          :style="{ top: shareTopSelectionOffset }"
          :aria-label="isSelectionMode ? $t(`sharePage.selectMode.cancel`) : $t(`sharePage.selectMode.enter`)"
          :title="isSelectionMode ? $t(`sharePage.selectMode.cancel`) : $t(`sharePage.selectMode.enter`)"
          @click="toggleSelectionMode"
        >
          <font-awesome-icon
            :icon="isSelectionMode ? 'fa-solid fa-xmark' : 'fa-solid fa-list-check'"
          />
        </button>
      </div>
    </Teleport>

    <!-- 浮动按钮 -->
    <Teleport to="body">
      <div v-if="hasShares" class="drag-btn-wrapper">
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
            @click="addShare"
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
    <div class="subs-list-wrapper" :class="{ 'dual-column-mode': isDualColumnMode }">
      <div
        v-if="hasShares && showTagBar"
        ref="radioWrapperRef"
        class="radio-wrapper"
      >
        <span
          v-for="item in tagOptions"
          :key="item.value"
          class="tag"
          :class="{ current: item.value === tag }"
          @click="setTag(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <div
        v-if="hasShares"
        class="share-page-content"
        :style="{
          paddingTop: `${radioWrapperHeight}px`,
          ...(isSelectionMode ? { paddingBottom: `${bottomSafeArea + 96}px` } : {}),
        }"
      >
        <!-- 单条订阅 -->
        <div v-if="subShareDataCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('sub')">
              <div class="list-title-main">
                <p>
                  {{ `${$t(`specificWord.singleSub`)}(${subShareDataCount})` }}
                </p>
                <nut-icon
                  v-if="!isFold('sub')"
                  name="rect-down"
                  size="12px"
                ></nut-icon>
                <nut-icon v-else name="rect-right" size="12px"></nut-icon>
              </div>
              <button
                v-if="isSelectionMode"
                type="button"
                class="share-type-selection-toggle"
                :class="{ active: isShareTypeAllSelected('sub') }"
                :aria-label="getShareTypeSelectionA11yLabel('sub')"
                :title="getShareTypeSelectionA11yLabel('sub')"
                @click.stop="toggleShareTypeSelection('sub')"
              >
                {{ getShareTypeSelectionButtonLabel('sub') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('sub')"
            v-model="filteredSubShareData"
            :item-key="getShareSelectionKey"
            class="draggable-list"
            :class="{ 'dual-column': isDualColumnMode }"
            :scroll-sensitivity="200"
            :force-fallback="true"
            :scroll-speed="8"
            :scroll="true"
            v-bind="{
              animation: 200,
              disabled: isSelectionMode,
              delay: 200,
              chosenClass: 'chosensub',
              handle: 'div',
            }"
            @change="changeSort('sub', subShareData)"
            @start="handleDragStart(subShareData)"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div
                :key="getShareSelectionKey(element)"
                class="draggable-item"
              >
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isShareSelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleShareSelection(element)"
                >
                  <nut-checkbox
                    :model-value="isShareSelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleShareSelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ShareListItem
                      :data="element"
                      :disabled="true"
                      :is-dual-column="isDualColumnMode"
                    />
                  </div>
                </div>
                <ShareListItem
                  v-else
                  :data="element"
                  :disabled="swipeDisabled"
                  :is-dual-column="isDualColumnMode"
                />
              </div>
            </template>
          </draggable>
        </div>
        <!-- 组合订阅 -->
        <div v-if="collectionShareDataCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('col')">
              <div class="list-title-main">
                <p>
                  {{
                    `${$t(
                      `specificWord.collectionSub`,
                    )}(${collectionShareDataCount})`
                  }}
                </p>
                <nut-icon
                  v-if="!isFold('col')"
                  name="rect-down"
                  size="12px"
                ></nut-icon>
                <nut-icon v-else name="rect-right" size="12px"></nut-icon>
              </div>
              <button
                v-if="isSelectionMode"
                type="button"
                class="share-type-selection-toggle"
                :class="{ active: isShareTypeAllSelected('col') }"
                :aria-label="getShareTypeSelectionA11yLabel('col')"
                :title="getShareTypeSelectionA11yLabel('col')"
                @click.stop="toggleShareTypeSelection('col')"
              >
                {{ getShareTypeSelectionButtonLabel('col') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('col')"
            v-model="filteredCollectionShareData"
            :item-key="getShareSelectionKey"
            class="draggable-list"
            :class="{ 'dual-column': isDualColumnMode }"
            :scroll-sensitivity="200"
            :force-fallback="true"
            :scroll-speed="8"
            :scroll="true"
            v-bind="{
              animation: 200,
              disabled: isSelectionMode,
              delay: 200,
              chosenClass: 'chosensub',
              handle: 'div',
            }"
            @change="changeSort('col', collectionShareData)"
            @start="handleDragStart(collectionShareData)"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div
                :key="getShareSelectionKey(element)"
                class="draggable-item"
              >
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isShareSelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleShareSelection(element)"
                >
                  <nut-checkbox
                    :model-value="isShareSelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleShareSelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ShareListItem
                      :data="element"
                      :disabled="true"
                      :is-dual-column="isDualColumnMode"
                    />
                  </div>
                </div>
                <ShareListItem
                  v-else
                  :data="element"
                  :disabled="swipeDisabled"
                  :is-dual-column="isDualColumnMode"
                />
              </div>
            </template>
          </draggable>
        </div>
        <!-- 文件 -->
        <div v-if="fileShareDataCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('file')">
              <div class="list-title-main">
                <p>
                  {{ `${$t(`specificWord.file`)}(${fileShareDataCount})` }}
                </p>
                <nut-icon
                  v-if="!isFold('file')"
                  name="rect-down"
                  size="12px"
                ></nut-icon>
                <nut-icon v-else name="rect-right" size="12px"></nut-icon>
              </div>
              <button
                v-if="isSelectionMode"
                type="button"
                class="share-type-selection-toggle"
                :class="{ active: isShareTypeAllSelected('file') }"
                :aria-label="getShareTypeSelectionA11yLabel('file')"
                :title="getShareTypeSelectionA11yLabel('file')"
                @click.stop="toggleShareTypeSelection('file')"
              >
                {{ getShareTypeSelectionButtonLabel('file') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('file')"
            v-model="filteredFileShareData"
            :item-key="getShareSelectionKey"
            class="draggable-list"
            :class="{ 'dual-column': isDualColumnMode }"
            :scroll-sensitivity="200"
            :force-fallback="true"
            :scroll-speed="8"
            :scroll="true"
            v-bind="{
              animation: 200,
              disabled: isSelectionMode,
              delay: 200,
              chosenClass: 'chosensub',
              handle: 'div',
            }"
            @change="changeSort('file', fileShareData)"
            @start="handleDragStart(fileShareData)"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div
                :key="getShareSelectionKey(element)"
                class="draggable-item"
              >
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isShareSelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleShareSelection(element)"
                >
                  <nut-checkbox
                    :model-value="isShareSelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleShareSelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ShareListItem
                      :data="element"
                      :disabled="true"
                      :is-dual-column="isDualColumnMode"
                    />
                  </div>
                </div>
                <ShareListItem
                  v-else
                  :data="element"
                  :disabled="swipeDisabled"
                  :is-dual-column="isDualColumnMode"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <!-- 没有数据 -->
    <div v-if="!isLoading && fetchResult && !hasShares" class="no-data-wrapper">
      <nut-empty image="empty">
        <template #description>
          <h3>{{ $t(`sharePage.emptyShare.title`) }}</h3>
          <p>{{ $t(`sharePage.emptyShare.desc`) }}</p>
        </template>
      </nut-empty>
      <nut-button type="primary" @click="addShare">
        {{ $t(`sharePage.emptyShare.btn`) }}
      </nut-button>
    </div>

    <!-- 数据加载失败 -->
    <div v-if="!isLoading && !fetchResult" class="no-data-wrapper">
      <nut-empty image="error" style="padding: 32px 30px">
        <template #description>
          <h3>{{ $t(`subPage.loadFailed.title`) }}</h3>
          <p>{{ $t(`subPage.loadFailed.desc`) }}</p>
          <a href="https://t.me/zhetengsha/218" style="color: var(--primary-color)"> {{ $t(`magicPath.troubleshooting`) }}</a>
          <p>
            
            <a
              href="/aboutUs"
              style="color: var(--primary-color)"
            >
              {{ $t(`subPage.loadFailed.about`) }}
            </a>
          </p>
        </template>
      </nut-empty>
      <nut-button icon="refresh" type="primary" @click="refresh">
        {{ $t(`subPage.loadFailed.btn`) }}
      </nut-button>
      <!-- <a
        href="https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46"
        target="_blank"
      >
        <span>{{ $t(`subPage.loadFailed.doc`) }}</span>
        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
      </a> -->
    </div>
    <div
      v-if="hasShares && isSelectionMode"
      class="share-selection-actions"
      :style="{ bottom: `${bottomSafeArea + 12}px` }"
    >
      <div class="share-selection-summary">
        {{ $t(`sharePage.selectMode.selectedCount`, { count: selectedShareCount }) }}
      </div>
      <nut-button plain size="small" type="primary" @click="toggleSelectAllShares">
        {{
          isAllSharesSelected
            ? $t(`sharePage.selectMode.clearAll`)
            : $t(`sharePage.selectMode.selectAll`)
        }}
      </nut-button>
      <nut-button
        plain
        size="small"
        type="primary"
        :disabled="expiredShareCount === 0"
        @click="selectExpiredShares"
      >
        {{ $t(`sharePage.selectMode.selectExpired`) }}
      </nut-button>
      <nut-button
        size="small"
        type="danger"
        :disabled="selectedShareCount === 0 || isDeletingSelectedShares"
        :loading="isDeletingSelectedShares"
        @click="confirmDeleteSelectedShares"
      >
        {{ $t(`sharePage.selectMode.delete`) }}
      </nut-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import draggable from "vuedraggable";
import ShareListItem from "@/components/ShareListItem.vue";
import { useShareApi } from "@/api/share";
import { useBackend } from "@/hooks/useBackend";
import { useFilteredDraggableList } from "@/hooks/useFilteredDraggableList";
import { useListViewMode } from "@/hooks/useListViewMode";
import { useListViewModeSelectionLock } from "@/hooks/useListViewModeSelectionLock";
import { useTagBarHeight } from "@/hooks/useTagBarHeight";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useListSearchStore } from "@/store/listSearch";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { useSystemStore } from "@/store/system";
import { getShareCreatePath } from "@/utils/share";
import { listItemMatchesSearch, shouldSearchListRemark } from "@/utils/listSearch";
import {
  ALL_SHARE_TAG,
  buildShareTagOptions,
  groupSharesByType,
  resolveShareTagFilter,
  shareMatchesTagFilter,
} from "@/utils/shareTags";
import { initStores } from "@/utils/initApp";
import { isMobile } from "@/utils/isMobile";
import { openManagedDeleteDialog } from "@/utils/archive";

type ShareGroupKey = "sub" | "col" | "file";

const shareTypeLabelKeyMap: Record<ShareGroupKey, "singleSub" | "collectionSub" | "file"> = {
  sub: "singleSub",
  col: "collectionSub",
  file: "file",
};

const router = useRouter();

const { env } = useBackend();
const isArchiveEnabled = computed(() => {
  return env.value?.feature?.archive;
});
const { t } = useI18n();
const shareApi = useShareApi();
const { showNotify } = useAppNotifyStore();
const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const systemStore = useSystemStore();
const settingsStore = useSettingsStore();
const listSearchStore = useListSearchStore();
const { appearanceSetting } = storeToRefs(settingsStore);
const { effectiveListViewMode } = useListViewMode();
const isDualColumnMode = computed(() => {
  return effectiveListViewMode.value === "dual-column";
});

const { shares, hasShares } = storeToRefs(subsStore);
const {
  isLoading,
  fetchResult,
  bottomSafeArea,
} = storeToRefs(globalStore);
const { navBartop, navBarHeight } = storeToRefs(systemStore);
const swipeDisabled = ref(false);

const shareTopSelectionOffset = computed(() => {
  const navBarHeightNum = Number.parseFloat(navBarHeight.value || "56");
  const navBarTopNum = Number.parseFloat(navBartop.value || "0");
  return `${(navBarHeightNum + navBarTopNum) / 2}px`;
});

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

const fold = ref<Record<ShareGroupKey, boolean>>({
  sub: false,
  col: false,
  file: false,
});

const isFold = (key: ShareGroupKey) => {
  return fold.value?.[key];
};

const toggleFold = (key: ShareGroupKey) => {
  fold.value[key] = !fold.value[key];
};

const addShare = () => {
  if (as.value) return;
  router.push(getShareCreatePath());
};

const getTag = () => {
  return localStorage.getItem("share-tag") || ALL_SHARE_TAG;
};
const tag = ref(getTag());
const tagNavBarHeight = computed(() => {
  return navBarHeight.value;
});
const tagOptions = computed(() => {
  const options = buildShareTagOptions(shares.value, {
    all: t("specificWord.all"),
    untagged: t("specificWord.untagged"),
  });
  const resolvedTag = resolveShareTagFilter(tag.value, options);
  if (resolvedTag !== tag.value) {
    tag.value = resolvedTag;
    if (resolvedTag === ALL_SHARE_TAG) {
      localStorage.removeItem("share-tag");
    }
  }
  return options;
});
const showTagBar = computed(() => {
  return tagOptions.value.length > 0;
});
const { tagBarRef: radioWrapperRef, tagBarHeight: radioWrapperHeight } = useTagBarHeight([
  tag,
  () => tagOptions.value,
]);
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const setTag = (current: string) => {
  tag.value = current;
  if (current === ALL_SHARE_TAG) {
    localStorage.removeItem("share-tag");
  } else {
    localStorage.setItem("share-tag", current);
  }
  scrollToTop();
};
const shouldShowShare = (share: Share) => {
  return shareMatchesTagFilter(share, tag.value)
    && listItemMatchesSearch(share, listSearchStore.normalizedQuery, {
      includeRemark: shouldSearchListRemark(appearanceSetting.value),
    });
};

const subShareData = ref<Share[]>([]);
const collectionShareData = ref<Share[]>([]);
const fileShareData = ref<Share[]>([]);
const filteredSubShareData = useFilteredDraggableList(subShareData, shouldShowShare);
const filteredCollectionShareData = useFilteredDraggableList(collectionShareData, shouldShowShare);
const filteredFileShareData = useFilteredDraggableList(fileShareData, shouldShowShare);
const isSelectionMode = ref(false);
const selectedShareKeys = ref<string[]>([]);
const isDeletingSelectedShares = ref(false);
useListViewModeSelectionLock(isSelectionMode);

const subShareDataCount = computed(() => subShareData.value.filter(shouldShowShare).length);
const collectionShareDataCount = computed(() => collectionShareData.value.filter(shouldShowShare).length);
const fileShareDataCount = computed(() => fileShareData.value.filter(shouldShowShare).length);
const allShareData = computed(() => [
  ...subShareData.value,
  ...collectionShareData.value,
  ...fileShareData.value,
].filter((item) => shouldShowShare(item)));
const selectedShareKeySet = computed(() => new Set(selectedShareKeys.value));
const selectedShares = computed(() =>
  allShareData.value.filter((item) =>
    selectedShareKeySet.value.has(getShareSelectionKey(item)),
  ),
);
const expiredShares = computed(() =>
  allShareData.value.filter((item) => isShareExpired(item)),
);
const selectedShareCount = computed(() => selectedShares.value.length);
const expiredShareCount = computed(() => expiredShares.value.length);
const isAllSharesSelected = computed(
  () =>
    allShareData.value.length > 0
    && selectedShareCount.value === allShareData.value.length,
);

function getShareTypeLabel(type: ShareGroupKey) {
  return t(`specificWord.${shareTypeLabelKeyMap[type]}`);
}

function getShareSelectionKey(item: Share) {
  return `${item.type || ""}-${item.name || ""}-${item.token || ""}`;
}

function getVisibleSharesByType(type: ShareGroupKey) {
  const sharesByType: Record<ShareGroupKey, Share[]> = {
    sub: subShareData.value,
    col: collectionShareData.value,
    file: fileShareData.value,
  };
  return sharesByType[type].filter((item) => shouldShowShare(item));
}

function getVisibleShareKeysByType(type: ShareGroupKey) {
  return getVisibleSharesByType(type).map((item) => getShareSelectionKey(item));
}

function getSelectedShareCountByType(type: ShareGroupKey) {
  const selectedKeys = selectedShareKeySet.value;
  return getVisibleShareKeysByType(type).filter((key) => selectedKeys.has(key)).length;
}

function isShareTypeAllSelected(type: ShareGroupKey) {
  const visibleShares = getVisibleSharesByType(type);
  return visibleShares.length > 0
    && getSelectedShareCountByType(type) === visibleShares.length;
}

function getShareTypeSelectionButtonLabel(type: ShareGroupKey) {
  return isShareTypeAllSelected(type)
    ? t("sharePage.selectMode.clearAll")
    : t("sharePage.selectMode.selectAll");
}

function getShareTypeSelectionA11yLabel(type: ShareGroupKey) {
  return isShareTypeAllSelected(type)
    ? t("sharePage.selectMode.clearTypeAll", {
      type: getShareTypeLabel(type),
    })
    : t("sharePage.selectMode.selectTypeAll", {
      type: getShareTypeLabel(type),
    });
}

function clearSelectedShares() {
  selectedShareKeys.value = [];
}

function exitSelectionMode() {
  clearSelectedShares();
  isSelectionMode.value = false;
}

function toggleSelectionMode() {
  if (isSelectionMode.value) {
    exitSelectionMode();
    return;
  }
  isSelectionMode.value = true;
}

function isShareSelected(item: Share) {
  return selectedShareKeySet.value.has(getShareSelectionKey(item));
}

function toggleShareSelection(item: Share) {
  const selectionKey = getShareSelectionKey(item);
  if (selectedShareKeySet.value.has(selectionKey)) {
    selectedShareKeys.value = selectedShareKeys.value.filter(
      (key) => key !== selectionKey,
    );
    return;
  }
  selectedShareKeys.value = [...selectedShareKeys.value, selectionKey];
}

function toggleSelectAllShares() {
  if (isAllSharesSelected.value) {
    clearSelectedShares();
    return;
  }
  selectedShareKeys.value = allShareData.value.map((item) =>
    getShareSelectionKey(item),
  );
}

function toggleShareTypeSelection(type: ShareGroupKey) {
  const typeKeys = getVisibleShareKeysByType(type);
  if (typeKeys.length === 0) {
    return;
  }

  if (isShareTypeAllSelected(type)) {
    const typeKeySet = new Set(typeKeys);
    selectedShareKeys.value = selectedShareKeys.value.filter((key) =>
      !typeKeySet.has(key),
    );
    return;
  }

  const nextSelectedKeySet = new Set(selectedShareKeys.value);
  typeKeys.forEach((key) => {
    nextSelectedKeySet.add(key);
  });
  selectedShareKeys.value = Array.from(nextSelectedKeySet);
}

function isShareExpired(item: Share) {
  return typeof item.exp === "number" && item.exp <= Date.now();
}

function selectExpiredShares() {
  if (expiredShareCount.value === 0) {
    return;
  }
  selectedShareKeys.value = expiredShares.value.map((item) =>
    getShareSelectionKey(item),
  );
}

watch(
  () => shares.value,
  (val) => {
    const groupedShares = groupSharesByType(val);
    subShareData.value = [...groupedShares.sub];
    collectionShareData.value = [...groupedShares.col];
    fileShareData.value = [...groupedShares.file];
  },
  { immediate: true, deep: true }
);

watch(
  allShareData,
  (val) => {
    const validKeys = new Set(val.map((item) => getShareSelectionKey(item)));
    selectedShareKeys.value = selectedShareKeys.value.filter((item) =>
      validKeys.has(item),
    );
    if (!val.length) {
      exitSelectionMode();
    }
  },
  { immediate: true, deep: true },
);

const sortFailed = ref(false);
let dragData: any = null;

const changeSort = async (type: string, dataValue: any[]) => {
  try {
    const allTokensKeySortArray = [
      ...subShareData.value,
      ...collectionShareData.value,
      ...fileShareData.value,
    ].map((item) => `${item.type}-${item.name}-${item.token}`);
    
    const sortRes = await shareApi.sortShares(
      JSON.parse(JSON.stringify(toRaw(allTokensKeySortArray)))
    );
    if (sortRes?.data?.status !== "success") {
      sortFailed.value = true;
      showNotify({
        title: t("notify.sortsub.failed"),
        type: "danger",
        content: JSON.stringify(sortRes),
      });
    }
  } catch (error) {
    sortFailed.value = true;
  }
};

const handleDragStart = (dataValue: any) => {
  swipeDisabled.value = true;
  dragData = dataValue;
};

const handleDragEnd = () => {
  if (sortFailed.value) {
    subsStore.fetchShareData();
    sortFailed.value = false;
  }
  dragData = null;
  swipeDisabled.value = false;
};

const init = async () => {
  await subsStore.fetchShareData();
}

onMounted(() => {
  init();
});

const deleteSelectedShares = async (mode: DeleteMode = "permanent") => {
  if (selectedShareCount.value === 0 || isDeletingSelectedShares.value) {
    return;
  }
  isDeletingSelectedShares.value = true;
  const deleteTargets = [...selectedShares.value];
  const results = await Promise.all(
    deleteTargets.map(async (item) => {
      if (!item.token || !item.type || !item.name) {
        return false;
      }
      try {
        const { data } = await shareApi.deleteShare(item.token, item.type, item.name, mode);
        return data?.status === "success";
      } catch (error) {
        console.log("batch deleteShare error", error);
        return false;
      }
    }),
  );

  await subsStore.fetchShareData();

  const successCount = results.filter(Boolean).length;
  const failedCount = results.length - successCount;

  if (failedCount === 0) {
    showNotify({
      type: mode === "archive" ? "success" : "danger",
      title:
        mode === "archive"
          ? t("archivePage.liveDelete.succeedNotify")
          : t("sharePage.batchDelete.succeedNotify"),
    });
    exitSelectionMode();
  } else {
    showNotify({
      type: "danger",
      title: t("sharePage.batchDelete.failNotify"),
      content: t("sharePage.batchDelete.result", {
        success: successCount,
        failed: failedCount,
      }),
    });
  }

  isDeletingSelectedShares.value = false;
};

const confirmDeleteSelectedShares = () => {
  if (selectedShareCount.value === 0 || isDeletingSelectedShares.value) {
    return;
  }
  openManagedDeleteDialog({
    enabled: isArchiveEnabled.value,
    managedTitle: t("archivePage.liveDelete.title"),
    managedContent: t("archivePage.liveDelete.batchDesc", {
      count: selectedShareCount.value,
      type: t("specificWord.share"),
    }),
    managedCancelText: t("archivePage.liveDelete.btn.archive"),
    managedOkText: t("archivePage.liveDelete.btn.permanent"),
    legacyTitle: t("sharePage.batchDelete.title"),
    legacyContent: t("sharePage.batchDelete.desc", {
      count: selectedShareCount.value,
    }),
    legacyCancelText: t("sharePage.deleteShare.btn.cancel"),
    legacyOkText: t("sharePage.deleteShare.btn.confirm"),
    onArchive: () => deleteSelectedShares("archive"),
    onPermanent: () => deleteSelectedShares("permanent"),
  });
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
    margin: 24px 0 12px 0;
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
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding-left: 8px;
  padding-right: 8px;
  font-weight: bold;
  //padding-left: var(--safe-area-side);
  p {
    margin-right: 6px;
  }
  :deep(.nut-icon) {
    // transform: rotate(270deg);
    font-size: 12px;
    height: 12px;
    opacity: 0.6;
    margin-top: 3px;
  }
}

.list-title-main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.share-type-selection-toggle {
  flex-shrink: 0;
  border: 1px solid var(--primary-color);
  border-radius: 999px;
  background: transparent;
  color: var(--primary-color);
  font-size: 12px;
  line-height: 1.2;
  padding: 4px 10px;
  white-space: nowrap;
  cursor: pointer;

  &.active {
    background: var(--primary-color);
    color: #fff;
  }
}

.sticky-title-wrappers {
  // margin-top: var(--safe-area-side);
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
  border-radius: var(--item-card-radios);
  overflow: hidden;
}

.draggable-list.dual-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
  padding-top: 12px;

  > .draggable-item {
    min-width: 0;
    margin: 0;
    border-radius: var(--item-card-radios);
    overflow: hidden;
  }
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
      margin: 0 5px;
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

.share-page-content {
  width: 100%;
}

.share-data + .share-data {
  margin-top: 8px;
}

.share-nav-action-layer {
  @include centered-fixed-container;
  top: 0;
  z-index: 21;
  pointer-events: none;
}

.share-top-selection-toggle {
  position: absolute;
  left: 46px;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--icon-nav-bar-right);
  cursor: pointer;
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.share-top-create-button {
  position: absolute;
  left: 80px;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--icon-nav-bar-right);
  cursor: pointer;
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.share-top-selection-toggle svg {
  width: 14px !important;
  height: 14px !important;
  font-size: 14px !important;
}

.share-top-create-button svg {
  width: 14px !important;
  height: 14px !important;
  font-size: 14px !important;
}

.share-top-selection-toggle:focus,
.share-top-create-button:focus {
  outline: none;
}

.share-select-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: var(--item-card-radios);
  transition: transform 0.2s ease;

  &.is-dual-column {
    height: 100%;
    align-items: flex-start;
  }
}

.share-select-checkbox {
  flex-shrink: 0;
}

.share-select-item-content {
  min-width: 0;
  flex: 1;
  display: flex;
  pointer-events: none;

  > * {
    width: 100%;
  }
}

.share-selection-actions {
  @include centered-fixed-container;
  width: calc(100% - 1.5rem);
  max-width: calc(100% - 1.5rem);
  z-index: 1000;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: var(--popup-color);
  box-shadow: 0 8px 24px #0003;

  @media screen and (min-width: 600px) {
    max-width: calc(85% - 1.5rem);
  }

  @media screen and (min-width: 768px) {
    max-width: calc(#{$container-width-md} - 1.5rem);
  }

  @media screen and (min-width: 900px) {
    max-width: calc(#{$container-width-lg} - 1.5rem);
  }

  @media screen and (min-width: 1200px) {
    max-width: calc(#{$container-width-xl} - 1.5rem);
  }
}

.share-selection-summary {
  flex: 1;
  min-width: 0;
  color: var(--primary-text-color);
  font-weight: bold;
}
</style>
