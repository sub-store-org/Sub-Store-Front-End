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

    <!-- <p class="des-label" v-if="value.mode === 'link'">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
    </p> -->
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
    <template v-if="value.mode === 'link' || value.mode === 'script'">
      <div class="input-wrapper-title">
        <div class="title-label">
          <nut-switch v-model="showKeyValue" />
          <span>{{ $t(`editorPage.subConfig.nodeActions['${type}'].paramsEdit`) }}</span>
        </div>
        <div class="title-label">
          <nut-switch v-model="params.noCache" />
          <span>{{ $t(`editorPage.subConfig.nodeActions['${type}'].noCache`) }}</span>
        </div>

        <div v-if="showKeyValue" class="button">
          <div @click="addParameter">{{ $t(`editorPage.subConfig.nodeActions['${type}'].paramsAdd`) }}</div>
        </div>
      </div>
      <div v-if="showKeyValue" class="key-value-container">
        <div class="key-value-box">
          <div class="header">
            <div class="item">key</div>
            <div class="item">value</div>
            <div class="item">{{ $t(`editorPage.subConfig.nodeActions['${type}'].paramsOptions`) }}</div>
          </div>
          <div class="content">
            <div
              v-for="(item, index) in paramsArguments"
              :key="index"
              class="key-value-row"
            >
              <div class="item">
                <nut-textarea
                  v-model="item.key"
                  :border="false"
                  placeholder="key"
                  type="text"
                  :rows="1"
                  autosize
                />
              </div>
              <div class="item">
                <nut-textarea
                  v-model="item.value"
                  :border="false"
                  placeholder="value"
                  type="text"
                  :rows="1"
                  autosize
                />
              </div>
              <div class="item key-value-operation">
                <div @click="deleteItem(index)">{{ $t(`editorPage.subConfig.nodeActions['${type}'].paramsDelete`) }}</div>
              </div>
            </div>
            <div v-if="!paramsArguments.length" class="empty-tips">
              <p>{{ $t(`editorPage.subConfig.nodeActions['${type}'].paramsEmpty`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="value.mode === 'script'"
      style="
        margin-left: -16px;
        margin-right: -16px;
        max-height: 80vh;
        overflow: auto;
      "
    >
      <!-- <div class="input-wrapper"> -->
      <!-- <nut-textarea
          v-model="value.code"
          :placeholder="placeholders"
          :rows="9"
        /> -->
      <!-- <span>
        <font-awesome-icon icon="fa-solid fa-code" />
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].openEditorBtn`) }}
      </span> -->
      <!-- </div> -->
      <!-- <br> -->
      <!-- <span class="editor-page-header">
      <button  @click="pushEditCode">
      <font-awesome-icon icon="fa-solid fa-eraser" />
    </button>
    </span> -->
      <cmView :id="id" :is-read-only="false" />
      <!-- <button
        class="open-editor-btn"
        v-if="value.mode === 'script'"
        @click="pushEditCode"
      >
        <span>
          <font-awesome-icon icon="fa-solid fa-code" />
          前往脚本编辑器
        </span>
      </button> -->
    </div>
    <!-- <nut-textarea
        v-model="value.content"
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].placeholder`)
        "
        :rows="5"
      /> -->

    <!-- function operator(proxies, targetPlatform) {
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
} -->
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

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

const addParameter = () => {
  paramsArguments.value.push({ key: "", value: "" });
};

const deleteItem = (index) => {
  paramsArguments.value.splice(index, 1);
};

const parseUrlParams = (urlStr) => {
  let $arguments = {};
  let noCache = false;
  let url = urlStr || "";

  // 处理没有参数的情况
  if (!url || url.trim() === "") {
    return { url: "", arguments: {}, noCache: false };
  }

  // 安全的URL解码函数
  const safeDecodeURIComponent = (encodedURIComponent) => {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch (e) {
      // 尝试处理嵌套的URL编码（例如 %25252F -> %252F -> %2F -> / )
      let result = encodedURIComponent;
      let previousResult = "";
      let attempts = 0;
      const maxAttempts = 5; // 避免无限循环

      while (result !== previousResult && attempts < maxAttempts) {
        try {
          previousResult = result;
          result = decodeURIComponent(previousResult);
          attempts++;
        } catch (decodeError) {
          return previousResult; // 返回最后一次成功解码的结果
        }
      }
      return result;
    }
  };

  // 处理noCache标记
  if (url.endsWith("#noCache")) {
    url = url.replace(/#noCache$/, "");
    noCache = true;
  }

  // 分割URL和参数
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) {
    // 没有参数
    return { url, arguments: {}, noCache };
  }

  // 获取基本URL和参数部分
  const baseUrl = url.substring(0, hashIndex);
  let paramsSection = url.substring(hashIndex + 1);

  // 检查参数部分是否包含noCache
  if (paramsSection.endsWith("#noCache")) {
    paramsSection = paramsSection.replace(/#noCache$/, "");
    noCache = true;
  } else if (paramsSection === "noCache") {
    return { url: baseUrl, arguments: {}, noCache: true };
  }

  // 尝试解析参数
  try {
    // 先尝试作为JSON解析
    try {
      $arguments = JSON.parse(safeDecodeURIComponent(paramsSection));
    } catch (jsonError) {
      // JSON解析失败，使用&分割参数
      const pairs = paramsSection.split("&");

      for (const pair of pairs) {
        if (!pair) continue;

        const equalIndex = pair.indexOf("=");
        if (equalIndex === -1) {
          // 没有等号，将整个值作为键，值为true
          $arguments[pair] = true;
        } else {
          // 有等号，分割键和值
          const key = pair.substring(0, equalIndex);
          if (!key) continue;

          let value;
          try {
            // 处理值可能被截断的情况
            const encodedValue = pair.substring(equalIndex + 1);
            value = encodedValue ? safeDecodeURIComponent(encodedValue) : "";
          } catch (e) {
            // 如果值解析失败，使用原始编码值
            value = pair.substring(equalIndex + 1) || "";
          }

          $arguments[key] = value;
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse URL parameters:", e);
  }

  return {
    url: baseUrl,
    arguments: $arguments,
    noCache,
  };
};

const buildUrlWithParams = (baseUrl, args, noCache) => {
  let argString = "";
  if (args && Object.keys(args).length > 0) {
    argString = `#${Object.entries(args)
      .map(
        ([key, value]) =>
          `${key}=${encodeURIComponent(value?.toString() ?? "")}`,
      )
      .join("&")}`;
  }
  return `${baseUrl}${argString}${noCache ? "#noCache" : ""}`;
};

const editorIsVisible = ref(false);
usePopupRoute(editorIsVisible);
const value = reactive({
  mode: "",
  content: "",
  code: "",
});

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
    padding-left: 8px;
  }
  span {
    font-size: 12px;
    color: var(--second-text-color);
    padding-left: 8px;
  }
  .button {
    margin-left: auto;
    div {
      cursor: pointer;
      color: var(--primary-color);
      margin: 0 8px;
      font-size: 12px;
    }
  }
}
.key-value-container {
  .key-value-box {
    .header {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      font-size: 14px;
      color: var(--second-text-color);
      padding: 8px 0;
      border-bottom: 1px solid var(--lowest-text-color);
      .item {
        text-align: left;
        padding: 8px 12px;
        &:last-child {
          text-align: center;
        }
      }
    }
    .content {
      .key-value-row {
        display: grid;
        grid-template-columns: 2fr 2fr 1fr;
        padding: 8px 0;
        .item {
          text-align: left;
          display: flex;
          align-items: center;

          :deep(.nut-textarea) {
            width: 100%;
            background: transparent;
            padding: 8px 12px;
            color: var(--second-text-color);

            :deep(.nut-textarea__textarea) {
              color: inherit;
              min-height: unset;
              height: auto;
              overflow: hidden;
            }
          }

          &.key-value-operation {
            display: flex;
            align-items: center;
            justify-content: center;
            div {
              cursor: pointer;
              color: var(--primary-color);
              margin: 0 8px;
            }
          }
        }
      }
      .empty-tips {
        display: flex;
        justify-content: center;
        padding: 8px 0;
        color: var(--comment-text-color);
        p {
          font-size: 12px;
        }
      }
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
