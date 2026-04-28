<template>
  <div style="overflow: hidden; -webkit-user-select: none; user-select: none">
    <Teleport to="body">
      <div v-if="hasEntries" class="share-nav-action-layer">
        <button
          type="button"
          class="share-top-selection-toggle"
          :style="{ top: selectionToggleOffset }"
          :aria-label="isSelectionMode ? $t('archivePage.selectMode.cancel') : $t('archivePage.selectMode.enter')"
          :title="isSelectionMode ? $t('archivePage.selectMode.cancel') : $t('archivePage.selectMode.enter')"
          @click="toggleSelectionMode"
        >
          <font-awesome-icon
            :icon="isSelectionMode ? 'fa-solid fa-xmark' : 'fa-solid fa-list-check'"
          />
        </button>
      </div>
    </Teleport>

    <div class="subs-list-wrapper" :class="{ 'dual-column-mode': isDualColumnMode }">
      <div
        v-if="hasEntries && showTagBar"
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
        v-if="hasEntries"
        class="share-page-content"
        :style="{
          paddingTop: `${radioWrapperHeight}px`,
          ...(isSelectionMode ? { paddingBottom: `${bottomSafeArea + 108}px` } : {}),
        }"
      >
        <div v-if="subEntryCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('sub')">
              <div class="list-title-main">
                <p>{{ `${$t('specificWord.singleSub')}(${subEntryCount})` }}</p>
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
                :class="{ active: isTypeAllSelected('sub') }"
                :aria-label="getTypeSelectionA11yLabel('sub')"
                :title="getTypeSelectionA11yLabel('sub')"
                @click.stop="toggleTypeSelection('sub')"
              >
                {{ getTypeSelectionButtonLabel('sub') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('sub')"
            v-model="filteredSubEntries"
            item-key="id"
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
            @change="changeSort"
            @start="handleDragStart"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div :key="element.id" class="draggable-item">
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isEntrySelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleEntrySelection(element)"
                >
                  <nut-checkbox
                    :model-value="isEntrySelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleEntrySelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ArchiveListItem :data="element" :disabled="true" :is-dual-column="isDualColumnMode" />
                  </div>
                </div>
                <ArchiveListItem
                  v-else
                  :data="element"
                  :disabled="dragDisabled"
                  :is-dual-column="isDualColumnMode"
                  @restore="restoreEntry"
                  @delete="confirmDeleteEntry"
                />
              </div>
            </template>
          </draggable>
        </div>

        <div v-if="colEntryCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('col')">
              <div class="list-title-main">
                <p>{{ `${$t('specificWord.collectionSub')}(${colEntryCount})` }}</p>
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
                :class="{ active: isTypeAllSelected('col') }"
                :aria-label="getTypeSelectionA11yLabel('col')"
                :title="getTypeSelectionA11yLabel('col')"
                @click.stop="toggleTypeSelection('col')"
              >
                {{ getTypeSelectionButtonLabel('col') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('col')"
            v-model="filteredColEntries"
            item-key="id"
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
            @change="changeSort"
            @start="handleDragStart"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div :key="element.id" class="draggable-item">
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isEntrySelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleEntrySelection(element)"
                >
                  <nut-checkbox
                    :model-value="isEntrySelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleEntrySelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ArchiveListItem :data="element" :disabled="true" :is-dual-column="isDualColumnMode" />
                  </div>
                </div>
                <ArchiveListItem
                  v-else
                  :data="element"
                  :disabled="dragDisabled"
                  :is-dual-column="isDualColumnMode"
                  @restore="restoreEntry"
                  @delete="confirmDeleteEntry"
                />
              </div>
            </template>
          </draggable>
        </div>

        <div v-if="fileEntryCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('file')">
              <div class="list-title-main">
                <p>{{ `${$t('specificWord.file')}(${fileEntryCount})` }}</p>
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
                :class="{ active: isTypeAllSelected('file') }"
                :aria-label="getTypeSelectionA11yLabel('file')"
                :title="getTypeSelectionA11yLabel('file')"
                @click.stop="toggleTypeSelection('file')"
              >
                {{ getTypeSelectionButtonLabel('file') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('file')"
            v-model="filteredFileEntries"
            item-key="id"
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
            @change="changeSort"
            @start="handleDragStart"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div :key="element.id" class="draggable-item">
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isEntrySelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleEntrySelection(element)"
                >
                  <nut-checkbox
                    :model-value="isEntrySelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleEntrySelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ArchiveListItem :data="element" :disabled="true" :is-dual-column="isDualColumnMode" />
                  </div>
                </div>
                <ArchiveListItem
                  v-else
                  :data="element"
                  :disabled="dragDisabled"
                  :is-dual-column="isDualColumnMode"
                  @restore="restoreEntry"
                  @delete="confirmDeleteEntry"
                />
              </div>
            </template>
          </draggable>
        </div>

        <div v-if="artifactEntryCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('artifact')">
              <div class="list-title-main">
                <p>{{ `${$t('specificWord.syncConfig')}(${artifactEntryCount})` }}</p>
                <nut-icon
                  v-if="!isFold('artifact')"
                  name="rect-down"
                  size="12px"
                ></nut-icon>
                <nut-icon v-else name="rect-right" size="12px"></nut-icon>
              </div>
              <button
                v-if="isSelectionMode"
                type="button"
                class="share-type-selection-toggle"
                :class="{ active: isTypeAllSelected('artifact') }"
                :aria-label="getTypeSelectionA11yLabel('artifact')"
                :title="getTypeSelectionA11yLabel('artifact')"
                @click.stop="toggleTypeSelection('artifact')"
              >
                {{ getTypeSelectionButtonLabel('artifact') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('artifact')"
            v-model="filteredArtifactEntries"
            item-key="id"
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
            @change="changeSort"
            @start="handleDragStart"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div :key="element.id" class="draggable-item">
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isEntrySelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleEntrySelection(element)"
                >
                  <nut-checkbox
                    :model-value="isEntrySelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleEntrySelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ArchiveListItem :data="element" :disabled="true" :is-dual-column="isDualColumnMode" />
                  </div>
                </div>
                <ArchiveListItem
                  v-else
                  :data="element"
                  :disabled="dragDisabled"
                  :is-dual-column="isDualColumnMode"
                  @restore="restoreEntry"
                  @delete="confirmDeleteEntry"
                />
              </div>
            </template>
          </draggable>
        </div>

        <div v-if="shareEntryCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('share')">
              <div class="list-title-main">
                <p>{{ `${$t('specificWord.share')}(${shareEntryCount})` }}</p>
                <nut-icon
                  v-if="!isFold('share')"
                  name="rect-down"
                  size="12px"
                ></nut-icon>
                <nut-icon v-else name="rect-right" size="12px"></nut-icon>
              </div>
              <button
                v-if="isSelectionMode"
                type="button"
                class="share-type-selection-toggle"
                :class="{ active: isTypeAllSelected('share') }"
                :aria-label="getTypeSelectionA11yLabel('share')"
                :title="getTypeSelectionA11yLabel('share')"
                @click.stop="toggleTypeSelection('share')"
              >
                {{ getTypeSelectionButtonLabel('share') }}
              </button>
            </div>
          </div>
          <draggable
            v-if="!isFold('share')"
            v-model="filteredShareEntries"
            item-key="id"
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
            @change="changeSort"
            @start="handleDragStart"
            @end="handleDragEnd"
          >
            <template #item="{ element }">
              <div :key="element.id" class="draggable-item">
                <div
                  v-if="isSelectionMode"
                  class="share-select-item"
                  :class="{ selected: isEntrySelected(element), 'is-dual-column': isDualColumnMode }"
                  @click.stop="toggleEntrySelection(element)"
                >
                  <nut-checkbox
                    :model-value="isEntrySelected(element)"
                    class="share-select-checkbox"
                    @click.stop="toggleEntrySelection(element)"
                  />
                  <div class="share-select-item-content">
                    <ArchiveListItem :data="element" :disabled="true" :is-dual-column="isDualColumnMode" />
                  </div>
                </div>
                <ArchiveListItem
                  v-else
                  :data="element"
                  :disabled="dragDisabled"
                  :is-dual-column="isDualColumnMode"
                  @restore="restoreEntry"
                  @delete="confirmDeleteEntry"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <div v-if="!pageLoading && pageFetchResult && !hasEntries" class="no-data-wrapper">
      <nut-empty image="empty">
        <template #description>
          <h3>{{ $t('archivePage.empty.title') }}</h3>
          <p>{{ $t('archivePage.empty.desc') }}</p>
        </template>
      </nut-empty>
      <router-link to="/" class="router-link">
        <nut-button type="primary">
          {{ $t('archivePage.empty.btn') }}
        </nut-button>
      </router-link>
    </div>

    <div v-if="!pageLoading && !pageFetchResult" class="no-data-wrapper">
      <nut-empty image="error" style="padding: 32px 30px">
        <template #description>
          <h3>{{ $t('subPage.loadFailed.title') }}</h3>
          <p>{{ $t('subPage.loadFailed.desc') }}</p>
        </template>
      </nut-empty>
      <nut-button icon="refresh" type="primary" @click="init">
        {{ $t('subPage.loadFailed.btn') }}
      </nut-button>
    </div>

    <div
      v-if="hasEntries && isSelectionMode"
      class="share-selection-actions"
      :style="{ bottom: `${bottomSafeArea + 12}px` }"
    >
      <div class="share-selection-summary">
        {{ $t('archivePage.selectMode.selectedCount', { count: selectedEntryCount }) }}
      </div>
      <nut-button plain size="small" type="primary" @click="toggleSelectAllEntries">
        {{ isAllEntriesSelected ? $t('archivePage.selectMode.clearAll') : $t('archivePage.selectMode.selectAll') }}
      </nut-button>
      <nut-button
        plain
        size="small"
        type="primary"
        :disabled="selectedEntryCount === 0 || isRestoringSelectedEntries"
        :loading="isRestoringSelectedEntries"
        @click="restoreSelectedEntries"
      >
        {{ $t('archivePage.selectMode.restore') }}
      </nut-button>
      <nut-button
        size="small"
        type="danger"
        :disabled="selectedEntryCount === 0 || isDeletingSelectedEntries"
        :loading="isDeletingSelectedEntries"
        @click="confirmDeleteSelectedEntries"
      >
        {{ $t('archivePage.selectMode.delete') }}
      </nut-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, createVNode, onMounted, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import draggable from 'vuedraggable';

import ArchiveListItem from '@/components/ArchiveListItem.vue';
import { useFilteredDraggableList } from '@/hooks/useFilteredDraggableList';
import { useListViewMode } from '@/hooks/useListViewMode';
import { useListViewModeSelectionLock } from '@/hooks/useListViewModeSelectionLock';
import { useTagBarHeight } from '@/hooks/useTagBarHeight';
import { useAppNotifyStore } from '@/store/appNotify';
import { useGlobalStore } from '@/store/global';
import { useArchiveStore } from '@/store/archive';
import { useSystemStore } from '@/store/system';
import {
  ALL_SHARE_TAG as ALL_ARCHIVE_TAG,
  buildShareTagOptions as buildArchiveTagOptions,
  countSharesByTagFilter as countArchiveEntriesByTagFilter,
  resolveShareTagFilter as resolveArchiveTagFilter,
  shareMatchesTagFilter as archiveEntryMatchesTagFilter,
} from '@/utils/shareTags';
import {
  getArchiveEntryDisplayName,
  groupArchiveEntriesByType,
  openClosableDialog,
} from '@/utils/archive';

type ArchiveGroupKey = ArchiveItemType;
const ARCHIVE_TAG_STORAGE_KEY = 'archive-tag';

const archiveTypeLabelKeyMap: Record<ArchiveGroupKey, string> = {
  sub: 'singleSub',
  col: 'collectionSub',
  file: 'file',
  artifact: 'syncConfig',
  share: 'share',
};

const { t } = useI18n();
const { showNotify } = useAppNotifyStore();
const archiveStore = useArchiveStore();
const globalStore = useGlobalStore();
const systemStore = useSystemStore();
const { effectiveListViewMode } = useListViewMode();

const { entries, hasEntries } = storeToRefs(archiveStore);
const { bottomSafeArea } = storeToRefs(globalStore);
const { navBartop, navBarHeight } = storeToRefs(systemStore);
const isDualColumnMode = computed(() => {
  return effectiveListViewMode.value === 'dual-column';
});

const pageLoading = ref(false);
const pageFetchResult = ref(true);
const dragDisabled = ref(false);
const sortFailed = ref(false);
const isSelectionMode = ref(false);
const selectedEntryIds = ref<string[]>([]);
const isDeletingSelectedEntries = ref(false);
const isRestoringSelectedEntries = ref(false);
useListViewModeSelectionLock(isSelectionMode);

const selectionToggleOffset = computed(() => {
  const navBarHeightNum = Number.parseFloat(navBarHeight.value || '56');
  const navBarTopNum = Number.parseFloat(navBartop.value || '0');
  return `${(navBarHeightNum + navBarTopNum) / 2}px`;
});

const getTag = () => {
  return localStorage.getItem(ARCHIVE_TAG_STORAGE_KEY) || ALL_ARCHIVE_TAG;
};

const tag = ref(getTag());
const tagNavBarHeight = computed(() => {
  return navBarHeight.value;
});
const tagOptions = computed(() => {
  const options = buildArchiveTagOptions(entries.value, {
    all: t('specificWord.all'),
    untagged: t('specificWord.untagged'),
  });
  const resolvedTag = resolveArchiveTagFilter(tag.value, options);

  if (resolvedTag !== tag.value) {
    tag.value = resolvedTag;
    if (resolvedTag === ALL_ARCHIVE_TAG) {
      localStorage.removeItem(ARCHIVE_TAG_STORAGE_KEY);
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
    behavior: 'smooth',
  });
};
const setTag = (current: string) => {
  tag.value = current;
  if (current === ALL_ARCHIVE_TAG) {
    localStorage.removeItem(ARCHIVE_TAG_STORAGE_KEY);
  } else {
    localStorage.setItem(ARCHIVE_TAG_STORAGE_KEY, current);
  }
  scrollToTop();
};
const shouldShowEntry = (entry: ArchiveEntry) => {
  return archiveEntryMatchesTagFilter(entry, tag.value);
};

const subEntries = ref<ArchiveEntry[]>([]);
const colEntries = ref<ArchiveEntry[]>([]);
const fileEntries = ref<ArchiveEntry[]>([]);
const artifactEntries = ref<ArchiveEntry[]>([]);
const shareEntries = ref<ArchiveEntry[]>([]);

const filteredSubEntries = useFilteredDraggableList(subEntries, shouldShowEntry);
const filteredColEntries = useFilteredDraggableList(colEntries, shouldShowEntry);
const filteredFileEntries = useFilteredDraggableList(fileEntries, shouldShowEntry);
const filteredArtifactEntries = useFilteredDraggableList(artifactEntries, shouldShowEntry);
const filteredShareEntries = useFilteredDraggableList(shareEntries, shouldShowEntry);

const subEntryCount = computed(() => countArchiveEntriesByTagFilter(subEntries.value, tag.value));
const colEntryCount = computed(() => countArchiveEntriesByTagFilter(colEntries.value, tag.value));
const fileEntryCount = computed(() => countArchiveEntriesByTagFilter(fileEntries.value, tag.value));
const artifactEntryCount = computed(() => countArchiveEntriesByTagFilter(artifactEntries.value, tag.value));
const shareEntryCount = computed(() => countArchiveEntriesByTagFilter(shareEntries.value, tag.value));

const allEntries = computed(() => [
  ...subEntries.value,
  ...colEntries.value,
  ...fileEntries.value,
  ...artifactEntries.value,
  ...shareEntries.value,
].filter((entry) => shouldShowEntry(entry)));

const selectedEntryIdSet = computed(() => new Set(selectedEntryIds.value));
const selectedEntries = computed(() =>
  allEntries.value.filter((entry) => selectedEntryIdSet.value.has(entry.id)),
);
const selectedEntryCount = computed(() => selectedEntries.value.length);
const isAllEntriesSelected = computed(
  () =>
    allEntries.value.length > 0
    && selectedEntryCount.value === allEntries.value.length,
);

const fold = ref<Record<ArchiveGroupKey, boolean>>({
  sub: false,
  col: false,
  file: false,
  artifact: false,
  share: false,
});

const isFold = (key: ArchiveGroupKey) => {
  return fold.value?.[key];
};

const toggleFold = (key: ArchiveGroupKey) => {
  fold.value[key] = !fold.value[key];
};

const getTypeLabel = (type: ArchiveGroupKey) => {
  return t(`specificWord.${archiveTypeLabelKeyMap[type]}`);
};

const getVisibleEntriesByType = (type: ArchiveGroupKey) => {
  const entriesByType: Record<ArchiveGroupKey, ArchiveEntry[]> = {
    sub: filteredSubEntries.value,
    col: filteredColEntries.value,
    file: filteredFileEntries.value,
    artifact: filteredArtifactEntries.value,
    share: filteredShareEntries.value,
  };

  return entriesByType[type];
};

const getVisibleEntryIdsByType = (type: ArchiveGroupKey) => {
  return getVisibleEntriesByType(type).map((entry) => entry.id);
};

const getSelectedEntryCountByType = (type: ArchiveGroupKey) => {
  const selectedIds = selectedEntryIdSet.value;
  return getVisibleEntryIdsByType(type).filter((id) => selectedIds.has(id)).length;
};

const isTypeAllSelected = (type: ArchiveGroupKey) => {
  const visibleEntries = getVisibleEntriesByType(type);
  return visibleEntries.length > 0
    && getSelectedEntryCountByType(type) === visibleEntries.length;
};

const getTypeSelectionButtonLabel = (type: ArchiveGroupKey) => {
  return isTypeAllSelected(type)
    ? t('archivePage.selectMode.clearAll')
    : t('archivePage.selectMode.selectAll');
};

const getTypeSelectionA11yLabel = (type: ArchiveGroupKey) => {
  return isTypeAllSelected(type)
    ? t('archivePage.selectMode.clearTypeAll', {
      type: getTypeLabel(type),
    })
    : t('archivePage.selectMode.selectTypeAll', {
      type: getTypeLabel(type),
    });
};

const clearSelectedEntries = () => {
  selectedEntryIds.value = [];
};

const exitSelectionMode = () => {
  clearSelectedEntries();
  isSelectionMode.value = false;
};

const toggleSelectionMode = () => {
  if (isSelectionMode.value) {
    exitSelectionMode();
    return;
  }

  isSelectionMode.value = true;
};

const isEntrySelected = (entry: ArchiveEntry) => {
  return selectedEntryIdSet.value.has(entry.id);
};

const toggleEntrySelection = (entry: ArchiveEntry) => {
  if (selectedEntryIdSet.value.has(entry.id)) {
    selectedEntryIds.value = selectedEntryIds.value.filter((id) => id !== entry.id);
    return;
  }

  selectedEntryIds.value = [...selectedEntryIds.value, entry.id];
};

const toggleSelectAllEntries = () => {
  if (isAllEntriesSelected.value) {
    clearSelectedEntries();
    return;
  }

  selectedEntryIds.value = allEntries.value.map((entry) => entry.id);
};

const toggleTypeSelection = (type: ArchiveGroupKey) => {
  const typeIds = getVisibleEntryIdsByType(type);
  if (typeIds.length === 0) {
    return;
  }

  if (isTypeAllSelected(type)) {
    const typeIdSet = new Set(typeIds);
    selectedEntryIds.value = selectedEntryIds.value.filter((id) => !typeIdSet.has(id));
    return;
  }

  const nextSelectedIdSet = new Set(selectedEntryIds.value);
  typeIds.forEach((id) => {
    nextSelectedIdSet.add(id);
  });
  selectedEntryIds.value = Array.from(nextSelectedIdSet);
};

watch(
  () => entries.value,
  (value) => {
    const groupedEntries = groupArchiveEntriesByType(value);
    subEntries.value = [...groupedEntries.sub];
    colEntries.value = [...groupedEntries.col];
    fileEntries.value = [...groupedEntries.file];
    artifactEntries.value = [...groupedEntries.artifact];
    shareEntries.value = [...groupedEntries.share];
  },
  { immediate: true, deep: true },
);

watch(
  allEntries,
  (value) => {
    const validIds = new Set(value.map((entry) => entry.id));
    selectedEntryIds.value = selectedEntryIds.value.filter((id) => validIds.has(id));
    if (!value.length) {
      exitSelectionMode();
    }
  },
  { immediate: true, deep: true },
);

const init = async () => {
  pageLoading.value = true;
  pageFetchResult.value = await archiveStore.fetchEntries();
  pageLoading.value = false;
};

const changeSort = async () => {
  const ids = [
    ...subEntries.value,
    ...colEntries.value,
    ...fileEntries.value,
    ...artifactEntries.value,
    ...shareEntries.value,
  ].map((entry) => entry.id);

  const isSucceed = await archiveStore.sortEntries(
    JSON.parse(JSON.stringify(toRaw(ids))),
  );

  if (!isSucceed) {
    sortFailed.value = true;
    showNotify({
      title: t('notify.sortsub.failed'),
      type: 'danger',
    });
  }
};

const handleDragStart = () => {
  dragDisabled.value = true;
};

const handleDragEnd = async () => {
  if (sortFailed.value) {
    await archiveStore.fetchEntries();
    sortFailed.value = false;
  }
  dragDisabled.value = false;
};

const restoreEntry = async (entry: ArchiveEntry) => {
  await archiveStore.restoreEntry(entry);
};

const deleteEntry = async (entry: ArchiveEntry) => {
  await archiveStore.deleteEntry(entry.id);
};

const confirmDeleteEntry = (entry: ArchiveEntry) => {
  openClosableDialog({
    title: t('archivePage.delete.title'),
    content: createVNode(
      'span',
      { style: 'white-space: pre-line;' },
      t('archivePage.delete.desc', {
        displayName: getArchiveEntryDisplayName(entry),
      }),
    ),
    onCancel: () => {},
    onOk: () => deleteEntry(entry),
    popClass: 'auto-dialog',
    cancelText: t('archivePage.delete.btn.cancel'),
    okText: t('archivePage.delete.btn.confirm'),
    closeOnPopstate: true,
    lockScroll: false,
    closeable: true,
    closeIcon: 'close-little',
  });
};

const restoreSelectedEntries = async () => {
  if (selectedEntryCount.value === 0 || isRestoringSelectedEntries.value) {
    return;
  }

  isRestoringSelectedEntries.value = true;
  const restoreTargets = [
    ...selectedEntries.value.filter((entry) => entry.itemType !== 'share'),
    ...selectedEntries.value.filter((entry) => entry.itemType === 'share'),
  ];
  const restoredTypes: ArchiveItemType[] = [];
  const results: boolean[] = [];

  for (const entry of restoreTargets) {
    const isSucceed = await archiveStore.restoreEntry(entry, {
      showNotify: false,
      reloadEntries: false,
      refreshRelatedData: false,
    });

    if (isSucceed) {
      restoredTypes.push(entry.itemType);
    }

    results.push(isSucceed);
  }

  if (restoredTypes.length > 0) {
    await Promise.all([
      archiveStore.fetchEntries(),
      archiveStore.refreshRelatedData(restoredTypes),
    ]);
  }

  const successCount = results.filter(Boolean).length;
  const failedCount = results.length - successCount;

  if (failedCount === 0) {
    showNotify({
      type: 'success',
      title: t('archivePage.restore.succeedNotify'),
    });
    exitSelectionMode();
  } else {
    showNotify({
      type: 'danger',
      title: t('archivePage.restore.failNotify'),
      content: t('archivePage.restore.result', {
        success: successCount,
        failed: failedCount,
      }),
    });
  }

  isRestoringSelectedEntries.value = false;
};

const deleteSelectedEntries = async () => {
  if (selectedEntryCount.value === 0 || isDeletingSelectedEntries.value) {
    return;
  }

  isDeletingSelectedEntries.value = true;
  const deleteTargets = [...selectedEntries.value];
  const results = await Promise.all(
    deleteTargets.map((entry) =>
      archiveStore.deleteEntry(entry.id, {
        showNotify: false,
        reloadEntries: false,
      })),
  );

  await archiveStore.fetchEntries();

  const successCount = results.filter(Boolean).length;
  const failedCount = results.length - successCount;

  if (failedCount === 0) {
    showNotify({
      type: 'danger',
      title: t('archivePage.delete.succeedNotify'),
    });
    exitSelectionMode();
  } else {
    showNotify({
      type: 'danger',
      title: t('archivePage.delete.failNotify'),
      content: t('archivePage.delete.result', {
        success: successCount,
        failed: failedCount,
      }),
    });
  }

  isDeletingSelectedEntries.value = false;
};

const confirmDeleteSelectedEntries = () => {
  if (selectedEntryCount.value === 0 || isDeletingSelectedEntries.value) {
    return;
  }

  openClosableDialog({
    title: t('archivePage.delete.batchTitle'),
    content: createVNode(
      'span',
      { style: 'white-space: pre-line;' },
      t('archivePage.delete.batchDesc', {
        count: selectedEntryCount.value,
      }),
    ),
    onCancel: () => {},
    onOk: deleteSelectedEntries,
    popClass: 'auto-dialog',
    cancelText: t('archivePage.delete.btn.cancel'),
    okText: t('archivePage.delete.btn.confirm'),
    closeOnPopstate: true,
    lockScroll: false,
    closeable: true,
    closeIcon: 'close-little',
  });
};

onMounted(() => {
  init();
});
</script>

<style lang="scss">
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

  p {
    margin-right: 6px;
  }

  :deep(.nut-icon) {
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
  color: var(--comment-text-color);
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

.share-top-selection-toggle svg {
  width: 14px !important;
  height: 14px !important;
  font-size: 14px !important;
}

.share-top-selection-toggle:focus {
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
