<template>
  <button
    type="button"
    :class="[
      'language-switch-button',
      `language-switch-button--${props.variant}`,
    ]"
    :aria-label="t('navBar.langSwitcher.cellTitle')"
    :title="t('navBar.langSwitcher.cellTitle')"
    @click.stop="showLangSwitchPopup = true"
  >
    <font-awesome-icon
      class="language-switch-button__icon"
      icon="fa-solid fa-language"
    />
  </button>

  <nut-popup
    v-model:visible="showLangSwitchPopup"
    pop-class="language-switch-popup"
    position="top"
    :z-index="props.zIndex"
    :style="{ paddingTop: 'env(safe-area-inset-top)' }"
  >
    <nut-cell-group>
      <div class="language-switch-popup__title">
        {{ t("navBar.langSwitcher.cellTitle") }}
      </div>
      <nut-cell
        v-for="lang in langList"
        :key="lang"
        :title="t(`navBar.langSwitcher.${lang}`)"
        :class="{ selected: lang === currentLocale }"
        @click="changeLang(lang)"
      >
        <template #icon>
          <font-awesome-icon
            v-if="lang === currentLocale"
            class="fa-lg"
            icon="fa-solid fa-check"
          />
        </template>
      </nut-cell>
    </nut-cell-group>
  </nut-popup>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = withDefaults(
  defineProps<{
    variant?: "compact" | "icon";
    zIndex?: number | string;
  }>(),
  {
    variant: "compact",
    zIndex: 12000,
  },
);

const { t, locale } = useI18n();
const showLangSwitchPopup = ref(false);
const langList = ["zh", "en"];

const currentLocale = computed(() => {
  const normalizedLocale = String(locale.value || "").slice(0, 2);
  return langList.includes(normalizedLocale) ? normalizedLocale : "zh";
});

const changeLang = (type: string) => {
  locale.value = type;
  localStorage.setItem("locale", type);
  showLangSwitchPopup.value = false;
};
</script>

<style lang="scss">
.language-switch-button {
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--divider-color);
  border-radius: 8px;
  margin: 0;
  background: var(--card-color);
  color: var(--second-text-color);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;

  &:focus {
    outline: none;
  }

  &--compact {
    width: 32px;
    padding: 0;
  }

  &--icon {
    width: 32px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--icon-nav-bar-right);
  }

  &__icon {
    width: 14px;
    height: 14px;
    font-size: 14px;
    color: currentColor;
  }
}

.language-switch-popup > .nut-cell-group {
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

.language-switch-popup__title {
  color: var(--comment-text-color);
  padding: 10px 0 10px 15px;
  font-size: 14px;
}

</style>
