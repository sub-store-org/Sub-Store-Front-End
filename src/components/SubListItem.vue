<template>
  <!-- 滚动内容 -->
  <nut-swipe
    class="sub-item-swipe"
    ref="swipe"
    @close="setIsMoveClose()"
    @open="setIsMoveOpen()"
    @click="onClickPreviews()"
    :disabled="props.disabled"
  >
    <div
      class="sub-item-wrapper"
      :style="{ padding: isSimpleMode ? '9px' : '16px' }"
    >
      <div v-if="subProgressStyle === 'background' && typeof flow === 'object' && flow.progress" class="progress" :style="{width: flow.progress*100+'%'}"></div>
      <!-- compareSub -->
      <div
        @click.stop="compareSub"
        class="sub-img-wrappers"
        :style="{ 'margin-top': isSimpleMode ? '5px' : '0' }"
      >
        <div v-if="isIconColor">
          <nut-avatar
            v-if="props[props.type].icon"
            :size="isSimpleMode ? '36' : '48'"
            :url="props[props.type].icon"
            bg-color=""
          />
          <nut-avatar
            v-else
            :size="isSimpleMode ? '36' : '48'"
            :url="icon"
            bg-color=""
          />
        </div>
        <div v-else>
          <nut-avatar
            class="sub-item-customer-icon"
            :size="isSimpleMode ? '36' : '48'"
            :url="props[props.type].icon || icon"
            bg-color=""
          />
        </div>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 v-if="!isSimpleMode" class="sub-item-title">
            {{ displayName || name }}
            <span class="tag" v-for="i in tag" :key="i"><nut-tag>{{ i }}</nut-tag></span>
          </h3>
          <h3 v-else class="sub-item-title" style="color: var(--primary-text-color); font-size: 16px">
            {{ displayName || name }}
            <span class="tag" v-for="i in tag" :key="i"><nut-tag>{{ i }}</nut-tag></span>
          </h3>

          <!-- onClickCopyLink 拷贝 -->
          <div
            style="position: relative"
            :style="{ top: isSimpleMode ? '8px' : '0' }"
          >
            <button class="copy-sub-link" @click.stop="onClickCopyLink">
              <font-awesome-icon icon="fa-solid fa-clone" />
            </button>
            <button
              class="refresh-sub-flow"
              @click.stop="onClickRefresh"
              v-if="props.type === 'sub' && (!isSimpleMode || isSimpleReicon)"
            >
              <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
            </button>

            <!-- 编辑 -->
            <button
              v-if="!isSimpleMode"
              class="copy-sub-link"
              @click.stop="onClickEdit"
            >
              <font-awesome-icon icon="fa-solid fa-pen-nib" />
            </button>
            <button class="refresh-sub-flow" @click.stop="onClickEdit" v-else>
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
        <template v-if="!isSimpleMode">
          <p v-if="type === 'sub'" class="sub-item-detail">
            <template v-if="typeof flow === 'string'">
              <span>
                {{ flow }}
              </span>
            </template>
            <template v-else-if="typeof flow === 'object'">
              <span>
                {{ flow.firstLine }}
              </span>
              <span>{{ flow.secondLine }}</span>
            </template>
          </p>
          <p v-else-if="type === 'collection'" class="sub-item-detail">
            {{ collectionDetail }}
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
              <span v-if="flow.secondLine" style="font-weight: normal">
                {{ flow.firstLine + ' | ' + flow.secondLine }}
              </span>
              <span v-else style="font-weight: normal">
                {{ flow.firstLine }}
              </span>
            </template>
          </p>
          <p v-else-if="type === 'collection'" class="sub-item-detail-isSimple">
            {{ collectionDetail }}
          </p>
        </template>
      </div>
    </div>
    <!-- 加入判断 开启拖动不显示 -->
    <template v-if="isLeftRight" #left>
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
      <div v-if="type === 'sub'" class="sub-item-swipe-btn-wrapper">
        <a :href=" `${host}/api/${props.type}/${encodeURIComponent(name)}?raw=1` " target="_blank"><nut-button shape="square" type="success" class="sub-item-swipe-btn">
          <font-awesome-icon icon="fa-solid fa-file-export" />
        </nut-button></a>
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
      <div v-if="type === 'sub'" class="sub-item-swipe-btn-wrapper">
        <a :href=" `${host}/api/${props.type}/${encodeURIComponent(name)}?raw=1` " target="_blank"><nut-button shape="square" type="success" class="sub-item-swipe-btn">
          <font-awesome-icon icon="fa-solid fa-file-export" />
        </nut-button></a>
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
    :compareData="compareData"
    @closeCompare="closeCompare"
  />
