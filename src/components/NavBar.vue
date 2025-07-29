<template>
  <!-- isPWA 时候顶部边距 -->
  <div v-if="isPWA" class="pwa_top_padding" />
  <div class="nav-bar-wrapper">
    <nav>
      <!-- &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{ navBarHeight }} {{ wh }}    {{ topHeight }}-->

      <nut-navbar
        @on-click-back="back"
        @on-click-right="showLangSwitchPopup = true"
        :title="currentTitle"
        :tit-icon="currentTitleWhetherAsk"
        @on-click-icon="onClickNavbarIcon"
      >
        <template #left>
          <div :class="isNeedBack ? 'icon-back' : 'icon-home'"></div>
          <div class="icon-group">
            <font-awesome-icon
              v-if="!isNeedBack && !appearanceSetting.showFloatingRefreshButton"
              @click.stop="refresh"
              class="icon fa-arrow-rotate-right"
              icon="fa-solid fa-arrow-rotate-right"
            />
            <font-awesome-icon
              v-if="
                ['/subs', '/sync', '/files'].includes(route.path) &&
                !appearanceSetting.showFloatingAddButton
              "
              @click.stop="add(route)"
              class="icon fa-plus"
              icon="fa-solid fa-plus"
            />
          </div>
        </template>

        <template #right>
          <font-awesome-icon
            v-if="appearanceSetting.isSimpleMode"
            @click.stop="setSimpleMode(false)"
            class="navBar-right-icon fa-toggle"
            icon="fa-solid fa-toggle-on "
          />
          <font-awesome-icon
            v-else
            @click.stop="setSimpleMode(true)"
            class="navBar-right-icon fa-toggle"
            icon="fa-solid fa-toggle-off"
          />
          <font-awesome-icon
            class="navBar-right-icon fa-lg"
            icon="fa-solid fa-language"
          />
        </template>
      </nut-navbar>
    </nav>
  </div>
  <!-- lock-scroll  -->
  <nut-popup
    pop-class="nav-bar-lang-switch-popup"
    position="top"
    v-model:visible="showLangSwitchPopup"
    z-index="1000"
     :style="{ paddingTop: 'env(safe-area-inset-top)' }"
  >
    <nut-cell-group>
      <div
        style="
          color: var(--comment-text-color);
          padding: 10px 0 10px 15px;
          font-size: 14px;
        "
      >
        {{ $t(`navBar.langSwitcher.cellTitle`) }}
      </div>
      <nut-cell
        v-for="lang in langList"
        :title="$t(`navBar.langSwitcher.${lang}`)"
        @click="changeLang(lang)"
        :key="lang"
        :class="{ selected: lang === locale }"
      >
        <template v-slot:icon>
          <font-awesome-icon
            v-if="lang === locale"
            class="fa-lg"
            icon="fa-solid fa-check"
          />
        </template>
      </nut-cell>
    </nut-cell-group>
  </nut-popup>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from '@/store/settings';
import { storeToRefs } from "pinia";
import { Toast } from "@nutui/nutui";
import { initStores } from "@/utils/initApp";
import { useMethodStore } from '@/store/methodStore';
import { useAppNotifyStore } from "@/store/appNotify";
import i18n from "@/locales";

const { t:i18n_global } = i18n.global;
const { showNotify } = useAppNotifyStore();
const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const methodStore = useMethodStore()
const globalStore = useGlobalStore();
const showLangSwitchPopup = ref(false);
const langList = ["zh", "en"];
const settingsStore = useSettingsStore();
const { changeAppearanceSetting } = settingsStore;
const { appearanceSetting } = storeToRefs(settingsStore);
// const { isSimpleMode, showFloatingRefreshButton } = storeToRefs(globalStore);
const isLandscape = ref(false);
const isSmall = ref(false);
const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
  screenHeight.value = window.innerHeight;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
