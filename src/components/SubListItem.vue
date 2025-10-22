<template>
  <nut-swipe
    ref="swipe"
    class="sub-item-swipe"
    :disabled="props.disabled"
    @close="setIsMoveClose()"
    @open="setIsMoveOpen()"
  >
    <div
      class="sub-item-wrapper"
      :style="{ padding: appearanceSetting.isSimpleMode ? '9px' : '16px' }"
      @click="handleContentClick"
    >
      <div
        v-if="
          appearanceSetting.subProgressStyle === 'background' &&
          typeof flow === 'object' &&
          flow.progress
        "
        class="progress"
        :style="{ width: `${flow.progress * 100}%` }"
      ></div>
      <!-- compareSub -->
      <div
        class="sub-img-wrappers"
        :style="{ 'margin-top': appearanceSetting.isSimpleMode ? '5px' : '0' }"
        @click.stop="compareSub"
      >
        <!-- icon visible -->
        <div v-if="appearanceSetting.isShowIcon">
          <div v-if="isIconColor">
            <nut-avatar
              v-if="props[props.type].icon"
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="props[props.type].icon"
              bg-color=""
            />
            <nut-avatar
              v-else
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="icon"
              bg-color=""
            />
          </div>
          <div v-else>
            <nut-avatar
              class="sub-item-customer-icon"
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="props[props.type].icon || icon"
              bg-color=""
            />
          </div>
        </div>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 v-if="!appearanceSetting.isSimpleMode" class="sub-item-title">
            {{ displayName || name }}
            <!-- <span v-if="appOpenBtnVisible" class="app-url" @click.stop="openAppUrl" :title="typeof flow === 'object' ? flow.appUrl : ''">
              <font-awesome-icon icon="fa-solid fa-square-arrow-up-right" />
            </span> -->
            <span v-for="i in tag" :key="i" class="tag">
              <nut-tag>{{ i }}</nut-tag>
            </span>
          </h3>
          <h3
            v-else
            class="sub-item-title"
            style="color: var(--primary-text-color); font-size: 16px"
          >
            {{ displayName || name }}
            <!-- <span v-if="appOpenBtnVisible" class="app-url" @click.stop="openAppUrl" :title="typeof flow === 'object' ? flow.appUrl : ''">
              <font-awesome-icon icon="fa-solid fa-square-arrow-up-right" />
            </span> -->
            <span v-for="i in tag" :key="i" class="tag">
              <nut-tag>{{ i }}</nut-tag>
            </span>
          </h3>

          <!-- onClickCopyLink 拷贝 -->
          <div
            class="sub-item-menu"
            :class="{ 'simple-mode': appearanceSetting.isSimpleMode }"
          >
            <!-- 更多 -->
            <button
              v-if="appearanceSetting.isSubItemMenuFold"
              class="compare-sub-link"
              @click.stop="switchItemMenuVisible"
            >
              <font-awesome-icon
                :icon="
                  itemMenuVisible
                    ? 'fa-solid fa-angle-right'
                    : 'fa-solid fa-ellipsis'
                "
              />
            </button>
            <template
              v-if="itemMenuVisible || !appearanceSetting.isSubItemMenuFold"
            >
              <!-- 官网 -->
              <button
                v-if="appOpenBtnVisible"
                class="compare-sub-link"
                @click.stop="openAppUrl"
              >
                <font-awesome-icon icon="fa-solid fa-square-arrow-up-right" />
              </button>
              <!-- 预览 -->
              <button
                v-if="!appearanceSetting.isShowIcon"
                class="compare-sub-link"
                @click.stop="compareSub"
              >
                <font-awesome-icon icon="fa-solid fa-eye" />
              </button>
              <!-- 分享 -->
              <button
                v-if="shareBtnVisible"
                class="share-sub-link"
                @click.stop="onClickShareLink"
              >
                <font-awesome-icon icon="fa-solid fa-share-nodes" />
              </button>
              <button class="copy-sub-link" @click.stop="onClickCopyLink">
                <font-awesome-icon icon="fa-solid fa-clone" />
              </button>
            </template>
            <!-- 刷新 -->
            <button
              v-if="
                props.type === 'sub' &&
                (!appearanceSetting.isSimpleMode ||
                  appearanceSetting.isSimpleReicon)
              "
              class="refresh-sub-flow"
              @click.stop="onClickRefresh"
            >
              <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
            </button>
            <!-- 编辑 -->
            <button
              v-if="!appearanceSetting.isSimpleMode"
              class="copy-sub-link"
              @click.stop="onClickEdit"
            >
              <font-awesome-icon icon="fa-solid fa-pen-nib" />
            </button>
            <button v-else class="refresh-sub-flow" @click.stop="onClickEdit">
              <font-awesome-icon icon="fa-solid fa-pen-nib" />
            </button>
            <!-- 打开侧边栏 -->
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
        <template v-if="!appearanceSetting.isSimpleMode">
          <p v-if="type === 'sub'" class="sub-item-detail">
            <template v-if="typeof flow === 'string'">
              <span>
                {{ flow }}
              </span>
            </template>
            <template v-else-if="typeof flow === 'object'">
              <span :title="flow.planName">
                {{ flow.firstLine }}
              </span>
              <span :title="flow.planName">{{ flow.secondLine }}</span>
            </template>
          </p>
          <p v-else-if="type === 'collection'" class="sub-item-detail">
            {{ collectionDetail }}
          </p>
          <p v-if="remark" class="sub-item-remark">
            <span>{{ remarkText }}</span>
          </p>
        </template>

        <template v-else>
          <p v-if="type === 'sub'" class="sub-item-detail-isSimple">
            <template v-if="typeof flow === 'string'">
              <span style="font-weight: normal">
                {{ flow }}
              </span>
            </template>
            <template v-else-if="typeof flow === 'object'">
              <span
                v-if="flow.secondLine"
                style="font-weight: normal"
                :title="flow.planName"
              >
                {{ `${flow.firstLine} | ${flow.secondLine}` }}
              </span>
              <span v-else style="font-weight: normal" :title="flow.planName">
                {{ flow.firstLine }}
              </span>
            </template>
          </p>
          <p v-else-if="type === 'collection'" class="sub-item-detail-isSimple">
            {{ collectionDetail }}
          </p>
          <p
            v-if="remark && appearanceSetting.isSimpleShowRemark"
            class="sub-item-remark"
          >
            <span>{{ remarkText }}</span>
          </p>
        </template>
      </div>
    </div>
    <!-- 加入判断 开启拖动不显示 -->
    <template v-if="appearanceSetting.isLeftRight" #left>
      <!-- Copy -->
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="primary"
          class="sub-item-swipe-btn"
          @click="onClickCopyConfig"
        >
          <font-awesome-icon icon="fa-solid fa-paste" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <a
          :href="`${host}/api/${props.type}/${encodeURIComponent(name)}?raw=1`"
          target="_blank"
        >
          <nut-button shape="square" type="success" class="sub-item-swipe-btn">
            <font-awesome-icon icon="fa-solid fa-file-export" />
          </nut-button>
        </a>
      </div>
      <!-- preview -->
      <!-- <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="success" class="sub-item-swipe-btn" @click="onClickPreview">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </nut-button>
      </div> -->
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
          type="primary"
          class="sub-item-swipe-btn"
          @click.stop="onClickCopyConfig"
        >
          <font-awesome-icon icon="fa-solid fa-paste" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <a
          :href="`${host}/api/${props.type}/${encodeURIComponent(name)}?raw=1`"
          target="_blank"
        >
          <nut-button shape="square" type="success" class="sub-item-swipe-btn">
            <font-awesome-icon icon="fa-solid fa-file-export" />
          </nut-button>
        </a>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="danger"
          class="sub-item-swipe-btn"
          @click.stop="onClickDelete"
        >
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>
    </template>
  </nut-swipe>

  <CompareTable
    v-if="compareTableIsVisible"
    :name="name"
    :compare-data="compareData"
    @closeCompare="closeCompare"
  />
