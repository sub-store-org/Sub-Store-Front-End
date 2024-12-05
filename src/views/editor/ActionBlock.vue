<template>
  <div class="form-block-wrapper">
    <div v-if="sourceType !== 'file'" class="sticky-title-wrapper actions-title-wrapper">
      <p>{{ $t(`editorPage.subConfig.actions.label`) }}</p>
      <font-awesome-icon
        v-if="isCollapsed"
        @click.stop="setCollapsed(false)"
        class="toggle fa-toggle"
        icon="fa-solid fa-toggle-on "
      />
      <font-awesome-icon
        v-else
        @click.stop="setCollapsed(true)"
        class="toggle fa-toggle"
        icon="fa-solid fa-toggle-off"
      />
      <button @click="popActionsHelp">
        <font-awesome-icon icon="fa-solid fa-circle-question" />
        {{ $t(`editorPage.subConfig.basic.nodeActionsHelp`) }}
      </button>
    </div>
    <Draggable
      v-if="list.length > 0"
      class="list-group"
      tag="ul"
      :component-data="{
        tag: 'ul',
        name: drag ? 'flip-list' : null,
      }"
      :scroll-sensitivity="200"
      :force-fallback="true"
      :scroll="true"
      :list="list"
      :scrollSpeed="8"
      v-bind="{
        animation: 200,
        disabled: false,
        ghostClass: 'ghost',
        chosenClass: 'chosen',
        dragClass: 'dragging',
        delay: 150,
        handle: '.drag-handler',
      }"
      @end="drag = false"
      @start="drag = true"
      item-key="id"
    >
      <template #item="{ element, index }">
        <nut-cell class="list-group-item" aria-hidden="true">
          <div :class="{ 'list-group-item-title': true, 'collapsed': collapsedElements.includes(element.id) }">
            <div class="title-text left">
              <span class="collapsed" @click="toggleElementCollapsed(element.id)">
                <nut-icon v-if="!collapsedElements.includes(element.id)" name="rect-down" size="12px"></nut-icon>
                <nut-icon v-if="collapsedElements.includes(element.id)" name="rect-right" size="12px"></nut-icon>
              </span>
              <div class="input-wrapper">
                <input
                  ref="customNameInput"
                  @click.stop
                  v-model="findEditItemById(element).customName"
                  class="custom-name-input"
                  type="text"
                  :disabled="!findEditItemById(element).isEditing"
                  :placeholder="findEditItemById(element).defualtName"
                />
                <div
                  v-if="!findEditItemById(element).isEditing"
                  class="input-overlay"
                  @click="toggleElementCollapsed(element.id)"
                ></div>
              </div>
              <div class="list-group-item-icons">
                <template v-if="!findEditItemById(element).isEditing">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" @click.stop="toggleEditName(element)" />
                </template>
                <template v-else>
                  <font-awesome-icon icon="fa-solid fa-floppy-disk" @click.stop="saveEditName(element)" />
                  <font-awesome-icon icon="fa-solid fa-ban" @click.stop="exitEditName(element)" />
                </template>
                <font-awesome-icon icon="fa-solid fa-circle-question" @click.stop="pop(element.type, element.tipsDes)" />
              </div>
            </div>
            <div class="right">
              <div class="action-switch">
                <!-- <nut-switch
                  v-model="element.enabled"
                  class="my-switch"
                  :active-text="t(`editorPage.subConfig.actions.enable`)"
                  :inactive-text="t(`editorPage.subConfig.actions.disable`)"
                /> -->
                <nut-checkbox
                  v-model="element.enabled"
                  class="my-switch"
                ></nut-checkbox>
                <span @click="toggleActionSwitch(element.id)">{{ $t(`editorPage.subConfig.actions.enable`) }}</span>
              </div>
              <div class="preview-switch">
                <nut-checkbox
                  v-model="getItem(element.id)[1]"
                  class="my-switch"
                ></nut-checkbox>
                <span @click="togglePreviewSwitch(element.id)">
                  {{ $t(`editorPage.subConfig.basic.previewSwitch`) }}
                </span>
              </div>
              <div class="copy">
                <font-awesome-icon icon="fa-solid fa-clone" @click="copyItem(element)"></font-awesome-icon>
              </div>
              <div class="delete">
                <font-awesome-icon icon="fa-solid fa-trash-can" @click="deleteItem(element.id)" />
              </div>
              <div class="drag-handler">
                <font-awesome-icon icon="fa-solid fa-grip" class="fa-lg" />
              </div>
            </div>
          </div>
          <Component v-show="!collapsedElements.includes(element.id)" :is="element.component" :type="element.type" :id="element.id" :sourceType="sourceType"/>
        </nut-cell>
      </template>
    </Draggable>

    <!-- <nut-picker
      v-model:visible="showAddPicker"
      :columns="columns"
      :title="$t(`editorPage.subConfig.actions.addAction.title`)"
      :cancel-text="$t(`editorPage.subConfig.actions.addAction.cancel`)"
      :ok-text="$t(`editorPage.subConfig.actions.addAction.confirm`)"
      @confirm="confirm"
    ></nut-picker> -->

    <!-- <button class="add-action-btn" @click="onClickAddBtn"> -->
    <!-- <span class="add-action-btn"
        ><font-awesome-icon icon="fa-icon fa-plus" />{{
          $t(`editorPage.subConfig.actions.addAction.title`)
        }}</span
      > -->
    <!-- </button> -->

    <nut-cell class="list-group-itemsa" aria-hidden="true">
      <div class="list-group-item-titlesa">
        <!-- <div class="title-text left"> -->
        <span>{{
          $t(`editorPage.subConfig.actions.addAction.title`)
        }}</span>
        <font-awesome-icon v-if="sourceType !== 'file'"  @click="popActionsHelp" icon="fa-solid fa-circle-question" />
      </div>
      <div class="horizontal-button-container">
        <button v-for="(item, index) in columns" :key="index" @click="onButtonClick(item)" class="custom-button">
          {{ item.text }}
        </button>
        <button @click="paste" class="custom-button">
          {{ $t(`editorPage.subConfig.actions.pasteAction.label`) }}
        </button>
      </div>
    </nut-cell>
    <nut-form v-if="showPasteboard" class="paste-action">
      <nut-form-item>
        <nut-textarea
          class="textarea-wrapper"
          v-model="pasteboard"
          :autosize="{ maxHeight: 110, minHeight: 50 }"
          :placeholder="$t(`editorPage.subConfig.actions.pasteAction.placeholder`)"
          text-align="center"
        />
        <div class="horizontal-button-container">
          <button @click="cancelPaste" class="custom-button">
            {{ $t(`editorPage.subConfig.actions.addAction.cancel`) }}
          </button>
          <button @click="paste" class="custom-button">
            {{ $t(`editorPage.subConfig.actions.pasteAction.label`) }}
          </button>
        </div>
      </nut-form-item>
  </nut-form>
  </div>
