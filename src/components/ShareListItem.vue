<template>
  <div
    class="sub-item-wrapper"
    :class="{ disabled: props.disabled, 'is-dual-column': props.isDualColumn }"
    :style="{ padding: itemPadding }"
    data-testid="share-card"
    @click="onClickPreviews"
  >
    <div
      class="sub-img-wrappers"
      :style="{ 'margin-top': imageMarginTop }"
      @click.stop="onClickEdit"
    >
      <div v-if="appearanceSetting.isShowIcon">
        <div v-if="isIconColor">
          <nut-avatar
            :size="avatarSize"
            :url="shareIcon"
            bg-color=""
          />
        </div>
        <div v-else>
          <nut-avatar
            class="sub-item-customer-icon"
            :size="avatarSize"
            :url="shareIcon"
            bg-color=""
          />
        </div>
      </div>
    </div>
    <div class="sub-item-content">
      <div class="sub-item-title-wrapper">
        <h3 v-if="!appearanceSetting.isSimpleMode" class="sub-item-title">
          {{ displayName || name }}
          <span v-for="item in shareTags" :key="item" class="tag">
            <nut-tag>{{ item }}</nut-tag>
          </span>
        </h3>
        <h3
          v-else
          class="sub-item-title"
          style="color: var(--primary-text-color); font-size: 16px"
        >
          {{ displayName || name }}
          <span v-for="item in shareTags" :key="item" class="tag">
            <nut-tag>{{ item }}</nut-tag>
          </span>
        </h3>

        <div
          class="share-item-actions"
          :style="{ top: appearanceSetting.isSimpleMode ? '8px' : '0' }"
        >
          <button
            class="copy-sub-link"
            :disabled="props.disabled"
            @click.stop="onClickShareLink"
          >
            <font-awesome-icon icon="fa-solid fa-link" />
          </button>
          <button
            class="copy-sub-link"
            :disabled="props.disabled"
            @click.stop="onClickCopyLink"
          >
            <font-awesome-icon icon="fa-solid fa-clone" />
          </button>
          <button
            class="refresh-sub-flow"
            :disabled="props.disabled"
            @click.stop="onClickEdit"
          >
            <font-awesome-icon icon="fa-solid fa-pen-nib" />
          </button>
          <button
            class="share-sub-link"
            data-testid="share-delete-button"
            :aria-label="t('sharePage.selectMode.delete')"
            :title="t('sharePage.selectMode.delete')"
            :disabled="props.disabled"
            @click.stop="onClickDelete"
          >
            <font-awesome-icon icon="fa-solid fa-trash-can" />
          </button>
        </div>
      </div>
      <p v-if="!appearanceSetting.isSimpleMode" class="sub-item-remark">
        <span>{{ t(`sharePage.createTimeLabel`) }}{{ createTime }}</span>
      </p>
      <p class="sub-item-remark">
        <span>{{ appearanceSetting.isSimpleMode ? detailLine : nonSimpleSecondLine }}</span>
      </p>

      <p
        v-if="remark && (
          appearanceSetting.isSimpleMode
            ? appearanceSetting.isSimpleShowRemark && !shouldInlineRemarkInSecondLine
            : !isDualNonSimpleMode
        )"
        class="sub-item-remark"
      >
        <span>{{ remark }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import { Dialog, Toast } from "@nutui/nutui";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, createVNode } from "vue";
import { useI18n } from "vue-i18n";
import useV3Clipboard from "vue-clipboard3";
import { useRouter } from "vue-router";
import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import PreviewPanel from "@/components/PreviewPanel.vue";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useAppNotifyStore } from "@/store/appNotify";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { openManagedDeleteDialog } from "@/utils/archive";
import { createGithubProxyUrlRewriter } from "@/utils/githubProxy";
import {
  formatShareTimestamp,
  getShareEditPath,
  getSharePublicUrl,
  resolveShareDisplayIconState,
} from "@/utils/share";
import { normalizeTagArray } from "@/utils/shareTags";

const { showNotify } = useAppNotifyStore();
const router = useRouter();
const props = defineProps<{
  data: Share;
  disabled?: boolean;
  isDualColumn?: boolean;
}>();
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { t } = useI18n();
const { env } = useBackend();
const isArchiveEnabled = computed(() => {
  return env.value?.feature?.archive;
});
const settingsStore = useSettingsStore();
const subsStore = useSubsStore();
const { appearanceSetting, githubProxy, githubProxyRegex } = storeToRefs(settingsStore);
const { currentUrl: host } = useHostAPI();
const avatarSize = computed(() => {
  if (appearanceSetting.value.isSimpleMode) return "36";
  return props.isDualColumn ? "40" : "48";
});
const itemPadding = computed(() => {
  if (appearanceSetting.value.isSimpleMode) return "9px";
  return props.isDualColumn ? "12px" : "16px";
});
const imageMarginTop = computed(() => {
  if (appearanceSetting.value.isSimpleMode) return "5px";
  return props.isDualColumn ? "2px" : "0";
});

