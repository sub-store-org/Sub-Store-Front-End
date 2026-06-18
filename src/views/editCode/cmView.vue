<template>
  <div
    class="cmviewRef"
    :class="[
      { 'is-fullscreen': isFullscreen },
      toolbarVariant !== 'default' ? `cmviewRef--${toolbarVariant}` : '',
    ]"
  >
    <div
      class="cm-img-button"
      :class="[
        { 'nodark-imgbutton': !isDarkModeEnabled },
        toolbarVariant !== 'default' ? `cm-img-button--${toolbarVariant}` : '',
      ]"
    >
      <div v-if="openPanel" class="cm-toolbar-actions">
        <div class="cm-toolbar-left">
          <button
            v-if="isToolbarActionEnabled('fullscreen') && enableFullscreen"
            type="button"
            :title="fullscreenTitle"
            :aria-label="fullscreenTitle"
            @click="toggleFullscreen"
          >
            <font-awesome-icon
              :icon="
                isFullscreen
                  ? 'fa-solid fa-minimize'
                  : 'fa-solid fa-maximize'
              "
            />
          </button>
          <button
            v-if="canImportFile"
            type="button"
            :title="importFileTitle"
            :aria-label="importFileTitle"
            @click="openFilePicker"
          >
            <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
          </button>
          <input
            v-if="canImportFile"
            ref="fileInput"
            class="cm-file-input"
            type="file"
            @change="importFile"
          />
        </div>
        <div class="cm-toolbar-right">
          <button
            v-if="
              isToolbarActionEnabled('language-detect') &&
              isLanguageDetectionActionVisible
            "
            class="language-detect-button"
            :class="`is-${languageDetectionStatus}`"
            type="button"
            :title="languageDetectionTitle"
            :aria-label="languageDetectionTitle"
            @click="onLanguageDetectionAction"
          >
            <span
              v-if="languageDetectionStatus === 'detecting'"
              class="language-detect-spinner"
              aria-hidden="true"
            />
            <span
              v-else-if="languageDetectionStatus === 'error'"
              class="language-detect-retry"
              aria-hidden="true"
            />
            <span v-else class="language-detect-auto" aria-hidden="true" />
          </button>
          <span
            v-if="isToolbarActionEnabled('language')"
            class="language-select-wrap"
          >
            <span class="language-select-display" aria-hidden="true">
              {{ selectedLanguageDisplayLabel }}
            </span>
            <select
              v-model="selectedLanguage"
              class="language-select"
              :title="selectedLanguageTitle"
              aria-label="Editor language"
              @change="onLanguageChange"
            >
              <option
                v-for="option in languageOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </span>
          <button v-if="isToolbarActionEnabled('undo')" @click="undoCode">
            <img :src="undoimg" />
          </button>
          <button v-if="isToolbarActionEnabled('redo')" @click="redoCode">
            <img :src="redoimg" />
          </button>
          <button
            v-if="isToolbarActionEnabled('format') && canFormatActiveLanguage"
            :disabled="isFormatting"
            @click="formatCode"
          >
            <img :src="format" />
          </button>
          <button v-if="isToolbarActionEnabled('search')" @click="searchs">
            <img :src="searchimg" />
          </button>
          <button v-if="isToolbarActionEnabled('copy')" @click="copyText">
            <img :src="copyimg" />
          </button>
          <button v-if="isToolbarActionEnabled('delete')" @click="delAllCode">
            <img :src="del" />
          </button>
          <button v-if="isToolbarActionEnabled('paste')" @click="pasteNav">
            <img :src="paste" />
          </button>
        </div>
      </div>
      <span
        v-else-if="canToggleToolbarPanel"
        style="
          opacity: 0.9;
          font-size: 12px;
          padding-left: 10px;
          line-height: 14px;
          height: 22px;
          color: var(--second-text-color);
        "
      >
        {{ Length }} &nbsp;
      </span>
      <button v-if="canToggleToolbarPanel" @click="setPanel">
        <img :src="more" />
      </button>
    </div>

    <div ref="viewRef" class="cm-editor-host" style="width: 100%; font-size: 12px" />
    <div style="height: 10px" />
  </div>
