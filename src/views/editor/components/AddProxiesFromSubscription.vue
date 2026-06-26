<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des.source`) }}
    </p>
    <div class="radio-wrapper source-radio">
      <nut-radiogroup v-model="sourceTypeValue" direction="horizontal">
        <nut-radio
          v-for="(key, index) in sourceTypeOptions"
          :key="key"
          :label="key"
        >
          {{
            $t(
              `editorPage.subConfig.nodeActions['${type}'].sourceOptions[${index}]`,
            )
          }}
        </nut-radio>
      </nut-radiogroup>
    </div>

    <div class="source-name-row">
      <nut-input
        v-model.trim="sourceName"
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].sourceNamePlaceholder`)
        "
        right-icon="rect-right"
        @click-right-icon="openSourceNamePicker"
      />
    </div>

    <div class="checkbox-row">
      <nut-checkbox v-model="includeUnsupportedProxy" class="my-switch" />
      <button
        class="checkbox-label"
        type="button"
        @click="toggleIncludeUnsupportedProxy"
      >
        {{
          $t(
            `editorPage.subConfig.nodeActions['${type}'].des.includeUnsupportedProxy`,
          )
        }}
      </button>
      <button
        class="checkbox-tip"
        type="button"
        @click.stop="includeUnsupportedProxyTips"
      >
        <nut-icon class="checkbox-info" name="tips" />
      </button>
    </div>

    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des.position`) }}
    </p>
    <div class="radio-wrapper position-radio">
      <nut-radiogroup v-model="position" direction="horizontal">
        <nut-radio
          v-for="(key, index) in positionOptions"
          :key="key"
          :label="key"
        >
          {{
            $t(
              `editorPage.subConfig.nodeActions['${type}'].positionOptions[${index}]`,
            )
          }}
        </nut-radio>
      </nut-radiogroup>
    </div>

    <DesktopPicker
      :key="`${sourceTypeValue}-${sourceNameColumns.length}`"
      v-model="selectedSourceName"
      v-model:visible="showSourceNamePicker"
      :columns="sourceNameColumns"
      :title="$t(`editorPage.subConfig.sourceNamePicker.title`)"
      :cancel-text="$t(`editorPage.subConfig.sourceNamePicker.cancel`)"
      :ok-text="$t(`editorPage.subConfig.sourceNamePicker.confirm`)"
      @confirm="handleSourceNameConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from "vue";

import DesktopPicker from "@/components/DesktopPicker.vue";
import { useSubsStore } from "@/store/subs";

const { type, id } = defineProps<{
  type: string;
  id: string;
}>();

const form = inject<any>("form");
const subsStore = useSubsStore();

const sourceTypeOptions = ["subscription", "collection"];
const positionOptions = ["replace", "front", "back"];
const sourceTypeValue = ref("subscription");
const sourceName = ref("");
const includeUnsupportedProxy = ref(false);
const position = ref("replace");
const selectedSourceName = ref<string[]>([]);
const showSourceNamePicker = ref(false);

const sourceList = computed<any[]>(() =>
  sourceTypeValue.value === "collection" ? subsStore.collections : subsStore.subs,
);

const sourceNameColumns = computed(() =>
  (sourceList.value || []).map((item) => ({
    text: item.displayName ? `${item.displayName}` : item.name,
    value: item.name,
  })),
);

const getActionItem = () => form.process.find((item) => item.id === id);

const syncArgs = () => {
  const item = getActionItem();
  if (!item) return;

  item.args = {
    sourceType: sourceTypeValue.value,
    sourceName: sourceName.value,
    includeUnsupportedProxy: includeUnsupportedProxy.value,
    position: position.value,
  };
};

const openSourceNamePicker = () => {
  selectedSourceName.value = sourceName.value ? [sourceName.value] : [];
  showSourceNamePicker.value = true;
};

const handleSourceNameConfirm = ({ selectedValue }) => {
  sourceName.value = selectedValue?.[0] || "";
  showSourceNamePicker.value = false;
};

const includeUnsupportedProxyDocUrl =
  "https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E";

const includeUnsupportedProxyTips = () => {
  window.open(includeUnsupportedProxyDocUrl);
};

const toggleIncludeUnsupportedProxy = () => {
  includeUnsupportedProxy.value = !includeUnsupportedProxy.value;
};

const initArgs = () => {
  const item = getActionItem();
  if (!item) return;

  const defaultSourceType =
    sourceTypeOptions.includes(form?.sourceType) && form?.sourceType !== "none"
      ? form.sourceType
      : "subscription";

  sourceTypeValue.value = item.args?.sourceType || defaultSourceType;
  sourceName.value =
    item.args?.sourceName ||
    (sourceTypeValue.value === form?.sourceType ? form?.sourceName : "") ||
    "";
  includeUnsupportedProxy.value =
    typeof item.args?.includeUnsupportedProxy === "boolean"
      ? item.args.includeUnsupportedProxy
      : false;
  position.value = item.args?.position || "replace";
  syncArgs();
};

initArgs();

watch(
  [sourceTypeValue, sourceName, includeUnsupportedProxy, position],
  syncArgs,
);
</script>

<style lang="scss" scoped>
.des-label {
  font-size: 12px;
  margin-bottom: 14px;
  color: var(--comment-text-color);

  &:not(:first-child) {
    margin-top: 24px;
  }
}

.radio-wrapper {
  :deep(.nut-radiogroup) {
    width: 100%;
    display: grid;
  }

  :deep(.nut-radio) {
    min-height: 30px;
    align-items: center;
  }

  :deep(.nut-radio__label) {
    color: var(--second-text-color);
    font-size: 14px;
    line-height: 1.35;
  }
}

.source-radio {
  width: min(100%, 760px);
  margin-bottom: 24px;

  :deep(.nut-radiogroup) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.position-radio {
  width: 100%;

  :deep(.nut-radiogroup) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.source-name-row {
  width: min(100%, 1120px);
  margin-bottom: 18px;

  :deep(.nut-input) {
    background: transparent;
    min-height: 28px;
    padding: 0 0 6px;
    border-bottom: 1px solid var(--lowest-text-color);
    border-radius: 0;
    color: var(--second-text-color);
    cursor: text;
  }

  :deep(.nut-input-inner),
  :deep(.input-text),
  :deep(input) {
    color: var(--second-text-color);
    font-size: 14px;
    line-height: 20px;
  }

  :deep(.nut-input-right-icon) {
    color: var(--comment-text-color);
    cursor: pointer;
    font-size: 18px;
  }
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 18px 0 24px;
  color: var(--second-text-color);
  font-size: 14px;
  line-height: 1.35;

  .my-switch {
    width: 18px;
    margin-right: 0;

    :deep(.nut-icon) {
      font-size: 16px;
    }

    :deep(.nut-checkbox__label) {
      display: none;
    }
  }

  .checkbox-label {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    flex: 0 1 auto;
    font: inherit;
    padding: 0;
    user-select: none;
  }

  .checkbox-tip {
    align-items: center;
    background: none;
    border: none;
    color: var(--comment-text-color);
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    justify-content: center;
    padding: 0;
  }

  .checkbox-info {
    color: var(--comment-text-color);
    font-size: 15px;
  }
}

@media (min-width: 900px) {
  .source-name-row {
    width: 67%;
  }
}

@media (max-width: 640px) {
  .source-radio,
  .position-radio {
    :deep(.nut-radiogroup) {
      grid-template-columns: 1fr;
      row-gap: 12px;
    }
  }
}
</style>
