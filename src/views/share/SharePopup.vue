<!-- 分享弹窗 -->
<template>
  <nut-popup
    v-model:visible="isVisible"
    pop-class="share-popup"
    position="center"
    :style="{
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
    <div class="share-popup-title">{{ sharePopupTitle }}</div>
    <div class="share-info-wrapper">
      <div class="share-info-form">
        <!-- 新增分享 -->
        <template v-if="action === 'add'">
          <nut-form ref="ruleForm" :model-value="form">
            <nut-form-item
              :label="$t(`sharePage.createShare.expiresValue.label`)"
              prop="expiresValue"
              required
              :rules="[
                {
                  required: true,
                  message: $t(`sharePage.createShare.expiresValue.empty`),
                },
                {
                  validator: validateExpiresValue,
                  message: $t(`sharePage.createShare.expiresValue.regex`),
                },
              ]"
            >
              <nut-input
                v-model="form.expiresValue"
                :border="false"
                :placeholder="$t(`sharePage.createShare.expiresValue.placeholder`)"
                type="number"
                max-length="8"
                format-trigger="onBlur"
                @blur="customerBlurValidate('expiresValue')"
              ></nut-input>
            </nut-form-item>
            <nut-form-item
              :label="$t(`sharePage.createShare.expiresUnit.label`)"
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
            <nut-form-item :label="$t(`sharePage.createShare.token.label`)" prop="token">
              <nut-input
                v-model="form.token"
                :border="false"
                :placeholder="$t(`sharePage.createShare.token.placeholder`)"
                type="text"
                max-length="100"
                clearable
                @clear="clearToken"
              ></nut-input>
            </nut-form-item>
            <nut-form-item :label="$t(`sharePage.createShare.displayName.label`)" prop="displayName">
              <nut-input
                v-model="form.displayName"
                :border="false"
                :placeholder="$t(`sharePage.createShare.displayName.placeholder`)"
                type="text"
                max-length="100"
              ></nut-input>
            </nut-form-item>
            <nut-form-item
              :label="$t(`sharePage.createShare.remark.label`)"
              prop="remark"
            >
              <nut-textarea
                v-model="form.remark"
                class="nut-input-text"
                :border="false"
                :placeholder="$t(`sharePage.createShare.remark.placeholder`)"
                type="text"
                input-align="left"
                rows="1"
                :autosize="{ maxHeight: 140 }"
                max-length="100"
              />
            </nut-form-item>
            <nut-form-item
              v-if="shareUrlVisible"
              :label="$t(`sharePage.createShare.shareUrl.label`)"
              prop="shareUrl"
            >
              <nut-textarea
                v-model="form.shareUrl"
                class="nut-input-text"
                :border="false"
                :placeholder="$t(`sharePage.createShare.shareUrl.placeholder`)"
                type="text"
                input-align="left"
                rows="3"
                :autosize="{ maxHeight: 140 }"
              />
            </nut-form-item>
            <div v-if="shareUrlVisible" class="qrcode-wrapper">
              <nut-image
                :src="shareUrlQrCode"
                class="qrcode"
                fit="cover"
                alt="QR Code"
              />
            </div>
            <div class="btn-wrapper">
              <nut-button
                class="btn"
                plain
                shape="round"
                :disabled="form.shareUrl ? false : true"
                @click="handleCopyShare"
              >
                {{ $t("sharePage.createShare.copyBtn") }}
              </nut-button>
              <nut-button
                class="btn"
                type="primary"
                shape="round"
                @click="handleCreateShare"
              >
                {{ $t("sharePage.createShare.createBtn") }}
              </nut-button>
            </div>
          </nut-form>
        </template>
        <!-- 编辑分享 -->
        <template v-if="action === 'edit'">
          <nut-form ref="ruleForm" :model-value="form">
            <!-- 更新分享 -->
            <template v-if="isUpdateShare">
              <nut-form-item
                :label="$t(`sharePage.createShare.expiresValue.label`)"
                prop="expiresValue"
                required
                :rules="[
                  {
                    required: true,
                    message: $t(`sharePage.createShare.expiresValue.empty`),
                  },
                  {
                    validator: validateExpiresValue,
                    message: $t(`sharePage.createShare.expiresValue.regex`),
                  },
                ]"
              >
                <nut-input
                  v-model="form.expiresValue"
                  :border="false"
                  :placeholder="
                    $t(`sharePage.createShare.expiresValue.placeholder`)
                  "
                  type="number"
                  max-length="8"
                  format-trigger="onBlur"
                  @blur="customerBlurValidate('expiresValue')"
                ></nut-input>
              </nut-form-item>
              <nut-form-item
                :label="$t(`sharePage.createShare.expiresUnit.label`)"
                prop="expiresUnit"
              >
                <nut-radiogroup
                  v-model="form.expiresUnit"
                  direction="horizontal"
                >
                  <nut-radio
                    v-for="(item, index) in expiresUnitList"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </nut-radio>
                </nut-radiogroup>
              </nut-form-item>
              <nut-form-item
                :label="$t(`sharePage.createShare.token.label`)"
                prop="token"
              >
                <nut-input
                  v-model="form.token"
                  :border="false"
                  :placeholder="$t(`sharePage.createShare.token.placeholder`)"
                  type="text"
                  max-length="100"
                  clearable
                  @clear="clearToken"
                ></nut-input>
              </nut-form-item>
              <nut-form-item :label="$t(`sharePage.createShare.displayName.label`)" prop="displayName">
                <nut-input
                  v-model="form.displayName"
                  :border="false"
                  :placeholder="$t(`sharePage.createShare.displayName.placeholder`)"
                  type="text"
                  max-length="100"
                ></nut-input>
              </nut-form-item>
            </template>
            <nut-form-item
              :label="$t(`sharePage.createShare.shareUrl.label`)"
              prop="shareUrl"
            >
              <nut-textarea
                v-model="form.shareUrl"
                class="nut-input-text"
                :border="false"
                :placeholder="$t(`sharePage.createShare.shareUrl.placeholder`)"
                type="text"
                input-align="left"
                rows="3"
                :autosize="{ maxHeight: 140 }"
              />
            </nut-form-item>
            <nut-form-item
              :label="$t(`sharePage.createShare.remark.label`)"
              prop="remark"
            >
              <nut-textarea
                v-model="form.remark"
                class="nut-input-text"
                :border="false"
                :placeholder="$t(`sharePage.createShare.remark.placeholder`)"
                type="text"
                input-align="left"
                rows="1"
                :autosize="{ maxHeight: 140 }"
                max-length="100"
              />
            </nut-form-item>
            <div v-if="shareUrlVisible" class="qrcode-wrapper">
              <nut-image
                :src="shareUrlQrCode"
                class="qrcode"
                fit="cover"
                alt="QR Code"
              />
            </div>
            <div class="btn-wrapper">
              <nut-button
                class="btn"
                plain
                shape="round"
                :disabled="form.shareUrl ? false : true"
                @click="handleCopyShare"
              >
                {{ $t("sharePage.createShare.copyBtn") }}
              </nut-button>
              <nut-button
                v-if="!isUpdateShare"
                class="btn"
                type="primary"
                shape="round"
                @click="handleUpdateShare"
              >
                {{ $t("sharePage.createShare.updateBtn") }}
              </nut-button>
              <nut-button
                v-else
                class="btn"
                type="primary"
                shape="round"
                @click="confirmUpdateShare"
              >
                {{ $t("sharePage.createShare.createBtn") }}
              </nut-button>
            </div>
          </nut-form>
        </template>
      </div>
    </div>
  </nut-popup>
