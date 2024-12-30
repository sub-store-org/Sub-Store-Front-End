<template>
  <div
    style="overflow: hidden; -webkit-user-select: none; user-select: none"
  >
    <!-- 浮动按钮 -->
    <Teleport to="body">
      <div v-if="hasShares" class="drag-btn-wrapper">
        <nut-drag
          :attract="true"
          :boundary="{
            top: 56 + 8,
            left: 16,
            bottom: bottomSafeArea + 48 + 12 + 8,
            right: 16,
          }"
          :style="{
            cursor: 'pointer',
            right: '16px',
            bottom: `${
              bottomSafeArea +
              48 + 36 + 
              (!isMobile() ? (appearanceSetting.isSimpleMode ? 44 : 48) : 0)
            }px`,
          }"
        >
          <!-- 刷新 -->
          <div
            v-if="appearanceSetting.showFloatingRefreshButton"
            class="drag-btn refresh"
            @click="refresh"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
          </div>

          <!-- 加号 -->
          <!-- <div
            class="router-link"
            @touchmove="onTa"
            @touchend="enTa"
            @click="addShare"
          >
            <div class="drag-btn">
              <font-awesome-icon icon="fa-solid fa-plus" />
            </div>
          </div> -->
        </nut-drag>
      </div>
    </Teleport>

    <!-- 页面内容 -->
    <!-- 有数据 -->
    <div class="subs-list-wrapper">
      <div v-if="hasShares">
        <!-- 单条订阅 -->
        <div v-if="subShareDataCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('sub')">
              <p>
                {{ `${$t(`specificWord.singleSub`)}(${subShareDataCount})` }}
              </p>
              <nut-icon
                v-if="!isFold('sub')"
                name="rect-down"
                size="12px"
              ></nut-icon>
              <nut-icon v-else name="rect-right" size="12px"></nut-icon>
            </div>
          </div>
          <div v-if="!isFold('sub')" class="draggable-list">
            <div
              v-for="(item, index) in subShareData"
              :key="index"
              class="draggable-item"
            >
              <ShareListItem
                :data="item"
                :key="index"
                :disabled="swipeDisabled"
                @detail="handleShareDetail"
              />
            </div>
          </div>
        </div>
        <!-- 组合订阅 -->
        <div v-if="collectionShareDataCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('col')">
              <p>
                {{
                  `${$t(
                    `specificWord.collectionSub`,
                  )}(${collectionShareDataCount})`
                }}
              </p>
              <nut-icon
                v-if="!isFold('col')"
                name="rect-down"
                size="12px"
              ></nut-icon>
              <nut-icon v-else name="rect-right" size="12px"></nut-icon>
            </div>
          </div>
          <div v-if="!isFold('col')" class="draggable-list">
            <div
              v-for="(item, index) in collectionShareData"
              :key="index"
              class="draggable-item"
            >
              <ShareListItem
                :data="item"
                :key="index"
                :disabled="swipeDisabled"
                @detail="handleShareDetail"
              />
            </div>
          </div>
        </div>
        <!-- 文件 -->
        <div v-if="fileShareDataCount > 0" class="share-data">
          <div class="sticky-title-wrappers">
            <div class="list-title" @click="toggleFold('file')">
              <p>
                {{ `${$t(`specificWord.file`)}(${fileShareDataCount})` }}
              </p>
              <nut-icon
                v-if="!isFold('file')"
                name="rect-down"
                size="12px"
              ></nut-icon>
              <nut-icon v-else name="rect-right" size="12px"></nut-icon>
            </div>
          </div>
          <div v-if="!isFold('file')" class="draggable-list">
            <div
              v-for="(item, index) in fileShareData"
              :key="index"
              class="draggable-item"
            >
              <ShareListItem
                :data="item"
                :key="index"
                :disabled="swipeDisabled"
                @detail="handleShareDetail"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 没有数据 -->
    <div v-if="!isLoading && fetchResult && !hasShares" class="no-data-wrapper">
      <nut-empty image="empty">
        <template #description>
          <h3>{{ $t(`sharePage.emptyShare.title`) }}</h3>
          <p>{{ $t(`sharePage.emptyShare.desc`) }}</p>
        </template>
      </nut-empty>
      <router-link to="/subs" class="router-link">
        <nut-button type="primary">
          {{ $t(`sharePage.emptyShare.btn`) }}
        </nut-button>
      </router-link>
    </div>

    <!-- 数据加载失败 -->
    <div v-if="!isLoading && !fetchResult" class="no-data-wrapper">
      <nut-empty image="error" style="padding: 32px 30px">
        <template #description>
          <h3>{{ $t(`subPage.loadFailed.title`) }}</h3>
          <p>{{ $t(`subPage.loadFailed.desc`) }}</p>
          <p>{{ $t(`subPage.loadFailed.followOfficialChannel`) }}</p>
          <p>
            {{ $t(`subPage.loadFailed.officialChannel`) }}
            <a
              href="https://t.me/cool_scripts"
              style="color: var(--primary-color)"
            >
              Cool Scripts
            </a>
          </p>
        </template>
      </nut-empty>
      <nut-button icon="refresh" type="primary" @click="refresh">
        {{ $t(`subPage.loadFailed.btn`) }}
      </nut-button>
      <a
        href="https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46"
        target="_blank"
      >
        <span>{{ $t(`subPage.loadFailed.doc`) }}</span>
        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
      </a>
    </div>
    <SharePopup
      v-model:visible="sharePopupVisible"
      :data="shareData"
      :type="shareDataType"
      action="edit"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, toRaw } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ShareListItem from "@/components/ShareListItem.vue";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { initStores } from "@/utils/initApp";