</template>

<script lang="ts" setup>
import { Dialog, Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, createVNode, ref, toRaw } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { useSubsApi } from "@/api/subs";
import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import PreviewPanel from "@/components/PreviewPanel.vue";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from "@/hooks/useHostAPI";
import { usePopupRoute } from "@/hooks/usePopupRoute";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { getString } from "@/utils/flowTransfer";
import { isMobile } from "@/utils/isMobile";
import CompareTable from "@/views/CompareTable.vue";

const props = defineProps<{
  type: "sub" | "collection";
  sub?: Sub;
  collection?: Collection;
  disabled?: boolean;
}>();
const emit = defineEmits(["update:visible", "share"]);
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t } = useI18n();

const { env } = useBackend();

// console.log('props.disabled')
// console.log(props.disabled)
let scrollTop = 0;

const compareTableIsVisible = ref(false);
usePopupRoute(compareTableIsVisible);

const moreAction = ref();
const swipe = ref();
const swipeIsOpen = ref(false);
const compareData = ref();
const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const subsStore = useSubsStore();
const subsApi = useSubsApi();
const settingsStore = useSettingsStore();
const { appearanceSetting } = storeToRefs(settingsStore);

const {
  isFlowFetching,
  // isSimpleMode,
  // isLeftRight,
  // isIconColor,
  // isSimpleReicon,
  // isDefaultIcon,
  // subProgressStyle,
} = storeToRefs(globalStore);
const { showNotify } = useAppNotifyStore();
const { currentUrl: host } = useHostAPI();

