<template>
  <div class="age-key-helper">
    <button
      type="button"
      class="age-key-trigger"
      :aria-label="$t('ageKey.helper.open')"
      @click="openDialog"
    >
      <nut-icon name="refresh" />
    </button>

    <nut-dialog
      v-model:visible="visible"
      teleport="#app"
      pop-class="age-key-helper-dialog auto-dialog"
      :title="$t('ageKey.helper.title')"
      close-on-click-overlay
    >
      <div class="age-key-helper-body">
        <div class="age-key-type-block">
          <div class="age-key-section-title">{{ $t("ageKey.helper.type") }}</div>
          <div class="radio-wrapper age-key-type-wrapper">
            <nut-radiogroup direction="horizontal" v-model="keyType">
              <nut-radio shape="button" :label="AGE_KEY_TYPES.X25519">
              X25519
              </nut-radio>
              <nut-radio shape="button" :label="AGE_KEY_TYPES.HYBRID">
              MLKEM768-X25519
              </nut-radio>
            </nut-radiogroup>
          </div>
        </div>

        <section class="age-key-section">
          <div class="age-key-section-header">
            <div class="age-key-section-title">{{ $t("ageKey.secretKey.label") }}</div>
            <div class="age-key-section-actions">
              <nut-button
                size="small"
                type="primary"
                shape="square"
                class="age-key-action-button"
                :loading="isBusy"
                @click="handleGenerate"
              >
                {{ $t("ageKey.helper.generate") }}
              </nut-button>
              <nut-button
                size="small"
                plain
                shape="square"
                class="age-key-action-button"
                :disabled="!secretKey"
                @click="copyValue(secretKey)"
              >
                {{ $t("ageKey.helper.copySecret") }}
              </nut-button>
              <nut-button
                v-if="props.applyMode === 'secret'"
                size="small"
                type="primary"
                shape="square"
                class="age-key-action-button"
                :disabled="!secretKey"
                @click="fillSecretKey"
              >
                {{ $t("ageKey.helper.applyPublic") }}
              </nut-button>
            </div>
          </div>
          <div class="age-key-textarea-wrapper">
            <nut-textarea
              v-model="secretKey"
              class="age-key-textarea"
              :border="false"
              rows="3"
              :autosize="{ minHeight: 70, maxHeight: 140 }"
              :placeholder="$t('ageKey.secretKey.placeholder')"
            />
            <button
              v-if="secretKey"
              type="button"
              class="age-key-clear"
              :aria-label="$t('ageKey.helper.clearSecret')"
              @click="secretKey = ''"
            >
              <nut-icon name="mask-close" />
            </button>
          </div>
        </section>

        <section v-if="props.applyMode !== 'secret'" class="age-key-section">
          <div class="age-key-section-header">
            <div class="age-key-section-title">{{ $t("ageKey.publicKey.label") }}</div>
            <div class="age-key-section-actions">
              <nut-button
                size="small"
                plain
                shape="square"
                class="age-key-action-button"
                :disabled="!secretKey"
                :loading="isBusy"
                @click="handleDerive"
              >
                {{ $t("ageKey.helper.derive") }}
              </nut-button>
              <nut-button
                size="small"
                plain
                shape="square"
                class="age-key-action-button"
                :disabled="!publicKey"
                @click="copyValue(publicKey)"
              >
                {{ $t("ageKey.helper.copyPublic") }}
              </nut-button>
              <nut-button
                v-if="props.applyMode === 'pair'"
                size="small"
                type="primary"
                shape="square"
                class="age-key-action-button"
                :disabled="!secretKey || !publicKey"
                @click="fillKeyPair"
              >
                {{ $t("ageKey.helper.applyPair") }}
              </nut-button>
              <nut-button
                v-else
                size="small"
                type="primary"
                shape="square"
                class="age-key-action-button"
                :disabled="!publicKey"
                @click="fillPublicKey"
              >
                {{ $t("ageKey.helper.applyPublic") }}
              </nut-button>
            </div>
          </div>
          <div class="age-key-textarea-wrapper">
            <nut-textarea
              v-model="publicKey"
              class="age-key-textarea"
              :border="false"
              rows="2"
              :autosize="{ minHeight: 48, maxHeight: 100 }"
              :placeholder="$t('ageKey.publicKey.placeholder')"
            />
            <button
              v-if="publicKey"
              type="button"
              class="age-key-clear"
              :aria-label="$t('ageKey.helper.clearPublic')"
              @click="publicKey = ''"
            >
              <nut-icon name="mask-close" />
            </button>
          </div>
        </section>

        <p class="age-helper-tips">
          {{ $t(props.applyMode === "secret" ? "ageKey.helper.secretTips" : "ageKey.helper.tips") }}
        </p>
      </div>
      <template #footer>
        <nut-button size="small" type="primary" shape="round" class="age-key-close" @click="visible = false">
          {{ $t("ageKey.helper.close") }}
        </nut-button>
      </template>
    </nut-dialog>
  </div>
</template>

<script setup lang="ts">
import { Toast } from "@nutui/nutui";
import useClipboard from "vue-clipboard3";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import {
  AGE_KEY_TYPES,
  AGE_PUBLIC_KEY,
  AGE_SECRET_KEY,
  type AgeKeyType,
  derivePublicKey,
  generateKeyPair,
} from "@/utils/age";

