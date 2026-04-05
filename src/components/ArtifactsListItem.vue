<template>
  <nut-swipe
    class="sub-item-swipe"
    :class="{ 'is-dual-column': props.isDualColumn }"
    ref="swipe"
    @close="setIsMoveClose()"
    @open="setIsMoveOpen()"
    :disabled="props.disabled"
  >
    <div
      class="sub-item-wrapper"
      :class="{ 'is-dual-column': props.isDualColumn }"
      :style="{ padding: itemPadding }"
      @click="handleContentClick"
    >
      <div v-if="appearanceSetting.isShowIcon" class="sub-img-wrappers" @click.stop="openUrl">
        <nut-avatar
          :class="{ 'sub-item-customer-icon': !isIconColor }"
          :size="avatarSize"
          :url="displayIcon"
          bg-color=""
        ></nut-avatar>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 class="sub-item-title">
            {{ displayName }}
            <span v-for="item in tag" :key="item" class="tag">
              <nut-tag>{{ item }}</nut-tag>
            </span>
          </h3>
          <div class="title-right-wrapper" v-if="!appearanceSetting.isSimpleMode">
            <button
              v-if="!appearanceSetting.isShowIcon && artifact.url"
              class="copy-sub-link"
              @click.stop="openUrl"
            >
              <font-awesome-icon icon="fa-solid fa-eye" />
            </button>
            <button
              class="copy-sub-link"
              style="padding: 0 12px"
              v-if="artifact.url"
              @click.stop="onClickCopyLink"
            >
              <font-awesome-icon icon="fa-solid fa-clone"></font-awesome-icon>
            </button>
            <button
              class="copy-sub-link"
              @click.stop="onClickEdit"
            >
              <font-awesome-icon icon="fa-solid fa-pen-nib" />
            </button>
            <button
              class="copy-sub-link"
              @click.stop="swipeController"
              v-if="!isMobile()"
              ref="moreAction"
            >
              <font-awesome-icon icon="fa-solid fa-angles-right" />
            </button>
          </div>
        </div>

        <div class="sub-item-detail">
          <p>
            {{ detail.firstLine }}
          </p>
          <div class="second-line-wrapper">
            <p :class="{ 'dual-non-simple-second-line': isDualNonSimpleMode }">
              {{
                appearanceSetting.isSimpleMode
                  ? simpleDetailSecondLine
                  : nonSimpleDetailSecondLine
              }}
            </p>
            <div class="task-switch">
              <div v-if="appearanceSetting.isSimpleMode">
                <div class="simple-actions">
                <button
                  v-if="!appearanceSetting.isShowIcon && artifact.url"
                  class="copy-sub-link"
                  @click.stop="openUrl"
                >
                  <font-awesome-icon icon="fa-solid fa-eye" />
                </button>
                <button
                  v-if="artifact.url"
                  class="copy-sub-link"
                  style="padding: 0 12px"
                  @click.stop="onClickCopyLink"
                >
                  <font-awesome-icon
                    icon="fa-solid fa-clone"
                  ></font-awesome-icon>
                </button>
                <button
                  class="copy-sub-link"
                  @click.stop="onClickEdit"
                >
                  <font-awesome-icon icon="fa-solid fa-pen-nib" />
                </button>
                <button
                    class="copy-sub-link"
                    @click.stop="swipeController"
                    v-if="!isMobile()"
                    ref="moreAction"
                  >
                  <font-awesome-icon icon="fa-solid fa-angles-right" />
                </button>
                </div>
              </div>
              <span class="switch-label" v-if="!appearanceSetting.isSimpleMode">
                {{ $t(`syncPage.syncSwitcher`) }}
              </span>
              <span @click.stop>
                <nut-switch
                  class="my-switch"
                  v-model="isSyncOpen"
                  :loading="isSwitcherLoading"
                />
              </span>
            </div>
          </div>
        </div>
        <p
          v-if="remark && (
            appearanceSetting.isSimpleMode
              ? appearanceSetting.isSimpleShowRemark && !shouldInlineRemarkInSecondLine
              : !isDualNonSimpleMode
          )"
          class="sub-item-remark"
        >
          <span>{{ remarkText }}</span>
        </p>
      </div>
    </div>

    <template v-if="appearanceSetting.isLeftRight" #left>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="primary"
          class="sub-item-swipe-btn"
          @click="onClickSync"
        >
          <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="warning"
          class="sub-item-swipe-btn"
          @click="onClickEdit"
        >
          <font-awesome-icon icon="fa-solid fa-pen-nib" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="danger"
          class="sub-item-swipe-btn"
          @click="onClickDelete"
        >
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>
    </template>

    <template v-else #right>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="primary"
          class="sub-item-swipe-btn"
          @click="onClickSync"
        >
          <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="warning"
          class="sub-item-swipe-btn"
          @click="onClickEdit"
        >
          <font-awesome-icon icon="fa-solid fa-pen-nib" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="danger"
          class="sub-item-swipe-btn"
          @click="onClickDelete"
        >
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>
    </template>
  </nut-swipe>
