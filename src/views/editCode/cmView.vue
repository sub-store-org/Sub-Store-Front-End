<template>
  <div class="cmviewRef">
    <div
      class="cm-img-button"
      :class="{ 'nodark-imgbutton': !isDarkModeEnabled }"
    >
      <div v-if="openPanel">
        <button @click="hiCode"><img :src="jsimg" /></button>
        <button @click="undoCode"><img :src="undoimg" /></button>
        <button @click="redoCode"><img :src="redoimg" /></button>
        <button v-if="isJS" @click="formatCode"><img :src="format" /></button>
        <button @click="searchs"><img :src="searchimg" /></button>
        <button @click="copyText"><img :src="copyimg" /></button>
        <button @click="delAllCode"><img :src="del" /></button>
        <button @click="pasteNav"><img :src="paste" /></button>
      </div>
      <span
        v-else
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
      <button @click="setPanel"><img :src="more" /></button>
    </div>

    <div ref="viewRef" style="width: 100%; font-size: 12px" />
    <div style="height: 10px" />
  </div>
</template>

<script setup>
import { darkCode } from "./dark.js";
import { lightCode } from "./light.js";
import { javascript } from "@/views/editCode/lang-js";
import { ref, onMounted, watch, watchEffect } from "vue";

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
import jsimg from "@/views/editCode/svg/jsimg.svg";
import { useSettingsStore } from "@/store/settings";
import { useCodeStore } from "@/store/codeStore";
import { storeToRefs } from "pinia";
import beautify from "js-beautify";
import { useAppNotifyStore } from "@/store/appNotify";
const { toClipboard } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();

const settingsStore = useSettingsStore();
const { theme } = storeToRefs(settingsStore);

const isDarkModeEnabled = ref(true);

const Length = ref("");
const props = defineProps(["isReadOnly", "id"]);
console.log("cm-id: ", props.id);
const cmStore = useCodeStore();
const isJS = ref(false);
const viewRef = ref(null);
const editorTheme = new Compartment();
const langs = new Compartment();
let docUpdate = false;
let view;
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
      if (!docUpdate && newValue !== view.state.doc.toString()) {
        console.log("Code更新到文档");
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: newValue,
          },
        });
        getjsjson(newValue);
      }
    }
  );

  watch(isDarkModeEnabled, (isDark) => {
    console.log(isDarkModeEnabled);
    if (isDark) {
      view.dispatch({
        effects: editorTheme.reconfigure(darkCode),
      });
    } else {
      view.dispatch({
        effects: editorTheme.reconfigure(lightCode),
      });
    }
  });
};
function formatLength(length) {
  if (length < 1024) {
    return length === 0 ? "" : length + " bytes";
  } else if (length < 1024 * 1024) {
    return (length / 1024).toFixed(2) + " KB";
  } else {
    return (length / (1024 * 1024)).toFixed(2) + " MB";
  }
}
const getjsjson = (res) => {
  Length.value = formatLength(res?.length);
  // if (props.isJS) return false;
  try {
    const jsRegex =
      /(?:function|var|let|const|if|else|return|try|catch|finally|typeof|delete|async|await)\s/;
    if (jsRegex.test(res.slice(0, 4000))) {
      setHJ();
      console.log("---setHJ");
      return true;
    } else {
      if (/\{/.test(res.slice(0, 4000))) {
        try {
          JSON.parse(res);
          setHJ();
          console.log("111");
          return true;
        } catch (error) {
          noHJ();
          console.log("1112");
          return true;
        }
      } else {
        noHJ();
        return false;
      }
    }
  } catch (error) {
    noHJ();
    return false;
  }
};

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
  let lg = localStorage.getItem("highlightJS");
  const x = getjsjson(cmStore.EditCode[props.id]);
  if (!x) {
    if (lg == 1 || lg == null) {
      setHJ();
    } else {
      noHJ();
    }
  }
});

const openPanel = ref(localStorage.getItem("openCodePanel") != 1);
const setPanel = () => {
  if (openPanel.value) {
    openPanel.value = false;
    localStorage.setItem("openCodePanel", 1);
  } else {
    openPanel.value = true;
    localStorage.setItem("openCodePanel", 0);
  }
};

let ishiCode = localStorage.getItem("highlightJS") != 1;
const hiCode = () => {
  if (ishiCode) {
    setHJ();
    ishiCode = false;
    localStorage.setItem("highlightJS", 1);
  } else {
    noHJ();
    ishiCode = true;
    localStorage.setItem("highlightJS", 0);
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

const setHJ = () => {
  isJS.value = true;
  view.dispatch({
    effects: langs.reconfigure(javascript()),
  });
};
const noHJ = () => {
  isJS.value = false;
  view.dispatch({
    effects: langs.reconfigure([]),
  });
};
// const openLine = () => {
//   gotoLine(view);
// };

const undoCode = () => undo(view);
const redoCode = () => redo(view);

async function formatCode() {
  try {
    cmStore.setEditCode(
      [props.id],
      beautify
        .js_beautify(cmStore.EditCode[props.id], {
          indent_size: 2,
        })
        .replace(/^\s*[\r\n]/gm, "\n")
    );
  } catch (error) {
    console.error(error);
  }
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
      title: "获取剪贴板失败: 非Https",
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

.cm-img-button {
  display: flex;
  padding-top: 9px;
  z-index: 10;
  height: 33px;
  width: 100%;
  justify-content: flex-end;
  // position: absolute;
  // top: 42px;
  // background-color: var(--card-color);
  img {
    width: 16px;
    height: 16px;
  }
  button {
    cursor: pointer;
  }
}

.cm-img-button button {
  height: 16px;
  background-repeat: no-repeat;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  width: 33px;
  transition: transform 0.2s;
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

.nodark-imgbutton {
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
