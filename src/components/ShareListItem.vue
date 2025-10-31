<template>
  <!-- 滚动内容 -->
  <nut-swipe
    ref="swipe"
    class="sub-item-swipe"
    :disabled="props.disabled"
    @close="setIsMoveClose()"
    @open="setIsMoveOpen()"
    @click="onClickPreviews()"
  >
    <div
      class="sub-item-wrapper"
      :style="{ padding: appearanceSetting.isSimpleMode ? '9px' : '16px' }"
    >
      <div
        class="sub-img-wrappers"
        :style="{ 'margin-top': appearanceSetting.isSimpleMode ? '5px' : '0' }"
        @click.stop="onClickEdit"
      >
        <div v-if="appearanceSetting.isShowIcon">
          <div v-if="isIconColor">
            <nut-avatar
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="shareIcon"
              bg-color=""
            />
          </div>
          <div v-else>
            <nut-avatar
              class="sub-item-customer-icon"
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="shareIcon"
              bg-color=""
            />
          </div>
        </div>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <!-- 分享订阅、文件名 -->
          <h3 v-if="!appearanceSetting.isSimpleMode" class="sub-item-title">
            {{ displayName || name }}
            <span class="tag">
              <nut-tag>{{ leftTime }}</nut-tag>
            </span>
          </h3>
          <h3
            v-else
            class="sub-item-title"
            style="color: var(--primary-text-color); font-size: 16px"
          >
            {{ displayName || name }}
            <span class="tag">
              <nut-tag>{{ leftTime }}</nut-tag>
            </span>
          </h3>

          <!-- 快捷操作按钮 -->
          <div
            style="position: relative"
            :style="{ top: appearanceSetting.isSimpleMode ? '8px' : '0' }"
          >
            <!-- 查看 -->
            <button class="copy-sub-link" @click.stop="onClickShareLink">
              <font-awesome-icon icon="fa-solid fa-link" />
            </button>
            <button class="copy-sub-link" @click.stop="onClickCopyLink">
              <font-awesome-icon icon="fa-solid fa-clone" />
            </button>
            <!-- 编辑 -->
            <button class="refresh-sub-flow" @click.stop="onClickEdit">
              <font-awesome-icon icon="fa-solid fa-pen-nib" />
            </button>

            <button
              v-if="!isMobile()"
              ref="moreAction"
              class="copy-sub-link"
              @click.stop="swipeController"
            >
              <font-awesome-icon icon="fa-solid fa-angles-right" />
            </button>
          </div>
        </div>
        <p v-if="!appearanceSetting.isSimpleMode" class="sub-item-remark">
          <span>{{ t(`sharePage.createTimeLabel`) }}{{ createTime }}</span>
        </p>
        <p class="sub-item-remark">
          <span>{{ t(`sharePage.expiredLabel`) }}{{ expiresTime }}</span>
        </p>

        <!-- 分享备注 -->
        <p v-if="remark && (appearanceSetting.isSimpleMode ? appearanceSetting.isSimpleShowRemark : true)" class="sub-item-remark">
          <span>{{ remark }}</span>
        </p>
      </div>
    </div>
    <!-- 加入判断 开启拖动不显示 -->
    <template v-if="appearanceSetting.isLeftRight" #left>
      <!-- del -->
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
import { useClipboard } from "@vueuse/core";
import useV3Clipboard from "vue-clipboard3";
import { Dialog, Toast } from "@nutui/nutui";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, createVNode, ref } from "vue";
import { useI18n } from "vue-i18n";
import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import PreviewPanel from "@/components/PreviewPanel.vue";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from "@/hooks/useHostAPI";
import { usePopupRoute } from "@/hooks/usePopupRoute";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { isMobile } from "@/utils/isMobile";
import { useRouter } from "vue-router";
import { useAppNotifyStore } from "@/store/appNotify";

const { showNotify } = useAppNotifyStore();
const router = useRouter();
const props = defineProps<{
  data: Share;
  disabled?: boolean;
}>();
const emit = defineEmits(["detail", "delete"]);
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { t } = useI18n();
const { env } = useBackend();
const scrollTop = 0;
const filePreviewIsVisible = ref(false);
usePopupRoute(filePreviewIsVisible);
const moreAction = ref();
const swipe = ref();
const swipeIsOpen = ref(false);
const settingsStore = useSettingsStore();
const subsStore = useSubsStore();
const { appearanceSetting } = storeToRefs(settingsStore);
const { currentUrl: host } = useHostAPI();

const name = computed(() => {
  return props?.data?.name;
});

const displayName = computed(() => {
  return props?.data?.displayName;
});
const remark = computed(() => {
  return props?.data?.remark;
});
const type = computed(() => {
  return props?.data?.type;
});
const token = computed(() => {
  return props?.data?.token;
});
const expiresTime = computed(() => {
  return props?.data?.exp ? dayjs(props?.data?.exp).format("YYYY-MM-DD") : "";
});
const createTime = computed(() =>{
  return props?.data?.createdAt
    ? dayjs(props?.data?.createdAt).format("YYYY-MM-DD")
    : "";
})
// 判断是否过期
const leftTime = computed(() => {
  return props?.data?.exp
    ? dayjs(props?.data?.exp).diff(dayjs(), "second") > 0
      ? `${t("sharePage.leftTime")} ${dayjs(props?.data?.exp).diff(dayjs(), "day", true).toFixed(0)} ${t("sharePage.createShare.unit.day")}`
      : t("sharePage.expired")
    : 0;
});

