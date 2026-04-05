<template>
  <div
    class="sub-item-wrapper archives-item-wrapper"
    :class="{ disabled: props.disabled, 'is-dual-column': props.isDualColumn }"
    :style="{ padding: itemPadding }"
  >
    <div
      class="sub-img-wrappers"
      :style="{ 'margin-top': appearanceSetting.isSimpleMode ? '5px' : '0' }"
    >
      <div
        class="archives-item-icon"
        :class="{ simple: appearanceSetting.isSimpleMode, 'is-dual-column': props.isDualColumn }"
      >
        <img
          :src="displayItemIcon"
          alt=""
          :style="{
            opacity: isIconColor ? 1 : 0.8,
            filter: isIconColor ? 'none' : 'brightness(var(--img-brightness))',
          }"
        >
      </div>
    </div>
    <div class="sub-item-content archives-item-content">
      <div class="sub-item-title-wrapper archives-item-title-wrapper">
        <h3
          v-if="!appearanceSetting.isSimpleMode"
          class="sub-item-title archives-item-title"
        >
          {{ displayName }}
          <span
            v-for="item in tags"
            :key="item"
            class="tag"
          >
            <nut-tag>{{ item }}</nut-tag>
          </span>
        </h3>
        <h3
          v-else
          class="sub-item-title archives-item-title"
          style="color: var(--primary-text-color); font-size: 16px"
        >
          {{ displayName }}
          <span
            v-for="item in tags"
            :key="item"
            class="tag"
          >
            <nut-tag>{{ item }}</nut-tag>
          </span>
        </h3>
        <div
          class="archives-item-actions"
          :style="{ top: appearanceSetting.isSimpleMode ? '8px' : '0' }"
        >
          <button
            class="refresh-sub-flow"
            :disabled="props.disabled"
            :title="$t('archivePage.entry.restore')"
            @click.stop="emit('restore', props.data)"
          >
            <font-awesome-icon icon="fa-solid fa-reply" />
          </button>
          <button
            class="share-sub-link archives-danger-action"
            :disabled="props.disabled"
            :title="$t('archivePage.entry.delete')"
            @click.stop="emit('delete', props.data)"
          >
            <font-awesome-icon icon="fa-solid fa-trash-can" />
          </button>
        </div>
      </div>
      <template v-if="isDualNonSimpleMode">
        <p class="sub-item-remark archives-item-detail dual-non-simple-line">
          {{ nonSimplePrimaryLine }}
        </p>
        <p class="sub-item-remark archives-item-detail dual-non-simple-line">
          {{ nonSimpleSecondLine }}
        </p>
      </template>
      <template v-else>
        <p
          v-if="detailLineWithInlineRemark"
          class="sub-item-remark archives-item-detail"
          :class="{ 'sub-item-detail-isSimple': appearanceSetting.isSimpleMode }"
        >
          {{ detailLineWithInlineRemark }}
        </p>
        <p
          v-if="archiveTimeLine && !appearanceSetting.isSimpleMode"
          class="sub-item-remark archives-item-detail"
        >
          {{ archiveTimeLine }}
        </p>
        <p
          v-if="remark && (!appearanceSetting.isSimpleMode || appearanceSetting.isSimpleShowRemark) && !shouldInlineRemarkInSecondLine"
          class="sub-item-remark archives-item-remark"
        >
          {{ remark }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import logoIcon from '@/assets/icons/logo.png';
import logoRedIcon from '@/assets/icons/logo-red.png';
import { useSettingsStore } from '@/store/settings';
import { useSubsStore } from '@/store/subs';
import { resolveArtifactIcon } from '@/utils/artifactIcon';
import { createGithubProxyUrlRewriter } from '@/utils/githubProxy';
import {
  formatArchiveTime,
  getArchiveEntryDisplayName,
  getArchiveTypeLabelKey,
} from '@/utils/archive';

const props = defineProps<{
  data: ArchiveEntry;
  disabled?: boolean;
  isDualColumn?: boolean;
}>();

const emit = defineEmits(['restore', 'delete']);

const { t } = useI18n();
const settingsStore = useSettingsStore();
const subsStore = useSubsStore();
const { appearanceSetting, githubProxy, githubProxyRegex } = storeToRefs(settingsStore);
const itemPadding = computed(() => {
  if (appearanceSetting.value.isSimpleMode) return '10px 12px';
  return props.isDualColumn ? '12px' : '14px 16px';
});

const displayName = computed(() => getArchiveEntryDisplayName(props.data));
const remark = computed(() => props.data?.remark || '');
const shouldInlineRemarkInSecondLine = computed(() => {
  return Boolean(
    props.isDualColumn
    && appearanceSetting.value.isSimpleMode
    && remark.value
    && appearanceSetting.value.isSimpleShowRemark
  );
});
const isDualNonSimpleMode = computed(() => {
  return Boolean(
    props.isDualColumn
    && !appearanceSetting.value.isSimpleMode,
  );
});
const tags = computed(() => props.data?.tag || []);
const itemType = computed(() => props.data?.itemType);
const shareType = computed(() => props.data?.shareType);
const archivedAt = computed(() => formatArchiveTime(props.data?.archivedAt));
const icon = computed(() => {
  return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon;
});
const artifactSnapshot = computed(() => {
  return itemType.value === 'artifact' ? props.data?.snapshot : null;
});
const artifactSourceItem = computed(() => {
  if (itemType.value !== 'artifact' || !artifactSnapshot.value?.source) {
    return null;
  }

  switch (artifactSnapshot.value.type) {
    case 'collection':
      return subsStore.getOneCollection(artifactSnapshot.value.source);
    case 'subscription':
      return subsStore.getOneSub(artifactSnapshot.value.source);
    case 'file':
      return subsStore.getOneFile(artifactSnapshot.value.source);
    default:
      return null;
  }
});
const artifactSourceIcon = computed(() => {
  if (
    itemType.value !== 'artifact'
    || artifactSnapshot.value?.type !== 'file'
    || !artifactSnapshot.value?.source
  ) {
    return null;
  }

  return subsStore.getOneFile(artifactSnapshot.value.source)?.icon || null;
});
const artifactSourceType = computed(() => {
  switch (artifactSnapshot.value?.type) {
    case 'subscription':
      return t('specificWord.singleSub');
    case 'collection':
      return t('specificWord.collectionSub');
    case 'file':
      return t('specificWord.file');
    default:
      return t('specificWord.unknownType');
  }
});
const artifactSourceName = computed(() => {
  const sourceItem = artifactSourceItem.value;

  if (sourceItem) {
    return (
      sourceItem.displayName
      || sourceItem['display-name']
      || sourceItem.name
    );
  }

  return artifactSnapshot.value?.source
    ? `${artifactSnapshot.value.source}(🚫)`
    : t('specificWord.unknownSource');
});

const itemIcon = computed(() => {
  switch (itemType.value) {
    case 'sub':
      return props.data?.snapshot?.icon || icon.value;
    case 'col':
      return props.data?.snapshot?.icon || icon.value;
    case 'file':
      return props.data?.snapshot?.icon || icon.value;
    case 'artifact':
      return resolveArtifactIcon({
        artifact: artifactSnapshot.value,
        isDefaultIcon: appearanceSetting.value.isDefaultIcon,
        sourceIcon: artifactSourceIcon.value,
      });
    case 'share':
      return icon.value;
    default:
      return icon.value;
  }
});
const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const displayItemIcon = computed(() => {
  return githubUrlRewriter.value(itemIcon.value) || itemIcon.value;
});

const isIconColor = computed(() => {
  if (itemType.value === 'share') {
    return true;
  }

  return props.data?.snapshot?.isIconColor !== false;
});

const detailParts = computed(() => {
  if (itemType.value === 'artifact') {
    return appearanceSetting.value.isSimpleMode
      ? [artifactSourceType.value, artifactSourceName.value]
      : [
          t('syncPage.detail.firstLine', {
            type: artifactSourceType.value,
            name: artifactSourceName.value,
          }),
        ];
  }

  if (
    itemType.value === 'sub'
    || itemType.value === 'col'
    || itemType.value === 'file'
  ) {
    return [];
  }

  const parts = [
    t(`specificWord.${getArchiveTypeLabelKey(itemType.value)}`),
  ];

  if (itemType.value === 'share' && shareType.value) {
    parts.push(t(`specificWord.${getArchiveTypeLabelKey(shareType.value)}`));
  }

  return parts;
});

const archiveTimeLine = computed(() => {
  return archivedAt.value
    ? t('archivePage.entry.archivedAt', {
        time: archivedAt.value,
      })
    : '';
});

const detailLine = computed(() => {
  if (
    !appearanceSetting.value.isSimpleMode
    && (
      itemType.value === 'sub'
      || itemType.value === 'col'
      || itemType.value === 'file'
    )
  ) {
    return '';
  }

  const parts = [...detailParts.value];

  if (appearanceSetting.value.isSimpleMode && archivedAt.value) {
    parts.push(archivedAt.value);
  }

  if (itemType.value === 'artifact' && appearanceSetting.value.isSimpleMode) {
    const [type, name, time] = parts;
    const sourceText = [type, name].filter(Boolean).join(' ');
    return time ? `${sourceText} · ${time}` : sourceText;
  }

  return parts.join(' · ');
});
const detailLineWithInlineRemark = computed(() => {
  if (!shouldInlineRemarkInSecondLine.value) {
    return detailLine.value;
  }

  return [detailLine.value, remark.value].filter(Boolean).join(" · ");
});
const nonSimplePrimaryLine = computed(() => {
  return detailLine.value || archiveTimeLine.value;
});
const nonSimpleSecondLine = computed(() => {
  if (!detailLine.value) {
    return remark.value;
  }

  return [archiveTimeLine.value, remark.value].filter(Boolean).join(" · ");
});
</script>

<style lang="scss" scoped>
.sub-item-wrapper {
  line-height: 1.4;
  margin-left: auto;
  margin-right: auto;
  border-radius: var(--item-card-radios);
  display: flex;
  min-width: 0;
  background: var(--card-color);
  cursor: default;
  overflow: hidden;

  &.disabled {
    opacity: 0.92;
  }
}

.sub-img-wrappers {
  display: flex;
  align-items: center;
}

.archives-item-icon {
  width: 48px;
  height: 48px;
  margin-right: 15px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &.simple {
    width: 36px;
    height: 36px;
  }

  &.is-dual-column:not(.simple) {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
  }
}

.sub-item-content {
  min-width: 0;
  flex: 1;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
}

.sub-item-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.sub-item-title {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  color: var(--primary-text-color);
  font-size: 16px;
  line-height: 1.4;

  .tag {
    margin: 0 2px;
  }
}

.archives-item-actions {
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  .share-sub-link,
  .copy-sub-link,
  .refresh-sub-flow {
    background-color: transparent;
    border: none;
    padding: 0 8px;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 16px;
      height: 16px;
      color: var(--comment-text-color);
    }

    &:disabled {
      cursor: default;
      opacity: 0.45;
    }
  }
}

.archives-danger-action {
  :deep(svg) {
    color: var(--danger-color);
  }
}

.archives-item-detail,
.archives-item-remark {
  margin-top: 6px;
  color: var(--comment-text-color);
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
}

.archives-item-wrapper.is-dual-column {
  .sub-item-title-wrapper {
    align-items: flex-start;
    gap: 6px;
  }

  .archives-item-title {
    font-size: 15px;
  }

  .archives-item-detail {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .dual-non-simple-line {
    min-height: 18px;
  }

  .archives-item-remark {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
</style>
