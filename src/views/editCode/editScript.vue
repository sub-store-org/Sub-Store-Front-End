<template>
  <cmView :isReadOnly="false" :id="id" />
  <div class="bottom-btn-wrapper">
    <nut-button
      @click="routerBack"
      class="compare-btn btn"
      style="width: 30%"
      plain
      shape="square"
    >
      <font-awesome-icon icon="fa-solid fa-eye" />
      {{ $t("myPage.btn.cancel") }}
    </nut-button>
    <nut-button
      @click="submit"
      class="submit-btn btn"
      type="primary"
      shape="square"
    >
      <font-awesome-icon icon="fa-solid fa-floppy-disk" />
      {{ $t("editorPage.subConfig.btn.save") }}
    </nut-button>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from "@/store/global";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import cmView from "@/views/editCode/cmView.vue";
import { useCodeStore } from "@/store/codeStore";
import { storeToRefs } from "pinia";
import { useAppNotifyStore } from "@/store/appNotify";

const cmStore = useCodeStore();
const { t } = useI18n();
const router = useRouter();
const { showNotify } = useAppNotifyStore();
const globalStore = useGlobalStore();
const { bottomSafeArea } = storeToRefs(globalStore);
const padding = bottomSafeArea.value + "px";

const route = useRoute();
const id = route.params.id as string;
console.log(id)
const routerBack = () => {
  cmStore.setEditCode(id, "");
  router.back();
};

const submit = () => {
  const code = cmStore.CmCode;
  cmStore.setEditCode(id, code);
  router.back();
  showNotify({
    type: "success",
    title: "请勿重复点击...",
  });
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0 var(--safe-area-side) calc(v-bind("padding") + 63px)
    var(--safe-area-side);

  :deep(.nut-cell-group__warp) {
    border-radius: var(--item-card-radios);
  }
}

.bottom-btn-wrapper {
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  width: 100%;
  padding: 8px var(--safe-area-side) calc(v-bind("padding") + 8px)
    var(--safe-area-side);
  z-index: 20;
  background: var(--background-color);
  border-top: 1px solid var(--divider-color);

  .btn {
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      margin-right: 4px;
    }
  }

  // .compare-btn {
  //   background: transparent;
  //   width: 36%;
  // }

  .submit-btn {
    width: 67%;
  }
}
</style>
