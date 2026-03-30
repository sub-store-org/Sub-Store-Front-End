import dayjs from 'dayjs';
import { Dialog } from '@nutui/nutui';
import { createVNode } from 'vue';

import { normalizeTagArray } from '@/utils/shareTags';

export const ARCHIVE_TYPE_ORDER: ArchiveItemType[] = [
  'sub',
  'col',
  'file',
  'artifact',
  'share',
];

const archiveTypeLabelKeyMap: Record<ArchiveItemType, string> = {
  sub: 'singleSub',
  col: 'collectionSub',
  file: 'file',
  artifact: 'syncConfig',
  share: 'share',
};

export const normalizeArchiveItemType = (
  value: string | null | undefined,
): ArchiveItemType => {
  if (value === 'collection') {
    return 'col';
  }

  if (
    value === 'sub'
    || value === 'col'
    || value === 'file'
    || value === 'artifact'
    || value === 'share'
  ) {
    return value;
  }

  return 'share';
};

export const normalizeArchiveEntry = (
  entry: ArchiveEntry,
): ArchiveEntry => {
  return {
    ...entry,
    itemType: normalizeArchiveItemType(entry?.itemType),
    shareType:
      entry?.shareType === 'sub'
      || entry?.shareType === 'col'
      || entry?.shareType === 'file'
        ? entry.shareType
        : undefined,
    tag: normalizeTagArray(entry?.tag),
  };
};

export const groupArchiveEntriesByType = (
  entries: ArchiveEntry[],
): Record<ArchiveItemType, ArchiveEntry[]> => {
  return {
    sub: entries.filter((entry) => entry.itemType === 'sub'),
    col: entries.filter((entry) => entry.itemType === 'col'),
    file: entries.filter((entry) => entry.itemType === 'file'),
    artifact: entries.filter((entry) => entry.itemType === 'artifact'),
    share: entries.filter((entry) => entry.itemType === 'share'),
  };
};

export const getArchiveTypeLabelKey = (type: ArchiveItemType) => {
  return archiveTypeLabelKeyMap[type];
};

export const getArchiveEntryDisplayName = (entry: ArchiveEntry) => {
  return entry.displayName || entry.name || entry.id;
};

export const formatArchiveTime = (value?: number) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '';
};

export const openClosableDialog = (options: Record<string, any>) => {
  (Dialog as any)(options);
};

interface ManagedDeleteDialogOptions {
  enabled: boolean;
  managedTitle: string;
  managedContent: string;
  managedCancelText: string;
  managedOkText: string;
  legacyTitle: string;
  legacyContent: string;
  legacyCancelText: string;
  legacyOkText: string;
  onArchive: () => void | Promise<void>;
  onPermanent: () => void | Promise<void>;
}

export const openManagedDeleteDialog = ({
  enabled,
  managedTitle,
  managedContent,
  managedCancelText,
  managedOkText,
  legacyTitle,
  legacyContent,
  legacyCancelText,
  legacyOkText,
  onArchive,
  onPermanent,
}: ManagedDeleteDialogOptions) => {
  openClosableDialog({
    title: enabled ? managedTitle : legacyTitle,
    content: createVNode(
      'span',
      {
        style: 'white-space: pre-line;',
      },
      enabled ? managedContent : legacyContent,
    ),
    onCancel: enabled ? onArchive : () => {},
    onOk: onPermanent,
    popClass: 'auto-dialog',
    cancelText: enabled ? managedCancelText : legacyCancelText,
    okText: enabled ? managedOkText : legacyOkText,
    closeOnPopstate: true,
    lockScroll: false,
    closeable: true,
    closeIcon: 'close-little',
  });
};
