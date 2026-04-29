<template>
  <!-- isPWA 时候顶部边距 -->
  <div v-if="isPWA" class="pwa_top_padding" />
  <div
    class="nav-bar-wrapper"
    :class="{ 'is-logs-overlay-open': isLogsOverlayOpen }"
  >
    <nav>
      <!-- &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{ navBarHeight }} {{ wh }}    {{ topHeight }}-->

      <nut-navbar
        @on-click-back="back"
        :title="currentTitle"
        :tit-icon="currentTitleWhetherAsk"
        @on-click-icon="onClickNavbarIcon"
      >
        <template #left>
          <div v-if="isLogsOverlayOpen" class="nav-leading-placeholder" />
          <button
            v-else-if="isNeedBack"
            type="button"
            class="nav-leading-button icon-back"
            @click.stop="back"
          >
            <font-awesome-icon
              class="icon-back-icon"
              icon="fa-solid fa-arrow-left"
            />
          </button>
          <div v-else :class="leftIconClass" @click.stop="back"></div>
          <div v-if="!isLogsOverlayOpen" class="icon-group">
            <button
              v-if="!isNeedBack && !appearanceSetting.showFloatingRefreshButton"
              type="button"
              @click.stop="refresh"
              class="navBar-left-icon navBar-left-icon--refresh"
            >
              <font-awesome-icon
                class="icon fa-arrow-rotate-right"
                icon="fa-solid fa-arrow-rotate-right"
              />
            </button>
            <button
              v-if="
                ['/subs', '/sync', '/files'].includes(route.path) &&
                !appearanceSetting.showFloatingAddButton
              "
              type="button"
              @click.stop="add(route)"
              class="navBar-left-icon navBar-left-icon--add"
            >
              <font-awesome-icon
                class="icon fa-plus"
                icon="fa-solid fa-plus"
              />
            </button>
          </div>
        </template>

        <template #right>
          <template v-if="!isLogsOverlayOpen">
            <button
              type="button"
              v-if="appearanceSetting.isSimpleMode"
              class="navBar-right-button"
              :style="{ right: navRightButtonRight.simple }"
              :aria-label="simpleModeToggleTitle"
              :title="simpleModeToggleTitle"
              @click.stop="setSimpleMode(false)"
            >
              <font-awesome-icon
                class="navBar-right-icon navBar-right-icon--simple"
                icon="fa-solid fa-toggle-on"
                :title="simpleModeToggleTitle"
              />
            </button>
            <button
              type="button"
              v-else
              class="navBar-right-button"
              :style="{ right: navRightButtonRight.simple }"
              :aria-label="simpleModeToggleTitle"
              :title="simpleModeToggleTitle"
              @click.stop="setSimpleMode(true)"
            >
              <font-awesome-icon
                class="navBar-right-icon navBar-right-icon--simple"
                icon="fa-solid fa-toggle-off"
                :title="simpleModeToggleTitle"
              />
            </button>
            <button
              v-if="showWideScreenNarrowModeToggle"
              type="button"
              class="navBar-right-button"
              :style="{ right: navRightButtonRight.navigation }"
              @click.stop="handleWideScreenNarrowModeToggle"
            >
              <font-awesome-icon
                class="navBar-right-icon"
                :icon="isWideScreenNarrowModeActive ? 'fa-solid fa-mobile-screen-button' : 'fa-solid fa-desktop'"
                :title="wideScreenNarrowModeToggleTitle"
              />
            </button>
            <button
              v-if="showListViewToggle"
              type="button"
              class="navBar-right-button"
              :style="{ right: navRightButtonRight.list }"
              :disabled="isListViewModeLocked"
              :aria-disabled="isListViewModeLocked ? 'true' : 'false'"
              @click.stop="handleListViewModeToggle"
            >
              <font-awesome-icon
                class="navBar-right-icon"
                :class="{ 'is-disabled': isListViewModeLocked }"
                :icon="effectiveListViewMode === 'dual-column' ? 'fa-solid fa-table-columns' : 'fa-solid fa-list'"
                :title="listViewModeToggleTitle"
              />
            </button>
            <button
              v-if="showLogsButton"
              type="button"
              class="navBar-right-button"
              :style="{ right: navRightButtonRight.logs }"
              @click.stop="openLogsOverlay"
              :title="t('logsPage.floating.open')"
            >
              <font-awesome-icon
                class="navBar-right-icon"
                icon="fa-solid fa-file-lines"
                :title="t('logsPage.floating.open')"
              />
            </button>
          </template>
        </template>
      </nut-navbar>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useWideScreenNarrowMode } from "@/hooks/useWideScreenNarrowMode";
