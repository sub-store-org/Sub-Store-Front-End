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

  <nut-popup position="top" v-model:visible="showLangSwitchPopup">
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
  import { ref, computed, watchEffect } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { banScroll, allowScroll } from '@/utils/switchCanScroll'

  const { t, locale } = useI18n()
  const route = useRoute()
  const isNeedBack = ref(false)
  const showLangSwitchPopup = ref(false)
  const langList = ['zh', 'en']

  const currentTitle = computed(() => {
    const metaTitle = route.meta.title
    return metaTitle ? t(`pagesTitle.${metaTitle}`) : undefined
  })

  watchEffect(() => {
    showLangSwitchPopup.value ? banScroll() : allowScroll()
  })

  const navBarHeight = '56px'
  const changeLang = (type: string) => {
    locale.value = type
    localStorage.setItem('locale', type)
    showLangSwitchPopup.value = false
  }

  const back = () => {
    isNeedBack.value ? console.log('Click Back') : null
  }
</script>

<style lang="scss" scoped>
  .nav-bar-wrapper {
    position: relative;
    height: v-bind(navBarHeight);

    nav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 20;

      .nut-navbar {
        height: v-bind(navBarHeight);
        top: 0;
        box-shadow: none;
        background: #f8f8f8dd;
        border-bottom: #00000006 solid 1px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);

        .navBar-right-icon {
          color: #606266;
        }
      }
    }
  }

  .selected {
    color: #409eff;
    font-weight: bold;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }
</style>
