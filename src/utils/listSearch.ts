import { normalizeTagArray } from "@/utils/shareTags";

interface SearchableListItem {
  name?: unknown;
  displayName?: unknown;
  "display-name"?: unknown;
  remark?: unknown;
  tag?: unknown;
}

interface ListSearchOptions {
  includeRemark?: boolean;
}

interface ListSearchAppearanceSetting {
  isSimpleMode?: boolean;
  isSimpleShowRemark?: boolean;
}

const normalizeSearchText = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

export const getListSearchDisplayName = (item: SearchableListItem) => {
  return (
    normalizeSearchText(item.displayName)
    || normalizeSearchText(item["display-name"])
    || normalizeSearchText(item.name)
  );
};

export const shouldSearchListRemark = (appearanceSetting: ListSearchAppearanceSetting) => {
  return !appearanceSetting.isSimpleMode || Boolean(appearanceSetting.isSimpleShowRemark);
};

export const listItemMatchesSearch = (
  item: SearchableListItem,
  query: string,
  options: ListSearchOptions = {},
) => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    getListSearchDisplayName(item),
    ...normalizeTagArray(item.tag).map(normalizeSearchText),
  ];

  if (options.includeRemark !== false) {
    searchableValues.push(normalizeSearchText(item.remark));
  }

  return searchableValues.some((value) => value.includes(normalizedQuery));
};
