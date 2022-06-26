<template>
  <div class="nav-bar-wrapper">
    <nut-navbar
      id="my-nav-bar"
      :left-show="isNeedBack"
      @on-click-back="back"
      @on-click-right="showLangSwitchPopup = true"
      border
      title="首页"
    >
      <template #right>
        <font-awesome-icon
          class="navBar-right-icon"
          icon="fa-solid fa-language "
        />
      </template>
    </nut-navbar>
  </div>

  <nut-popup position="top" v-model:visible="showLangSwitchPopup">
    <nut-cell-group :title="$t(`common.navBar.langSwitcher.cellTitle`)">
      <nut-cell
        :title="$t(`common.navBar.langSwitcher.zh.name`)"
        @click="changeLang('zh')"
      >
        <template v-slot:icon>
          <img
            class="nut-icon"
            src="https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png"
          />
        </template>
      </nut-cell>
      <nut-cell
        :title="$t(`common.navBar.langSwitcher.en.name`)"
        @click="changeLang('en')"
      >
        <template v-slot:icon>
          <img
            class="nut-icon"
            src="https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png"
          />
        </template>
      </nut-cell>
    </nut-cell-group>
  </nut-popup>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { locale } = useI18n()

  const isNeedBack = ref(false)
  const showLangSwitchPopup = ref(false)

  const changeLang = (type: string) => {
    locale.value = type
    showLangSwitchPopup.value = false
  }

  const back = () => {
    isNeedBack.value ? console.log('Click Back') : null
  }
</script>

<style lang="scss" scoped>
  .nav-bar-wrapper {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 20;

    .nut-navbar {
      height: 56px;
      top: 0;
      box-shadow: none;
      background: #fffd;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);

      .navBar-right-icon {
        color: #606266;
        width: 24px;
        height: 24px;
        margin-left: 6px;
      }
    }
  }
</style>
