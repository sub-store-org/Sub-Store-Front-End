<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].field.des`) }}
    </p>
    <div class="tag-wrapper">
      <draggable
          item-key="id"
          v-model="dragData"
          :force-fallback="true"
          :scroll="true"
          v-bind="{
            chosenClass: 'chosentag',
          }"
        >
        <template #item="{ element, index }">
            <nut-tag
              @click="onClickTag"
              class="tag-item"
              closeable
              @close="deleteItem(index)"
            >
              <span>{{
                element.value
              }}
              </span>
            </nut-tag>
          </template>
      </draggable>
    </div>
    <div class="input-wrapper">
      <nut-input
       class="custom-input"
        label=""
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].field.placeholder`)
        "
        v-model="input"
      />
      <font-awesome-icon @click="addItem" icon="fa-solid fa-location-arrow" />
    </div>
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].action.des`) }}
    </p>
    <nut-radiogroup direction="horizontal" v-model="value.action">
      <nut-radio v-for="(key, index) in actionList" :label="key" :key="index"
        >{{
          $t(
            `editorPage.subConfig.nodeActions['${type}'].action.options[${index}]`
          )
        }}
      </nut-radio>
    </nut-radiogroup>
    <template v-if="value.action === 'rename'">
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].position.des`) }}
      </p>
      <nut-radiogroup direction="horizontal" v-model="value.position">
        <nut-radio
          v-for="(key, index) in positionList"
          :label="key"
          :key="index"
          >{{
            $t(
              `editorPage.subConfig.nodeActions['${type}'].position.options[${index}]`
            )
          }}
        </nut-radio>
      </nut-radiogroup>
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].template.des`) }}
      </p>
      <div class="input-wrapper">
        <nut-input
          label=""
          :placeholder="
            $t(
              `editorPage.subConfig.nodeActions['${type}'].template.placeholder`
            )
          "
          v-model="value.template"
        />
      </div>
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].link.des`) }}
      </p>
      <div class="input-wrapper">
        <nut-input
          label=""
          :placeholder="
            $t(`editorPage.subConfig.nodeActions['${type}'].link.placeholder`)
          "
          v-model="value.link"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { Dialog } from '@nutui/nutui';
  import { inject, onMounted, watch, reactive, toRaw, ref, computed } from 'vue';
  import draggable from "vuedraggable";
  const { t } = useI18n();
  const input = ref('');
  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  const actionList = ['rename', 'delete'];
  const positionList = ['front', 'back'];

  const value = reactive({
    action: '',
    position: '',
    template: '',
    link: '',
    field: [],
  });
  const dragData = computed({
    get() {
      return Array.isArray(value.field) ? value.field.map((item, index) => ({
        id: index + JSON.stringify(item),
        value: item,
      })) : []
    },
    set(val) {
      val.map((item, index) => {
        value.field[index] = item.value
      })
    }
  })
const onClickTag = el => {
    const index = [...el.currentTarget.parentElement.children].indexOf(
      el.currentTarget
    );
    if (input.value ) {
      Dialog({
        title: t('editorPage.subConfig.pop.clickTag.title'),
        content: t('editorPage.subConfig.pop.clickTag.content'),
        popClass: 'auto-dialog',
        okText: t(`editorPage.subConfig.pop.clickTag.confirm`),
        cancelText: t(`editorPage.subConfig.pop.clickTag.cancel`),
        onOk: () => editTag(index),
        // onCancel: () => resolve(false),
        // @ts-ignore
        closeOnClickOverlay: true,
      });
    } else {
      editTag(index);
    }
  };

  const editTag = index => {
    const oldValue = value.field[index];

    value.field.splice(index, 1);

    input.value = oldValue;
  };

  const deleteItem = index => {
    value.field.splice(index, 1);
  };

  const addItem = () => {
    if (!input.value) return;

      value.field.push(input.value);

    input.value = ''
  };
  // 挂载时将 value 值指针指向 form 对应的数据
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) {
      value.action = item.args.action;
      value.position = item.args.position;
      value.template = item.args.template;
      value.link = item.args.link;
      value.field = item.args.field || ['name'];
    }
  });

  watch(value, () => {
    const item = form.process.find(item => item.id === id);
    if (item) item.args = toRaw(value);
  });
</script>

<style lang="scss" scoped>
  .des-label {
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--comment-text-color);

    &:not(:first-child) {
      margin-top: 16px;
    }
  }

  .nut-radiogroup {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .input-wrapper {
    display: flex;
    align-items: center;

    > view.nut-input {
      background: transparent;
      padding: 8px 12px;
      margin-right: 16px;
      border-bottom: 1px solid var(--lowest-text-color);
      color: var(--second-text-color);
    }
  }

  .tag-wrapper {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-bottom: 12px;
    max-width: 100%;
    cursor: pointer;

    &:active {
      cursor: grabbing;
      cursor: -moz-grabbing;
      cursor: -webkit-grabbing;
    }

    .tag-item {
      max-width: 100%;
      margin-right: 8px;
      margin-bottom: 8px;

      span {
        max-width: 95%;
        min-width: 20px;
        display: -webkit-box;
        white-space: normal !important;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }

  .chosentag {
    box-shadow: 0 0 5px var(--primary-color);
    overflow: hidden;
  }

  .input-wrapper {
    display: flex;
    align-items: center;

    > view.nut-input {
      background: transparent;
      padding: 8px 12px;
      margin-right: 16px;
    }

    > svg {
      width: 20px;
      height: 20px;
      color: var(--primary-color);
      flex: 1;
      padding-right: 12px;
    }
  }
</style>