import { isMobile } from "@/utils/isMobile";

import SharePopup from "./SharePopup.vue";
import { Dialog } from "@nutui/nutui";

const router = useRouter();
const { currentUrl: host } = useHostAPI();

const { env } = useBackend();
const { t } = useI18n();
const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const { appearanceSetting } = storeToRefs(settingsStore);

const { shares, hasShares } = storeToRefs(subsStore);
const {
  isLoading,
  fetchResult,
  bottomSafeArea,
} = storeToRefs(globalStore);
const swipeDisabled = ref(false);

const refresh = () => {
  initStores(true, true, true);
};

const as = ref(false);

const onTa = () => {
  as.value = true;
};

const enTa = () => {
  setTimeout(() => {
    as.value = false;
  }, 100);
};

const fold = ref({
  sub: false,
  col: false,
  file: false,
});

const isFold = (key) => {
  return fold.value?.[key];
};

const toggleFold = (key) => {
  fold.value[key] = !fold.value[key];
};

const addShare = () => {
  if (as.value) return;
  Dialog({
    title: t("sharePage.emptyShare.title"),
    content: t("sharePage.emptyShare.emptyTips"),
    popClass: "auto-dialog",
    okText: "OK",
    noCancelBtn: true,
    closeOnPopstate: true,
    lockScroll: false,
    onOk: () => {
      router.push("/subs");
    },
    onCancel: () => {},
  });
};

const subShareData = computed(() => {
  return shares.value.filter((item) => item.type === "sub");
});

const subShareDataCount = computed(() => {
  return subShareData.value.length;
});

const fileShareData = computed(() => {
  return shares.value.filter((item) => item.type === "file");
});

const fileShareDataCount = computed(() => {
  return fileShareData.value.length;
});

const collectionShareData = computed(() => {
  return shares.value.filter((item) => item.type === "col");
});

const collectionShareDataCount = computed(() => {
  return collectionShareData.value.length;
});

const init = async () => {
  await subsStore.fetchShareData();
}

onMounted(() => {
  init();
});

const shareData = ref(null);
const shareDataType = ref(null);
const sharePopupVisible = ref(false);

const secretPath = computed(() => {
  return env.value?.meta?.node?.env?.SUB_STORE_FRONTEND_BACKEND_PATH || "";
});

const handleShareDetail = (detail: Share) => {
  console.log('detail', detail)
  const { type, name, token } = detail;
  const shareUrl = `${host.value.replace(new RegExp(`${secretPath.value}$`), "")}/share/${type}/${encodeURIComponent(name)}?token=${encodeURIComponent(token)}`;
  shareData.value = { ...detail, shareUrl };
  shareDataType.value = type;
  sharePopupVisible.value = true;
  console.log("share", detail);
  console.log("env", env.value);
  console.log('shareDataType', shareDataType.value)
  console.log("secretPath", secretPath.value);
  console.log("shareUrl", shareUrl);
};
</script>

<style lang="scss">
.drag-btn-wrapper {
  position: relative;
  z-index: 999;

  .drag-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-image: linear-gradient(
      to bottom right,
      var(--primary-color),
      var(--primary-color-end)
    );
    box-shadow: 0 4px 8px #0003;
    display: flex;
    justify-content: center;
    align-items: center;

    &.refresh {
      background: var(--second-color);
      margin-bottom: 12px;
    }

    > svg {
      width: 20px;
      height: 20px;
      color: #fffb;
    }
  }
}

.add-sub-popup {
  background-color: var(--popup-color);
  // position: relative;

  .add-sub-panel-title {
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: var(--comment-text-color);
  }

  .add-sub-panel-list {
    padding: 16px 0;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    width: 100%;
    color: var(--second-text-color);

    > li {
      width: 50%;
      display: flex;
      justify-content: center;

      .router-link {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        > svg {
          width: 44px;
          height: 44px;
          color: var(--primary-color);
          margin-bottom: 12px;
        }
      }
    }
  }
}

.no-data-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h3 {
    font-size: 18px;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  p {
    font-size: 14px;
    color: var(--comment-text-color);
  }

  a {
    font-size: 14px;
    margin-top: 24px;
    color: var(--comment-text-color);

    span {
      margin-right: 4px;
    }
  }
}

.list-title {
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding-left: 8px;
  font-weight: bold;
  //padding-left: var(--safe-area-side);
  p {
    margin-right: 6px;
  }
  :deep(.nut-icon) {
    // transform: rotate(270deg);
    font-size: 12px;
    height: 12px;
    opacity: 0.6;
    margin-top: 3px;
  }
}

.sticky-title-wrappers {
  margin-top: var(--safe-area-side);
  // backdrop-filter: blur(var(--sticky-title-blur));
  // -webkit-backdrop-filter: blur(var(--sticky-title-blur));
  color: var(--comment-text-color);
  // background-color: var(--nav-bar-color);
}

.desc-about {
  display: block;
  padding: 100px 30px 50px;
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

.draggable-item {
  margin-top: 12px;
  margin-bottom: 12px;
  // overflow: hidden;
}

.chosensub {
  box-shadow: 0 0 10px var(--primary-color);
  border-radius: var(--item-card-radios);
  overflow: hidden;
}

.subs-list-wrapper {
  width: calc(100% - 1.5rem);
  margin-left: auto;
  margin-right: auto;
}
</style>
