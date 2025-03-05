<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[0]`) }}
      <a
        href="https://github.com/sub-store-org/Sub-Store/wiki/%E8%84%9A%E6%9C%AC%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E"
        target="_blank"
      >
        {{ $t("subPage.panel.tips.ok") }}
      </a>
    </p>
    <nut-radiogroup v-model="value.mode" direction="horizontal">
      <nut-radio v-for="(key, index) in modeList" :key="index" :label="key">
        {{
          $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`)
        }}
      </nut-radio>
    </nut-radiogroup>

    <div v-if="value.mode === 'link'" class="input-wrapper">
      <nut-textarea
        v-model="value.content"
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].placeholder`)
        "
        :rows="5"
        autosize
        @blur="handleLinkValueChange"
      />
    </div>
    <div
      v-if="value.mode === 'script'"
      style="
        margin-left: -16px;
        margin-right: -16px;
        max-height: 80vh;
        overflow: auto;
      "
    >
      <cmView :id="id" :is-read-only="false" />
    </div>

    <!-- 参数编辑控制部分 -->
    <div class="input-wrapper-title">
      <!-- 参数编辑开关 -->
      <div class="title-label">
        <nut-switch v-model="showKeyValue" />
        <span>
          {{ $t(`editorPage.subConfig.nodeActions['${type}'].paramsEdit`) }}
        </span>
        <font-awesome-icon
          class="icon"
          icon="fa-solid fa-circle-question"
          @click.stop="showParamsEditTips"
        />
      </div>
      <!-- 无缓存开关 - 仅在link模式时显示 -->
      <div v-if="value.mode === 'link'" class="title-label">
        <nut-switch v-model="params.noCache" />
        <span>
          {{ $t(`editorPage.subConfig.nodeActions['${type}'].noCache`) }}
        </span>
        <font-awesome-icon
          class="icon"
          icon="fa-solid fa-circle-question"
          @click.stop="showNoCacheTips"
        />
      </div>
      <!-- 添加参数按钮 -->
      <div v-if="showKeyValue" class="button">
        <div @click="addParameter">
          {{ $t(`editorPage.subConfig.nodeActions['${type}'].paramsAdd`) }}
        </div>
      </div>
    </div>
    <ParamsEditor
      v-model:paramsArguments="paramsArguments"
      :visible="showKeyValue"
      :type="type"
    />
  </div>
</template>

<script lang="ts" setup>
import { Dialog } from "@nutui/nutui";
import { inject, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import ParamsEditor from "@/components/ParamsEditor.vue";
import { usePopupRoute } from "@/hooks/usePopupRoute";
import { useCodeStore } from "@/store/codeStore";
import cmView from "@/views/editCode/cmView.vue";

const { type, id, sourceType } = defineProps<{
  type: string;
  id: string;
  sourceType?: string;
}>();

const cmStore = useCodeStore();

const { t } = useI18n();

const form = inject<Sub | Collection>("form");

const modeList = ["link", "script"];

const showKeyValue = ref(false);

const isEditKeyValue = ref(true);

const params = reactive({
  url: "",
  arguments: {},
  noCache: false,
});

const paramsArguments = ref([]);

const parseUrlParams = (urlStr) => {
  let $arguments = {};
  let noCache = false;
  let url = urlStr?.trim() || "";

  // 处理没有参数的情况
  if (!url) {
    return { url: "", arguments: {}, noCache: false };
  }

  // 处理URL末尾的所有 #noCache 标记
  while (url.endsWith("#noCache")) {
    url = url.slice(0, -8);
    noCache = true;
  }

  // 安全的URL解码函数
  const safeDecodeURIComponent = (encodedURIComponent) => {
    if (!encodedURIComponent) return "";

    try {
      return decodeURIComponent(encodedURIComponent);
    } catch (e) {
      // 尝试处理嵌套的URL编码
      let result = encodedURIComponent;
      let previousResult = "";
      let attempts = 0;
      const maxAttempts = 5;

      while (result !== previousResult && attempts < maxAttempts) {
        try {
          previousResult = result;
          result = decodeURIComponent(previousResult);
          attempts++;
        } catch (decodeError) {
          return previousResult;
        }
      }
      return result;
    }
  };

  // 查找第一个 # 符号
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) {
    return { url, arguments: {}, noCache };
  }

  // 提取基础URL和参数部分
  const baseUrl = url.substring(0, hashIndex);
  let paramsText = url.substring(hashIndex + 1);

  // 处理参数部分的所有 #noCache 标记（支持在参数中间出现 #noCache）
  const parts = paramsText.split("#");
  const cleanParts = [];

  for (const part of parts) {
    if (part === "noCache") {
      noCache = true;
    } else {
      cleanParts.push(part);
    }
  }

  // 重新组合参数部分，排除noCache标记
  paramsText = cleanParts.join("#");

  // 如果参数部分为空，则返回基本URL和noCache状态
  if (!paramsText) {
    return { url: baseUrl, arguments: {}, noCache };
  }

  // 尝试解析参数
  try {
    // 先尝试作为JSON解析
    try {
      const decodedParams = safeDecodeURIComponent(paramsText);
      if (decodedParams.startsWith("{") && decodedParams.endsWith("}")) {
        $arguments = JSON.parse(decodedParams);
      } else {
        throw new Error("Not a JSON object");
      }
    } catch (jsonError) {
      // JSON解析失败，使用&分割参数
      const pairs = paramsText.split("&");

      for (const pair of pairs) {
        if (!pair) continue;

        const equalIndex = pair.indexOf("=");
        if (equalIndex === -1) {
          // 没有等号，将整个值作为键，值为true
          const key = pair.trim();
          if (key) $arguments[key] = true;
        } else {
          // 有等号，分割键和值
          const key = pair.substring(0, equalIndex).trim();
          if (!key) continue;

          let value;
          try {
            const encodedValue = pair.substring(equalIndex + 1);
            value = encodedValue ? safeDecodeURIComponent(encodedValue) : "";
          } catch (e) {
            value = pair.substring(equalIndex + 1) || "";
          }

          $arguments[key] = value;
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse URL parameters:", e);
    $arguments = {};
  }

  return {
    url: baseUrl,
    arguments: $arguments,
    noCache,
  };
};

const buildUrlWithParams = (baseUrl, args, noCache) => {
  if (!baseUrl) return noCache ? "#noCache" : "";

  const validArgs = args && typeof args === "object" && Object.keys(args).length > 0;

  // 如果没有参数且不需要noCache，直接返回baseUrl
  if (!validArgs && !noCache) return baseUrl;

  let paramStrings = [];

  if (validArgs) {
    // 为了一致性，对键名进行排序
    paramStrings = Object.entries(args)
      .filter(([key]) => key && typeof key === "string")
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => {
        // 处理布尔值 true - 直接输出键名，无等号
        if (value === true) {
          return key;
        }

        // 处理其他值 - 转换为字符串并编码
        const strValue = value === null || value === undefined ? "" : value.toString();
        return `${key}=${encodeURIComponent(strValue)}`;
      });
  }

  // 构建最终URL
  let result = baseUrl;

  if (paramStrings.length > 0) {
    result += `#${paramStrings.join("&")}`;
  }

  // noCache 标记始终放在末尾
  if (noCache) {
    result += "#noCache";
  }

  return result;
};

