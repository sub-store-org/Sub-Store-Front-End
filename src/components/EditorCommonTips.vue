<template>
  <button
    type="button"
    class="editor-common-tips-button"
    :aria-label="t('editorPage.commonTips.open')"
    :title="t('editorPage.commonTips.open')"
    @click.stop="openTips"
  >
    <font-awesome-icon icon="fa-solid fa-circle-question" />
  </button>
</template>

<script setup lang="ts">
import { Dialog } from "@nutui/nutui";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const openTips = () => {
  Dialog({
    title: t("editorPage.commonTips.title"),
    content: t("editorPage.commonTips.content"),
    popClass: "auto-dialog",
    textAlign: "left",
    okText: t("editorPage.commonTips.goSettings"),
    cancelText: t("editorPage.commonTips.cancel"),
    closeOnPopstate: true,
    lockScroll: false,
    onOk: () => {
      router.push("/settings/more");
    },
  });
};
</script>

<style lang="scss" scoped>
.editor-common-tips-button {
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  margin: 0 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--second-text-color);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus {
    color: var(--primary-color);
    outline: none;
  }

  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