const displayName =
  props[props.type].displayName || props[props.type]["display-name"];

const name = props[props.type].name;
const tag = props[props.type].tag;
const remark = props[props.type].remark;
const remarkText = computed(() => {
  if (remark) {
    return remark;
  } else {
    return "";
  }
});
const { flows } = storeToRefs(subsStore);

const icon = computed(() => {
  return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon;
});

const isIconColor = computed(() => {
  return props[props.type].isIconColor !== false;
});

const collectionDetail = computed(() => {
  const nameList = props?.collection.subscriptions || [];
  const subTags = props?.collection.subscriptionTags || [];
  if (nameList.length === 0 && subTags.length === 0) {
    return t("subPage.collectionItem.noSub");
  } else {
    const displayNameList = nameList.map((name) => {
      const sub = subsStore.getOneSub(name);
      return sub?.displayName || sub?.["display-name"] || sub?.name;
    });
    if (nameList.length === 0) {
      return `${t("subPage.collectionItem.containTag")}: ${subTags.join(", ")}`;
    }
    if (subTags.length === 0) {
      return `${t("subPage.collectionItem.contain")}: ${displayNameList.join(
        ", ",
      )}`;
    }
    return `${t("subPage.collectionItem.containTag")}: ${subTags.join(
      ", ",
    )} | ${t("subPage.collectionItem.contain")}: ${displayNameList.join(", ")}`;
  }
});

const flow = computed(() => {
  if (props.type === "sub") {
    const urlList = Object.keys(flows.value);
    const localOnly =
      props.sub.source === "local" &&
      !["localFirst", "remoteFirst"].includes(props.sub.mergeSources);
    if (localOnly && !props.sub.subUserinfo) return t("subPage.subItem.local");
    if (isFlowFetching.value && !urlList.includes(props.sub.url))
      return t("subPage.subItem.loading");

    const target = toRaw(
      flows.value[props.sub.url] || flows.value[props.sub.name],
    );
    if (!target) {
      return {
        firstLine: t("subPage.subItem.noRecord"),
        secondLine: ``,
      };
    }
    if (!target?.status) {
      return {
        firstLine: t("subPage.subItem.flowError"),
        secondLine: ``,
      };
    }

    if (target.status === "noFlow") {
      return {
        firstLine: t("subPage.subItem.noFlow"),
        secondLine: ``,
      };
    } else if (target.status === "success" && target.data?.usage) {
      let {
        planName,
        appUrl,
        remainingDays,
        expires,
        total,
        usage: { upload, download },
      } = target.data;
      if (target.hideExpire) expires = undefined;
      let progress = 0;
      try {
        progress = 1 - (upload + download) / total;
        progress = Number.parseFloat(progress.toFixed(2));
      } catch (e) {}
      if (!(progress > 0)) {
        progress = 0;
      }
      let secondLine: string;
      if (appearanceSetting.value.isSimpleMode) {
        secondLine = remainingDays
          ? `${remainingDays}${t("subPage.subItem.remainingDaysUnit")}`
          : "";
        const expiresInfo = !expires
          ? ""
          : `${dayjs.unix(expires).format("YYYY-MM-DD")}`;
        if (expiresInfo) {
          secondLine = secondLine
            ? `${secondLine} | ${expiresInfo}`
            : expiresInfo;
        }
        return {
          planName,
          appUrl,
          firstLine: `${getString(
            target.showRemaining
              ? total - upload - download
              : upload + download,
            total,
            "B",
          )}`,
          secondLine,
          progress,
        };
      } else {
        secondLine = remainingDays
          ? `${t("subPage.subItem.remainingDays")}: ${remainingDays}${t(
              "subPage.subItem.remainingDaysUnit",
            )}`
          : "";
        let expiresInfo = !expires
          ? t("subPage.subItem.noExpiresInfo")
          : `${t("subPage.subItem.expires")}: ${dayjs
              .unix(expires)
              .format("YYYY-MM-DD")}`;
        if (target.hideExpire) {
          expiresInfo = "";
        }
        if (expiresInfo) {
          secondLine = secondLine
            ? `${secondLine} | ${expiresInfo}`
            : expiresInfo;
        }
        return {
          planName,
          appUrl,
          firstLine: `${t(
            target.showRemaining
              ? "subPage.subItem.showRemainingFlow"
              : "subPage.subItem.flow",
          )}: ${getString(
            target.showRemaining
              ? total - upload - download
              : upload + download,
            total,
            "B",
          )}`,
          secondLine,
          progress,
        };
      }
    } else if (target?.status === "failed") {
      if (target.error.code === "NO_FLOW_INFO") {
        return {
          firstLine: t("subPage.subItem.noFlowInfo"),
          secondLine: ``,
        };
      } else {
        return {
          firstLine: `⚠️ ${target.error?.type}`,
          secondLine: `${target.error?.message}`,
        };
      }
    }
  }
});

