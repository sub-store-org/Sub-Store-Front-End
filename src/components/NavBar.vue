<template>
  <div class="nav-bar-wrapper">
    <nav>
      <nut-navbar
        :left-show="isNeedBack"
        @on-click-back="back"
        @on-click-right="showLangSwitchPopup = true"
        :title="currentTitle"
      >
        <template #right>
          <font-awesome-icon
            class="navBar-right-icon fa-lg"
            icon="fa-solid fa-language "
          />
        </template>
      </nut-navbar>
    </nav>
  </div>

  <nut-popup
    lock-scroll
    pop-class="nav-bar-lang-switch-popup"
    position="top"
    v-model:visible="showLangSwitchPopup"
    z-index="1000"
  >
    <nut-cell-group :title="$t(`common.navBar.langSwitcher.cellTitle`)">
      <nut-cell
        v-for="lang in langList"
        :title="$t(`common.navBar.langSwitcher.${lang}.name`)"
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
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  const { t, locale } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const showLangSwitchPopup = ref(false)
  const langList = ['zh', 'en']

  const isNeedBack = computed(() => {
    return route.meta.needNavBack ?? false
  })

  const currentTitle = computed(() => {
    const metaTitle = route.meta.title
    return metaTitle ? t(`pagesTitle.${metaTitle}`) : undefined
  })

  const navBarHeight = '56px'
  const changeLang = (type: string) => {
    locale.value = type
    localStorage.setItem('locale', type)
    showLangSwitchPopup.value = false
  }

  const back = () => {
    if (isNeedBack.value) {
      console.log('Click Back')
      router.back()
    }
  }
</script>

<style lang="scss">
  @import '@/assets/custom_theme_variables.scss';

  .nav-bar-wrapper {
    position: fixed;
    width: 100%;
    top: 0;
    height: v-bind(navBarHeight);
    z-index: 20;

    nav {
      .nut-navbar {
        height: v-bind(navBarHeight);
        top: 0;
        box-shadow: none;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(20px);

        .dark-mode & {
          background: $dark-nav-bar-color;
          border-bottom: $dark-divider-color solid 1px;

          .nut-navbar__title > .title {
            color: $dark-primary-text-color;
          }
        }
        .light-mode & {
          background: $light-nav-bar-color;
          border-bottom: $light-divider-color solid 1px;

          .nut-navbar__title > .title {
            color: $light-primary-text-color;
          }
        }

        .navBar-right-icon {
          color: #606266;
        }
      }
    }
  }

  .nav-bar-lang-switch-popup > .nut-cell-group {
    width: 100%;

    .dark-mode & {
      background-color: $dark-popup-color;
      > .nut-cell-group__title {
        color: $dark-comment-text-color;
      }

      > .nut-cell-group__warp {
        background-color: $dark-popup-color;

        > .nut-cell {
          background-color: $dark-popup-color;

          &::after {
            border-color: $dark-divider-color;
          }
        }

        > .nut-cell:not(.selected) {
          color: $dark-primary-text-color;
        }
      }
    }

    .light-mode & {
      background-color: $light-popup-color;

      > .nut-cell-group__title {
        color: $light-comment-text-color;
      }

      > .nut-cell-group__warp {
        background-color: $light-popup-color;

        > .nut-cell {
          background-color: $light-popup-color;

          &::after {
            border-color: $light-divider-color;
          }
        }

        > .nut-cell:not(.selected) {
          color: $light-primary-text-color;
        }
      }
    }

    .selected.nut-cell {
      color: $primary-color;
      font-weight: bold;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    }
  }
</style>
