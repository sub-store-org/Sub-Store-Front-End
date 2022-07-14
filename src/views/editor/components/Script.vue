<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[0]`) }}
    </p>
    <nut-radiogroup direction="horizontal" v-model="value.mode">
      <nut-radio v-for="(key, index) in modeList" :label="key" :key="index"
        >{{
          $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`)
        }}
      </nut-radio>
    </nut-radiogroup>
    <p class="des-label" v-if="value.mode === 'link'">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
    </p>
    <div class="input-wrapper" v-if="value.mode === 'link'">
      <nut-textarea
        v-model="value.content"
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].placeholder`)
        "
        :rows="5"
      />
    </div>
    <button
      class="open-editor-btn"
      v-else-if="value.mode === 'script'"
      @click="editorIsVisible = true"
    >
      <span>
        <font-awesome-icon icon="fa-solid fa-code" />
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].openEditorBtn`) }}
      </span>
    </button>
    <MonacoEditor
      v-if="editorIsVisible"
      @close="onCloseEditor"
      :code="value.code"
    ></MonacoEditor>
  </div>
</template>

<script lang="ts" setup>
  import { inject, reactive, onMounted, watch, ref } from 'vue';
  import { usePopupRoute } from '@/hooks/usePopupRoute';
  import MonacoEditor from '@/views/editor/components/MonacoEditor.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  const modeList = ['link', 'script'];

  const editorIsVisible = ref(false);
  usePopupRoute(editorIsVisible);
  const value = reactive({
    mode: '',
    content: '',
    code: '',
  });

  const onCloseEditor = val => {
    value.code = val;
    editorIsVisible.value = false;
    router.back();
  };

  // 挂载时将 value 值指针指向 form 对应的数据
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) {
      value.mode = item.args.mode;
      if (item.args.mode === 'script') {
        value.code = item.args.content;
      } else {
        value.content = item.args.content;
      }
    }
  });

  watch(value, () => {
    const item = form.process.find(item => item.id === id);
    item.args.mode = value.mode;
    if (item.args.mode === 'script') {
      item.args.content = value.code;
    } else {
      item.args.content = value.content;
    }
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

    > view.nut-textarea {
      background: transparent;
      padding: 8px 12px;
      border-bottom: 1px solid;
      color: var(--second-text-color);
      border-color: var(--lowest-text-color);

      :deep(textarea) {
        color: inherit;
      }
    }
  }

  .open-editor-btn {
    border: 1px solid var(--primary-color);
    background: transparent;
    margin: 20px 0 12px 0;
    padding: 8px 0;
    text-align: center;
    width: 100%;
    border-radius: var(--item-card-radios);
    color: var(--primary-color);
    font-weight: bold;
    svg {
      margin-right: 8px;
    }
  }
</style>