</template>

<script setup>
import { darkCode } from "./dark.js";
import { lightCode } from "./light.js";
import {
  canFormatEditorLanguage,
  detectEditorLanguage,
  EDITOR_LANGUAGE_OPTIONS,
  formatEditorCode,
  loadEditorLanguageExtension,
  normalizeEditorLanguage,
} from "@/views/editCode/editorLanguages";
import { shikiHighlight } from "@/views/editCode/shikiHighlight";
import {
  computed,
  nextTick,
  ref,
  onBeforeUnmount,
  onMounted,
  watch,
  watchEffect,
} from "vue";

import {
  highlightSelectionMatches,
  searchKeymap,
  openSearchPanel,
  gotoLine,
  closeSearchPanel,
} from "@/views/editCode/search";
import {
  lineNumbers,
  EditorView,
  highlightActiveLine,
  keymap,
  placeholder as cmPlaceholder,
} from "@codemirror/view";
import { foldGutter, bracketMatching } from "@codemirror/language";
import {
  undo,
  redo,
  history,
  defaultKeymap,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { closeBrackets, autocompletion } from "@codemirror/autocomplete";
import { Compartment, EditorState } from "@codemirror/state";
import { hyperLink } from "@/views/editCode/link";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import useV3Clipboard from "vue-clipboard3";
import copyimg from "@/views/editCode/svg/copy.svg";
import del from "@/views/editCode/svg/del.svg";
import paste from "@/views/editCode/svg/zt.svg";
import searchimg from "@/views/editCode/svg/search.svg";
import format from "@/views/editCode/svg/format.svg";
import more from "@/views/editCode/svg/more.svg";
import redoimg from "@/views/editCode/svg/redo.svg";
import undoimg from "@/views/editCode/svg/undo.svg";
import { useSettingsStore } from "@/store/settings";
import { useCodeStore } from "@/store/codeStore";
import { storeToRefs } from "pinia";
import { useAppNotifyStore } from "@/store/appNotify";
import { useI18n } from "vue-i18n";
const { toClipboard } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();
const { t } = useI18n();

const settingsStore = useSettingsStore();
const { theme } = storeToRefs(settingsStore);

const isDarkModeEnabled = ref(true);

const Length = ref("");
const DEFAULT_TOOLBAR_ACTIONS = [
  "fullscreen",
  "import",
  "language-detect",
  "language",
  "undo",
  "redo",
  "format",
  "search",
  "copy",
  "delete",
  "paste",
  "panel",
];
const props = defineProps({
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    required: true,
  },
  editorLanguage: {
    default: undefined,
  },
  placeholder: {
    type: String,
    default: "",
  },
  enableFullscreen: {
    type: Boolean,
    default: true,
  },
  enableImport: {
    type: Boolean,
    default: true,
  },
  toolbarActions: {
    type: Array,
    default: () => [
      "fullscreen",
      "import",
      "language-detect",
      "language",
      "undo",
      "redo",
      "format",
      "search",
      "copy",
      "delete",
      "paste",
      "panel",
    ],
  },
  toolbarVariant: {
    type: String,
    default: "default",
  },
});
const emit = defineEmits(["update:editorLanguage"]);
console.log("cm-id: ", props.id);
const cmStore = useCodeStore();
const viewRef = ref(null);
const editorTheme = new Compartment();
const langs = new Compartment();
const shikiSyntax = new Compartment();
const editorPlaceholder = new Compartment();
const selectedLanguage = ref(normalizeEditorLanguage(props.editorLanguage, "auto"));
const activeLanguage = ref("plaintext");
const autoDetectedLanguage = ref(null);
const isFormatting = ref(false);
const languageDetectionStatus = ref("idle");
const isFullscreen = ref(false);
const LANGUAGE_DETECTION_BUSY_DELAY = 300;
let docUpdate = false;
let view;
let languageRequestId = 0;
let languageDetectionTimer;
const fileInput = ref(null);

