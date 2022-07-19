<template>
  <div class="editor-action-card">
    <template v-if="type === 'Regex Filter'">
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
      </p>
      <nut-radiogroup direction="horizontal" v-model="mode">
        <nut-radio v-for="(key, index) in opt[type]" :label="key" :key="index"
          >{{
            $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`)
          }}
        </nut-radio>
      </nut-radiogroup>
    </template>
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[0]`) }}
    </p>
    <div class="tag-wrapper">
      <nut-tag
        @click="onClickTag"
        class="tag-item"
        v-for="(content, index) in value"
        closeable
        @close="deleteRegexItem(index)"
      >
        <span>{{
          type === 'Regex Rename Operator'
            ? `${content.expr}  ⇒  ${content.now}`
            : content
        }}</span>
      </nut-tag>
    </div>
    <div class="input-wrapper">
      <nut-input
        label=""
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].placeholder[0]`)
        "
        v-model="input1"
      />
      <nut-input
        v-if="type === 'Regex Rename Operator'"
        label=""
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].placeholder[1]`)
        "
        v-model="input2"
      />
      <font-awesome-icon @click="addItem" icon="fa-solid fa-location-arrow" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Dialog } from '@nutui/nutui';
  import { inject, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { onBeforeRouteLeave, useRouter } from 'vue-router';

  const { t } = useI18n();
  const router = useRouter();
  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  // 此处 key 需要与 i18n 的 actions 中的 key 相同
  // 值的次序需要与该选项的 options 值 顺序相同
  const opt = {
    'Regex Filter': [0, 1],
  };

  const input1 = ref('');
  const input2 = ref('');

  const mode = ref();
  const value = ref();

  const onClickTag = el => {
    const index = [...el.currentTarget.parentElement.children].indexOf(
      el.currentTarget
    );
    if (input1.value || input2.value) {
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
    const oldValue = value.value[index];

    value.value.splice(index, 1);
    if (type === 'Regex Rename Operator') {
      input1.value = oldValue.expr;
      input2.value = oldValue.now;
    } else {
      input1.value = oldValue;
    }
  };

  const deleteRegexItem = index => {
    value.value.splice(index, 1);
  };

  const addItem = () => {
    if (!input1.value) return;
    if (type === 'Regex Rename Operator') {
      value.value.push({
        expr: input1.value,
        now: input2.value,
      });
    } else {
      value.value.push(input1.value);
    }
    input1.value = '';
    input2.value = '';
  };

  // 挂载时将 value 值指针指向 form 对应的数据
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) {
      switch (type) {
        case 'Regex Filter':
          value.value = item.args.regex;
          mode.value = item.args.keep ? 0 : 1;
          break;
        default:
          value.value = item.args;
          break;
      }
    }
  });

  watch(mode, () => {
    const item = form.process.find(item => item.id === id);
    if (item && type === 'Regex Filter') {
      item.args.keep = !mode.value;
    }
  });

  const confirmLeave = () => {
    return new Promise(resolve => {
      Dialog({
        title: t('editorPage.subConfig.pop.leaveConfirmTitle'),
        content: t('editorPage.subConfig.pop.leaveContent'),
        popClass: 'auto-dialog',
        okText: t(`editorPage.subConfig.pop.leaveConfirm`),
        cancelText: t(`editorPage.subConfig.pop.leaveCancel`),
        onOk: () => {
          resolve(true);
        },
        onCancel: () => resolve(false),
        // @ts-ignore
        closeOnClickOverlay: true,
      });
    });
  };

  onBeforeRouteLeave(async (to, from, next) => {
    if (input1.value || input2.value) {
      const result = await confirmLeave();
      next(result);
    }
    next();
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

  .tag-wrapper {
    margin-bottom: 12px;
    max-width: 100%;

    .tag-item {
      max-width: 100%;
      margin-right: 8px;
      margin-bottom: 8px;

      span {
        max-width: 95%;
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