const closeCompare = () => {
  document.querySelector("html").style["overflow-y"] = "";
  document.querySelector("html").style.height = "";
  document.body.style.height = "";
  document.body.style["overflow-y"] = "";
  (document.querySelector("#app") as HTMLElement).style["overflow-y"] = "";
  (document.querySelector("#app") as HTMLElement).style.height = "";

  compareTableIsVisible.value = false;

  window.scrollTo({
    top: scrollTop,
    behavior: "instant" as any,
  });

  router.back();
};

const appOpenBtnVisible = computed(() => {
  return (
    props.type === "sub" && typeof flow.value === "object" && flow.value?.appUrl
  );
});

const itemMenuVisible = ref(false);

const switchItemMenuVisible = () => {
  itemMenuVisible.value = !itemMenuVisible.value;
};

const openAppUrl = () => {
  console.log("flow", flow.value);
  if (typeof flow.value === "object" && flow.value?.appUrl) {
    window.open(flow.value.appUrl);
  }
};

const compareSub = async () => {
  Toast.loading("生成节点对比中...", {
    id: "compare",
    cover: true,
    duration: 1500,
  });
  const res = await useSubsApi().compareSub(
    props.type,
    props.sub ?? props.collection,
  );
  if (res?.data?.status === "success") {
    compareData.value = res.data.data;

    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    globalStore.setSavedPositions(route.path, { left: 0, top: scrollTop });

    document.querySelector("html").style["overflow-y"] = "hidden";
    document.querySelector("html").style.height = "100%";
    document.body.style.height = "100%";
    document.body.style["overflow-y"] = "hidden";
    (document.querySelector("#app") as HTMLElement).style["overflow-y"] =
      "hidden";
    (document.querySelector("#app") as HTMLElement).style.height = "100%";

    compareTableIsVisible.value = true;
    Toast.hide("compare");
  }
};
const swipeClose = () => {
  swipe.value.close();
};
const swipeController = () => {
  if (swipeIsOpen.value) {
    swipe.value.close();
    swipeIsOpen.value = false;
    if (moreAction.value) moreAction.value.style.transform = "rotate(0deg)";

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
        if (moreAction.value) moreAction.value.style.transform = "rotate(180deg)";

        setTimeout(() => {
          document.addEventListener('click', handleGlobalClick);
        }, 10);
      }, 100);
    }
  }
};

const handleGlobalClick = (event) => {
  const swipeRightEl = document.querySelector('.nut-swipe__right');
  const swipeLeftEl = document.querySelector('.nut-swipe__left');

  if ((swipeRightEl && swipeRightEl.contains(event.target)) ||
      (swipeLeftEl && swipeLeftEl.contains(event.target))) {
    return;
  }

  swipe.value.close();
  swipeIsOpen.value = false;
  if (moreAction.value) moreAction.value.style.transform = "rotate(0deg)";

  document.removeEventListener('click', handleGlobalClick);
};

const onDeleteConfirm = async () => {
  await subsStore.deleteSub(props.type, name);
  // Notify.danger(t('subPage.deleteSub.succeedNotify'), { duration: 1500 });
};

const ismove = ref(false);

const setIsMoveOpen = () => {
  ismove.value = true;

  setTimeout(() => {
    swipeIsOpen.value = true;
    if (moreAction.value) moreAction.value.style.transform = "rotate(180deg)";
  }, 100);

  setTimeoutTF();
};

const setIsMoveClose = () => {
  ismove.value = true;
  swipeIsOpen.value = false;
  setTimeoutTF();
};

// 增加延迟防止打开时 触发不了
const setTimeoutTF = () => {
  setTimeout(() => {
    ismove.value = false;
  }, 200);
};



const handleContentClick = (event) => {
  event.stopPropagation();

  if (swipeIsOpen.value) {
    swipe.value.close();
    swipeIsOpen.value = false;
    if (moreAction.value) moreAction.value.style.transform = "rotate(0deg)";
    return;
  }

  if (!ismove.value) {
    openPreviewPanel();
  }
};

