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
import { inject, reactive, onMounted, watch, ref, toRaw } from "vue";
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