const props = withDefaults(defineProps<{
  modelValue?: string;
  applyMode?: "public" | "pair" | "secret";
}>(), {
  applyMode: "public",
});

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "apply", value: string): void;
  (event: "apply-pair", value: { [AGE_SECRET_KEY]: string; [AGE_PUBLIC_KEY]: string }): void;
}>();

const { t } = useI18n();
const { toClipboard } = useClipboard();
const visible = ref(false);
const isBusy = ref(false);
const keyType = ref<AgeKeyType>(AGE_KEY_TYPES.X25519);
const publicKey = ref("");
const secretKey = ref("");

const openDialog = () => {
  secretKey.value = "";
  publicKey.value = "";
  visible.value = true;
};

const getErrorMessage = (error: any) => {
  return error?.response?.data?.error?.message || error?.message || String(error);
};

const handleError = (error: unknown) => {
  Toast.fail(`${t("ageKey.helper.error")}: ${getErrorMessage(error)}`);
};

const handleGenerate = async () => {
  isBusy.value = true;
  try {
    const pair = await generateKeyPair(keyType.value);
    secretKey.value = pair[AGE_SECRET_KEY];
    publicKey.value = pair[AGE_PUBLIC_KEY];
  } catch (error) {
    handleError(error);
  } finally {
    isBusy.value = false;
  }
};

const handleDerive = async () => {
  isBusy.value = true;
  try {
    publicKey.value = await derivePublicKey(secretKey.value);
  } catch (error) {
    handleError(error);
  } finally {
    isBusy.value = false;
  }
};

const fillPublicKey = () => {
  const value = publicKey.value.trim();
  emit("update:modelValue", value);
  emit("apply", value);
  Toast.text(t("ageKey.helper.filled"));
};

const fillSecretKey = () => {
  const value = secretKey.value.trim();
  emit("update:modelValue", value);
  emit("apply", value);
  Toast.text(t("ageKey.helper.filled"));
};

const fillKeyPair = () => {
  const identity = secretKey.value.trim();
  const recipient = publicKey.value.trim();
  emit("update:modelValue", recipient);
  emit("apply", recipient);
  emit("apply-pair", {
    [AGE_SECRET_KEY]: identity,
    [AGE_PUBLIC_KEY]: recipient,
  });
  Toast.text(t("ageKey.helper.filledPair"));
};

const copyValue = async (value: string) => {
  try {
    await toClipboard(value);
    Toast.text(t("ageKey.helper.copied"));
  } catch (error) {
    handleError(error);
  }
};
</script>

<style scoped lang="scss">
.age-key-helper {
  display: flex;
  justify-content: flex-end;
}

.age-key-trigger {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--primary-color);
  cursor: pointer;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
}

.age-key-helper-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.age-key-type-block,
.age-key-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.age-key-type-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  :deep(.nut-radio__button.false) {
    background: var(--divider-color);
    border-color: transparent;
    color: var(--second-text-color);
  }

  :deep(.nut-radio__button) {
    padding: 5px 10px;
  }
}

.age-key-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.age-key-section-title {
  flex: 0 0 auto;
  color: var(--comment-text-color, #8a8a8a);
  font-size: 14px;
  line-height: 1.4;
}

.age-key-section-actions {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

.age-key-action-button {
  height: 26px !important;
  min-height: 26px !important;
  min-width: 0;
  padding: 0 !important;

  :deep(.nut-button__warp) {
    height: 26px;
    min-height: 26px;
    padding: 0 7px !important;
    font-size: 11px;
    line-height: 1;
  }
}

.age-key-textarea-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--divider-color);
  border-radius: 4px;
  background: var(--card-color);
}

.age-key-textarea {
  width: 100%;
  background: transparent !important;
  padding: 0 !important;
  font-size: 11px;
  line-height: 1.4;
  color: var(--primary-text-color);

  :deep(.nut-textarea) {
    background: transparent !important;
  }

  :deep(.nut-textarea__textarea) {
    box-sizing: border-box;
    background: transparent !important;
    color: var(--primary-text-color);
    caret-color: var(--primary-color);
    padding: 8px 34px 8px 10px;
    font-size: 12px;
    line-height: 1.45;
    text-align: left !important;
    word-break: break-word;

    &::placeholder {
      color: var(--comment-text-color, #8a8a8a);
      font-size: 12px;
      line-height: 1.45;
      opacity: 1;
    }
  }
}

.age-key-clear {
  position: absolute;
  top: 50%;
  right: 8px;
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--comment-text-color, #8a8a8a);
  cursor: pointer;
  transform: translateY(-50%);
}

.age-helper-tips {
  margin: 0;
  color: var(--comment-text-color, #8a8a8a);
  font-size: 12px;
  line-height: 1.5;
}

.age-key-close {
  height: 28px !important;
  min-width: 96px;
  padding: 0 !important;

  :deep(.nut-button__warp) {
    height: 28px;
    min-height: 28px;
    padding: 0 14px !important;
    font-size: 12px;
  }
}

:global(.age-key-helper-dialog),
:global(.nut-dialog.age-key-helper-dialog) {
  width: min(92vw, 560px) !important;
  max-width: 560px !important;
}

:global(.age-key-helper-dialog .nut-dialog),
:global(.nut-dialog.age-key-helper-dialog) {
  width: 100%;
  max-width: none;
}

:global(.age-key-helper-dialog .nut-dialog__content),
:global(.nut-dialog.age-key-helper-dialog .nut-dialog__content) {
  width: 100%;
  max-height: 72vh;
  overflow-y: auto;
}

</style>