import { useGlobalStore } from "@/store/global";
import { useListViewMode } from "@/hooks/useListViewMode";
import { useSystemStore } from "@/store/system";
import { useSettingsStore } from '@/store/settings';
import { useLogsOverlayStore } from "@/store/logsOverlay";
import { storeToRefs } from "pinia";
import { Dialog } from "@nutui/nutui";
import { initStores } from "@/utils/initApp";
import { useMethodStore } from '@/store/methodStore';
import { useAppNotifyStore } from "@/store/appNotify";
import { LOGS_PATH } from "@/utils/popupHistory";
import i18n from "@/locales";

const { t:i18n_global } = i18n.global;
const { showNotify } = useAppNotifyStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const methodStore = useMethodStore()
const globalStore = useGlobalStore();
const systemStore = useSystemStore();
const logsOverlayStore = useLogsOverlayStore();
const settingsStore = useSettingsStore();
const { changeAppearanceSetting } = settingsStore;
const { appearanceSetting } = storeToRefs(settingsStore);
const { isOpen: isLogsOverlayOpen } = storeToRefs(logsOverlayStore);
const {
  effectiveListViewMode,
  isListViewModeLockedBySelection,
  isListViewModeLocked,
  showListViewToggle,
  toggleListViewMode,
} = useListViewMode();
const {
  isWideScreenNarrowModeActive,
  showWideScreenNarrowModeToggle,
  toggleWideScreenNarrowMode,
} = useWideScreenNarrowMode();
// 从systemStore获取状态
const { isPWA, isLandscape, isSmall } = storeToRefs(systemStore);

onMounted(() => {
  systemStore.initSystemState();
});

// 使用systemStore中的计算属性
const { navBarHeight, navBartop, navBartopRight, pwaTopPadding: Pwa_top } = storeToRefs(systemStore);

const isNeedBack = computed(() => {
  return route.meta.needNavBack ?? false;
});
const leftIconClass = computed(() => {
  return isNeedBack.value ? "icon-back" : "icon-home";
});