</template>

<script lang="ts" setup>
// import { useMousePicker } from '@/hooks/useMousePicker';
import i18nFile from '@/locales/zh';
import { Dialog, Toast } from '@nutui/nutui';
import { ref, inject, reactive, watch, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Draggable from 'vuedraggable';
import { useClipboard } from '@vueuse/core';
import useV3Clipboard from "vue-clipboard3";
// const { copy, isSupported, text } = useClipboard({ read: true });
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t } = useI18n();
const pasteboard = ref("");
const showPasteboard = ref(false);
const drag = ref(true);
const isCollapsed = ref(localStorage.getItem('actions-block-collapsed') === '1');
const collapsedElements = ref([]);
const form = inject<Sub | Collection>('form');
// 列表渲染的数据
// 预览开关数组，数组第一项为 id，对应 list 中的同 id 项目，控制该 id 开启关闭预览
const { checked, list, sourceType } = defineProps<{
  checked: Array<[string, boolean]>;
  list: ActionModuleProps[];
  sourceType?: string;
}>();


// 通过 i18n 构造 picker 选项
// const showAddPicker = ref(false);
// const showAddPicker = ref(true);
const types = Object.keys(i18nFile.editorPage.subConfig.nodeActions);
let items = types.map(type => {
  return {
    text: t(`editorPage.subConfig.nodeActions['${type}'].label`),
    value: type,
  };
});