const getLanguageLabel = (language) => {
  const normalizedLanguage = normalizeEditorLanguage(language, "plaintext");
  return t(`editorLanguage.${normalizedLanguage}`);
};

const selectedLanguageDisplayLabel = computed(() =>
  getLanguageLabel(selectedLanguage.value)
);
const canFormatActiveLanguage = computed(() =>
  canFormatEditorLanguage(activeLanguage.value)
);
const normalizedToolbarActions = computed(
  () =>
    new Set(
      Array.isArray(props.toolbarActions)
        ? props.toolbarActions
        : DEFAULT_TOOLBAR_ACTIONS
    )
);
const isToolbarActionEnabled = (action) =>
  normalizedToolbarActions.value.has(action);
const canToggleToolbarPanel = computed(() => isToolbarActionEnabled("panel"));
const canImportFile = computed(
  () =>
    isToolbarActionEnabled("import") && props.enableImport && !props.isReadOnly
);
const fullscreenTitle = computed(() =>
  isFullscreen.value
    ? t("editorPage.subConfig.basic.url.tips.fullScreenEditCancel")
    : t("editorPage.subConfig.basic.url.tips.fullScreenEdit")
);
const importFileTitle = computed(() =>
  t("editorPage.subConfig.basic.url.tips.importFromFile")
);
const isAutoLanguageSelected = computed(
  () => normalizeEditorLanguage(selectedLanguage.value, "auto") === "auto"
);
const isLanguageDetectionActionVisible = computed(
  () =>
    isAutoLanguageSelected.value &&
    ["detecting", "error"].includes(languageDetectionStatus.value)
);
const languageDetectionTitle = computed(() => {
  if (languageDetectionStatus.value === "detecting") {
    return t("editorLanguage.detect.cancel");
  }
  if (languageDetectionStatus.value === "error") {
    return t("editorLanguage.detect.retry");
  }
  return t("editorLanguage.detect.auto");
});

const languageOptions = computed(() =>
  EDITOR_LANGUAGE_OPTIONS.map((option) =>
    option.value === "auto"
      ? {
          ...option,
          label: autoDetectedLanguage.value
            ? `${getLanguageLabel("auto")} · ${getLanguageLabel(autoDetectedLanguage.value)}`
            : getLanguageLabel(option.value),
        }
      : {
          ...option,
          label: getLanguageLabel(option.value),
        }
  )
);
const selectedLanguageTitle = computed(() => {
  if (normalizeEditorLanguage(selectedLanguage.value, "auto") !== "auto") {
    return selectedLanguageDisplayLabel.value;
  }

  return autoDetectedLanguage.value
    ? `${getLanguageLabel("auto")} · ${getLanguageLabel(autoDetectedLanguage.value)}`
    : getLanguageLabel("auto");
});

const createShikiHighlight = (language = activeLanguage.value) =>
  shikiHighlight({
    language,
    dark: isDarkModeEnabled.value,
  });

const createEditorPlaceholder = () =>
  props.placeholder ? cmPlaceholder(props.placeholder) : [];

const clearLanguageDetectionTimer = () => {
  if (languageDetectionTimer !== undefined) {
    clearTimeout(languageDetectionTimer);
    languageDetectionTimer = undefined;
  }
};

const scheduleLanguageDetectionBusy = (requestId) => {
  clearLanguageDetectionTimer();
  languageDetectionTimer = setTimeout(() => {
    languageDetectionTimer = undefined;
    if (
      requestId === languageRequestId &&
      normalizeEditorLanguage(selectedLanguage.value, "auto") === "auto"
    ) {
      languageDetectionStatus.value = "detecting";
    }
  }, LANGUAGE_DETECTION_BUSY_DELAY);
};

const finishLanguageDetection = (requestId, status = "idle") => {
  if (requestId !== languageRequestId) return;

  clearLanguageDetectionTimer();
  languageDetectionStatus.value = status;
};

