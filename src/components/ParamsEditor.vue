<template>
  <div>
    <div v-if="visible" class="key-value-container">
      <div class="key-value-box">
        <div class="header">
          <div class="item">key</div>
          <div class="item">value</div>
          <div class="item">{{ optionsText }}</div>
        </div>
        <div class="content">
          <div
            v-for="(item, index) in paramsArgumentsLocal"
            :key="index"
            class="key-value-row"
            :class="{ 'duplicate-key-row': isDuplicateKey(item.key) }"
          >
            <div class="item">
              <div class="input-container">
                <nut-textarea
                  v-model="item.key"
                  :border="false"
                  placeholder="key"
                  type="text"
                  :rows="1"
                  autosize
                  :class="{ 'duplicate-key-input': isDuplicateKey(item.key) }"
                  @blur="handleKeyBlur(item, index)"
                />
                <div
                  v-if="isDuplicateKey(item.key) && item.key"
                  class="duplicate-key-tip"
                >
                  {{
                    $t(`editorPage.subConfig.nodeActions['${props.type}'].duplicateKeyWarning`)
                  }}
                </div>
              </div>
            </div>
            <div class="item">
              <nut-textarea
                v-model="item.value"
                :border="false"
                placeholder="value"
                type="text"
                :rows="1"
                autosize
                
              />
              <!-- @blur="trimValue(item, 'value')" -->
            </div>
            <div class="item key-value-operation">
              <div @click="deleteItem(index)">{{ deleteParamsText }}</div>
            </div>
          </div>
          <div v-if="!paramsArgumentsLocal.length" class="empty-tips">
            <p>{{ emptyTipsText }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

type ParamItem = {
  key: string;
  value: string;
};

const props = defineProps({
  paramsArguments: {
    type: Array as () => ParamItem[],
    default: () => [],
  },
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:paramsArguments", "add-parameter"]);

const { t } = useI18n();

const paramsArgumentsLocal = computed({
  get: () => props.paramsArguments as ParamItem[],
  set: (val: ParamItem[]) => emit("update:paramsArguments", val),
});

// 跟踪重复键
const keyOccurrences = ref<Record<string, number>>({});

// 更新键名出现次数的函数
const updateKeyOccurrences = (args) => {
  const occurrences = {};
  args.forEach((item) => {
    if (item.key && item.key.trim() !== "") {
      occurrences[item.key] = (occurrences[item.key] || 0) + 1;
    }
  });
  keyOccurrences.value = occurrences;
};

// 检查一个键名是否重复
const isDuplicateKey = (key) => {
  return key && keyOccurrences.value[key] > 1;
};

// 监听参数变化，更新重复键的计数
watch(
  () => props.paramsArguments,
  (newArgs) => {
    updateKeyOccurrences(newArgs);
  },
  { deep: true, immediate: true },
);

// 文本内容通过i18n翻译
const optionsText = computed(() =>
  t(`editorPage.subConfig.nodeActions['${props.type}'].paramsOptions`),
);
const deleteParamsText = computed(() =>
  t(`editorPage.subConfig.nodeActions['${props.type}'].paramsDelete`),
);
const emptyTipsText = computed(() =>
  t(`editorPage.subConfig.nodeActions['${props.type}'].paramsEmpty`),
);

const deleteItem = (index) => {
  const newParamsArguments = [...props.paramsArguments];
  newParamsArguments.splice(index, 1);
  emit("update:paramsArguments", newParamsArguments);
  // 删除后需要更新键名出现次数
  updateKeyOccurrences(newParamsArguments);
};

const trimValue = (item, field) => {
  if (item[field] && typeof item[field] === "string") {
    item[field] = item[field].replace(/\s+/g, "");
  }
};

// 处理键名失焦事件
const handleKeyBlur = (item, index) => {
  // 先去除空白符
  trimValue(item, "key");

  // 更新键名出现次数统计
  updateKeyOccurrences(props.paramsArguments);
};
</script>

<style lang="scss" scoped>
.key-value-container {
  border-radius: var(--item-card-radios);
  overflow: hidden;
  .key-value-box {
    .header {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      font-size: 14px;
      color: var(--second-text-color);
      padding: 8px 0;
      border-bottom: 1px solid var(--lowest-text-color);
      .item {
        text-align: left;
        padding: 8px 12px;
        &:last-child {
          text-align: center;
        }
      }
    }
    .content {
      .key-value-row {
        display: grid;
        grid-template-columns: 2fr 2fr 1fr;
        padding: 8px 0;

        &.duplicate-key-row {
          background-color: rgba(255, 68, 68, 0.05); // 重复键行的背景色
        }

        .item {
          text-align: left;
          display: flex;
          align-items: flex-start; // 改为顶部对齐，方便显示错误提示

          .input-container {
            width: 100%;
            display: flex;
            flex-direction: column;

            .duplicate-key-tip {
              font-size: 10px;
              color: var(--danger-color, #ff4444);
              padding: 2px 12px;
              margin-top: -2px;
            }
          }

          :deep(.nut-textarea) {
            width: 100%;
            background: transparent;
            padding: 8px 12px;
            color: var(--second-text-color);

            &.duplicate-key-input {
              // border-bottom: 1px solid var(--danger-color, #ff4444);
              color: var(--danger-color, #ff4444);
            }

            :deep(.nut-textarea__textarea) {
              color: inherit;
              min-height: unset;
              height: auto;
              overflow: hidden;
            }
          }

          &.key-value-operation {
            display: flex;
            align-items: center;
            justify-content: center;
            div {
              cursor: pointer;
              color: var(--primary-color);
              margin: 0 8px;
            }
          }
        }
      }
      .empty-tips {
        display: flex;
        justify-content: center;
        padding: 8px 0;
        color: var(--comment-text-color);
        p {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
