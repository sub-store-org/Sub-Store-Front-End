<!-- 分享弹窗 -->
<template>
  <nut-popup
    v-model:visible="isVisible"
    pop-class="share-popup"
    position="center"
    :style="{
      width: `90%`,
      padding: '20px 12px 0 12px',
      backgroundColor: 'var(--background-color)',
    }"
    :lock-scroll="true"
    :safe-area-inset-bottom="true"
    close-icon="close-little"
    z-index="1100"
    :close-on-click-overlay="false"
    closeable
    round
    @close="close"
  >
    <div class="share-popup-title">{{ $t(`globalNotify.share.title`) }}</div>
    <div class="share-info-wrapper">
      <div class="share-info-form">
        <nut-form ref="ruleForm" :model-value="form">
          <nut-form-item
            :label="$t(`globalNotify.share.expiresValue`)"
            prop="expiresValue"
            required
            :rules="[
              {
                required: true,
                message: $t(`globalNotify.share.expiresValueEmpty`),
              },
              {
                validator: validateExpiresValue,
                message: $t(`globalNotify.share.expiresValueRegex`),
              },
            ]"
          >
            <nut-input
              v-model="form.expiresValue"
              :border="false"
              :placeholder="$t(`globalNotify.share.expiresValuePlaceholder`)"
              type="number"
              max-length="8"
              format-trigger="onBlur"
              @blur="customerBlurValidate('expiresValue')"
            ></nut-input>
          </nut-form-item>
          <nut-form-item
            :label="$t(`globalNotify.share.expiresUnit`)"
            prop="expiresUnit"
          >
            <nut-radiogroup v-model="form.expiresUnit" direction="horizontal">
              <nut-radio
                v-for="(item, index) in expiresUnitList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </nut-radio>
            </nut-radiogroup>
          </nut-form-item>
          <nut-form-item :label="$t(`globalNotify.share.token`)" prop="token">
            <nut-input
              v-model="form.token"
              :border="false"
              :placeholder="$t(`globalNotify.share.tokenPlaceholder`)"
              type="text"
              max-length="100"
              clearable
              @clear="clearToken"
            ></nut-input>
          </nut-form-item>
          <nut-form-item :label="$t(`globalNotify.share.remark`)" prop="remark">
            <nut-textarea
              v-model="form.remark"
              class="nut-input-text"
              :border="false"
              :placeholder="$t(`globalNotify.share.remarkPlaceholder`)"
              type="text"
              input-align="left"
              rows="1"
              :autosize="{ maxHeight: 140 }"
              max-length="100"
            />
          </nut-form-item>
          <nut-form-item
            v-if="shareUrlVisible"
            :label="$t(`globalNotify.share.shareUrl`)"
            prop="shareUrl"
          >
            <nut-textarea
              v-model="form.shareUrl"
              class="nut-input-text"
              :border="false"
              :placeholder="$t(`globalNotify.share.shareUrlPlaceholder`)"
              type="text"
              input-align="left"
              rows="3"
              :autosize="{ maxHeight: 140 }"
              max-length="100"
            />
          </nut-form-item>
          <div class="btn-wrapper">
            <!-- <nut-button
              class="btn"
              type="default"
              plain
              shape="round"
              @click="handleCancel"
            >
              {{ $t("globalNotify.share.cancel") }}
            </nut-button> -->
            <nut-button
              class="btn"
              plain
              shape="round"
              :disabled="form.shareUrl ? false : true"
              @click="handleCopyShare"
            >
              {{ $t("globalNotify.share.copyShare") }}
            </nut-button>
            <nut-button
              class="btn"
              type="primary"
              shape="round"
              @click="handleCreateShare"
            >
              {{ $t("globalNotify.share.createShare") }}
            </nut-button>
          </div>
        </nut-form>
      </div>
    </div>
  </nut-popup>
</template>

<script setup lang="ts">
import { Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import { computed, reactive, ref, watch } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";

import { useSubsApi } from "@/api/subs";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useAppNotifyStore } from "@/store/appNotify";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    default: "sub",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:visible"]);
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const subsApi = useSubsApi();
const { currentUrl: host } = useHostAPI();
const { showNotify } = useAppNotifyStore();