const editorIsVisible = ref(false);
usePopupRoute(editorIsVisible);
const value = reactive({
  mode: "",
  content: "",
  code: "",
});

// 添加参数方法
const addParameter = () => {
  const newParamsArguments = [...paramsArguments.value, { key: "", value: "" }];
  paramsArguments.value = newParamsArguments;
};

// 显示noCache提示
const showNoCacheTips = () => {
  Dialog({
    title: t(`editorPage.subConfig.nodeActions['${type}'].helpTitle`),
    content: t(`editorPage.subConfig.nodeActions['${type}'].noCacheTips`),
    popClass: "auto-dialog",
    okText: "OK",
    noCancelBtn: true,
    closeOnClickOverlay: true,
  });
};

// 显示参数编辑提示
const showParamsEditTips = () => {
  Dialog({
    title: t(`editorPage.subConfig.nodeActions['${type}'].helpTitle`),
    content: t(`editorPage.subConfig.nodeActions['${type}'].paramsEditTips`),
    popClass: "auto-dialog",
    okText: "OK",
    noCancelBtn: true,
    closeOnClickOverlay: true,
  });
};

const handleLinkValueChange = () => {
  if (value.mode === "link") {
    try {
      // 解析参数
      const parsedParams = parseUrlParams(value.content);

      // 更新URL和noCache状态
      params.url = parsedParams.url;
      params.noCache = parsedParams.noCache;

      // 更新arguments对象
      params.arguments = parsedParams.arguments || {};

      // 将已解析的参数映射到paramsArguments
      paramsArguments.value = Object.entries(params.arguments).map(
        ([key, value]) => ({ key, value: value === true ? "" : value }),
      );

      // 确保UI显示正确的值
      isEditKeyValue.value = true;

      console.log("value.content changed, parsed arguments:", params.arguments);
    } catch (error) {
      console.error("Failed to parse link content:", error);
    }
  }
};

