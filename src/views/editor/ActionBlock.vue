<template>
  <div class="form-block-wrapper">
    <div class="sticky-title-wrapper actions-title-wrapper">
      <p>{{ $t(`editorPage.subConfig.actions.label`) }}</p>
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
      <template #item="{ element }">
        <nut-cell class="list-group-item" aria-hidden="true">
          <div class="list-group-item-title">
            <div class="title-text left">
              <span>{{
                $t(`editorPage.subConfig.nodeActions['${element.type}'].label`)
              }}</span>
              <font-awesome-icon
                icon="fa-solid fa-circle-question"
                @click="pop(element.type, element.tipsDes)"
              />
            </div>
            <div class="right">
              <div class="preview-switch">
                <span>
                  {{ $t(`editorPage.subConfig.basic.previewSwitch`) }}
                </span>
                <nut-switch
                  class="my-switch"
                  v-model="getItem(element.id)[1]"
                />
              </div>
              <div class="delete">
                <font-awesome-icon
                  icon="fa-solid fa-trash-can"
                  @click="deleteItem(element.id)"
                />
              </div>
              <div class="drag-handler">
                <font-awesome-icon icon="fa-solid fa-grip" class="fa-lg" />
              </div>
            </div>
          </div>
          <Component
            :is="element.component"
            :type="element.type"
            :id="element.id"
          />
        </nut-cell>
      </template>
    </Draggable>

    <nut-picker
      v-model:visible="showAddPicker"
      :columns="columns"
      :title="$t(`editorPage.subConfig.actions.addAction.title`)"
      :cancel-text="$t(`editorPage.subConfig.actions.addAction.cancel`)"
      :ok-text="$t(`editorPage.subConfig.actions.addAction.confirm`)"
      @confirm="confirm"
    ></nut-picker>
    <button class="add-action-btn" @click="onClickAddBtn">
      <span
        ><font-awesome-icon icon="fa-icon fa-plus" />{{
          $t(`editorPage.subConfig.actions.addAction.title`)
        }}</span
      >
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { useMousePicker } from '@/hooks/useMousePicker';
  import i18nFile from '@/locales/zh';
  import { Dialog } from '@nutui/nutui';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Draggable from 'vuedraggable';

  const { t } = useI18n();
  const drag = ref(true);

  // 通过 i18n 构造 picker 选项
  const showAddPicker = ref(false);
  const types = Object.keys(i18nFile.editorPage.subConfig.nodeActions);
  const items = types.map(type => {
    return {
      text: t(`editorPage.subConfig.nodeActions['${type}'].label`),
      value: type,
    };
  });
  const columns = ref(items);
  useMousePicker();

  const onClickAddBtn = () => {
    showAddPicker.value = true;
  };

  // 列表渲染的数据
  // 预览开关数组，数组第一项为 id，对应 list 中的同 id 项目，控制该 id 开启关闭预览
  const { checked, list } = defineProps<{
    checked: Array<[string, boolean]>;
    list: ActionModuleProps[];
  }>();

  const emit = defineEmits(['addAction', 'deleteAction']);
  // 示例数据
  // const checked = reactive([
  //   ['12839211', true],
  // ])
  //
  // const list = [
  //   {
  //     id: '12839211',
  //     type: 'Flag Operator',
  //     component: ActionRadio as any,
  //     tipsDes: '我是第一条提示',
  //   },
  // ]

  // 获取绑定的对应预览开关
  const getItem = (id: string) => {
    return checked.find(item => item[0] === id);
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
  const confirm = ({ _, selectedOptions }) => {
    emit('addAction', selectedOptions);
  };

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
</script>

<style lang="scss" scoped>
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

      .left {
        font-size: 12px;
        font-weight: bold;
        span {
          margin-right: 6px;
        }

        svg {
          color: var(--unimportant-icon-color);
        }
      }

      .right {
        display: flex;

        .preview-switch {
          display: flex;
          align-items: center;
          margin-right: 12px;

          span {
            margin-right: 8px;
            font-weight: normal;
            font-size: 12px;
          }

          .my-switch {
            height: 22px;
            width: 40px;
            min-width: 40px;

            :deep(.switch-button) {
              width: 18px;
              height: 18px;
            }
          }
        }

        .delete {
          padding: 0 24px;
          color: var(--danger-color);
        }

        .drag-handler {
          padding-left: 16px;
          color: var(--lowest-text-color);
        }
      }
    }
  }

  .actions-title-wrapper {
    display: flex;
    justify-content: space-between;

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

  .list-group-item {
    cursor: move;
  }

  .list-group-item li {
    cursor: pointer;
  }
</style>