const openPreviewPanel = () => {
  if (ismove.value) return;
  Dialog({
    title: t("subPage.previewTitle"),
    content: createVNode(PreviewPanel, {
      name,
      displayName,
      type: props.type,
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
const shareBtnVisible = computed(() => {
  return env.value?.feature?.share;
});
const onClickShareLink = async () => {
  const type = props.type;
  const data = props.type === "sub" ? props.sub : props.collection;
  emit("share", data, type);
};
const onClickCopyConfig = async () => {
  // 移除 swipeController() 调用，保持左滑状态
  let data: Sub | Collection;
  switch (props.type) {
    case "sub":
      data = JSON.parse(JSON.stringify(toRaw(props.sub)));
      break;
    case "collection":
      data = JSON.parse(JSON.stringify(toRaw(props.collection)));
      break;
  }
  data.name += `-copy${~~(Math.random() * 10000)}`;

  Toast.loading(t("subPage.copyConfigNotify.loading"), { id: "copyConfig" });
  await subsApi.createSub(`${props.type}s`, data);
  await subsStore.fetchSubsData();
  Toast.hide("copyConfig");
  showNotify({ title: t("subPage.copyConfigNotify.succeed") });
};
// const onClickExport = async () => {
//   swipeController()
//   let data: Sub | Collection;
//   switch (props.type) {
//     case "sub":
//       data = JSON.parse(JSON.stringify(toRaw(props.sub)));
//       break;
//     case "collection":
//       data = JSON.parse(JSON.stringify(toRaw(props.collection)));
//       break;
//   }
//   data.name += `-exportedAt${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

//   Toast.loading(t("subPage.copyConfigNotify.loading"), { id: "exportConfig" });
//   // await subsApi.createSub(props.type + "s", data);
//   // await subsStore.fetchSubsData();
//   Toast.hide("exportConfig");
//   showNotify({ title: t("subPage.copyConfigNotify.succeed") });
//   swipe.value.close();
// };

const onClickEdit = () => {
  router.push(`/edit/${props.type}s/${encodeURIComponent(name)}`);
};

const onClickDelete = () => {
  Dialog({
    title: t("subPage.deleteSub.title"),
    content: createVNode(
      "span",
      {},
      t("subPage.deleteSub.desc", { displayName }),
    ),
    onCancel: () => {},
    onOk: onDeleteConfirm,
    popClass: "auto-dialog",
    cancelText: t("subPage.deleteSub.btn.cancel"),
    okText: t("subPage.deleteSub.btn.confirm"),
    closeOnPopstate: true,
    lockScroll: false,
  });
};

const onClickCopyLink = async () => {
  const url = `${host.value}/download/${
    props.type === "collection" ? "collection/" : ""
  }${encodeURIComponent(name)}`;

  if (isSupported) {
    await copy(url);
  } else {
    await copyFallback(url);
  }
  showNotify({ title: t("subPage.copyNotify.succeed") });
};

const onClickRefresh = async () => {
  Toast.loading(t("globalNotify.refresh.loading"), {
    cover: true,
    id: "refresh",
  });
  try {
    await subsApi.downloadOne(name, { noCache: true });
  } catch (e) {
    console.error(e);
  }
  try {
    await subsStore.fetchFlows(ref([props.sub]).value);
  } catch (e) {
    console.error(e);
  }
  Toast.hide("refresh");
  showNotify({ title: t("globalNotify.refresh.succeed") });
};
</script>

<style lang="scss" scoped>
.sub-item-swipe {
  position: relative;
}



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
  position: relative;
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

  > .sub-item-content {
    z-index: 1;
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
        vertical-align: middle;
      }
      .app-url {
        font-size: 14px !important;
        margin: 0 2px;
      }
      .tag {
        margin: 0 2px;
      }
      .sub-item-menu {
        position: relative;
        top: 0;
        // background: var(--card-color);
        padding: 4px 0;
        border-radius: var(--item-card-radios);
        &.simple-mode {
          position: relative;
          top: 8px;
        }
      }
      .compare-sub-link,
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
      margin-top: 2px;
      max-width: 80%;
      color: var(--comment-text-color);
      span {
        display: block;
        line-height: 1.5;
      }
    }
  }
  .progress {
    opacity: 0.5;
    z-index: 0;
    border-radius: var(--item-card-radios);
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: var(--primary-color);
  }
}

.sub-item-swipe {
  -webkit-user-select: none;
  user-select: none;
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
    z-index: 10;

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