</template>

<script lang="ts" setup>
import { useAppNotifyStore } from "@/store/appNotify";
import { useArtifactsStore } from "@/store/artifacts";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { butifyDate } from "@/utils/butifyDate";
import { resolveArtifactIcon } from "@/utils/artifactIcon";
import { createGithubProxyUrlRewriter } from "@/utils/githubProxy";
import { isMobile } from "@/utils/isMobile";
import { Dialog, Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref, toRaw, watch, watchEffect } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";
import { useGlobalStore } from "@/store/global";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useBackend } from "@/hooks/useBackend";
import { openManagedDeleteDialog } from "@/utils/archive";
const globalStore = useGlobalStore();
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t } = useI18n();
const { currentUrl: host } = useHostAPI();
const { env } = useBackend();
const isArchiveEnabled = computed(() => {
  return env.value?.feature?.archive;
});

const props = defineProps<{
  name: string;
  disabled?: boolean;
  isDualColumn?: boolean;
}>();

const { showNotify } = useAppNotifyStore();
const subsStore = useSubsStore();
const artifactsStore = useArtifactsStore();
const settingsStore = useSettingsStore();
const { appearanceSetting, githubProxy, githubProxyRegex } = storeToRefs(settingsStore);
const { artifacts } = storeToRefs(artifactsStore);
const artifact = computed(() => {
  return artifacts.value.find((item) => item.name === props.name);
});
const emit = defineEmits(["edit"]);

const displayName = computed(() => {
  return (
    artifact.value.displayName ||
    artifact.value["display-name"] ||
    artifact.value.name
  );
});
const tag = computed(() => artifact.value?.tag || []);
const remark = computed(() => artifact.value?.remark || "");
const remarkText = computed(() => {
  if (remark.value) {
    return remark.value;
  }
  return "";
});
const shouldInlineRemarkInSecondLine = computed(() => {
  return Boolean(
    props.isDualColumn
    && appearanceSetting.value.isSimpleMode
    && remarkText.value
    && appearanceSetting.value.isSimpleShowRemark
  );
});
const isDualNonSimpleMode = computed(() => {
  return Boolean(
    props.isDualColumn
    && !appearanceSetting.value.isSimpleMode,
  );
});
const avatarSize = computed(() => {
  if (appearanceSetting.value.isSimpleMode) return "36";
  return props.isDualColumn ? "40" : "48";
});
const itemPadding = computed(() => {
  if (appearanceSetting.value.isSimpleMode) return "9px";
  return props.isDualColumn ? "12px" : "16px";
});

const isInit = ref(false);
const isSyncOpen = ref(false);
const isSwitcherLoading = ref(false);
const moreAction = ref();
const swipe = ref();
const swipeIsOpen = ref(false);

const sourceSub = computed(() => {
  const name = artifact.value.source;
  switch (artifact.value.type) {
    case "collection":
      return subsStore.getOneCollection(name);
    case "subscription":
      return subsStore.getOneSub(name);
    case "file":
      return subsStore.getOneFile(name);
  }
});
const isIconColor = computed(() => {
  return artifact.value.isIconColor !== false;
});