const currentTitle = computed(() => {
  if (isLogsOverlayOpen.value) {
    return t("navBar.pagesTitle.logs");
  }

  const metaTitle = route.meta.title;
  return metaTitle ? t(`navBar.pagesTitle.${metaTitle}`) : undefined;
});
const currentTitleWhetherAsk = computed(() => {
  if (isLogsOverlayOpen.value) return "";

  const ownAsk = ["sync"];
  const metaTitle = route.meta.title;
  return ownAsk.includes(metaTitle) ? "ask" : "";
});
const showLogsButton = computed(() => route.path !== LOGS_PATH);
const onClickNavbarIcon = () => {
  const metaTitle = route.meta.title;
  const content =
    t(`navBar.pagesTitle.askWhat.${metaTitle}.content`) || "";
  const title = t(`navBar.pagesTitle.askWhat.${metaTitle}.title`) || "";
    Dialog({
      title: title,
      content: content,
      popClass: 'auto-dialog',
      textAlign: 'left',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};

const add = (route: any) => {
  const routePath = route.path;
  const addMethodMap = {
    "/subs": "addSub",
    "/files": "addFile",
    "/sync": "addSync",
  };
  methodStore.invokeMethod(addMethodMap[routePath], {});
};

const back = () => {
  if (isLogsOverlayOpen.value) {
    logsOverlayStore.close();
    return;
  }

  if (isNeedBack.value) {
    try {
      if (router.options.history.state.back) {
        router.back();
      } else {
        router.push("/");
      }
    } catch (error) {
      router.push("/");
    }
  }
};

const setSimpleMode = (isSimpleMode: boolean) => {
  // globalStore.setSimpleMode(isSimpleMode);
  const data = {
    ...appearanceSetting.value,
    isSimpleMode: isSimpleMode
  }
  changeAppearanceSetting({ appearanceSetting: data })
};

const listViewModeToggleTitle = computed(() => {
  if (isListViewModeLockedBySelection.value) {
    return t("navBar.listView.disabledInSelectionMode");
  }

  return effectiveListViewMode.value === "dual-column"
    ? t("navBar.listView.switchToSingle")
    : t("navBar.listView.switchToDual");
});

const wideScreenNarrowModeToggleTitle = computed(() => {
  return isWideScreenNarrowModeActive.value
    ? t("navBar.navigationMode.switchToWide")
    : t("navBar.navigationMode.switchToNarrow");
});

const simpleModeToggleTitle = computed(() => {
  return appearanceSetting.value.isSimpleMode
    ? t("navBar.simpleMode.switchToNormal")
    : t("navBar.simpleMode.switchToSimple");
});

const NAV_BAR_RIGHT_BUTTON_BASE_RIGHT = 15;
const NAV_BAR_RIGHT_BUTTON_GAP = 34;

const navRightButtonRight = computed<Record<string, string>>(() => {
  const buttons: string[] = [];
  if (showLogsButton.value) {
    buttons.push("logs");
  }
  buttons.push("simple");
  if (showWideScreenNarrowModeToggle.value) {
    buttons.push("navigation");
  }
  if (showListViewToggle.value) {
    buttons.push("list");
  }

  return buttons.reduce((acc, key, index) => {
    acc[key] = `${NAV_BAR_RIGHT_BUTTON_BASE_RIGHT + index * NAV_BAR_RIGHT_BUTTON_GAP}px`;
    return acc;
  }, {} as Record<string, string>);
});

const handleListViewModeToggle = async () => {
  if (isListViewModeLocked.value) {
    return;
  }

  await toggleListViewMode();
};

const handleWideScreenNarrowModeToggle = async () => {
  await toggleWideScreenNarrowMode();
};

const openLogsOverlay = () => {
  logsOverlayStore.open();
};

const refresh = async () => {
  if (["/preview"].includes(route.path)) {
    window.location.reload();
  } else if (["/subs", "/sync", "/files"].includes(route.path)) {
    initStores(true, true, true);
  } else {
    showNotify({ title: i18n_global("globalNotify.refresh.rePwaing"), type: "primary" });
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      for (let cacheName of cacheNames) {
        await caches.delete(cacheName);
      }
    }
    showNotify({ title: i18n_global("globalNotify.refresh.rePwa"), type: "primary" });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};
</script>

<style lang="scss">
.pwa_top_padding {
  padding-top: v-bind(Pwa_top);
}
.nav-bar-wrapper {
  top: 0;
  height: v-bind(navBarHeight);
  z-index: 20;
  @include centered-fixed-container;

  &.is-logs-overlay-open {
    z-index: 1004;
  }

  nav {
    .nut-navbar {
      padding-top: v-bind(navBartop);
      height: v-bind(navBarHeight);
      top: 0;
      box-shadow: none;
      backdrop-filter: blur(var(--nav-bar-blur));
      -webkit-backdrop-filter: blur(var(--nav-bar-blur));
      background: var(--nav-bar-color);
      border-bottom: var(--divider-color) solid 1px;
      @media screen and (min-width: 768px) {
        border-radius: var(--item-card-radios);
        overflow: hidden;
      }
      .nut-navbar__title {
        position: absolute;
        left: 50%;
        top: v-bind(navBartop);
        bottom: 0;
        transform: translateX(-50%);
        width: 53%;
        max-width: calc(100% - 160px);
        min-width: 0;
        margin: 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;

        .title {
          min-width: 20px;
          font-size: 18px;
          font-weight: 600;
          // line-height: 100%;
          color: var(--primary-text-color);
          display: nowrap;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }

        .nutui-iconfont {
          margin-left: 5px;
        }
      }
      .navBar-right-button {
        position: absolute;
        top: 50%;
        width: 32px;
        height: 32px;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        border: 0;
        background: transparent;
        color: var(--icon-nav-bar-right);
        cursor: pointer;
        pointer-events: auto;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        &:focus {
          outline: none;
        }

        .navBar-right-icon {
          width: 14px;
          height: 14px;
          font-size: 14px;
          line-height: 1;
          color: currentColor;
          display: inline-flex;
          align-items: center;
          justify-content: center;

          // &.navBar-right-icon--simple {
          //   transform: translateX(1px);
          // }

          :deep(svg) {
            width: 14px;
            height: 14px;
            font-size: 14px;
          }
        }
      }
      .icon-group {
        .navBar-left-icon {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 32px;
          padding-top: v-bind(navBartop);
          padding-right: 0;
          padding-bottom: 0;
          padding-left: 0;
          border: 0;
          margin: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--icon-nav-bar-right);
          cursor: pointer;

          .icon {
            pointer-events: none;
            width: 14px;
            height: 14px;
            font-size: 14px;
          }
        }

        .navBar-left-icon--refresh {
          left: 7px;
        }

        .navBar-left-icon--add {
          left: 37px;

          &:only-child {
            left: 7px;
          }
        }
      }
      .fa-plus {
        color: currentColor;
      }
      .fa-arrow-rotate-right {
        color: currentColor;
      }
      .is-disabled {
        opacity: 0.35;
      }
    }
  }
}

.nav-leading-button {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  width: 32px;
  padding: 0;
  padding-top: v-bind(navBartop);
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 0;
  border: 0;
  margin: 0;
  background: transparent;
  color: var(--icon-nav-bar-right);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
  }

  &:focus {
    outline: none;
  }
}

.nav-leading-placeholder {
  width: 32px;
  height: 32px;
}


.icon-back-icon {
  font-size: 14px;
  color: var(--icon-nav-bar-right);
}

.icon-null::before {
  content: "\2003";
}
</style>
