interface ArchiveStoreState {
  entries: ArchiveEntry[];
}

interface ArchiveEntry {
  id: string;
  archivedAt?: number;
  itemType: ArchiveItemType;
  shareType?: 'sub' | 'col' | 'file';
  name?: string;
  displayName?: string | null;
  remark?: string | null;
  tag?: string[];
  snapshot?: any;
}
