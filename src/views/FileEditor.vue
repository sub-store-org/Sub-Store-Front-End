<template>
  <div v-if="isDis">
    <div class="page-wrapper" @click="handleEditGlobalClick">
      <!-- 基础表单 -->
      <div class="form-block-wrapper">
        <div v-if="appearanceSetting.isShowIcon" class="sticky-title-icon-container">
          <nut-image
            :class="{ 'sub-item-customer-icon': !isIconColor }"
            :src="fileIcon"
            fit="cover"
            show-loading
            @click="showIconPopup"
          />
        </div>
        <nut-form class="form" :model-value="form" ref="ruleForm">
          <!-- name -->
          <nut-form-item
            required
            :label="$t(`editorPage.subConfig.basic.name.label`)"
            prop="name"
            :rules="[
              {
                required: true,
                message: $t(`editorPage.subConfig.basic.name.isEmpty`),
              },
              {
                validator: nameValidator,
                message: $t(`editorPage.subConfig.basic.name.isInvalid`),
              },
            ]"
          >
            <input
              class="nut-input-text"
              data-1p-ignore
              @blur="customerBlurValidate('name')"
              v-model.trim="form.name"
              :placeholder="$t(`editorPage.subConfig.basic.name.placeholder`)"
              type="text"
            />
          </nut-form-item>
          <!-- displayName -->
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.displayName.label`)"
            prop="displayName"
          >
            <input
              class="nut-input-text"
              data-1p-ignore
              v-model.trim="form.displayName"
              :placeholder="$t(`editorPage.subConfig.basic.displayName.placeholder`)"
              type="text"
            />
          </nut-form-item>
          <!-- remark -->
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.remark.label`)"
            prop="remark"
          >
            <nut-textarea
              class="nut-input-text"
              :border="false"
              v-model="form.remark"
              :placeholder="$t(`editorPage.subConfig.basic.remark.placeholder`)"
              type="text"
              input-align="right"
              rows="1"
              :autosize="{ maxHeight: 140 }"
              max-length="100"
            />
          </nut-form-item>
          <nut-form-item
            :label="$t(`filePage.download.label`)"
            prop="download"
            class="ignore-failed-wrapper"
          >
            <div class="switch-wrapper">
              <nut-switch v-model="form.download" />
            </div>
          </nut-form-item>
          <!-- icon -->
          <nut-form-item :label="$t(`editorPage.subConfig.basic.icon.label`)" prop="icon">
            <nut-input
              :border="false"
              class="nut-input-text"
              v-model.trim="form.icon"
              :placeholder="$t(`editorPage.subConfig.basic.icon.placeholder`)"
              type="text"
              input-align="right"
              left-icon="shop"
              @click-left-icon="showIconPopup"
            />
          </nut-form-item>
          <!-- isIconColor -->
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.isIconColor.label`)"
            prop="isIconColor"
            class="ignore-failed-wrapper"
          >
            <div class="switch-wrapper">
              <nut-switch v-model="form.isIconColor" />
            </div>
          </nut-form-item>
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.subInfoUrl.label`)"
            prop="subInfoUrl"
          >
            <input
              class="nut-input-text"
              data-1p-ignore
              v-model.trim="form.subInfoUrl"
              :placeholder="$t(`editorPage.subConfig.basic.subInfoUrl.placeholder`)"
              type="text"
            />
          </nut-form-item>
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.subInfoUserAgent.label`)"
            prop="subInfoUserAgent"
          >
            <input
              class="nut-input-text"
              data-1p-ignore
              v-model.trim="form.subInfoUserAgent"
              :placeholder="
                $t(`editorPage.subConfig.basic.subInfoUserAgent.placeholder`)
              "
              type="text"
            />
          </nut-form-item>
          <nut-form-item required :label="$t(`specificWord.type`)" prop="type">
            <div class="radio-wrapper">
              <nut-radiogroup v-model="form.type" direction="horizontal">
                <nut-radio shape="button" label="mihomoProfile">
                  {{ $t(`filePage.type.mihomoProfile`) }}
                </nut-radio>
                <nut-radio shape="button" label="file">
                  {{ $t(`specificWord.file`) }}
                </nut-radio>
              </nut-radiogroup>
            </div>
          </nut-form-item>
          <template v-if="form.type === 'mihomoProfile'">
            <nut-form-item
              required
              :label="$t(`editorPage.subConfig.basic.source.label`)"
              prop="source"
            >
              <div class="radio-wrapper">
                <nut-radiogroup
                  v-model="form.sourceType"
                  direction="horizontal"
                  @change="handleTypeChange"
                >
                  <nut-radio shape="button" label="subscription">
                    {{ $t(`specificWord.singleSub`) }}
                  </nut-radio>
                  <nut-radio shape="button" label="collection">
                    {{ $t(`specificWord.collectionSub`) }}
                  </nut-radio>
                  <nut-radio shape="button" label="none">
                    {{ $t(`specificWord.none`) }}
                  </nut-radio>
                </nut-radiogroup>
              </div>
            </nut-form-item>
            <nut-form-item
              v-if="form.sourceType !== 'none'"
              required
              :label="$t(`tabBar.sub`) + $t(`editorPage.subConfig.basic.name.label`)"
              prop="sourceName"
              :rules="[
                {
                  required: true,
                  message: $t(`editorPage.subConfig.basic.name.isEmpty`),
                },
              ]"
            >
              <nut-input
                class="nut-input-text"
                :border="false"
                data-1p-ignore
                @blur="customerBlurValidate('name')"
                input-align="right"
                v-model.trim="form.sourceName"
                :placeholder="(form.sourceType === 'subscription' ? $t(`specificWord.singleSub`) : $t(`specificWord.collectionSub`))+$t(`editorPage.subConfig.basic.name.label`)"
                type="text"
                right-icon="rect-right"
                @click-right-icon="showSourceName"
              />
            </nut-form-item>
          </template>
          <template v-else>
            <nut-form-item
              required
              :label="$t(`editorPage.subConfig.basic.source.label`)"
              prop="source"
            >
              <div class="radio-wrapper">
                <nut-radiogroup direction="horizontal" v-model="form.source">
                  <nut-radio shape="button" label="remote">
                    {{ $t(`filePage.source.remote`) }}
                  </nut-radio>
                  <nut-radio shape="button" label="local">
                    {{ $t(`filePage.source.local`) }}
                  </nut-radio>
                </nut-radiogroup>
              </div>
            </nut-form-item>
            <nut-form-item
              required
              v-if="form.source === 'remote'"
              :label="$t(`editorPage.subConfig.basic.url.label`)"
              prop="url"
              :rules="[
                {
                  required: true,
                  message: $t(`filePage.url.isEmpty`),
                },
                {
                  validator: urlValidator,
                  message: $t(`filePage.url.isIllegal`),
                },
              ]"
            >
              <nut-textarea
                class="textarea-wrapper"
                @blur="customerBlurValidate('url')"
                v-model="form.url"
                :autosize="{ maxHeight: 110, minHeight: 50 }"
                :placeholder="$t(`filePage.url.placeholder`)"
                type="text"
              />
            </nut-form-item>
            <nut-form-item
              v-else-if="form.source === 'local'"
              :label="undefined"
              prop="content"
            >
              <!-- <nut-textarea
              class="textarea-wrapper"
              v-model="form.content"
              text-align="left"
              :autosize="{ maxHeight: 410, minHeight: 50 }"
              :placeholder="$t(`filePage.content.placeholder`)"
              type="text"
            /> -->

              <button class="cimg-button" @click="isDis = false">
                <img src="" />
                {{ $t(`editorPage.subConfig.basic.url.tips.fullScreenEdit`) }}
                <!-- 测试 后续再改效果 -->
              </button>
              <input
                type="file"
                ref="fileInput"
                @change="fileChange"
                style="display: none"
              />
              <button class="cimg-button" @click="upload">
                {{ $t(`editorPage.subConfig.basic.url.tips.importFromFile`) }}
              </button>
              <div
                style="
                  margin-left: -15px;
                  margin-right: -15px;
                  max-height: 60vh;
                  overflow: auto;
                "
              >
                <cmView :isReadOnly="false" id="FileEditer" />
              </div>
            </nut-form-item>
            <!-- ua -->
            <nut-form-item
              :label="$t(`editorPage.subConfig.basic.ua.label`)"
              prop="ua"
              v-if="form.source === 'remote'"
            >
              <input
                class="nut-input-text"
                v-model.trim="form.ua"
                :placeholder="$t(`editorPage.subConfig.basic.ua.placeholder`)"
                type="text"
              />
            </nut-form-item>
            <nut-form-item
              :label="$t(`editorPage.subConfig.basic.proxy.label`)"
              prop="proxy"
            >
              <nut-input
                :border="false"
                class="nut-input-text"
                v-model.trim="form.proxy"
                :placeholder="$t(`editorPage.subConfig.basic.proxy.placeholder`)"
                type="text"
                input-align="right"
                left-icon="tips"
                @click-left-icon="proxyTips"
              />
            </nut-form-item>
            <nut-form-item
              :label="$t(`editorPage.subConfig.basic.source.mergeSources`)"
              prop="mergeSources"
            >
              <div class="radio-wrapper">
                <nut-radiogroup direction="horizontal" v-model="form.mergeSources">
                  <nut-radio shape="button" label="">
                    {{ $t(`editorPage.subConfig.basic.source.noMerge`) }}
                  </nut-radio>
                  <nut-radio shape="button" label="localFirst">
                    {{ $t(`editorPage.subConfig.basic.source.localFirst`) }}
                  </nut-radio>
                  <nut-radio shape="button" label="remoteFirst">
                    {{ $t(`editorPage.subConfig.basic.source.remoteFirst`) }}
                  </nut-radio>
                </nut-radiogroup>
              </div>
            </nut-form-item>
            <nut-form-item
              :label="$t(`filePage.ignoreFailedRemoteFile.label`)"
              prop="ignoreFailedRemoteFile"
              class="ignore-failed-wrapper"
            >
              <!-- <div class="switch-wrapper">
                <nut-switch v-model="form.ignoreFailedRemoteFile" />
              </div> -->
              <div class="radio-wrapper">
                <nut-radiogroup direction="horizontal" v-model="form.ignoreFailedRemoteFile">
                  <nut-radio shape="button" label="disabled">
                    {{ $t(`filePage.ignoreFailedRemoteFile.disabled`) }}
                  </nut-radio>
                  <nut-radio shape="button" label="quiet">
                    {{ $t(`filePage.ignoreFailedRemoteFile.quiet`) }}
                  </nut-radio>
                  <nut-radio shape="button" label="enabled">
                    {{ $t(`filePage.ignoreFailedRemoteFile.enabled`) }}
                  </nut-radio>
                
                </nut-radiogroup>
              </div>
            </nut-form-item>
          </template>
        </nut-form>
      </div>
      <div class="sticky-title-wrapper actions-title-wrapper" v-if="form.type === 'mihomoProfile'">
        <p>{{ $t(`filePage.type.mihomoProfileTips2`) }}</p>
        <small class="doc"><a href="https://mihomo.party/docs/guide/override">{{ $t("subPage.panel.tips.ok") }}</a></small>
      </div>
      <ActionBlock
        ref="actionBlockRef"
        :checked="actionsChecked"
        :list="actionsList"
        sourceType="file"
        @updateCustomNameModeFlag="updateCustomNameModeFlag"
        @addAction="addAction"
        @deleteAction="deleteAction"
        @toggleAction="toggleAction"
      />
    </div>

    <div class="bottom-btn-wrapper">
      <nut-button @click="compare" class="compare-btn btn" plain shape="square">
        <font-awesome-icon icon="fa-solid fa-eye" />
        {{ $t("editorPage.subConfig.btn.compare") }}
      </nut-button>
      <nut-button @click="submit" class="submit-btn btn" type="primary" shape="square">
        <font-awesome-icon icon="fa-solid fa-floppy-disk" />
        {{ $t("editorPage.subConfig.btn.save") }}
      </nut-button>
    </div>
  </div>

  <div v-else style="width: 100%; height: 95vh">
    <button class="cimg-button" @click="isDis = true">
      <img src="" />
      {{ $t(`editorPage.subConfig.basic.url.tips.fullScreenEditCancel`) }}
    </button>
    <cmView :isReadOnly="false" id="FileEditer" />
  </div>
  <FilePreview
    v-if="filePreviewIsVisible"
    :name="configName"
    :previewData="previewData"
    @closePreview="closePreview"
  />
  <icon-popup v-model:visible="iconPopupVisible" ref="iconPopupRef" @setIcon="setIcon">
  </icon-popup>
  <!-- 订阅名称 -->
  <nut-picker
    :key="sourceNameColumns.length"
    v-model="selectSourceName"
    v-model:visible="showSourceNamePicker"
    :columns="sourceNameColumns"
    :title="$t(`editorPage.subConfig.sourceNamePicker.title`)"
    :cancel-text="$t(`editorPage.subConfig.sourceNamePicker.cancel`)"
    :ok-text="$t(`editorPage.subConfig.sourceNamePicker.confirm`)"
    @confirm="handleSourceNameConfirm"
  >
    <div v-if="!sourceNameColumns.length" class="empty-tips" @click="goAddSub">
      <p>{{ t(`editorPage.subConfig.sourceNamePicker.emptyTips`) }}</p>
    </div>
  </nut-picker>
</template>

<script lang="ts" setup>
import { useArtifactsStore } from "@/store/artifacts";
import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import { useSubsApi } from "@/api/subs";
import { useFilesApi } from "@/api/files";
import { usePopupRoute } from "@/hooks/usePopupRoute";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import ActionBlock from "@/views/editor/ActionBlock.vue";
import { addItem, deleteItem, toggleItem } from "@/utils/actionsOperate";
import { actionsToProcess } from "@/utils/actionsToPorcess";
import Script from "@/views/editor/components/Script.vue";
import IconPopup from "@/views/icon/IconPopup.vue";
import FilePreview from "@/views/FilePreview.vue";
import { initStores } from "@/utils/initApp";
import { Dialog, Toast } from "@nutui/nutui";
import { storeToRefs } from "pinia";
import {
  computed,
  provide,
  reactive,
  ref,
  shallowRef,
  toRaw,
  watchEffect,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import cmView from "@/views/editCode/cmView.vue";
import { useCodeStore } from "@/store/codeStore";
import clashmetaIcon from '@/assets/icons/clashmeta_color.png';

const cmStore = useCodeStore();
const isDis = ref(true);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const subsApi = useSubsApi();
const filesApi = useFilesApi();
const configName = route.params.id as string;
const subsStore = useSubsStore();
const { showNotify } = useAppNotifyStore();

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const { bottomSafeArea } = storeToRefs(globalStore);
const { subs, collections } = storeToRefs(subsStore);
const { appearanceSetting } = storeToRefs(settingsStore);
const padding = bottomSafeArea.value + "px";

let scrollTop = 0;

const file = computed(() => subsStore.getOneFile(configName));
const filePreviewIsVisible = ref(false);
usePopupRoute(filePreviewIsVisible);
const previewData = ref();
const isInit = ref(false);
const ruleForm = ref<any>(null);
const actionsChecked = reactive([]);
const actionsList = reactive([]);
const isget = ref(false);
const fileInput = ref(null);
const form = reactive<any>({
  name: "",
  displayName: "",
  remark: "",
  icon: "",
  isIconColor: true,
  source: "local",
  sourceType: "collection",
  sourceName: "",
  process: [],
  type: configName === 'UNTITLED-mihomoProfile' ? 'mihomoProfile' : 'file',
});
provide("form", form);
// 排除非动作卡片
const ignoreList = ["Quick Setting Operator"];
// 订阅名称
const showSourceNamePicker = ref(false);
const selectSourceName = computed(() => [form.sourceName]);
const sourceNameColumns = computed(() => {
  const list =
    form.sourceType === "collection" ? subsStore.collections : subsStore.subs;
  if (!list || list.length === 0) {
    return [];
  }
  return list.map((item) => {
    return {
      text: item.displayName ? `${item.displayName}` : item.name,
      value: item.name,
    };
  });
});
const handleTypeChange = (val) => {
  form.sourceName = "";
};
const showSourceName = () => {
  showSourceNamePicker.value = true;
};
const handleSourceNameConfirm = ({ selectedValue, selectedOptions }) => {
  if (selectedValue[0]) {
    form.sourceName = selectedValue[0];
  }
  showSourceNamePicker.value = false;
};
const goAddSub = () => {
  router.push("/subs");
};
watch(
  () => cmStore.EditCode["FileEditer"],
  (newCode) => {
    form.content = newCode;
  }
);

watchEffect(() => {
  if (isInit.value) return;
  if (['UNTITLED', 'UNTITLED-mihomoProfile'].includes(configName)) {
    const fc = "// " + t(`filePage.content.placeholder`) + "\n";
    cmStore.setEditCode("FileEditer", fc);
    // 标记 加载完成
    isInit.value = true;
    return;
  }

  const sourceData: any = toRaw(file.value);
  if (sourceData) {
    if (!Array.isArray(sourceData.process)) {
      sourceData.process = [];
    }
    form.name = sourceData.name;
    form.displayName = sourceData.displayName || sourceData["display-name"];
    form.remark = sourceData.remark;
    form.icon = sourceData.icon;
    form.isIconColor = sourceData.isIconColor !== false;
    form.source = sourceData.source || "local";
    form.type = sourceData.type || 'file';
    form.sourceType = sourceData.sourceType || 'collection';
    form.sourceName = sourceData.sourceName;
    form.url = sourceData.url;
    form.subInfoUrl = sourceData.subInfoUrl;
    form.subInfoUserAgent = sourceData.subInfoUserAgent;
    form.proxy = sourceData.proxy;
    form.ua = sourceData.ua;
    form.mergeSources = sourceData.mergeSources;
    form.content = sourceData.content;
    cmStore.setEditCode("FileEditer", sourceData.content);
    let ignoreFailedRemoteFile = sourceData.ignoreFailedRemoteFile;
    if (ignoreFailedRemoteFile === true) {
      ignoreFailedRemoteFile = 'quiet';
    } else if (ignoreFailedRemoteFile === false || ignoreFailedRemoteFile == null) {
      ignoreFailedRemoteFile = 'disabled';
    }
    form.ignoreFailedRemoteFile = ignoreFailedRemoteFile;
    form.download = sourceData.download;
    const newProcess = JSON.parse(JSON.stringify(sourceData.process));
    form.process = newProcess;
    if (sourceData.process.length > 0) {
      form.process.forEach((item) => {
        const { type, id, customName, disabled } = item;
        actionsChecked.push([id, true]);
        const action = {
          type,
          id,
          customName,
          tipsDes: t(`editorPage.subConfig.nodeActions['${type}'].tipsDes`),
          component: null,
          enabled: !disabled,
        };
        switch (type) {
          case "Script Operator":
            action.component = shallowRef(Script);
            break;
          default:
            break;
        }
        actionsList.push(action);
      });
    }
    // 标记 加载完成
    isInit.value = true;
    console.log('form', form);
    return;
  }
});

const addAction = (val) => {
  addItem(form, actionsList, actionsChecked, val, t);
};

const deleteAction = (id) => {
  deleteItem(form, actionsList, actionsChecked, id);
};

const toggleAction = (id) => {
  toggleItem(actionsList, id);
};

const closePreview = () => {
  document.querySelector("html").style["overflow-y"] = "";
  document.querySelector("html").style.height = "";
  document.body.style.height = "";
  document.body.style["overflow-y"] = "";
  (document.querySelector("#app") as HTMLElement).style["overflow-y"] = "";
  (document.querySelector("#app") as HTMLElement).style.height = "";

  filePreviewIsVisible.value = false;

  window.scrollTo({
    top: scrollTop,
    behavior: "instant" as any,
  });

  router.back();
};
const upload = async () => {
  try {
    fileInput.value.click();
  } catch (e) {
    console.error(e);
  }
};
const fileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      cmStore.setEditCode("FileEditer", String(reader.result));
    };

    reader.onerror = (e) => {
      throw e;
    };
  } catch (e) {
    showNotify({
      type: "danger",
      title: "文件导入失败",
    });
    console.error(e);
  }
};
const compare = () => {
  ruleForm.value.validate().then(async ({ valid, errors }: any) => {
    // 如果验证失败
    if (!valid) {
      Dialog({
        title: t(`editorPage.subConfig.pop.errorTitle`),
        content: errors[0].message,
        popClass: "auto-dialog",
        noCancelBtn: true,
        okText: t(`editorPage.subConfig.pop.errorBtn`),
        // @ts-ignore
        closeOnClickOverlay: true,
      });
      return;
    }

    Toast.loading("生成中...", { id: "compare", cover: true, duration: 1500 });
    const data: any = JSON.parse(JSON.stringify(toRaw(form)));
    data.process = actionsToProcess(data.process, actionsList, ignoreList);
    if (data.ignoreFailedRemoteFile === "disabled"){
      data.ignoreFailedRemoteFile = false;
    }

    // 过滤掉预览开关关闭的操作
    actionsChecked.forEach((item) => {
      if (!item[1]) {
        const index = data.process.findIndex((i) => i.id === item[0]);
        if (index > -1) {
          data.process.splice(index, 1);
        }
      }
    });

    const res = await subsApi.compareSub("file", data);
    if (res?.data?.status === "success") {
      previewData.value = res.data.data;

      scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      globalStore.setSavedPositions(route.path, { left: 0, top: scrollTop });

      document.querySelector("html").style["overflow-y"] = "hidden";
      document.querySelector("html").style.height = "100%";
      document.body.style.height = "100%";
      document.body.style["overflow-y"] = "hidden";
      (document.querySelector("#app") as HTMLElement).style["overflow-y"] = "hidden";
      (document.querySelector("#app") as HTMLElement).style.height = "100%";

      filePreviewIsVisible.value = true;
      Toast.hide("compare");
    }
  });
};

const submit = () => {
  if (isget.value) {
    showNotify({
      type: "success",
      title: "请勿重复点击...",
    });
    return;
  }
  ruleForm.value.validate().then(async ({ valid, errors }: any) => {
    isget.value = true;
    // 如果验证失败
    if (!valid) {
      isget.value = false;
      Dialog({
        title: t(`editorPage.subConfig.pop.errorTitle`),
        content: errors[0].message,
        popClass: "auto-dialog",
        noCancelBtn: true,
        okText: t(`editorPage.subConfig.pop.errorBtn`),
        // @ts-ignore
        closeOnClickOverlay: true,
      });
      return;
    }
    Toast.loading("...", { id: "submits", cover: true, duration: 1500 });
    // 如果验证成功，开始保存/修改
    const data: any = JSON.parse(JSON.stringify(toRaw(form)));
    data["display-name"] = data.displayName;
    data.process = actionsToProcess(data.process, actionsList, ignoreList);
    if (data.ignoreFailedRemoteFile === "disabled"){
      data.ignoreFailedRemoteFile = false;
    }

    let res = null;

    if (['UNTITLED', 'UNTITLED-mihomoProfile'].includes(configName)) {
      res = await filesApi.createFile(data);
      await subsStore.fetchSubsData();
      if (data.source === "remote") await initStores(false, true, false);
    } else {
      res = await filesApi.editFile(configName, data);

      if (configName === data.name) {
        // @ts-ignore
        await subsStore.updateOneData("files", configName);
      } else {
        await subsStore.fetchSubsData();
        await useArtifactsStore().fetchArtifactsData();
      }
    }

    if (res?.data?.status === "success") {
      router.replace("/files").then(() => {
        if (res)
          showNotify({
            type: "success",
            title: t(`editorPage.subConfig.pop.succeedMsg`),
          });
      });
    }
    isget.value = false;
    Toast.hide("submits");
  });
};
const proxyTips = () => {
  Dialog({
    title: "通过代理/节点/策略获取远程文件",
    content:
      '1. Surge(参数 policy/policy-descriptor)\n\n可设置节点代理 例: Test = snell, 1.2.3.4, 80, psk=password, version=4\n\n或设置策略/节点 例: 国外加速\n\n2. Loon(参数 node)\n\nLoon 官方文档: \n\n指定该请求使用哪一个节点或者策略组（可以使节点名称、策略组名称，也可以说是一个Loon格式的节点描述，如：shadowsocksr,example.com,1070,chacha20-ietf,"password",protocol=auth_aes128_sha1,protocol-param=test,obfs=plain,obfs-param=edge.microsoft.com）\n\n3. Stash(参数 headers["X-Surge-Policy"])/Shadowrocket(参数 headers.X-Surge-Policy)/QX(参数 opts.policy)\n\n可设置策略/节点\n\n4. Node.js 版(http/https/socks5):\n\n例: socks5://a:b@127.0.0.1:7890\n\n※ 优先级由高到低: 文件配置, 默认配置\n\n完整说明 请查看 https://t.me/zhetengsha/1843',
    popClass: "auto-dialog",
    textAlign: "left",
    okText: "OK",
    noCancelBtn: true,
    closeOnPopstate: true,
    lockScroll: false,
  });
};
// 图标
const fileIcon = computed(() => {
  if (form.icon) {
    return form.icon;
  } else {
    if (form.type === 'mihomoProfile') return clashmetaIcon;
    return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon;
  }
});
const isIconColor = computed(() => {
  return form.isIconColor;
});
const iconPopupVisible = ref(false);
const iconPopupRef = ref(null);
const showIconPopup = () => {
  iconPopupVisible.value = true;
};
const setIcon = (icon: any) => {
  form.icon = icon.url;
};
const iconTips = () => {
  router.push(`/icon/collection`);
};
// 名称验证器
const nameValidator = (val: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (['UNTITLED', 'UNTITLED-mihomoProfile'].includes(val)) resolve(false);
    if (/\//.test(val)) {
      resolve(false);
    }
    const nameList = subsStore.files.map((item) => item.name);
    nameList.includes(val) && configName !== val ? resolve(false) : resolve(true);
  });
};

// url 格式验证器
const urlValidator = (val: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (/\n/.test(val)) {
      resolve(
        val
          .split(/[\r\n]+/)
          .map((i) => i.trim())
          .filter((i) => i.length)
          .every((i) => /^(http|https):\/\/\S+$/.test(i) || /^\/api\/(file|module)\/(.+)/.test(i) || /^\/.+/.test(i))
      );
    } else {
      resolve(/^(http|https):\/\/\S+$/.test(val) || /^\/api\/(file|module)\/(.+)/.test(val) || /^\/.+/.test(val));
    }
  });
};
// 失去焦点触发验证
const customerBlurValidate = (prop: string) => {
  ruleForm.value.validate(prop);
};
const actionBlockRef = ref(null);
const customNameModeFlag = ref(false);
const updateCustomNameModeFlag = (flag) => (customNameModeFlag.value = flag);
const handleEditGlobalClick = () => {
  if (actionBlockRef.value) {
    if (customNameModeFlag.value) {
      // exit
      actionBlockRef.value.exitAllEditName();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0 var(--safe-area-side) calc(v-bind("padding") + 63px) var(--safe-area-side);

  :deep(.nut-cell-group__warp) {
    border-radius: var(--item-card-radios);
  }

  :deep(.nut-icon-tips:before),
  :deep(.nut-icon-shop:before) {
    cursor: pointer;
  }
}

.radio-wrapper {
  display: flex;
  justify-content: end;

  :deep(.nut-radio__button.false) {
    background: var(--divider-color);
    border-color: transparent;
    color: var(--second-text-color);
  }

  :deep(.nut-radio__button) {
    padding: 5px 10px;
  }
}

.form-block-wrapper {
  position: relative;

  .sticky-title-icon-container {
    display: flex;
    justify-content: center;

    .nut-image {
      cursor: pointer;
      width: 70px;
      height: 70px;
      border-radius: 10px;
      overflow: hidden;
      background: transparent;
      padding: 10px;

      :deep(img) {
        width: 100%;
        height: 100%;
        border-radius: 12px;
      }
    }

    .sub-item-customer-icon {
      :deep(img) {
        & {
          opacity: 0.8;
          filter: brightness(var(--img-brightness));
        }
      }
    }
  }
  :deep(.nut-form-item__label) {
    width: auto;
  }
  :deep(.nut-input-text){
    .nut-input-inner {
      .nut-input-right-icon {
        margin-left: 10px;
      }
    }
  }
}
.actions-title-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: var(--comment-text-color);
  .doc {
    margin-left: 4px;
    color: var(--primary-text-color);
  }
}
.bottom-btn-wrapper {
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px var(--safe-area-side) calc(v-bind("padding") + 8px) var(--safe-area-side);
  z-index: 20;
  background: var(--background-color);
  border-top: 1px solid var(--divider-color);
  @include centered-fixed-container;

  .btn {
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      margin-right: 4px;
    }
  }

  .compare-btn {
    background: transparent;
    width: 36%;
  }

  .submit-btn {
    width: 62%;
  }
}

.ignore-failed-wrapper {
  flex-direction: row;
  justify-content: space-between;

  :deep(.nut-form-item__label) {
    width: auto;
  }

  .switch-wrapper {
    display: flex;
    justify-content: end;
  }
}

.include-subs-wrapper {
  flex-direction: column;

  :deep(.nut-form-item__label) {
    width: 100%;
    margin-bottom: 12px;
  }

  .subs-checkbox-wrapper {
    flex-direction: row-reverse;

    .subs-checkbox {
      justify-content: space-between;
      margin-left: 16px;
      padding: 16px 0 0 0;

      &:not(:last-child) {
        padding: 16px 0 16px 0;
        border-bottom: 1px solid;
        border-color: var(--divider-color);
      }

      .sub-img-wrapper {
        max-width: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--second-text-color);

        span {
          max-width: 56vw;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
        }

        .sub-item-customer-icon {
          margin-right: 12px;

          :deep(img) {
            object-fit: contain;

            &:not(.nut-icon__img) {
              filter: brightness(var(--img-brightness));
            }
          }
        }
      }
    }
  }
}

.empty-tips {
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
  p {
    // color: var(--primary-text-color);
    color: var(--comment-text-color);
    font-size: 14px;
    text-align: center;
  }
}
</style>