</template>

<script lang="ts" setup>
import { useSubsApi } from "@/api/subs";
import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import PreviewPanel from "@/components/PreviewPanel.vue";
import { usePopupRoute } from "@/hooks/usePopupRoute";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useSubsStore } from "@/store/subs";
import { getString } from "@/utils/flowTransfer";
import { isMobile } from "@/utils/isMobile";
import CompareTable from "@/views/CompareTable.vue";
import { Dialog, Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, createVNode, ref, toRaw } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useHostAPI } from "@/hooks/useHostAPI";

const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t } = useI18n();

const props = defineProps<{
  type: "sub" | "collection";
  sub?: Sub;
  collection?: Collection;
  disabled?: boolean;
}>();
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
const {
  isFlowFetching,
  isSimpleMode,
  isLeftRight,
  isIconColor,
  isSimpleReicon,
  isDefaultIcon,
  subProgressStyle,
} = storeToRefs(globalStore);

const displayName =
  props[props.type].displayName || props[props.type]["display-name"];

const name = props[props.type].name;
const tag = props[props.type].tag;
const { flows } = storeToRefs(subsStore);
const icon = computed(() => {
  return isDefaultIcon.value ? logoIcon : logoRedIcon;
});
const collectionDetail = computed(() => {
  const nameList = props?.collection.subscriptions || [];
  if (nameList.length === 0) {
    return t("subPage.collectionItem.noSub");
  } else {
    const displayNameList = nameList.map((name) => {
      const sub = subsStore.getOneSub(name);
      return sub?.displayName || sub?.["display-name"] || sub.name;
    });
    return `${t("subPage.collectionItem.contain")}: ${displayNameList.join(
      "、"
    )}`;
  }
});