const { t } = useI18n();
const ruleForm = ref<any>(null);
const form = reactive({
  expiresValue: "",
  expiresUnit: "day",
  expiresIn: "",
  remark: "",
  token: "",
  shareUrl: "",
});
const isCreateShareLinkSuccess = ref(false);
const isVisible = ref(props.visible);
const expiresUnitList = computed(() => [
  {
    label: t("globalNotify.share.unit.day"),
    value: "day",
  },
  {
    label: t("globalNotify.share.unit.month"),
    value: "month",
  },
  {
    label: t("globalNotify.share.unit.season"),
    value: "season",
  },
  {
    label: t("globalNotify.share.unit.year"),
    value: "year",
  },
]);
const show = () => {
  isVisible.value = true;
  emit("update:visible", true);
};
const hide = () => {
  isVisible.value = false;
  emit("update:visible", false);
};
const shareUrlVisible = computed(() => {
  return form.shareUrl || isCreateShareLinkSuccess.value;
});
const resetFormData = () => {
  form.expiresValue = "";
  form.expiresUnit = "day";
  form.expiresIn = "";
  form.remark = "";
  form.token = "";
  form.shareUrl = "";
  isCreateShareLinkSuccess.value = false;
};
const clearToken = () => {
  form.token = "";
};
const close = () => {
  resetFormData();
  hide();
};
const validateExpiresValue = (value: string) => {
  return /^(?:0\.0[1-9]\d*|[1-9]\d{0,4}(?:\.\d*)?|0\.[1-9]\d*)$/.test(value);
};
// 失去焦点触发验证
const customerBlurValidate = (prop: string) => {
  ruleForm.value.validate(prop);
};
const genExpiresIn = (expireValue: string, expireUnit: string) => {
  const unitMap = {
    day: 1,
    month: 30,
    season: 90,
    year: 365,
  };
  const value = Number.parseFloat(expireValue).toFixed(2);
  const unit = "d";
  const unitValue = unitMap[expireUnit];
  return `${Number(value) * unitValue}${unit}`;
};
const handleCopyShare = async () => {
  if (!form.shareUrl) {
    return;
  }
  if (isSupported) {
    await copy(form.shareUrl);
  } else {
    await copyFallback(form.shareUrl);
  }
  showNotify({ title: t("globalNotify.share.copyShareSuccessTips") });
};
const handleCreateShare = async () => {
  if (!form.expiresValue) {
    return Toast.warn(t("globalNotify.share.expiresValueEmpty"));
  }
  if (!validateExpiresValue(form.expiresValue)) {
    return Toast.warn(t("globalNotify.share.expiresValueRegex"));
  }
  const typeMap = {
    sub: "sub",
    collection: "col",
    file: "file",
  };
  const params: ShareToken = {
    payload: {
      type: typeMap[props.type] as "sub" | "col" | "file",
      name: props.data.name,
      remark: form.remark || "",
    },
    options: {
      expiresIn: genExpiresIn(form.expiresValue, form.expiresUnit),
    },
  };
  if (form.token) {
    params.payload.token = form.token;
  }
  const res = await subsApi.shareSub(params);
  if (res?.data?.status === "success") {
    isCreateShareLinkSuccess.value = true;
    const { secret, token } = res.data.data;
    const shareUrl = `${host.value.replace(
      new RegExp(`${secret}$`),
      "",
    )}/share/${typeMap[props.type]}/${encodeURIComponent(
      props.data.name,
    )}?token=${encodeURIComponent(token)}`;
    form.shareUrl = shareUrl;
    showNotify({ title: t("globalNotify.share.createShareSuccessTips") });
    handleCopyShare();
  } else {
    isCreateShareLinkSuccess.value = false;
  }
};
watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
  },
);
// 暴露方法给父组件
defineExpose({ show, hide, close });
</script>

<style lang="scss" scoped>
.share-popup {
  &-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    color: var(--primary-text-color);
    font-size: 18px;
    font-weight: bold;
  }
  .share-info-wrapper {
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .share-info-form {
      width: 100%;
      .nut-form {
        .nut-input {
          background: transparent;
          padding: 0;
          color: var(--second-text-color);
        }
        :deep(.nut-form-item__body__tips) {
          text-align: left;
        }
        :deep(.nut-textarea__textarea) {
          text-align: left;
        }
      }
    }
    .btn-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      .btn {
        flex: 1;
        border-radius: 8px;
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