const applyLanguage = async (language, requestId = ++languageRequestId) => {
  const nextLanguage = normalizeEditorLanguage(language, "plaintext");
  const resolvedLanguage =
    nextLanguage === "auto" ? "plaintext" : nextLanguage;

  if (view && activeLanguage.value === resolvedLanguage) return;
  const extension = await loadEditorLanguageExtension(resolvedLanguage);

  if (!view || requestId !== languageRequestId) return;
  activeLanguage.value = resolvedLanguage;
  view.dispatch({
    effects: [
      langs.reconfigure(extension),
      shikiSyntax.reconfigure(createShikiHighlight(resolvedLanguage)),
    ],
  });
};

const syncLanguageForDocument = async (docContent) => {
  const requestId = ++languageRequestId;
  const docSnapshot = docContent || "";
  const manualLanguage = normalizeEditorLanguage(selectedLanguage.value, "auto");

  if (manualLanguage === "auto") {
    languageDetectionStatus.value = "idle";
    scheduleLanguageDetectionBusy(requestId);
    try {
      const detectedLanguage = await detectEditorLanguage(docSnapshot);
      if (
        requestId !== languageRequestId ||
        normalizeEditorLanguage(selectedLanguage.value, "auto") !== "auto" ||
        (view && view.state.doc.toString() !== docSnapshot)
      ) {
        return;
      }

      autoDetectedLanguage.value = detectedLanguage;
      await applyLanguage(detectedLanguage, requestId);
      finishLanguageDetection(requestId);
    } catch (error) {
      console.error("Editor language detection failed", error);
      finishLanguageDetection(requestId, "error");
    }
    return;
  }

  clearLanguageDetectionTimer();
  languageDetectionStatus.value = "idle";
  if (
    requestId !== languageRequestId ||
    normalizeEditorLanguage(selectedLanguage.value, "auto") !== manualLanguage
  ) {
    return;
  }

  await applyLanguage(manualLanguage, requestId);
};

const onLanguageChange = () => {
  selectedLanguage.value = normalizeEditorLanguage(
    selectedLanguage.value,
    "auto"
  );
  emit(
    "update:editorLanguage",
    selectedLanguage.value === "auto" ? undefined : selectedLanguage.value
  );
  syncLanguageForDocument(view?.state.doc.toString() || "");
};

const onLanguageDetectionAction = () => {
  if (languageDetectionStatus.value === "detecting") {
    languageRequestId += 1;
    clearLanguageDetectionTimer();
    languageDetectionStatus.value = "idle";
    return;
  }

  syncLanguageForDocument(view?.state.doc.toString() || "");
};

const CreateView = () => {
  view = new EditorView({
    state: EditorState.create({
      extensions: [
        history(), //历史
        keymap.of([
          indentWithTab,
          ...searchKeymap,
          ...defaultKeymap, // 注释 缩进 等等
          ...historyKeymap,
        ]),
        langs.of([]),
        shikiSyntax.of(createShikiHighlight()),
        editorPlaceholder.of(createEditorPlaceholder()),
        editorTheme.of(isDarkModeEnabled.value ? darkCode : lightCode), // 设置初始主题
        EditorState.readOnly.of(props.isReadOnly ? true : false),
        EditorView.lineWrapping, // 换行
        lineNumbers(),
        highlightActiveLine(),
        bracketMatching(),
        highlightSelectionMatches(),
        indentationMarkers(),
        closeBrackets(), // 括号闭合
        autocompletion(), // 代码补全
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          const docContent = update.state.doc.toString();
          docUpdate = true;
          console.log("更新文档 - CodeValue");
          cmStore.setEditCode([props.id], docContent);
          Length.value = formatLength(docContent.length);
          docUpdate = false;
          if (selectedLanguage.value === "auto") {
            syncLanguageForDocument(docContent);
          }
        }),
        hyperLink,
        foldGutter({
          closedText: "▸",
          openText: "▾",
        }),
      ],
      doc: cmStore.EditCode[props.id],
    }),
    parent: viewRef.value,
  });

  watch(
    () => cmStore.EditCode[props.id],
    (newValue) => {
      const nextValue = newValue || "";

      if (!docUpdate && nextValue !== view.state.doc.toString()) {
        console.log("Code更新到文档");
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: nextValue,
          },
        });
        syncLanguageForDocument(nextValue);
      }
    }
  );

  watch(isDarkModeEnabled, (isDark) => {
    console.log(isDarkModeEnabled);
    view.dispatch({
      effects: [
        editorTheme.reconfigure(isDark ? darkCode : lightCode),
        shikiSyntax.reconfigure(createShikiHighlight()),
      ],
    });
  });
};