if (sourceType === 'file') {
  items = items.filter(item => ['Script Operator'].includes(item.value));
}
const columns = ref(items);
// useMousePicker();

if(isCollapsed.value) {
  collapsedElements.value = list.map((item) => item.id);
} else {
  collapsedElements.value = [];
}
const setCollapsed = (v) => {
  isCollapsed.value = v;
  if (v) {
    localStorage.setItem('actions-block-collapsed', '1')
    collapsedElements.value = list.map((item) => item.id);
  } else {
    localStorage.removeItem('actions-block-collapsed')
    collapsedElements.value = [];
  }
};
const toggleElementCollapsed = (id) => {
  if (collapsedElements.value.includes(id)) {
    collapsedElements.value = collapsedElements.value.filter(item => item !== id);
  } else {
    collapsedElements.value.push(id);
  }
  if(collapsedElements.value.length === list.length) {
    setCollapsed(true)
  } else if(collapsedElements.value.length === 0){
    setCollapsed(false)
  } else {
    isCollapsed.value = false;
  }
};
const onButtonClick = (item) => {
  emit('addAction', [item]);
};

const copyItem = async element => {
  const item = form.process.find(item => item.id === element.id);
  const data = JSON.stringify({ source: sourceType, data: item })
  if (isSupported) {
    await copy(data);
  } else {
    await copyFallback(data);
  }
  Toast.text(`已复制数据 可用于导入`);

};
const cancelPaste = async () => {
  showPasteboard.value = false
  pasteboard.value = ''
}
const paste = async () => {
  try {
    let text = ''
  if (showPasteboard.value) {
    text = pasteboard.value
    showPasteboard.value = false
    pasteboard.value = ''
  } else {
    try {
      text = await navigator.clipboard.readText()
    } catch (e) {
      console.error(e)
      pasteboard.value = ''
      showPasteboard.value = true
      return
    }
  }
  let item
  try {
    item = JSON.parse(text)
  } catch (e) {
    
  }
  // console.log(`item`, item)
  if (item?.data?.id && item?.data?.type) {
    if (item?.source !== sourceType) {
      throw new Error('文件操作与订阅操作不通用')
    }
    const data = [{
      ...item.data,
      value: item.data.type,
    }]
    // console.log(data)
    emit('addAction', data);
  } else {
    throw new Error('数据格式错误')
  }
  } catch (e) {
    console.error(e)
    Toast.text(`导入失败 ${e.message ?? e}`);
  }
};
const emit = defineEmits(['addAction', 'deleteAction', 'updateCustomNameModeFlag', 'toggleAction']);
// 示例数据
// const checked = reactive([
//   ['12839211', true],
// ])

// const list = [
//   {
//     id: '12839211',
//     type: 'Flag Operator',
//     component: ActionRadio as any,
//     tipsDes: '我是第一条提示',
//   },
// ]
const toggleActionSwitch = (id: string) => {
  emit('toggleAction', id);
};
// 获取绑定的对应预览开关
const getItem = (id: string) => {
  return checked.find(item => item[0] === id);
};
const togglePreviewSwitch = (id: string) => {
  const item = getItem(id);
  return item[1] = !item[1];
};

// 删除条目，actionsList 中记录的顺序 和 对应预览开关
const deleteItem = id => {
  Dialog({
    title: t(`editorPage.subConfig.pop.deleteTitle`),
    content: t(`editorPage.subConfig.pop.deleteDes`),
    popClass: 'auto-dialog',
    okText: t(`editorPage.subConfig.pop.deleteConfirm`),
    cancelText: t(`editorPage.subConfig.pop.deleteCancel`),
    onOk: () => {
      emit('deleteAction', id);
    },
    // @ts-ignore
    closeOnClickOverlay: true,
  });
};