</template>

<script setup lang="ts">
import { Dialog, Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { computed, reactive, ref, watch, watchEffect } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";

import { useShareApi } from "@/api/share";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useAppNotifyStore } from "@/store/appNotify";
import { useSubsStore } from "@/store/subs";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  action: {
    type: String,
    default: "add",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:visible"]);
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const shareApi = useShareApi();
const { currentUrl: host } = useHostAPI();
const { env } = useBackend();
const { showNotify } = useAppNotifyStore();
const subsStore = useSubsStore();

const { t } = useI18n();
const ruleForm = ref<any>(null);
const form = reactive({
  expiresValue: "",
  expiresUnit: "day",
  expiresIn: "",
  remark: "",
  token: "",
  name: "",
  displayName: "",
  type: "",
  shareUrl: "",
});

const parseDuration = (input: string): { value: number; unit: string } | null => {
  if (!input) {
    return null;
  }
  // 使用正则表达式提取数字和单位
  const regex = /^([\d.]+)([d])$/; // 匹配形如 "60d" 或 "0.15d" 的格式
  const match = input.match(regex);

  if (!match) {
      // 如果输入格式不正确，返回 null
      return null;
  }

  const days: number = parseFloat(match[1]); // 获取输入的天数
  const unitMap: { [key: string]: number } = {
      'day': 1,
      'month': 30,
      'season': 90,
      'year': 365,
  };

  // 根据输入天数计算相应的单位和数值
  if (days < 30) {
    return { value: parseFloat((days / unitMap['day']).toFixed(2)), unit: 'day' };
  } else if (days < 90) {
    return { value: parseFloat((days / unitMap['month']).toFixed(2)), unit: 'month' };
  } else if (days < 365) {
    return { value: parseFloat((days / unitMap['season']).toFixed(2)), unit: 'season' };
  } else {
    return { value: parseFloat((days / unitMap['year']).toFixed(2)), unit: 'year' };
  }
};

watchEffect(() => {
  if (props.action === "edit") {
    if (props.data?.expiresIn) {
      const { value, unit } = parseDuration(props.data?.expiresIn);
      form.expiresValue = String(value);
      form.expiresUnit = unit; 
    } else {
      form.expiresValue = "";
      form.expiresUnit = "day";
    }
    // form.token = props.data?.token;
    form.remark = props.data?.remark;
    form.shareUrl = props.data?.shareUrl;
    form.name = props.data?.name;
    form.displayName = props.data?.displayName;
    form.type = props.data?.type;
  } else {
    form.expiresValue = "";
    form.expiresUnit = "day";
    form.expiresIn = "";
    form.remark = "";
    form.token = "";
    form.shareUrl = "";
    form.name = props.data?.name;
    form.displayName = props.data?.displayName;
    form.type = props.data?.type;
  }
});
const isCreateShareLinkSuccess = ref(false);
const isVisible = ref(props.visible);
const sharePopupTitle = computed(() => {
  return `${t("sharePage.title")}`;
});
const expiresUnitList = computed(() => [
  {
    label: t("sharePage.createShare.unit.day"),
    value: "day",
  },
  {
    label: t("sharePage.createShare.unit.month"),
    value: "month",
  },
  {
    label: t("sharePage.createShare.unit.season"),
    value: "season",
  },
  {
    label: t("sharePage.createShare.unit.year"),
    value: "year",
  },
]);
const shareUrlQrCode = useQRCode(computed(() => form.shareUrl));
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

const isUpdateShare = ref(false);

const resetFormData = () => {
  form.expiresValue = "";
  form.expiresUnit = "day";
  form.expiresIn = "";
  form.remark = "";
  form.token = "";
  form.shareUrl = "";
  form.name = "";
  form.type = "";
  isCreateShareLinkSuccess.value = false;
  isUpdateShare.value = false;
};
const clearToken = () => {
  form.token = "";
};
const close = () => {
  setTimeout(() => {
    resetFormData();
  }, 300);
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
const handleCopyShare = async (isNotify: boolean = true) => {
  if (!form.shareUrl) {
    return;
  }
  if (isSupported) {
    await copy(form.shareUrl);
  } else {
    await copyFallback(form.shareUrl);
  }
  isNotify && showNotify({ title: t("sharePage.copyShare.succeedNotify") });
};

const secretPath = computed(() => {
  return env.value?.meta?.node?.env?.SUB_STORE_FRONTEND_BACKEND_PATH || "";
});

const handleUpdateShare = async () => {
  Dialog({
    title: t("sharePage.updateShare.title"),
    content: t("sharePage.updateShare.tips"),
    popClass: "auto-dialog",
    okText: t("sharePage.updateShare.confirm"),
    cancelText: t("sharePage.updateShare.cancel"),
    noCancelBtn: false,
    closeOnPopstate: true,
    lockScroll: false,
    onOk: async () => {
      console.log("form", form);
      console.log("props.data", props.data);
      isUpdateShare.value = true;
    },
    onCancel: () => {
      console.log("取消");
      isUpdateShare.value = false;
    },
  });
};

const handleCreateShare = async () => {
  if (!form.expiresValue) {
    return Toast.warn(t("sharePage.createShare.expiresValue.empty"));
  }
  if (!validateExpiresValue(form.expiresValue)) {
    return Toast.warn(t("sharePage.createShare.expiresValue.regex"));
  }
  const typeMap = {
    sub: "sub",
    collection: "col",
    col: "col",
    file: "file",
  };
  const params: ShareToken = {
    payload: {
      type: typeMap[form.type] as "sub" | "col" | "file",
      name: form.name,
      displayName: form.displayName || "",
      remark: form.remark || "",
    },
    options: {
      expiresIn: genExpiresIn(form.expiresValue, form.expiresUnit),
    },
  };
  if (form.token) {
    params.payload.token = form.token;
  }
  const res = await shareApi.createShare(params);
  if (res?.data?.status === "success") {
    isCreateShareLinkSuccess.value = true;
    const { token } = res.data.data;
    const shareUrl = `${host.value.replace(new RegExp(`${secretPath.value}$`), "")}/share/${typeMap[form.type]}/${encodeURIComponent(
      props.data.name,
    )}?token=${encodeURIComponent(token)}`;
    form.shareUrl = shareUrl;
    showNotify({ title: t("sharePage.createShare.succeedNotify") });
    handleCopyShare(false);
    if (props.action === "edit") {
      subsStore.fetchShareData();
    }
  } else {
    isCreateShareLinkSuccess.value = false;
  }
};

const confirmUpdateShare = async () => {
  await subsStore.deleteShare(props.data?.token, false);
  await handleCreateShare();
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
    min-width: 300px;
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
    .qrcode-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      .qrcode {
        width: 120px;
        height: 120px;
        margin: 0 auto;
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
