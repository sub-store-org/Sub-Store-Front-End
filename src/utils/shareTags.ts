export const ALL_SHARE_TAG = "all";
export const UNTAGGED_SHARE_TAG = "untagged";

export interface TagOption {
  label: string;
  value: string;
}

interface TaggableItem {
  tag?: unknown;
}

export const normalizeTagArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return [...new Set(
      value
        .map((item) => typeof item === "string" ? item.trim() : "")
        .filter(Boolean),
    )];
  }

  if (typeof value === "string") {
    return [...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    )];
  }

  return [];
};

export const stringifyTagInput = (value: unknown): string => {
  return normalizeTagArray(value).join(", ");
};

export const buildShareTagOptions = (
  shares: TaggableItem[],
  labels: { all: string; untagged: string },
): TagOption[] => {
  const tags = new Set<string>();
  let hasUntagged = false;

  shares.forEach((share) => {
    const normalizedTags = normalizeTagArray(share.tag);
    if (normalizedTags.length === 0) {
      hasUntagged = true;
      return;
    }

    normalizedTags.forEach((tag) => {
      tags.add(tag);
    });
  });

  if (tags.size === 0) {
    return [{ label: labels.all, value: ALL_SHARE_TAG }];
  }

  const options: TagOption[] = [
    { label: labels.all, value: ALL_SHARE_TAG },
    ...Array.from(tags).map((tag) => ({ label: tag, value: tag })),
  ];

  if (hasUntagged) {
    options.push({ label: labels.untagged, value: UNTAGGED_SHARE_TAG });
  }

  return options;
};

export const resolveShareTagFilter = (
  currentTag: string | null | undefined,
  options: TagOption[],
): string => {
  if (currentTag && options.some((option) => option.value === currentTag)) {
    return currentTag;
  }

  return ALL_SHARE_TAG;
};

export const shareMatchesTagFilter = (
  share: TaggableItem,
  currentTag: string,
): boolean => {
  if (currentTag === ALL_SHARE_TAG) {
    return true;
  }

  const tags = normalizeTagArray(share.tag);

  if (currentTag === UNTAGGED_SHARE_TAG) {
    return tags.length === 0;
  }

  return tags.includes(currentTag);
};

export const countSharesByTagFilter = (
  shares: TaggableItem[],
  currentTag: string,
): number => {
  return shares.filter((share) => shareMatchesTagFilter(share, currentTag)).length;
};

export const groupSharesByType = (shares: Share[]) => {
  return {
    sub: shares.filter((share) => share.type === "sub"),
    col: shares.filter((share) => share.type === "col"),
    file: shares.filter((share) => share.type === "file"),
  };
};