// 确认添加时 向渲染数组和预览数组添加对应项目
// const confirm = ({ _, selectedOptions }) => {
//   emit('addAction', selectedOptions);
// };

// 节点帮助弹窗
const popActionsHelp = () => {
  Dialog({
    title: t(`editorPage.subConfig.pop.helpTitle`),
    content: t(`editorPage.subConfig.pop.helpContent`),
    popClass: 'auto-dialog',
    noCancelBtn: true,
    // @ts-ignore
    closeOnClickOverlay: true,
  });
};

// tips 弹窗
const pop = (type: string, tipsDes: string) => {
  Dialog({
    title: t(`editorPage.subConfig.nodeActions['${type}'].tipsTitle`),
    content: tipsDes,
    popClass: 'auto-dialog',
    noCancelBtn: true,
    // @ts-ignore
    closeOnClickOverlay: true,
  });
};

// 操作名称自定义
const customNameInput = ref(null);

const findNameByType = (type) => items.find((item) => item.value === type).text;
const generateEditNameItem = (element) => {
  const { tipsDes, component, ...values } = element;
  return {
    defualtName: findNameByType(values.type),
    oldCustomName: values.customName,
    isEditing: false,
    ...values,
  };
};
const editNameList = reactive(list.map(generateEditNameItem));
const inCustomNameEditMode = computed(() =>
  editNameList.map((item) => item.isEditing).includes(true),
);

watch(list, (newV: ActionModuleProps[]) => {
  if (editNameList.length > newV.length) {
    // delete
    const elementsToDelete = editNameList.filter(
      (item) => !newV.some((newItem) => newItem.id === item.id),
    );
    elementsToDelete.forEach((element) => {
      const index = editNameList.findIndex((item) => item.id === element.id);
      if (index !== -1) {
        editNameList.splice(index, 1);
      }
    });
  } else {
    // add
    const elementsToAdd = newV.filter(
      (newItem) => !editNameList.some((item) => item.id === newItem.id),
    );
    elementsToAdd.forEach((element) => {
      editNameList.push(generateEditNameItem(element));
    });
  }
});

watch(inCustomNameEditMode, (newV) => {
  emit('updateCustomNameModeFlag', newV);
});

const findEditItemById = (target) =>
  editNameList.find((item) => item.id === target.id);

const saveEditName = (element) => {
  const editItem = editNameList.find((item) => item.id === element.id);
  editItem.isEditing = false;
  if (/^\s*$/.test(editItem.customName)) {
    editItem.customName = "";
  }
  // stash
  editItem.oldCustomName = editItem.customName;
  form.process.find((item) => item.id === element.id).customName =
    editItem.customName;
};

const exitEditName = (element) => {
  const editItem = editNameList.find((item) => item.id === element.id);
  editItem.isEditing = false;
  if (editItem.oldCustomName !== editItem.customName) {
    editItem.customName = editItem.oldCustomName;
  }
};

const exitAllEditName = () => {
  editNameList.forEach((item) => {
    if (item.isEditing) {
      exitEditName(item);
    }
  });
};

// 操作名称编辑
const toggleEditName = (element) => {
  const editItem = editNameList.find((item) => item.id === element.id);
  editNameList.forEach((item) => {
    if (item.isEditing && item.id !== editItem.id) {
      // exit others
      exitEditName(item);
    }
  });
  editItem.isEditing = true;
  nextTick(() => {
    customNameInput.value.focus();
  });
};

defineExpose({ exitAllEditName });
</script>

<style lang="scss" scoped>
.paste-action {
  background-color: var(--dialog-color);
  box-shadow: 0 1px 40px var(--background-color);
  border-radius: var(--item-card-radios);
  border: solid 1px var(--divider-color);
  position: fixed;
  width: 300px;
  height: 140px;
  left: calc(50vw - 150px);
  top: calc(50vh - 70px);
}
.add-action-btn {
  font-size: 14px;
  width: 100%;
  height: 44px;
  border-radius: var(--item-card-radios);
  color: var(--primary-color);
  border: 1px dashed var(--primary-color);
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;

  span {
    display: inline-flex;
    align-items: center;

    svg {
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }
  }
}