const icon = computed(() => {
  return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon;
});

const shareIcon = computed(() => {
  switch (type.value) {
    case "sub":
      return subsStore.getOneSub(name.value)?.icon || icon.value;
    case "col":
      return subsStore.getOneCollection(name.value)?.icon || icon.value;
    case "file":
      return subsStore.getOneFile(name.value)?.icon || icon.value;
    default:
      return icon.value;
  }
});

const isIconColor = computed(() => {
  switch (type.value) {
    case "sub":
      return subsStore.getOneSub(name.value)?.isIconColor !== false;
    case "col":
      return subsStore.getOneCollection(name.value)?.isIconColor !== false;
    case "file":
      return subsStore.getOneFile(name.value)?.isIconColor !== false;
    default:
      return true;
  }
})

const swipeController = () => {
  if (swipeIsOpen.value) {
    swipe.value.close();
    swipeIsOpen.value = false;
    if (moreAction.value) moreAction.value.style.transform = "rotate(0deg)";
  } else {
    if (appearanceSetting.value.isLeftRight) {
      swipe.value.open("right");
    } else {
      swipe.value.open("left");
      swipeIsOpen.value = true;
      if (moreAction.value) moreAction.value.style.transform = "rotate(180deg)";
    }
  }
};

const onDeleteConfirm = async () => {
  await subsStore.deleteShare(token.value, type.value, name.value);
};

const onClickEdit = () => {
  console.log("props", props);
  console.log('${host.value}', host.value);
  emit("detail", props.data);
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
  const url = getShareUrl();
  console.log('url', url);
  if (isSupported) {
    await copy(url);
  } else {
    await copyFallback(url);
  }
  showNotify({ title: t("sharePage.copyShare.succeedNotify") });
};

const onClickShareLink = async () => {
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
  swipeController();
  Dialog({
    title: t("sharePage.deleteShare.title"),
    content: createVNode(
      "span",
      {},
      t("sharePage.deleteShare.desc", { displayName: name.value }),
    ),
    onCancel: () => {},
    onOk: onDeleteConfirm,
    onOpened: () => swipe.value.close(),
    popClass: "auto-dialog",
    cancelText: t("sharePage.deleteShare.btn.cancel"),
    okText: t("sharePage.deleteShare.btn.confirm"),
    closeOnPopstate: true,
    lockScroll: false,
  });
};

const ismove = ref(false);

// 增加延迟防止打开时 触发不了
const setTimeoutTF = () => {
  setTimeout(() => {
    ismove.value = false;
  }, 200);
};

const setIsMoveOpen = () => {
  ismove.value = true;
  setTimeoutTF();
};

const setIsMoveClose = () => {
  ismove.value = true;
  setTimeoutTF();
};

const secretPath = computed(() => {
  return env.value?.meta?.node?.env?.SUB_STORE_FRONTEND_BACKEND_PATH || "";
});

const getShareUrl = () => {
  try {
    const { type, name, token } = props.data;
    if (!secretPath.value.startsWith('/')) {
      Toast.fail(t('sharePage.magicPathErrorNotify'));
      throw new Error(
        t("sharePage.magicPathErrorNotify"),
      );
    }
    const shareUrl = `${host.value.replace(
      new RegExp(`${secretPath.value}$`),
      "",
    )}/share/${type}/${encodeURIComponent(name)}?token=${encodeURIComponent(
      token,
    )}`;
    return shareUrl;
  } catch (error) {
    console.error(error);
    return "";
  }
};
const onClickPreviews = () => {
  console.log('name', name.value);
  console.log('props', props.data);
  if (type.value === "file") {
    return;
  }
  if (ismove.value) {
    return false;
  }
  swipeController();
  const url = getShareUrl();
  console.log('url', url);

  Dialog({
    title: t("subPage.previewTitle"),
    content: createVNode(PreviewPanel, {
      name: name.value,
      displayName: displayName.value,
      type: "share",
      url,
      general: t("subPage.panel.general"),
      notify: t("subPage.copyNotify.succeed"),
      tipsTitle: t(`subPage.panel.tips.title`),
      tipsContent: `${t("subPage.panel.tips.content")}\n${t(
        "syncPage.addArtForm.includeUnsupportedProxy.tips.content",
      )}`,
      desc: t(`subPage.panel.tips.desc`),
      tipsOkText: t(`subPage.panel.tips.ok`),
      tipsCancelText: t(`subPage.panel.tips.cancel`),
    }),
    onOpened: () => swipe.value.close(),
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
  background: var(--card-color);
  cursor: pointer;

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
    flex: 1;
    line-height: 1.6;

    .sub-item-title-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .sub-item-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        font-size: 16px;
        color: var(--primary-text-color);
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
          width: 16px;
          height: 16px;
          color: var(--comment-text-color);
        }
      }

      button {
        white-space: nowrap;
      }

      div {
        display: flex;
        align-items: center;
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
      // margin-top: 3.5px;
      max-width: 80%;
      color: var(--comment-text-color);
    }
  }
}

.sub-item-swipe {
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