const name = computed(() => {
  return props?.data?.name;
});

const displayName = computed(() => {
  return props?.data?.displayName;
});
const remark = computed(() => {
  return props?.data?.remark;
});
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
const type = computed(() => {
  return props?.data?.type;
});
const token = computed(() => {
  return props?.data?.token;
});
const shareTags = computed(() => {
  return normalizeTagArray(props?.data?.tag);
});
const expiresTime = computed(() => {
  return formatShareTimestamp(props?.data?.exp);
});
const createTime = computed(() => {
  return formatShareTimestamp(props?.data?.createdAt);
});
const leftTime = computed(() => {
  return props?.data?.exp
    ? dayjs(props?.data?.exp).diff(dayjs(), "second") > 0
      ? `${t("sharePage.leftTime")} ${dayjs(props?.data?.exp).diff(dayjs(), "day", true).toFixed(0)} ${t("sharePage.createShare.unit.day")}`
      : t("sharePage.expired")
    : 0;
});
const detailLine = computed(() => {
  const baseLine = `${expiresTime.value}${expiresTime.value ? " · " : ""}${leftTime.value}`;

  if (!shouldInlineRemarkInSecondLine.value) {
    return baseLine;
  }

  return [baseLine, remark.value].filter(Boolean).join(" · ");
});
const nonSimpleSecondLine = computed(() => {
  const baseLine = `${expiresTime.value}${expiresTime.value ? " · " : ""}${leftTime.value}`;
  return isDualNonSimpleMode.value
    ? [baseLine, remark.value].filter(Boolean).join(" · ")
    : baseLine;
});

const icon = computed(() => {
  return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon;
});
const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const sourceItem = computed(() => {
  switch (type.value) {
    case "sub":
      return subsStore.getOneSub(name.value) || null;
    case "col":
      return subsStore.getOneCollection(name.value) || null;
    case "file":
      return subsStore.getOneFile(name.value) || null;
    default:
      return null;
  }
});
const shareIconState = computed(() => {
  return resolveShareDisplayIconState({
    share: props.data,
    source: sourceItem.value,
    fallbackIcon: icon.value,
  });
});

const shareIcon = computed(() => {
  return githubUrlRewriter.value(shareIconState.value.icon) || shareIconState.value.icon;
});

const isIconColor = computed(() => {
  return shareIconState.value.isIconColor;
});

const onDeleteConfirm = async (mode: DeleteMode = "permanent") => {
  await subsStore.deleteShare(token.value, type.value, name.value, mode);
};

const onClickEdit = () => {
  if (props.disabled) {
    return;
  }
  if (!type.value || !name.value || !token.value) {
    return;
  }
  router.push(getShareEditPath(type.value, name.value, token.value));
};

const getOneShareOrigin = async (keyName: string) => {
  switch (type.value) {
    case "col":
      return subsStore.getOneCollection(keyName);
    case "sub":
      return subsStore.getOneSub(keyName);
    case "file":
      return subsStore.getOneFile(keyName);
  }
};

const onClickCopyLink = async () => {
  if (props.disabled) {
    return;
  }
  const url = getShareUrl();
  if (isSupported) {
    await copy(url);
  } else {
    await copyFallback(url);
  }
  showNotify({ title: t("sharePage.copyShare.succeedNotify") });
};

