<template>
  <Teleport to="#app">
    <div class="editor-page-wrapper">
      <header class="editor-page-header">
        <h1>
          <font-awesome-icon icon="fa-solid fa-code" />
          {{ $t(`codePage.title`) }}
          <span> {{ $t(`codePage.des`) }} </span>
        </h1>
        <button class="select-all" @click="onSelectAll">
          <font-awesome-icon icon="fa-solid fa-i-cursor" />
        </button>
        <button @click="onclearEditor">
          <font-awesome-icon icon="fa-solid fa-eraser" />
        </button>
        <button @click="onCloseEditor">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </button>
      </header>
      <div ref="monacoRef" class="monaco-editor"></div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { ref, watchEffect, toRaw } from 'vue';
  import { Dialog } from '@nutui/nutui';
  import * as monaco from 'monaco-editor';
  import Monokai from '@/assets/editor_theme/monokai.json';
  import { useI18n } from 'vue-i18n';


  const { t } = useI18n();
  const { code } = defineProps<{
    code: string;
  }>();
  const emit = defineEmits(['close']);
  const monacoRef = ref(null);
  const monacoEditor = ref(null);

  // 关闭编辑器时获取内容触发事件，然后销毁编辑器实例
  const onCloseEditor = () => {
    const value = toRaw(monacoEditor.value)?.getValue();
    emit('close', value);
    toRaw(monacoEditor.value)?.dispose();
  };
  // 清空编辑器内容
  const onclearEditor = () => {
      Dialog({
        title: t('editorPage.subConfig.pop.clearTitle'),
        content: t('editorPage.subConfig.pop.clearDes'),
        popClass: 'auto-dialog',
        okText: t(`editorPage.subConfig.pop.clearConfirm`),
        cancelText: t(`editorPage.subConfig.pop.clearCancel`),
        onOk: () =>toRaw(monacoEditor.value)?.setValue(''),
        // onCancel: () => resolve(false),
        // @ts-ignore
        closeOnClickOverlay: true,
      });
    
  };
  // 全选
  const onSelectAll = () => {
    const editor = toRaw(monacoEditor.value)
    if (editor) {
      const range = editor.getModel().getFullModelRange();
      editor.setSelection(range);
    }
  };

  // 获取当前系统主题 并在变化时动态修改编辑器主题
  // const theme = computed(() => {
  //   return useGlobalStore().isDarkMode ? 'vs-dark' : 'vs';
  // });

  // watch(theme, () => {
  //   if (monacoEditor.value) {
  //     toRaw(monacoEditor.value)?.updateOptions({
  //       theme: theme.value,
  //     });
  //   }
  // });

  // 默认内容
  const initCode = `function operator(proxies, targetPlatform) {
  return proxies.map( proxy => {
    // Change proxy information here

    return proxy;
  });
}

function filter(proxies, targetPlatform) {
  return proxies.map( proxy => {
    // Return true if the current proxy is selected

    return true;
  });
}
`;

  // 引入 Monokai 皮肤
  // @ts-ignore
  monaco.editor.defineTheme('Monokai', Monokai);
  monaco.editor.setTheme('Monokai');

  // 创建编辑器实例
  watchEffect(() => {
    if (monacoRef.value && !monacoEditor.value) {
      monacoEditor.value = monaco.editor.create(monacoRef.value, {
        value: code || initCode,
        language: 'javascript',
        autoClosingOvertype: 'always',
        autoClosingBrackets: 'always',
        autoClosingDelete: 'always',
        autoClosingQuotes: 'always',
        autoIndent: 'advanced',
        colorDecorators: true,
        copyWithSyntaxHighlighting: true,
        codeLens: true,
        emptySelectionClipboard: true,
        foldingStrategy: 'auto',
        fontSize: 12,
        fontFamily: 'JB, monospace',
        fontLigatures: true,
        formatOnPaste: true,
        glyphMargin: true,
        lineDecorationsWidth: '0.6ch',
        lineNumbersMinChars: 2,
        lineHeight: 1.8,
        minimap: {
          // 关闭代码缩略图
          enabled: false, // 是否启用预览图
        },
        overviewRulerBorder: false,
        scrollbar: {
          // 关闭滚动条
          horizontal: 'hidden', // 水平滚动条的样式
        },
        showUnused: true,
        showFoldingControls: 'always',
        tabCompletion: 'on',
        wrappingIndent: 'same',
      });
    }
  });
</script>

<style lang="scss" scoped>
  .editor-page-header {
    padding: var(--safe-area-side);
    position: sticky;
    top: 0;
    z-index: 19;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    color: #ffffffee;
    background: #272823;

    h1 {
      font-size: 20px;
      line-height: 1;
      font-weight: 500;

      span {
        font-size: 12px;
        margin-left: 8px;
        color: #ffffff88;
      }

      svg {
        margin-right: 6px;
        width: 20px;
        height: 20px;
      }
    }

    button {
      background: none;
      border: none;
      font-size: 20px;
      padding: 8px;
      color: #ffffff36;
      cursor: pointer;
      &.select-all {
        margin-left: auto;
      }
    }
  }

  .editor-page-wrapper {
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .monaco-editor {
    padding: 12px 0;
    height: calc(100vh - 56px);
  }
</style>