const icon = computed(() => {
  return resolveArtifactIcon({
    artifact: artifact.value,
    isDefaultIcon: appearanceSetting.value.isDefaultIcon,
    sourceIcon: sourceSub.value?.icon,
  });
});
const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const displayIcon = computed(() => {
  return githubUrlRewriter.value(icon.value) || icon.value;
});


const sourceUrl = computed(() => {
  if (!artifact.value.type) {
    return "";
  }
  if (artifact.value.type === "file") {
    const path = `/api/file/${encodeURIComponent(artifact.value.source)}`;
    const url = `${host.value}${path}`;
    return url;
  }
  const urlTarget: string =
    artifact.value.platform !== null
      ? `?target=${artifact.value.platform}`
      : "";
  let urlIncludeUnsupportedProxy = artifact.value.includeUnsupportedProxy
    ? `includeUnsupportedProxy=true`
    : "";
  if (urlTarget && urlIncludeUnsupportedProxy) {
    urlIncludeUnsupportedProxy = `&${urlIncludeUnsupportedProxy}`;
  } else if (urlIncludeUnsupportedProxy) {
    urlIncludeUnsupportedProxy = `?${urlIncludeUnsupportedProxy}`;
  }
  return `${host.value}/download/${
    artifact.value.type === "subscription" ? "" : "collection/"
  }${encodeURIComponent(
    artifact.value.source
  )}${urlTarget}${urlIncludeUnsupportedProxy}`;
});

const openUrl = () => {
  if (artifact.value.url) {
    window.open(artifact.value.url);
  }
};

const ismove = ref(false);

const setIsMoveOpen = () => {
  ismove.value = true;

  setTimeout(() => {
    swipeIsOpen.value = true;
    if (moreAction.value) moreAction.value.style.transform = "rotate(180deg)";

    setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 10);
  }, 100);

  setTimeoutTF();
};

const setIsMoveClose = () => {
  ismove.value = true;
  swipeIsOpen.value = false;
  if (moreAction.value) moreAction.value.style.transform = "rotate(0deg)";

  document.removeEventListener('click', handleGlobalClick);

  setTimeoutTF();
};

// 增加延迟防止打开时 触发不了
const setTimeoutTF = () => {
  setTimeout(() => {
    ismove.value = false;
  }, 200);
};

const handleGlobalClick = (event: MouseEvent) => {
  const swipeRightEl = document.querySelector('.nut-swipe__right');
  const swipeLeftEl = document.querySelector('.nut-swipe__left');

  if ((swipeRightEl && swipeRightEl.contains(event.target as Node)) ||
      (swipeLeftEl && swipeLeftEl.contains(event.target as Node))) {
    return;
  }

  swipe.value.close();
  swipeIsOpen.value = false;
  if (moreAction.value) moreAction.value.style.transform = "rotate(0deg)";

  document.removeEventListener('click', handleGlobalClick);
};

const handleContentClick = (event: MouseEvent) => {
  event.stopPropagation();

  if (swipeIsOpen.value) {
    swipe.value.close();
    swipeIsOpen.value = false;
    if (moreAction.value) moreAction.value.style.transform = "rotate(0deg)";
    return;
  }

  if (!ismove.value && sourceUrl.value) {
    openPreviewSource();
  }
};

const openPreviewSource = () => {
  if (ismove.value || !sourceUrl.value) return;
  Dialog({
    title: t("tabBar.sub"),
    content: sourceUrl.value,
    onCancel: () => {},
    onOk: () => {
      window.open(sourceUrl.value);
    },
    onOpened: () => swipe.value.close(),
    popClass: "auto-dialog",
    okText: t("editorPage.subConfig.basic.previewSwitch"),
    closeOnPopstate: true,
    lockScroll: false,
  });
};