.qa-info {
  padding: 8px 12px;
}

.list-group-item {
  display: flex;
  flex-direction: column;
  box-shadow: none;

  .list-group-item-title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 12px;
    color: var(--comment-text-color);
    border-bottom: 1px solid var(--divider-color);

    .input-wrapper {
      position: relative;
      display: inline-block;
      width: 60px;
      margin-right: 2px;

      .custom-name-input {
        width: 60px;
        font-size: 12px;
        font-weight: bold;
        background: transparent;
        // color: var(--second-text-color);
        padding: 0;
        border: none;
        outline: none;
        text-overflow: ellipsis;
      }

      .input-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: transparent;
      }
    }

    .list-group-item-icons {
      display: flex;
      align-items: center;
      gap: 4px;
      .svg-inline--fa {
        cursor: pointer;
      }
    }

    &.collapsed {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }

    .left {
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;

      .collapsed, .name {
        cursor: pointer;
      }

      span {
        margin-right: 6px;
      }

      svg {
        color: var(--unimportant-icon-color);
      }
    }

    .right {
      display: flex;
      align-items: center;
      .action-switch {
        display: flex;
        align-items: center;
        padding-right: 8px;

        .toggle {
          color: var(--unimportant-icon-color);
        }
        span {
          font-weight: normal;
          font-size: 12px;
          flex-shrink: 0;
        }
        .my-switch {
          width: 18px;
          :deep(.nut-icon) {
            font-size: 16px;
          }
        }
      }
      .preview-switch {
        -webkit-user-select: none;
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        // margin-right: 12px;
        padding-right: 5px;

        span {
          // margin-right: 8px;
          flex-shrink: 0;
          font-weight: normal;
          font-size: 12px;
        }

        .my-switch {
          width: 18px;
          :deep(.nut-icon) {
            font-size: 16px;
          }
        }
      }

      .copy {
        padding: 0 8px;
        cursor: pointer;
      }
      .delete {
        padding: 0 8px;
        color: var(--danger-color);
        cursor: pointer;
      }

      .drag-handler {
        padding-left: 8px;
        color: var(--lowest-text-color);
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
      }

      .drag-handler:active {
          cursor: grabbing;
          cursor: -moz-grabbing;
          cursor: -webkit-grabbing;
      }
  
    }
  }
}

.list-group-itemsa {
  display: flex;
  flex-direction: column;
  box-shadow: none;

  .list-group-item-titlesa {
    color: var(--comment-text-color);
    border-bottom: 1px solid var(--divider-color);
    padding: 1px 0 12px 12px;

    span {
      margin-right: 6px;
    }

    svg {
      color: var(--unimportant-icon-color);
    }
  }
}

.actions-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .toggle {
    cursor: pointer;
    margin-left: 18px;
    margin-right: auto;
  }

  button {
    background: none;
    border: none;
    font-weight: normal;
    font-size: 12px;
    padding: 0;
    color: var(--comment-text-color);

    svg {
      margin-right: 4px;
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  .light-mode & {
    background: #c8ebfb !important;
  }

  .dark-mode & {
    background: #202f3c !important;
  }
}

/*选中样式*/
.chosen {
  border: solid 1px var(--primary-color) !important;
  opacity: 0.92 !important;
}

.list-group {
  min-height: 20px;
}

// .list-group-item {
//   cursor: move;
// }

.list-group-item li {
  cursor: pointer;
}

.custom-button {
  background-color: var(--divider-color);
  color: var(--second-text-color);
  padding: 9px 15px;
  // margin: 8px;
  border-radius: 18px;
  border: none;
  font-weight: normal;
  // box-shadow: 0 1px 40px var(--background-color);
  cursor: pointer;
}

.horizontal-button-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(85px, 1fr));
  gap: 15px;
  background-color: var(--card-color);
  margin: 10px;
  border-radius: 15px;
}
</style>