let placeholders =
  sourceType !== "file"
    ? t(`// Example:
// Script Operator
// 1. backend version(>2.14.88):
$server.name = 'prefix-' + $server.name
$server.ecn = true
$server['test-url'] = 'http://1.0.0.1/generate_204'
// 2. operator function
function operator(proxies, targetPlatform) {
  return proxies.map( proxy => {
    // Change proxy information here

    return proxy;
  });
}

// Script Filter
// 1. backend version(>2.14.119):
const port = Number($server.port)
return [80].includes(port)

// 2. filter function
function filter(proxies, targetPlatform) {
  return proxies.map( proxy => {
    // Return true if the current proxy is selected

    return true;
  });
}
`)
    : t(`// Example:
// backend version(>2.14.148):
// $files: ['0', '1']
// $content: '0\\n1'

// produce proxies
// backend version(>2.14.156):
let singboxProxies = await produceArtifact({
    type: 'subscription', // type: 'subscription' 或 'collection'
    name: 'sub', // subscription name
    platform: 'sing-box', // target platform
    produceType: 'internal' // 'internal' produces an Array, otherwise produces a String( JSON.parse('JSON String') )
})

let clashMetaProxies = await produceArtifact({
    type: 'subscription',
    name: 'sub',
    platform: 'ClashMeta',
    produceType: 'internal' // 'internal' produces an Array, otherwise produces a String( ProxyUtils.yaml.safeLoad('YAML String').proxies )
})

// YAML
// ProxyUtils.yaml.load('YAML String')
// ProxyUtils.yaml.safeLoad('YAML String')
// $content = ProxyUtils.yaml.safeDump({})
// $content = ProxyUtils.yaml.dump({})

// Example: insert proxies into YAML
// const yaml = ProxyUtils.yaml.safeLoad($content ?? $files[0])
// let clashMetaProxies = await produceArtifact({
//     type: 'collection',
//     name: '机场',
//     platform: 'ClashMeta',
//     produceType: 'internal'
// })
// yaml.proxies.unshift(...clashMetaProxies)
// $content = ProxyUtils.yaml.dump(yaml)

// JSON
$content = JSON.stringify({}, null, 2)

// { $content, $files } will be passed to the next operator 
// $content is the final content of the file
`);

onMounted(() => {
  const item = form.process.find((item) => item.id === id);
  if (item) {
    value.mode = item.args.mode;
    if (item.args.mode === "script") {
      value.code = item.args.content;
      cmStore.setEditCode(
        id,
        item.args.content ? item.args.content : placeholders,
      );
      if (item.args.arguments) {
        params.arguments = item.args.arguments;
        paramsArguments.value = Object.entries(params.arguments).map(
          ([key, value]) => ({ key, value }),
        );
        showKeyValue.value = true;
      }
    } else {
      value.content = item.args.content;
      const parsedParams = parseUrlParams(value.content);
      params.url = parsedParams.url;
      params.arguments = parsedParams.arguments;
      params.noCache = parsedParams.noCache;
      paramsArguments.value = Object.entries(params.arguments).map(
        ([key, value]) => ({ key, value }),
      );
    }
  }
});

watch(
  paramsArguments,
  (newVal) => {
    console.log("paramsArguments changed:", newVal);
    params.arguments = newVal.reduce((acc, cur) => {
      if (cur.key) {
        acc[cur.key] = cur.value;
      }
      return acc;
    }, {});
    if (value.mode === "link") {
      value.content = buildUrlWithParams(
        params.url,
        params.arguments,
        params.noCache,
      );
    }
    const item = form.process.find((item) => item.id === id);
    item.args.arguments = params.arguments;
  },
  { deep: true },
);

watch(value, () => {
  const item = form.process.find((item) => item.id === id);
  item.args.mode = value.mode;

  if (item.args.mode === "script") {
    item.args.content = value.code;
    !cmStore.CodeClear[id] &&
      cmStore.setEditCode(
        id,
        item.args.content ? item.args.content : placeholders,
      );
    placeholders = " ";

    item.args.arguments = params.arguments;
  } else {
    item.args.content = value.content;

    const parsedParams = parseUrlParams(value.content);
    params.url = parsedParams.url;
    params.arguments = parsedParams.arguments;
    params.noCache = parsedParams.noCache;

    if (!isEditKeyValue.value) {
      paramsArguments.value = Object.entries(params.arguments).map(
        ([key, value]) => ({ key, value }),
      );
      isEditKeyValue.value = true;
    }
  }
});

watch(
  () => params.noCache,
  (newValue) => {
    if (value.mode === "link") {
      value.content = buildUrlWithParams(
        params.url,
        params.arguments,
        newValue,
      );
    }
  },
);

watch(
  () => params.url,
  (newValue) => {
    if (value.mode === "link") {
      value.content = buildUrlWithParams(
        newValue,
        params.arguments,
        params.noCache,
      );
    }
  },
);

watch(
  () => cmStore.EditCode[id],
  (newCode) => {
    value.code = newCode;
  },
);
</script>

<style lang="scss" scoped>
.des-label {
  font-size: 12px;
  margin-bottom: 8px;
  color: var(--comment-text-color);

  &:not(:first-child) {
    margin-top: 16px;
  }
  a {
    color: var(--primary-color);
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
.input-wrapper-title {
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 8px;
  .title-label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--second-text-color);
    padding-right: 8px;
    flex-shrink: 0;
    .icon {
      margin-left: 4px;
      color: var(--unimportant-icon-color);
    }
  }
  span {
    font-size: 12px;
    color: var(--second-text-color);
    padding-left: 4px;
  }
  .button {
    margin-left: auto;
    > div {
      cursor: pointer;
      color: var(--primary-color);
      font-size: 12px;
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

.editor-page-header {
  padding: var(--safe-area-side);
  top: 0;
  display: flex;
  align-items: center;
  height: 56px;

  button {
    background: none;
    border: none;
    font-size: 20px;
    padding: 8px;
    color: var(--danger-color);
    cursor: pointer;

    &.toggle-plaintext-mode {
      margin-left: auto;
    }
  }
}
</style>