watch(
  () => props.editorLanguage,
  (language) => {
    const nextLanguage = normalizeEditorLanguage(language, "auto");
    if (selectedLanguage.value === nextLanguage) return;

    selectedLanguage.value = nextLanguage;
    syncLanguageForDocument(view?.state.doc.toString() || "");
  }
);

watch(
  () => props.placeholder,
  () => {
    if (!view) return;

    view.dispatch({
      effects: editorPlaceholder.reconfigure(createEditorPlaceholder()),
    });
  }
);
function formatLength(length) {
  if (length < 1024) {
    return length === 0 ? "" : length + " bytes";
  } else if (length < 1024 * 1024) {
    return (length / 1024).toFixed(2) + " KB";
  } else {
    return (length / (1024 * 1024)).toFixed(2) + " MB";
  }
}
const updateDarkModeStatus = () => {
  isDarkModeEnabled.value = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
};

updateDarkModeStatus();
if (theme.value.auto === true) {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeMediaQuery.addEventListener("change", updateDarkModeStatus);
}
watchEffect(() => {
  if (theme.value.auto === false) {
    if (/^mocha$|light/.test(theme.value.name)) {
      isDarkModeEnabled.value = false;
    } else {
      isDarkModeEnabled.value = true;
    }
  }
});

onMounted(() => {
  CreateView();
  const initialCode = cmStore.EditCode[props.id] || "";
  Length.value = formatLength(initialCode.length);
  syncLanguageForDocument(initialCode);
});

onBeforeUnmount(() => {
  clearLanguageDetectionTimer();
});

const openPanel = ref(
  canToggleToolbarPanel.value ? localStorage.getItem("openCodePanel") != 1 : true
);
const setPanel = () => {
  if (!canToggleToolbarPanel.value) return;

  if (openPanel.value) {
    openPanel.value = false;
    localStorage.setItem("openCodePanel", 1);
  } else {
    openPanel.value = true;
    localStorage.setItem("openCodePanel", 0);
  }
};

let sopen = true;
const searchs = () => {
  if (sopen) {
    openSearchPanel(view);
    sopen = false;
  } else {
    closeSearchPanel(view);
    sopen = true;
  }
};

// const openLine = () => {
//   gotoLine(view);
// };

const undoCode = () => undo(view);
const redoCode = () => redo(view);

const refreshEditorLayout = () => {
  nextTick(() => {
    view?.requestMeasure?.();
  });
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  refreshEditorLayout();
};

const openFilePicker = () => {
  fileInput.value?.click?.();
};

const importFile = async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  try {
    const content = await file.text();
    cmStore.setEditCode([props.id], content);
  } catch (e) {
    showNotify({
      type: "danger",
      title: "文件导入失败",
    });
    console.error(e);
  }
};

async function formatCode() {
  if (!canFormatEditorLanguage(activeLanguage.value)) return;

  isFormatting.value = true;
  const result = await formatEditorCode(
    activeLanguage.value,
    cmStore.EditCode[props.id] || ""
  );
  isFormatting.value = false;

  if (result.ok) {
    cmStore.setEditCode([props.id], result.code);
    return;
  }

  console.error(result.error);
  showNotify({
    type: "warning",
    title:
      result.reason === "unsupported"
        ? "当前语言暂不支持格式化"
        : "格式化失败, 内容未修改",
  });
}

const copyText = async () => {
  const x = await toClipboard(cmStore.EditCode[props.id]);
  if (x) {
    showNotify({
      type: "success",
      title: "已复制字符串数: " + x?.text?.length,
    });
  }
};

const delAllCode = () => {
  cmStore.setEditCode([props.id], "");
  cmStore.CodeClear([props.id], true);
  showNotify({
    type: "success",
    title: "已清空",
  });
};

