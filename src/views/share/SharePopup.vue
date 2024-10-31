<!-- 分享弹窗 -->
<template>
  <nut-popup
    v-model:visible="isVisible"
    pop-class="share-popup"
    position="center"
    :style="{
      width: `90%`,
      height: `35%`,
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
    <div class="share-popup-title">分享</div>
    <div class="share-info-wrapper">
      <div class="share-info-form">
        <nut-form>
          <nut-form-item label="有效期">
            <nut-radiogroup v-model="form.expiresIn" direction="horizontal">
              <nut-radio
                v-for="(item, index) in defaultExpireList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </nut-radio>
            </nut-radiogroup>
          </nut-form-item>
          <div class="btn-wrapper">
            <nut-button
              class="submit-btn btn"
              type="primary"
              shape="round"
              @click="handleCreateShare"
            >
              创建分享
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

import { useSubsApi } from "@/api/subs";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useGlobalStore } from "@/store/global";

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

const { t } = useI18n();
const globalStore = useGlobalStore();
const isVisible = ref(props.visible);
const defaultExpireList = ref([
  {
    label: "1天",
    value: "1",
  },
  {
    label: "7天",
    value: "7",
  },
  {
    label: "30天",
    value: "30",
  },
  {
    label: "永久有效",
    value: "",
  },
]);
const form = reactive({
  expiresIn: "30",
});

const handleCreateShare = async () => {
  console.log("form", form);
  console.log("data", props.data);
  const typeMap = {
    sub: "sub",
    collection: "col",
    file: "file",
  };
  const params = {
    payload: {
      type: typeMap[props.type] as "sub" | "col" | "file",
      name: props.data.name,
    },
    options: {
      expiresIn: `${form.expiresIn}d`,
    },
  };
  const res = await subsApi.shareSub(params);
  if (res?.data?.status === "success") {
    const { secret, token } = res.data.data;
    const shareUrl = `${host.value.replace(
      new RegExp(`${secret}$`),
      "",
    )}/share/${typeMap[props.type]}/${encodeURIComponent(
      props.data.name,
    )}?token=${token}`;
    console.log("shareUrl", shareUrl);
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
