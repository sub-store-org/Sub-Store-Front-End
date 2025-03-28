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
      <div v-if="value.mode === 'link'" class="title-label">
        <nut-switch v-model="params.insecure" />
        <span>
          {{ $t(`editorPage.subConfig.nodeActions['${type}'].insecure`) }}
        </span>
        <font-awesome-icon
          class="icon"
          icon="fa-solid fa-circle-question"
          @click.stop="showInsecureTips"
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
  insecure: false,
});

const paramsArguments = ref([]);

const parseUrlParams = (urlStr) => {
  let $arguments = {} as any;
  let otherArguments = {} as any;
  let noCache = false;
  let insecure = false;
  let url = urlStr?.trim() || "";

  // 处理没有参数的情况
  if (!url) {
    return { url: "", arguments: {}, noCache: false, insecure: false };
  }
  // extract link arguments
  const rawArgs = url.split('#');
  try {
    if (rawArgs.length > 1) {
        try {
            // 支持 `#${encodeURIComponent(JSON.stringify({arg1: "1"}))}`
            $arguments = JSON.parse(decodeURIComponent(rawArgs[1]));
        } catch (e) {
            for (const pair of rawArgs[1].split('&')) {
                const key = pair.split('=')[0];
                const value = pair.split('=')[1];
                // 部分兼容之前的逻辑 const value = pair.split('=')[1] || true;
                $arguments[key] =
                    value == null || value === ''
                        ? true
                        : decodeURIComponent(value);
            }
        }
    }
  } catch (e) {
    console.error("Failed to parse URL parameters:", e);
    $arguments = {};
  }
  try {
    if (rawArgs.length > 2) {
      for (const pair of rawArgs[2].split('&')) {
          const key = pair.split('=')[0];
          const value = pair.split('=')[1];
          // 部分兼容之前的逻辑 const value = pair.split('=')[1] || true;
          otherArguments[key] =
              value == null || value === ''
                  ? true
                  : decodeURIComponent(value);
      }
      noCache = otherArguments?.noCache;
      insecure = otherArguments?.insecure;
    } else if ($arguments?.noCache != null || $arguments?.insecure != null) {
      noCache = $arguments?.noCache;
      insecure = $arguments?.insecure;
      delete $arguments?.noCache;
      delete $arguments?.insecure;
    }
  } catch (e) {
    console.error("Failed to parse additional URL parameters:", e);
  }

  return {
    url: url.split('#')[0],
    arguments: $arguments,
    noCache,
    insecure,
  };
};

const buildUrlWithParams = (baseUrl, args, noCache, insecure) => {
  if (!baseUrl) {
    if(noCache && insecure){
      return "##noCache&insecure"
    }else if(noCache){
      return "##noCache"
    }else if(insecure){
      return "##insecure"
    } else {
      return ""
    }
  }

  const validArgs = args && typeof args === "object" && Object.keys(args).length > 0;

  // 如果没有参数且不需要noCache，直接返回baseUrl
  if (!validArgs && !noCache && !insecure) return baseUrl;

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
  if (noCache && insecure) {
    result += "#noCache&insecure";
  }else if (noCache) {
    result += "#noCache";
  }else if (insecure) {
    result += "#insecure";
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
const showInsecureTips = () => {
  Dialog({
    title: t(`editorPage.subConfig.nodeActions['${type}'].helpTitle`),
    content: t(`editorPage.subConfig.nodeActions['${type}'].insecureTips`),
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
      params.insecure = parsedParams.insecure;

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
      params.insecure = parsedParams.insecure;
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
        params.insecure,
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
    params.insecure = parsedParams.insecure;

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
        params.insecure,
      );
    }
  },
);
watch(
  () => params.insecure,
  (newValue) => {
    if (value.mode === "link") {
      value.content = buildUrlWithParams(
        params.url,
        params.arguments,
        params.noCache,
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
        params.insecure,
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