const onClickShareLink = async () => {
  if (props.disabled) {
    return;
  }
  try {
    const keyName = encodeURIComponent(name.value);
    const item = await getOneShareOrigin(name.value);
    if (!item) {
      return Toast.text(t("sharePage.noOriginalTips"));
    }
    if (type.value === "file") {
      router.push(`/edit/files/${keyName}`);
    }
    if (type.value === "sub") {
      router.push(`/edit/subs/${keyName}`);
    }
    if (type.value === "col") {
      router.push(`/edit/collections/${keyName}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const onClickDelete = () => {
  if (props.disabled) {
    return;
  }
  openManagedDeleteDialog({
    enabled: isArchiveEnabled.value,
    managedTitle: t("archivePage.liveDelete.title"),
    managedContent: t("archivePage.liveDelete.desc", {
      displayName: displayName.value || name.value,
    }),
    managedCancelText: t("archivePage.liveDelete.btn.archive"),
    managedOkText: t("archivePage.liveDelete.btn.permanent"),
    legacyTitle: t("sharePage.deleteShare.title"),
    legacyContent: t("sharePage.deleteShare.desc", {
      displayName: name.value,
    }),
    legacyCancelText: t("sharePage.deleteShare.btn.cancel"),
    legacyOkText: t("sharePage.deleteShare.btn.confirm"),
    onArchive: () => onDeleteConfirm("archive"),
    onPermanent: () => onDeleteConfirm("permanent"),
  });
};

const secretPath = computed(() => {
  return env.value?.meta?.node?.env?.SUB_STORE_FRONTEND_BACKEND_PATH || "";
});

const getShareUrl = () => {
  try {
    if (!props.data.type || !props.data.name || !props.data.token) {
      return "";
    }
    return getSharePublicUrl({
      host: host.value,
      secretPath: secretPath.value,
      type: props.data.type,
      name: props.data.name,
      token: props.data.token,
    });
  } catch (error) {
    Toast.fail(t("sharePage.magicPathErrorNotify"));
    console.error(error);
    return "";
  }
};

const onClickPreviews = () => {
  if (props.disabled || type.value === "file") {
    return;
  }
  const url = getShareUrl();

  Dialog({
    title: t("subPage.previewTitle"),
    content: createVNode(PreviewPanel, {
      name: name.value,
      displayName: displayName.value,
      type: "share",
      url,
      general: t("subPage.panel.general"),
      notify: t("subPage.copyNotify.succeed"),
      tipsTitle: t("subPage.panel.tips.title"),
      tipsContent: `${t("subPage.panel.tips.content")}\n${t(
        "syncPage.addArtForm.includeUnsupportedProxy.tips.content",
      )}`,
      desc: t("subPage.panel.tips.desc"),
      tipsOkText: t("subPage.panel.tips.ok"),
      tipsCancelText: t("subPage.panel.tips.cancel"),
    }),
    popClass: "auto-dialog",
    // @ts-ignore
    closeOnClickOverlay: true,
    noOkBtn: true,
    noCancelBtn: true,
    closeOnPopstate: true,
    lockScroll: false,
  });
};
</script>

<style lang="scss" scoped>
.sub-item-customer-icon {
  :deep(img) {
    & {
      opacity: 0.8;
      filter: brightness(var(--img-brightness));
    }
  }
}

.sub-item-wrapper {
  line-height: 1.4;
  margin-left: auto;
  margin-right: auto;
  border-radius: var(--item-card-radios);
  display: flex;
  min-width: 0;
  background: var(--card-color);
  cursor: pointer;
  overflow: hidden;

  &.disabled {
    cursor: default;
  }

  :deep(.nut-avatar) {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    margin-right: 15px;
    border-radius: 12px;

    img {
      object-fit: contain;
      border-radius: 10px;
    }
  }

  > .sub-item-content {
    min-width: 0;
    flex: 1;
    line-height: 1.6;
    display: flex;
    flex-direction: column;

    .sub-item-title-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;

      .sub-item-title {
        flex: 1;
        min-width: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        font-size: 16px;
        color: var(--primary-text-color);
      }

      .tag {
        margin: 0 2px;
      }

      .share-item-actions {
        position: relative;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
      }

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
          width: 14px;
          height: 14px;
          color: var(--comment-text-color);
        }

        &:disabled {
          cursor: default;
          opacity: 0.45;
        }
      }

      button {
        white-space: nowrap;
      }
    }

    .sub-item-detail {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      margin-top: 4px;
      font-size: 12px;
      color: var(--comment-text-color);

      span {
        display: block;
        line-height: 1.8;
      }
    }

    .sub-item-remark {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      margin-top: 4px;
      font-size: 12px;
      color: var(--comment-text-color);

      span {
        display: block;
        line-height: 1.5;
      }
    }

    .sub-item-detail-isSimple {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      font-size: 12px;
      max-width: 80%;
      color: var(--comment-text-color);
    }
  }
}

.sub-item-wrapper.is-dual-column {
  :deep(.nut-avatar) {
    margin-right: 12px;
  }

  > .sub-item-content {
    .sub-item-title-wrapper {
      align-items: flex-start;
      gap: 6px;
    }

    .sub-item-title {
      font-size: 15px;
    }

    .sub-item-remark {
      -webkit-line-clamp: 1;
    }
  }
}

.desc-about {
  display: block;
  padding: 100px 30px 350px;
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

.subs-list-wrapper {
  margin-bottom: 36px;
  position: relative;
}

.sub-img-wrappers {
  display: flex;
  align-items: center;
}
</style>
