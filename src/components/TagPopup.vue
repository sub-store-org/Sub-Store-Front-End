<!-- 标签弹窗 -->
<template>
  <nut-popup
    v-model:visible="isVisible"
    pop-class="tag-popup"
    position="bottom"
    :style="{
      height: `95%`,
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
    <div class="popup-title">{{ t('subPage.tag.addTagTitle') }}</div>
    <div class="popup-header">
      <div class="tag-input">
        <nut-input
          class="nut-input-text"
          v-model.trim="keyword"
          :placeholder="t('subPage.tag.tagPlaceholder')"
          type="text"
          input-align="left"
          clearable
          @clear="clearSearch"
        />
      </div>
    </div>
    <div class="popup-main">
      <div class="tag-list">
        <draggable
          :list="allTagsList"
          :sort="true"
          item-key="label"
          animation="300"
          :scroll-sensitivity="200"
          :force-fallback="true"
          :scroll-speed="8"
          :scroll="true"
          @start="onStartDrag"
          @end="onEndDrag"
        >
          <template #item="{ element }">
            <nut-tag
              :key="element.label"
              :class="{ 'active': element.isActive }"
              @click="handleTagItem(element)"
            >{{ element.label }}</nut-tag>
          </template>
        </draggable>
        <!-- 新建标签 -->
        <div class="add-tag-box">
        <nut-input
          v-if="isAddTag"
          class="add-tag-input"
          v-model.trim="addTagValue"
          :placeholder="t('subPage.tag.tagPlaceholder')"
          :autofocus="true"
          max-length="30"
          type="text"
          input-align="left"
          :border="false"
          @blur="saveTag"
          closeable
        />
        <nut-tag v-else class="add-tag" @click="addTag">{{ t('subPage.tag.addTagBtn') }}</nut-tag>
        </div>
      </div>
    </div>
  </nut-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useSubsStore } from "@/store/subs";
import draggable from "vuedraggable";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
const subsStore = useSubsStore();
const { hasSubs, hasCollections, subs, collections, hasFiles, files } = storeToRefs(subsStore);
const hasUntagged = ref(false);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  currentTag: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'subCol',
  },
});
const isVisible = ref(props.visible);
const keyword = ref("");
const isAddTag = ref(false);
const addTagValue = ref('');
//拖拽开始的事件
const onStartDrag = () => {
  console.log("开始拖拽");
};

//拖拽结束的事件
const onEndDrag = () => {
  console.log("结束拖拽");
};
watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
    console.log("newValue", newValue);
    if (newValue) {
      getTags();
    }
  },
);
const clearSearch = () => {
  keyword.value = "";
}
const getTag = () => {
  return localStorage.getItem('sub-tag') || 'all';
}
const tag = ref(getTag());
const allTags = ref([]);
const allTagsList = computed(() => {
  if (!keyword.value) {
    return allTags.value
  }
  return allTags.value.filter(i => i.label.indexOf(keyword.value) !== -1)
})
const getTags = () => {
  if(props.type === 'file' && !hasFiles.value) return []
  if(props.type === 'subCol' && !hasSubs.value && !hasCollections.value) return []
  const set = new Set()
  if (props.type === 'subCol') {
    // 从 subs 和 collections 中获取所有的 tag, 去重
    subs.value.forEach(sub => {
      if (Array.isArray(sub.tag) && sub.tag.length > 0) {
        sub.tag.forEach(i => {
          set.add(i)
        });
      } else {
        hasUntagged.value = true
      }
    })
    collections.value.forEach(col => {
      if (Array.isArray(col.tag) && col.tag.length > 0) {
        col.tag.forEach(i => {
          set.add(i)
        });
      } else {
        hasUntagged.value = true
      }
    })
  } else if (props.type === 'file') {
    files.value.forEach(file => {
      if (Array.isArray(file.tag) && file.tag.length > 0) {
        file.tag.forEach(i => {
          set.add(i)
        });
      } else {
        hasUntagged.value = true
      }
    })
  }

  let tags: any[] = Array.from(set)
  if(tags.length === 0) return []
  tags = tags.map(i => ({ label: i, value: i }));
  
  let result = [...tags]
  // if(hasUntagged.value) result.push({ label: t("specificWord.untagged"), value: "untagged" })
  if (!result.find(i => i.value === tag.value)) {
    tag.value = 'all'
  }
  // 判断是否包含传入的tags，增加isActive样式
  const currentTagList = props.currentTag.split(',').map(i => i.trim())
  result.forEach(i => {
    i.isActive = currentTagList.includes(i.value)
  })
  allTags.value = result
};

const addTag = () => {
  addTagValue.value = ''
  isAddTag.value = true
}
const saveTag = () => {
  if(!addTagValue.value) {
    isAddTag.value = false
    return
  }
  // 如果新增标签和已有标签一样，则不添加，并且选中已有标签
  if (allTags.value.find(i => i.value === addTagValue.value)) {
    const index = allTags.value.findIndex(i => i.value === addTagValue.value)
    allTags.value[index].isActive = true
    isAddTag.value = false
    return
  }
  allTags.value.push({label: addTagValue.value, value: addTagValue.value, isActive: true})
  isAddTag.value = false
}
const handleTagItem = (item) => {
  const index = allTags.value.findIndex(i => i.value === item.value)
  allTags.value[index].isActive = !allTags.value[index].isActive
}

onMounted(() => {
  getTags();
})

const emit = defineEmits(["update:visible", "setTag"]);

const show = () => {
  isVisible.value = true;
  emit("update:visible", true);
};

const close = () => {
  const selectedTags = allTags.value.filter(i => i.isActive).map(i => i.value).join(',')
  emit("setTag", selectedTags);
  isAddTag.value = false
  hide();
}
const hide = () => {
  isVisible.value = false;
  emit("update:visible", false);
};
// 暴露方法给父组件
defineExpose({ show, close });
</script>

<style lang="scss" scoped>
.tag-popup {
  background: var(--background-color);
  .popup-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    color: var(--primary-text-color);
    font-size: 18px;
    font-weight: bold;
  }
  .popup-header {
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tag-input {
      width: 100%;
      .nut-input {
        background: var(--background-color);
      }
    }
  }
  .popup-main {
    padding: 0 10px;
    .tag-list {
      padding-top: 20px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      >div {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      .nut-tag {
        padding: 4px 10px;
        text-align: center;
        font-size: 14px;

        color: var(--primary-text-color);

        &.active {
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          background: var(--background-color);

        }
      }
      .add-tag-box {
        display: flex;
        align-items: center;
        height: 31px;
        .add-tag {
          border: 1px dashed var(--primary-color);
          color: var(--primary-color);
          background: var(--background-color);

        }
        .add-tag-input {
          padding: 0;
          background: var(--background-color);
          display: flex;
          align-items: center;
          .nut-input {

          }
        }
      }
    }
  }
}
</style>
