<!-- 分享弹窗 -->
<template>
  <nut-popup
    v-model:visible="isVisible"
    pop-class="share-popup"
    position="center"
    :style="{
      width: `90%`,
      height: `50%`,
      padding: '20px 12px 0 12px',
      backgroundColor: 'var(--background-color)',
    }"
    :lock-scroll="true"
    :safe-area-inset-bottom="true"
    close-icon="close-little"
    z-index="11000"
    closeable
    round
    @close="close"
  >
    <div class="share-popup-title">{{ $t(`globalNotify.share.title`) }}</div>
    <div class="share-info-wrapper">
      <div class="share-info-form">
        <nut-form :model-value="form" ref="ruleForm">
          <nut-form-item
            :label="$t(`globalNotify.share.expiresValue`)"
            prop="expiresValue"
            required
            :rules="[{ required: true, message: $t(`globalNotify.share.expiresValueEmpty`) }]"
          >
            <nut-input
              v-model="form.expiresValue"
              :border="false"
              text-align="right"
              :placeholder="$t(`globalNotify.share.expiresValuePlaceholder`)"
              type="number"
              @blur="customerBlurValidate('expiresValue')"
            ></nut-input>
          </nut-form-item>
          <nut-form-item :label="$t(`globalNotify.share.expiresUnit`)">
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
          <nut-form-item :label="$t(`globalNotify.share.token`)">
            <nut-input
              v-model="form.token"
              :border="false"
              text-align="right"
              :placeholder="$t(`globalNotify.share.tokenPlaceholder`)"
              type="text"
              clearable
              @clear="clearToken"
            ></nut-input>
          </nut-form-item>
          <nut-form-item :label="$t(`globalNotify.share.remark`)">
            <nut-input
              v-model="form.remark"
              :border="false"
              text-align="right"
              :placeholder="$t(`globalNotify.share.remarkPlaceholder`)"
              type="text"
              clearable
              @clear="clearRemark"
            ></nut-input>
          </nut-form-item>
          
          <div class="btn-wrapper">
            <nut-button
              class="submit-btn btn"
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
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppNotifyStore } from "@/store/appNotify";
import { useSubsApi } from "@/api/subs";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useGlobalStore } from "@/store/global";
import { useClipboard } from "@vueuse/core";
import useV3Clipboard from "vue-clipboard3";
import { Toast } from "@nutui/nutui";
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

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
const subsApi = useSubsApi();
const { currentUrl: host } = useHostAPI();
const { showNotify } = useAppNotifyStore();

const { t } = useI18n();
const globalStore = useGlobalStore();
const ruleForm = ref<any>(null);
const form = reactive({
  expiresValue: "30",
  expiresUnit: "day",
  expiresIn: "",
  remark: "",
  token: "",
});
const isVisible = ref(props.visible);
const expiresUnitList = ref([
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

const clearRemark = () => {
  form.remark = "";
}
const clearToken = () => {
  form.token = "";
}
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
  const value = parseFloat(expireValue).toFixed(2);
  const unit = 'd';
  const unitValue = unitMap[expireUnit];
  return `${Number(value) * unitValue}${unit}`;
}
const handleCreateShare = async () => {
  console.log("form", form);
  console.log("data", props.data);
  if (!form.expiresValue) {
    return false;
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
      remark: form.remark || '',
    },
    options: {
      expiresIn: genExpiresIn(form.expiresValue, form.expiresUnit),
    },
  };
  if (form.token) {
    params.payload.token = form.token
  }
  const res = await subsApi.shareSub(params);
  if (res?.data?.status === "success") {
    const { secret, token } = res.data.data;
    const shareUrl = `${host.value.replace(
      new RegExp(`${secret}$`),
      "",
    )}/share/${typeMap[props.type]}/${encodeURIComponent(
      props.data.name,
    )}?token=${encodeURIComponent(token)}`;
    console.log("shareUrl", shareUrl);
    if (isSupported) {
      await copy(shareUrl);
    } else {
      await copyFallback(shareUrl);
    }
    showNotify({ title: t("subPage.copyNotify.succeed") });
    close();
  }
};
watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
    console.log("newValue", newValue);
  },
);
const show = () => {
  isVisible.value = true;
  emit("update:visible", true);
};
const hide = () => {
  isVisible.value = false;
  emit("update:visible", false);
};
const close = () => {
  hide();
};
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
      .nut-input {
        background: transparent;
        padding: 0;
        color: var(--second-text-color);
      }
      .nut-form-item__body__tips {
          text-align: left;
        }
    }
    .btn-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      .btn {
        border-radius: 8px;
      }
    }
  }
}
</style>