const pasteNav = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText?.length > 0) {
      cmStore.setEditCode([props.id], clipboardText);
      showNotify({
        type: "success",
        title: "已粘贴字数: " + clipboardText.length,
      });
    }
  } catch (e) {
    showNotify({
      type: "warning",
      title: "获取剪贴板失败: 本地/HTTPS 环境下可用(或手动配置权限)"
    });
  }
};
</script>

<style lang="scss">
.cm-panels.cm-panels-bottom {
  padding: 10px;
  border-top: none !important;
  border-radius: 15px;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 30px;
  bottom: 24px !important;
  line-height: 16px;
}

.cmviewRef {
  border-radius: 16px;
}

.cmviewRef.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: max(env(safe-area-inset-top), 8px) 12px
    max(env(safe-area-inset-bottom), 8px);
  border-radius: 0;
  background: var(--card-color);
  overflow: hidden;
}

.cmviewRef.is-fullscreen .cm-editor-host {
  flex: 1 1 auto;
  min-height: 0;
}

.cmviewRef.is-fullscreen .cm-editor {
  height: 100%;
}

.cm-placeholder {
  color: var(--comment-text-color);
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
  white-space: nowrap;
}

.ͼ1 .cm-button {
  margin: .6em 0.2em .6em .6em !important;
  padding: .2em 1em;
  white-space: pre;
}

.cm-img-button {
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  padding-top: 9px;
  padding-bottom: 2px;
  z-index: 10;
  height: 33px;
  width: 100%;
  flex-shrink: 0;
  justify-content: flex-end;
  background-color: var(--card-color);
  img {
    width: 16px;
    height: 16px;
  }
  button {
    cursor: pointer;
  }
}

.cm-img-button--preview {
  box-sizing: border-box;
  margin-top: 0;
  padding: 8px 12px 4px;
  height: 40px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--divider-color);
}

.cm-toolbar-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1 1 auto;
  height: 24px;
  min-width: 0;
}

.cm-toolbar-left,
.cm-toolbar-right {
  display: flex;
  align-items: center;
  min-width: 0;
}

.cm-toolbar-left {
  flex: 0 0 auto;
}

.cm-toolbar-right {
  justify-content: flex-end;
  flex: 1 1 auto;
}

.cm-img-button--preview .cm-toolbar-actions,
.cm-img-button--preview .cm-toolbar-right {
  flex: 0 0 auto;
}

.cm-img-button--preview .cm-toolbar-actions {
  margin-left: auto;
}

.cm-file-input {
  display: none;
}

.cm-img-button svg {
  width: 16px;
  height: 16px;
  color: var(--second-text-color);
}

.cm-img-button .language-detect-button {
  position: relative;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  margin-right: 4px;
  border: 1px solid #8b8b8b66;
  border-radius: 6px;
  color: var(--second-text-color);
  opacity: 0.9;
}

.cm-img-button .language-detect-button:hover {
  color: #8fb4e8;
  border-color: #8fb4e8;
}

.language-detect-auto,
.language-detect-retry,
.language-detect-spinner {
  position: relative;
  display: block;
  width: 14px;
  height: 14px;
  color: currentColor;
}

.language-detect-auto {
  border: 1.5px solid currentColor;
  border-radius: 50%;
}

.language-detect-auto::before,
.language-detect-auto::after {
  content: "";
  position: absolute;
  border-radius: 50%;
}

.language-detect-auto::before {
  inset: 4px;
  background: currentColor;
}

.language-detect-auto::after {
  top: 1px;
  right: 1px;
  width: 3px;
  height: 3px;
  background: #8fb4e8;
}

.language-detect-spinner {
  box-sizing: border-box;
  border: 1.5px solid #8b8b8b66;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: language-detect-spin 0.85s linear infinite;
}

.language-detect-spinner::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 4px;
  height: 4px;
  border-radius: 1px;
  background: currentColor;
}

.language-detect-retry {
  border: 1.5px solid currentColor;
  border-left-color: transparent;
  border-radius: 50%;
}

