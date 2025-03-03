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
    <nut-radiogroup direction="horizontal" v-model="value.mode">
      <nut-radio v-for="(key, index) in modeList" :label="key" :key="index">
        {{
          $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`)
        }}
      </nut-radio>
    </nut-radiogroup>

    <!-- <p class="des-label" v-if="value.mode === 'link'">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
    </p> -->
    <div class="input-wrapper" v-if="value.mode === 'link'">
      <nut-textarea
        v-model="value.content"
        :placeholder="
          $t(`editorPage.subConfig.nodeActions['${type}'].placeholder`)
        "
        :rows="5"
      />
    </div>
    <div class="input-wrapper-title">
      <nut-switch v-model="showKeyValue" />
      <span>可视化参数编辑</span>
      <div class="button">
        <div @click="addParameter">添加参数</div>
      </div>
    </div>
    <div v-if="showKeyValue" class="key-value-container">
      <div class="key-value-box">
        <div class="header">
          <div class="item">key</div>
          <div class="item">value</div>
          <div class="item">操作</div>
        </div>
        <div class="content">
          <div
            v-for="(item, index) in paramsArguments"
            :key="index"
            class="key-value-row"
          >
            <div class="item">
              <nut-input v-model="item.key" :border="false" placeholder="key" />
            </div>
            <div class="item">
              <nut-input
                v-model="item.value"
                :border="false"
                placeholder="value"
              />
            </div>
            <div class="item key-value-operation">
              <div @click="deleteItem(index)">删除</div>
            </div>
          </div>
        </div>
      </div>
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
      <cmView :isReadOnly="false" :id="id" />
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
import { inject, reactive, onMounted, watch, ref, toRaw, computed } from "vue";
import { usePopupRoute } from "@/hooks/usePopupRoute";
// import MonacoEditor from '@/views/editor/components/MonacoEditor.vue';
// import { useRouter } from "vue-router";
// import { Dialog } from "@nutui/nutui";
import { useI18n } from "vue-i18n";
import cmView from "@/views/editCode/cmView.vue";
import { useCodeStore } from "@/store/codeStore";
const cmStore = useCodeStore();

// const router = useRouter();
const { type, id, sourceType } = defineProps<{
  type: string;
  id: string;
  sourceType?: string;
}>();

const { t } = useI18n();

const form = inject<Sub | Collection>("form");

const modeList = ["link", "script"];

const showKeyValue = ref(false);

const isEditKeyValue = ref(true);

const params = reactive({
  url: '',
  arguments: {},
  noCache: false,
});

// 返回arguments,构造json
// {
//  "key": "name",
//  "value": "value"
// }
//
const paramsArguments = ref([]);

const addParameter = () => {
  paramsArguments.value.push({ key: "", value: "" });
};

const deleteItem = (index) => {
  paramsArguments.value.splice(index, 1);
};

// 监听参数变化
// watch(paramsArguments, (newVal) => {
//   params.arguments = newVal.reduce((acc, cur) => {
//     acc[cur.key] = cur.value;
//     return acc;
//   }, {});
// });

const editorIsVisible = ref(false);
usePopupRoute(editorIsVisible);
const value = reactive({
  mode: "",
  content: "",
  code: "",
});

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
// const onCloseEditor = (val) => {
//   // value.code = val;
//   editorIsVisible.value = false;
//   router.back();
// };

// 挂载时将 value 值指针指向 form 对应的数据
onMounted(() => {
  const item = form.process.find((item) => item.id === id);
  if (item) {
    value.mode = item.args.mode;
    if (item.args.mode === "script") {
      value.code = item.args.content;
      cmStore.setEditCode(
        id,
        item.args.content ? item.args.content : placeholders
      );
    } else {
      value.content = item.args.content;
    }
  }
});

watch(value, () => {
  const item = form.process.find((item) => item.id === id);
  item.args.mode = value.mode;
  if (item.args.mode === "script") {
    item.args.content = value.code;
    !cmStore.CodeClear[id] && // 判断清除状态
      cmStore.setEditCode(
        id,
        item.args.content ? item.args.content : placeholders
      );
    placeholders = " ";
  } else {
    item.args.content = value.content;
    // 1. 从 URL 中提取参数
    let $arguments = {};
    let noCache;
    let url = value.content || '';
    if (url.endsWith('#noCache')) {
      url = url.replace(/#noCache$/, '');
      noCache = true;
    }
    // extract link arguments
    const rawArgs = url.split('#');
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
    params.url = url.split('#')[0];
    params.arguments = $arguments; // 传入脚本的参数, 可以增删改
    params.noCache = noCache; // 不缓存
    console.log('params', params)
    console.log('paramsArguments', paramsArguments.value)
    // 当item.args.content改变的时候, 也要改变paramsArguments.value
    paramsArguments.value = Object.entries(params.arguments).map(([key, value]) => ({ key, value }));


    // // 2. params 变化后的逻辑, 应该写到 watch 里
    // // 2.1 如果是远程链接, 组成新的 URL, 写回 value.content
    if(item.args.mode === "link") {
      const newUrl = `${params.url}${params.arguments ? `#${Object.entries(params.arguments).map(([key, value]) => `${key}=${encodeURIComponent(value?.toString() ?? '')}`).join('&')}` : ''}${params.noCache ? '#noCache' : ''}`
      console.log(newUrl)
      value.content = newUrl
    } else {
    // 2.2 如果是本地脚本, 则将参数写入 value.arguments. 这样本地脚本也能用参数了(后端需适配)
      value.arguments = params.arguments
    }
  }
});

watch(
  () => cmStore.EditCode[id],
  (newCode) => {
    value.code = newCode;
  }
);

// const pushEditCode = () => {
//   cmStore.setEditCode(id,value.code ? value.code : placeholders);
//   router.push(`/edit/Script/${id}`);
// };
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
  span {
    font-size: 14px;
    color: var(--second-text-color);
    padding-left: 8px;
  }
  .button {
    margin-left: auto;
    div {
      cursor: pointer;
      color: var(--primary-color);
      margin: 0 8px;
    }
  }
}
.key-value-container {
  .key-value-box {
    .header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      font-size: 14px;
      color: var(--second-text-color);
      padding: 8px 0;
      border-bottom: 1px solid var(--lowest-text-color);
      .item {
        text-align: center;
      }
    }
    .content {
      .key-value-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 8px 0;
        // border-bottom: 1px solid var(--lowest-text-color);
        .item {
          text-align: center;
          :deep(.nut-input) {
            background: transparent;
            padding: 8px 12px;
            // border-bottom: 1px solid;
            color: var(--second-text-color);
            // border-color: var(--lowest-text-color);
            :deep(input) {
              color: inherit;
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
  // position: sticky;
  top: 0;
  // z-index: 19;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  height: 56px;
  // color: #951b1bee;
  // background: #272823;

  // h1 {
  //   font-size: 20px;
  //   line-height: 1;
  //   font-weight: 500;

  //   span {
  //     font-size: 12px;
  //     margin-left: 8px;
  //     color: #84494988;
  //   }

  //   svg {
  //     margin-right: 6px;
  //     width: 20px;
  //     height: 20px;
  //   }
  // }

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