const flow = computed(() => {
  if (props.type === "sub") {
    const urlList = Object.keys(flows.value);
    const localOnly = props.sub.source === 'local' && !['localFirst', 'remoteFirst'].includes(props.sub.mergeSources)
    if (localOnly && !props.sub.subUserinfo) return t("subPage.subItem.local");
    if (isFlowFetching.value && !urlList.includes(props.sub.url))
      return t("subPage.subItem.loading");

    const target = toRaw(flows.value[props.sub.url] || flows.value[props.sub.name]);
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
    } else if (target.status === "success") {
      let {
        remainingDays,
        expires,
        total,
        usage: { upload, download },
      } = target.data;
      if(target.hideExpire) expires = undefined;
      let progress = 0;
      try {
        progress = 1 - (upload + download) / total
        progress = parseFloat(progress.toFixed(2))
      } catch (e) {
      }
      if (!(progress > 0)) {
        progress = 0
      }
      let secondLine: string;
      if (isSimpleMode.value) {
        secondLine = remainingDays ? `${remainingDays}${t(
          "subPage.subItem.remainingDaysUnit"
        )}` : ''
        const expiresInfo = !expires
          ? ""
          : `${dayjs.unix(expires).format("YYYY-MM-DD")}`;
        if (expiresInfo) {
          secondLine = secondLine ? `${secondLine} | ${expiresInfo}` : expiresInfo;
        }
        return {
          firstLine: `${getString(target.showRemaining ? (total - upload - download) : (upload + download), total, "B")}`,
          secondLine,
          progress
        };
      } else {
        secondLine = remainingDays ? `${t("subPage.subItem.remainingDays")}: ${remainingDays}${t(
          "subPage.subItem.remainingDaysUnit"
        )}` : ''
        let expiresInfo = !expires
          ? t("subPage.subItem.noExpiresInfo")
          : `${t("subPage.subItem.expires")}: ${dayjs
              .unix(expires)
              .format("YYYY-MM-DD")}`;
        if (target.hideExpire) {
          expiresInfo = ''
        }
        if (expiresInfo) {
          secondLine = secondLine ? `${secondLine} | ${expiresInfo}` : expiresInfo;
        }
        return {
          firstLine: `${t(target.showRemaining ? "subPage.subItem.showRemainingFlow" : "subPage.subItem.flow")}: ${getString(
            target.showRemaining ? (total - upload - download) : (upload + download),
            total,
            "B"
          )}`,
          secondLine,
          progress
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
          firstLine: `${target.error?.type}`,
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

const compareSub = async () => {
  Toast.loading("生成节点对比中...", {
    id: "compare",
    cover: true,
    duration: 1500,
  });
  const res = await useSubsApi().compareSub(
    props.type,
    props.sub ?? props.collection
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
    if(moreAction.value) moreAction.value.style.transform = "rotate(0deg)";
  } else {
    if (isLeftRight.value) {
      swipe.value.open("right");
    } else {
      swipe.value.open("left");
      swipeIsOpen.value = true;
      if(moreAction.value) moreAction.value.style.transform = "rotate(180deg)";
    }
  }
};

const onDeleteConfirm = async () => {
  await subsStore.deleteSub(props.type, name);
  // Notify.danger(t('subPage.deleteSub.succeedNotify'), { duration: 1500 });
};

const ismove = ref(false);

const setIsMoveOpen = () => {
  ismove.value = true;
  setTimeoutTF();
};

const setIsMoveClose = () => {
  ismove.value = true;
  setTimeoutTF();
};

// 增加延迟防止打开时 触发不了
const setTimeoutTF = () => {
  setTimeout(() => {
    ismove.value = false;
  }, 200);
};

const onClickPreviews = () => {
  if (ismove.value) return;
  swipeController()
  Dialog({
    title: t("subPage.previewTitle"),
    content: createVNode(PreviewPanel, {
      name,
      type: props.type,
      general: t("subPage.panel.general"),
      notify: t("subPage.copyNotify.succeed"),
      tipsTitle: t(`subPage.panel.tips.title`),
      tipsContent: `${t("subPage.panel.tips.content")}\n${t(
        "syncPage.addArtForm.includeUnsupportedProxy.tips.content"
      )}`,
      desc: t(`subPage.panel.tips.desc`),
      tipsOkText: t(`subPage.panel.tips.ok`),
      tipsCancelText: t(`subPage.panel.tips.cancel`),
    }),
    onOpened: () => swipe.value.close(),
    popClass: "auto-dialog",
    // @ts-ignore-next-line  组件库bug，类型错误但功能正常
    closeOnClickOverlay: true,
    noOkBtn: true,
    noCancelBtn: true,
    closeOnPopstate: true,
    lockScroll: false,
  });
};

const onClickCopyConfig = async () => {
  swipeController()
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
  await subsApi.createSub(props.type + "s", data);
  await subsStore.fetchSubsData();
  Toast.hide("copyConfig");
  showNotify({ title: t("subPage.copyConfigNotify.succeed") });
  swipe.value.close();
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
  swipeController()
  Dialog({
    title: t("subPage.deleteSub.title"),
    content: createVNode(
      "span",
      {},
      t("subPage.deleteSub.desc", { displayName })
    ),
    onCancel: () => {},
    onOk: onDeleteConfirm,
    onOpened: () => swipe.value.close(),
    popClass: "auto-dialog",
    cancelText: t("subPage.deleteSub.btn.cancel"),
    okText: t("subPage.deleteSub.btn.confirm"),
    closeOnPopstate: true,
    lockScroll: false,
  });
};

const { showNotify } = useAppNotifyStore();
const { currentUrl: host } = useHostAPI();

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
  await subsStore.fetchFlows(ref([props.sub]).value);
  Toast.hide("refresh");
  showNotify({ title: t("globalNotify.refresh.succeed") });
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
  position: relative;

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
      }

      .tag {
        margin: 0 2px;
      }

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