const isPWA = ref(
  (window.matchMedia("(display-mode: standalone)").matches &&
    !/Android/.test(navigator.userAgent)) ||
    false
);

// isPWA.value = true;
// isSmall.value = true;

const navBarHeight = computed(() => {
  return isPWA.value && !isLandscape.value ? (isSmall.value ? "78px" : "95px") : "56px";
});

const navBartop = computed(() => {
  return isPWA.value && !isLandscape.value ? (isSmall.value ? "38px" : "55px") : "0px";
});

const navBartopRight = computed(() => {
  return isPWA.value && !isLandscape.value ? (isSmall.value ? "52px" : "65px") : "15px";
});

const Pwa_top = computed(() => {
  return isPWA.value ? (isSmall.value ? "20px" : "45px") : "45px";
});

const isNeedBack = computed(() => {
  return route.meta.needNavBack ?? false;
});

const currentTitle = computed(() => {
  const metaTitle = route.meta.title;
  return metaTitle ? t(`navBar.pagesTitle.${metaTitle}`) : undefined;
});
const currentTitleWhetherAsk = computed(() => {
  const ownAsk = ["sync"];
  const metaTitle = route.meta.title;
  return ownAsk.includes(metaTitle) ? "ask" : "";
});
const onClickNavbarIcon = () => {
  const metaTitle = route.meta.title;
  const toastContent =
    t(`navBar.pagesTitle.askWhat.${metaTitle}.content`) || "";
  const toastTitle = t(`navBar.pagesTitle.askWhat.${metaTitle}.title`) || "";
  Toast.text(toastContent, {
    title: toastTitle,
    duration: 0,
    cover: true,
    "close-on-click-overlay": true,
    "bg-color": "rgba(0, 0, 0, 0.8)",
    "cover-color": "rgba(0, 0, 0, 0.2)",
    "text-align-center": false,
  });
};

const changeLang = (type: string) => {
  locale.value = type;
  localStorage.setItem("locale", type);
  showLangSwitchPopup.value = false;
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

const refresh = async () => {
  if (["/subs", "/sync", "/files"].includes(route.path)) {
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
watchEffect(() => {
  handleResize();
  isSmall.value = screenHeight.value < 750 || /iPad/.test(navigator.userAgent);
  isLandscape.value = screenWidth.value > screenHeight.value;
});
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
        min-width: 53%;
        margin: 0 auto;
        position: relative;
        left: -7px;
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
      .navBar-right-icon {
        padding-top: v-bind(navBartopRight);
        padding-right: 4px;
        padding-bottom: 15px;
        padding-left: 10px;
        color: var(--icon-nav-bar-right);
      }
      .icon-group {
        .icon {
          &:first-child:last-child {
            left: 15px;
          }
        }
      }
      .fa-plus {
        padding-top: v-bind(navBartop);
        color: var(--icon-nav-bar-right);
        position: absolute;
        left: 45px;
        top: 50%;
        transform: translateY(-50%);
      }
      .fa-arrow-rotate-right {
        padding-top: v-bind(navBartop);
        color: var(--icon-nav-bar-right);
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
      }
      .fa-lg {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
      }

      .fa-toggle {
        position: absolute;
        right: 58px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}

.nav-bar-lang-switch-popup > .nut-cell-group {
  width: 100%;

  background-color: var(--popup-color);

  > .nut-cell-group__title {
    color: var(--comment-text-color);
  }

  > .nut-cell-group__warp {
    background-color: var(--popup-color);

    > .nut-cell {
      background-color: var(--popup-color);

      &::after {
        border-color: var(--divider-color);
      }
    }

    > .nut-cell:not(.selected) {
      color: var(--primary-text-color);
    }
  }

  .selected.nut-cell {
    color: var(--primary-color);
    font-weight: bold;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }
}

.icon-back::before {
  color: var(--primary-text-color);
  content: "\e6c9";
}

.icon-null::before {
  content: "\2003";
}
</style>