.language-detect-retry::after {
  content: "";
  position: absolute;
  top: -1px;
  right: 0;
  width: 5px;
  height: 5px;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
  transform: rotate(20deg);
}

@keyframes language-detect-spin {
  to {
    transform: rotate(360deg);
  }
}

.language-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;
  margin-right: 6px;
  color: var(--second-text-color);
  flex: 0 1 auto;
}

.language-select-wrap::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 8px;
  z-index: 3;
  width: 6px;
  height: 6px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  opacity: 0.9;
  pointer-events: none;
  transform: translateY(-65%) rotate(45deg);
}

.language-select-display {
  position: absolute;
  inset: 0 22px 0 8px;
  z-index: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: currentColor;
  font-size: 12px;
  line-height: 22px;
  pointer-events: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.language-select {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  height: 24px;
  width: 120px;
  max-width: 34vw;
  padding: 0 22px 0 8px;
  border: 1px solid #8b8b8b66;
  border-radius: 6px;
  background-color: transparent;
  background-image: none;
  box-shadow: none;
  color: transparent;
  font-size: 12px;
  line-height: 22px;
  outline: none;
  opacity: 1;
  text-overflow: ellipsis;
  -webkit-text-fill-color: transparent;
}

.language-select:focus {
  border-color: #8fb4e8;
}

.language-select option {
  color: #222;
  background-color: #fff;
  -webkit-text-fill-color: #222;
}

.cm-img-button button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  background-repeat: no-repeat;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  width: 33px;
  transition: transform 0.2s;
}

@media (max-width: 480px) {
  .cm-img-button button {
    width: 28px;
  }

  .cm-img-button .language-detect-button {
    flex-basis: 22px;
    width: 22px;
    height: 22px;
    margin-right: 3px;
  }

  .language-select-wrap {
    margin-right: 3px;
  }

  .language-select {
    width: 104px;
    padding-right: 18px;
    padding-left: 7px;
  }

  .language-select-display {
    inset: 0 18px 0 7px;
  }

  .language-select-wrap::after {
    right: 7px;
  }
}
.cimg-button {
  // width: 33px;
  height: 16px;
  font-size: 12px;
  background-repeat: no-repeat;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  margin-left: 10px;
  margin-top: 8px;
  color: var(--comment-text-color);
  // position: absolute;
  cursor: pointer;
}
.cm-img-button button:hover {
  transform: scale(0.9);
}

.cm-img-button button:active {
  transform: scale(0.9);
  filter: invert(0.5);
}

.cm-img-button button:disabled {
  cursor: wait;
  opacity: 0.5;
}

.cm-button {
  background-image: none !important;
  background-color: #88828217 !important;
  border: none !important;
  border-radius: 10px !important;
}

.cm-textfield {
  vertical-align: middle;
  color: inherit;
  font-size: 70%;
  border: 1px solid #8b8b8b3b !important;
  border-radius: 10px;
  background-color: transparent !important;
  width: 40%;
  padding: 0.2em 0.5em;
  border-color: none !important;
  outline: none;
}

.cm-panel.cm-search input[type="checkbox"] {
  position: absolute;
  width: 12px !important;
  height: 14px !important;
  margin-top: 5px !important;
  background-color: #00000000 !important;
  -webkit-appearance: none;
  appearance: none;
}

input[type="checkbox"]:checked {
  border: 6px solid #8b8b9256 !important;
  border-radius: 2px;
}
.cm-button[name="replace"] {
  margin-left: 10px !important;
}
.cm-button[name="prev"] {
  margin-right: 13px !important;
}

.cm-panel.cm-search label {
  margin: 0.2em 0.5em 0.5em 1.2em !important;
}

.cm-panel.cm-search label {
  font-size: 90% !important;
}

.nodark-imgbutton img {
  filter: invert(1);
}
.ͼ1.cm-focused {
  outline: none;
}

.ͼ1u .cm-panels.cm-panels-bottom {
  border-top: none;
}

.cm-panels.cm-panels-bottom {
  background: var(--card-color) !important;
  box-shadow: 0 0 6px #919db687;
}

.cm-button:active {
  background-color: #b6d9eba6 !important;
}
</style>