const transferText = (type: string) => {
  const transType = () => {
    switch (artifact.value.type) {
      case "subscription":
        return t("specificWord.singleSub");
      case "collection":
        return t("specificWord.collectionSub");
      case "file":
        return t("specificWord.file");
      default:
        return t("specificWord.unknownType");
    }
  };

  const transTime = () => {
    if (appearanceSetting.value.isSimpleMode) {
      return artifact.value.updated ? butifyDate(artifact.value.updated) : "";
    } else {
      return artifact.value.updated
        ? t(`syncPage.detail.secondLine`, {
            time: butifyDate(artifact.value.updated),
          })
        : t(`syncPage.detail.notSync`);
    }
  };

  switch (type) {
    case "type":
      return transType();
    case "time":
      return transTime();
  }
};

const detail = computed(() => {
  const name = sourceSub.value
    ? sourceSub.value?.displayName ||
      sourceSub.value?.["display-name"] ||
      sourceSub.value?.name
    : (artifact.value.source ?`${artifact.value.source}(🚫)` : t("specificWord.unknownSource"));
  const type = transferText("type") || "";
  if (appearanceSetting.value.isSimpleMode) {
    return {
      firstLine: "",
      secondLine: type + " " + name + " " + transferText("time"),
    };
  } else {
    return {
      firstLine: t(`syncPage.detail.firstLine`, {
        type,
        name,
      }),
      secondLine: transferText("time"),
    };
  }
});
const simpleDetailSecondLine = computed(() => {
  if (!shouldInlineRemarkInSecondLine.value) {
    return detail.value.secondLine;
  }

  return [detail.value.secondLine, remarkText.value].filter(Boolean).join(" · ");
});
const nonSimpleDetailSecondLine = computed(() => {
  return [detail.value.secondLine, remarkText.value].filter(Boolean).join(" · ");
});

const swipeController = () => {
  if (swipeIsOpen.value) {
    swipe.value.close();
    swipeIsOpen.value = false;
    if(moreAction.value) moreAction.value.style.transform = "rotate(0deg)";

    document.removeEventListener('click', handleGlobalClick);
  } else {
    if (appearanceSetting.value.isLeftRight) {
      swipe.value.open("right");
      setTimeout(() => {
        swipeIsOpen.value = true;
        setTimeout(() => {
          document.addEventListener('click', handleGlobalClick);
        }, 10);
      }, 100);
    } else {
      swipe.value.open("left");
      setTimeout(() => {
        swipeIsOpen.value = true;
        if(moreAction.value) moreAction.value.style.transform = "rotate(180deg)";

        setTimeout(() => {
          document.addEventListener('click', handleGlobalClick);
        }, 10);
      }, 100);
    }
  }
};

const onClickCopyLink = async () => {
  if (isSupported) {
    await copy(encodeURI(artifact.value.url));
  } else {
    await copyFallback(encodeURI(artifact.value.url));
  }
  showNotify({ title: t("syncPage.copyNotify.succeed"), type: "success" });
};

const onDeleteConfirm = async (mode: DeleteMode = "permanent") => {
  const shouldShowToast = artifact.value.updated
  if (shouldShowToast) {
    Toast.loading("正在删除...", {
      cover: true,
      id: "delete-toast",
    });
  }

  await artifactsStore.deleteArtifact(artifact.value.name, mode);

  if (shouldShowToast) {
    Toast.hide("delete-toast");
  }
};

const onClickSync = async () => {
  Toast.loading("同步中...", {
    cover: true,
    id: "sync-toast",
  });
  await artifactsStore.syncOneArtifact(artifact.value.name);
  await settingsStore.fetchSettings();
  Toast.hide("sync-toast");
};

const onClickEdit = () => {
  emit("edit", artifact.value);
};

const onClickDelete = () => {
  openManagedDeleteDialog({
    enabled: isArchiveEnabled.value,
    managedTitle: t("archivePage.liveDelete.title"),
    managedContent: [
      t("archivePage.liveDelete.desc", { displayName: displayName.value }),
      t("syncPage.deleteArt.archiveExtra"),
    ].join("\n\n"),
    managedCancelText: t("archivePage.liveDelete.btn.archive"),
    managedOkText: t("archivePage.liveDelete.btn.permanent"),
    legacyTitle: t("syncPage.deleteArt.title"),
    legacyContent: t("syncPage.deleteArt.desc", { displayName: displayName.value }),
    legacyCancelText: t("syncPage.deleteArt.btn.cancel"),
    legacyOkText: t("syncPage.deleteArt.btn.confirm"),
    onArchive: () => onDeleteConfirm("archive"),
    onPermanent: () => onDeleteConfirm("permanent"),
  });
};

// 初始化开关状态
watchEffect(() => {
  if (!isInit.value && artifact.value.name) {
    isSyncOpen.value = artifact.value.sync;
    isInit.value = true;
  } else {
  }
});

// 切换开关修改数据
watch(isSyncOpen, async () => {
  if (!isInit.value) return;
  isSwitcherLoading.value = true;
  const data = toRaw(artifact.value);
  data.sync = !artifact.value.sync;
  await artifactsStore.editArtifact(artifact.value.name, data);
  isSwitcherLoading.value = false;
});
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
  line-height: 1.6;
  // width: calc(100% - 24px);
  margin-left: auto;
  margin-right: auto;
  border-radius: var(--item-card-radios);
  // padding: var(--safe-area-side);
  display: flex;
  flex-direction: row; //
  justify-content: flex-end; //
  min-width: 0;
  background: var(--card-color);
  cursor: pointer;
  overflow: hidden;

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

  .sub-item-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    .sub-item-title-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;

      .sub-item-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        font-size: 16px;
        color: var(--primary-text-color);

        .tag {
          margin-left: 4px;
          display: inline-flex;
          vertical-align: middle;
        }
      }

      .title-right-wrapper {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
      }
    }

    .sub-item-detail {
      word-wrap: break-word;
      // margin-top: 3.5px;
      font-size: 12px;

      .second-line-wrapper {
        width: 100%;
        display: flex;
        align-items: flex-start;

        > p {
          flex: 1 1 auto;
          min-width: 0;
          padding-right: 8px;
        }

        .task-switch {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: flex-end; // ios 14
          margin-left: auto;

          .simple-actions {
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }

          span {
            margin-right: 6px;
            font-weight: normal;
            // line-height: 2.8;
            color: var(--comment-text-color);
          }
          .switch-label {
            flex-shrink: 0;
          }

          .my-switch {
            height: 22px;
            width: 45px;
            min-width: 40px;

            :deep(.switch-button) {
              width: 18px;
              height: 18px;
            }
          }
        }
      }

      p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        word-break: break-all;
        line-height: 1.8;
      }

      color: var(--comment-text-color);
    }

    .sub-item-remark {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
      line-height: 1.8;
      font-size: 12px;
      color: var(--comment-text-color);
      margin-top: 2px;
    }
  }
}

.sub-item-swipe {
  display: block;
  min-width: 0;
  :deep(.nut-swipe__left) {
    .sub-item-swipe-btn-wrapper {
      padding-left: 24px;
    }
  }

  :deep(.nut-swipe__right),
  :deep(.nut-swipe__left) {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .sub-item-swipe-btn-wrapper {
      padding-left: 14px;

      &:last-child {
        padding-right: 14px;
      }

      .sub-item-swipe-btn {
        border-radius: 50%;
        height: 46px;
        width: 44px;
      }
    }
  }
}

.sub-item-swipe.is-dual-column {
  .sub-item-wrapper {
    :deep(.nut-avatar) {
      margin-right: 12px;
    }

    .sub-item-content {
      .sub-item-title-wrapper {
        align-items: flex-start;
        gap: 6px;
      }

      .sub-item-title {
        font-size: 15px;
      }

      .sub-item-detail {
        .second-line-wrapper {
          gap: 8px;
        }

        p {
          -webkit-line-clamp: 1;
        }
      }

      .sub-item-remark {
        -webkit-line-clamp: 1;
      }

      .dual-non-simple-second-line {
        min-height: 18px;
      }
    }
  }
}

.copy-sub-link {
  background-color: transparent;
  border: none;
  padding: 0 8px;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  // margin-left: 12px;

  svg {
    width: 16px;
    height: 16px;
    color: var(--comment-text-color);
  }
}
.sub-img-wrappers {
  display: flex;
  align-items: center;
}
</style>
