<template>
  <div class="page-wrapper">
    <div class="form-block-wrapper">
      <div v-if="appearanceSetting.isShowIcon" class="sticky-title-icon-container">
        <nut-image
          :class="{ 'sub-item-customer-icon': !form.isIconColor }"
          :src="syncIcon"
          fit="cover"
          show-loading
          @click="showIconPopup"
        />
      </div>
      <nut-form class="form" :model-value="form" ref="ruleForm">
        <nut-form-item
          :label="$t(`syncPage.addArtForm.name.label`)"
          prop="name"
          required
          :rules="[
            {
              required: true,
              message: $t(`syncPage.addArtForm.name.isRequired`),
            },
            {
              validator: nameValidator,
              message: $t(`syncPage.addArtForm.name.isValid`),
            },
            {
              validator: duplicateNameValidator,
              message: $t(`syncPage.addArtForm.name.isExist`),
            },
          ]"
        >
          <nut-input
            :border="false"
            input-align="right"
            class="nut-input-text"
            :placeholder="$t(`syncPage.addArtForm.name.placeholder`)"
            :disabled="isEditMode"
            v-model.trim="form.name"
            @click="onClickNameInput"
            @blur="customerBlurValidate('name')"
            type="text"
          />
        </nut-form-item>

        <nut-form-item
          :label="$t(`syncPage.addArtForm.displayName.label`)"
          prop="displayName"
        >
          <nut-input
            :border="false"
            input-align="right"
            class="nut-input-text"
            :placeholder="$t(`syncPage.addArtForm.displayName.placeholder`)"
            v-model.trim="form.displayName"
            type="text"
          />
        </nut-form-item>

        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.remark.label`)"
          prop="remark"
        >
          <nut-textarea
            class="nut-input-text"
            :border="false"
            v-model="form.remark"
            :placeholder="$t(`editorPage.subConfig.basic.remark.placeholder`)"
            input-align="right"
            rows="1"
            :autosize="{ maxHeight: 140 }"
            max-length="100"
          />
        </nut-form-item>

        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.tag.label`)"
          prop="tag"
        >
          <nut-input
            class="nut-input-text"
            v-model.trim="form.tag"
            :border="false"
            :placeholder="$t(`editorPage.subConfig.basic.tag.placeholder`)"
            type="text"
            input-align="right"
            right-icon="rect-right"
            @click-right-icon="showTagPopup"
          />
        </nut-form-item>

        <nut-form-item
          :label="$t(`editorPage.subConfig.basic.icon.label`)"
          prop="icon"
        >
          <nut-input
            :border="false"
            input-align="right"
            class="nut-input-text"
            :placeholder="$t(`editorPage.subConfig.basic.icon.placeholder`)"
            v-model.trim="form.icon"
            type="text"
            left-icon="shop"
            @click-left-icon="showIconPopup"
          />
        </nut-form-item>

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
          :label="$t(`syncPage.addArtForm.source.label`)"
          required
          prop="source"
          :rules="[
            {
              required: true,
              message: $t(`syncPage.addArtForm.source.isRequired`),
            },
          ]"
        >
          <nut-input
            :border="false"
            input-align="right"
            class="nut-input-text source-input"
            :placeholder="$t(`syncPage.addArtForm.source.placeholder`)"
            v-model="sourceInput"
            readonly
            right-icon="rect-right"
            @click="sourceSelectorIsVisible = true"
            @click-right-icon="sourceSelectorIsVisible = true"
            type="text"
          />
        </nut-form-item>

        <template
          v-if="
            sourceInput &&
            ['subscription', 'collection'].includes(form.type)
          "
        >
          <nut-form-item class="include-unsupported-proxy-wrapper">
            <template #label>
              <div class="label" @click="includeUnsupportedProxyTips">
                <p>{{ $t(`syncPage.addArtForm.includeUnsupportedProxy.label`) }}</p>
                <nut-icon name="tips"></nut-icon>
              </div>
            </template>
            <div class="switch-wrapper">
              <nut-switch v-model="form.includeUnsupportedProxy" />
            </div>
          </nut-form-item>

          <nut-form-item :label="$t(`syncPage.addArtForm.platform.label`)">
            <nut-radiogroup
              direction="horizontal"
              v-model="form.platform"
              class="artifact-radio-group"
            >
              <nut-radio label="Stash">Stash</nut-radio>
              <nut-radio label="Egern">Egern</nut-radio>
              <nut-radio label="ClashMeta">Mihomo</nut-radio>
              <nut-radio label="Surfboard">Surfboard</nut-radio>
              <nut-radio label="Surge">Surge</nut-radio>
              <nut-radio label="SurgeMac">
                Surge(macOS)
                <a
                  href="https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E"
                  target="_blank"
                >
                  ⓘ
                </a>
              </nut-radio>
              <nut-radio label="Loon">Loon</nut-radio>
              <nut-radio label="ShadowRocket">Shadowrocket</nut-radio>
              <nut-radio label="QX">
                Quantumult X
                <span name="tips" @click="qxTips">&nbsp;ⓘ</span>
              </nut-radio>
              <nut-radio label="sing-box">sing-box</nut-radio>
              <nut-radio label="V2Ray">V2Ray</nut-radio>
              <nut-radio label="URI">URI</nut-radio>
              <nut-radio label="JSON">JSON</nut-radio>
              <nut-radio label="Clash">Clash(Deprecated)</nut-radio>
            </nut-radiogroup>
          </nut-form-item>
        </template>
      </nut-form>
    </div>

    <div class="bottom-btn-wrapper">
      <nut-button
        @click="submit"
        class="submit-btn btn"
        type="primary"
        shape="square"
      >
        <font-awesome-icon icon="fa-solid fa-floppy-disk" />
        {{ $t("editorPage.subConfig.btn.save") }}
      </nut-button>
    </div>

    <Teleport to="#ztop">
      <nut-cascader
        :title="$t('syncPage.selectSource.title')"
        v-model:visible="sourceSelectorIsVisible"
        v-model="sourceModel"
        @change="sourceChange"
        :options="sourceOptions"
      ></nut-cascader>
    </Teleport>

    <tag-popup
      v-model:visible="tagPopupVisible"
      :currentTag="currentTag"
      @setTag="setTagValue"
      type="artifact"
    />
    <icon-popup
      v-model:visible="iconPopupVisible"
      @setIcon="setIcon"
    />
  </div>
</template>

<script lang="ts" setup>
import TagPopup from "@/components/TagPopup.vue";
import IconPopup from "@/views/icon/IconPopup.vue";
import { useAppNotifyStore } from "@/store/appNotify";
import { useArtifactsStore } from "@/store/artifacts";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { resolveArtifactIcon } from "@/utils/artifactIcon";
import { createGithubProxyUrlRewriter } from "@/utils/githubProxy";
import { Dialog, Toast } from "@nutui/nutui";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, toRaw, watch, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const configName = route.params.id as string;

const artifactsStore = useArtifactsStore();
const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const { showNotify } = useAppNotifyStore();
const { bottomSafeArea } = storeToRefs(globalStore);
const { appearanceSetting, githubProxy, githubProxyRegex } = storeToRefs(settingsStore);

const padding = bottomSafeArea.value + "px";
const isEditMode = computed(() => configName !== "UNTITLED");
const isInit = ref(false);
const fetchReady = ref(!isEditMode.value);
const isSubmitting = ref(false);
const ruleForm = ref<any>(null);
const sourceSelectorIsVisible = ref(false);
const sourceInput = ref("");
const sourceModel = ref<string[]>([]);
const tagPopupVisible = ref(false);
const iconPopupVisible = ref(false);

const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const rewriteGithubUrl = (url?: string | null) => {
  return githubUrlRewriter.value(url);
};

const form = reactive<any>({
  name: "",
  displayName: "",
  remark: "",
  tag: "",
  icon: "",
  isIconColor: true,
  source: "",
  type: "file",
  platform: "Stash",
  sync: false,
  includeUnsupportedProxy: false,
});

const syncIcon = computed(() => {
  const icon = resolveArtifactIcon({
    artifact: form,
    isDefaultIcon: appearanceSetting.value.isDefaultIcon,
  });

  return rewriteGithubUrl(icon) || icon;
});

const sourceOptions = computed(() => {
  const subsNameList = subsStore.subs.map(sub => ({
    name: sub.name,
    displayName: sub.displayName || sub["display-name"] || sub.name,
  }));
  const collectionNameList = subsStore.collections.map(collection => ({
    name: collection.name,
    displayName:
      collection.displayName || collection["display-name"] || collection.name,
  }));
  const filesNameList = subsStore.files.map(file => ({
    name: file.name,
    displayName: file.displayName || file["display-name"] || file.name,
  }));

  const options: any[] = [];
  if (subsNameList.length > 0) {
    options.push({
      value: "subscription",
      text: t("specificWord.singleSub"),
      children: subsNameList.map(item => ({
        value: item.name,
        text: item.displayName,
      })),
    });
  }

  if (collectionNameList.length > 0) {
    options.push({
      value: "collection",
      text: t("specificWord.collectionSub"),
      children: collectionNameList.map(item => ({
        value: item.name,
        text: item.displayName,
      })),
    });
  }

  if (filesNameList.length > 0) {
    options.push({
      value: "file",
      text: t("specificWord.file"),
      children: filesNameList.map(item => ({
        value: item.name,
        text: item.displayName,
      })),
    });
  }

  return options;
});

const displayType = computed(() => {
  return (
    sourceOptions.value.find(item => item.value === form.type)?.text ??
    t("specificWord.unknown")
  );
});

const displaySourceName = computed(() => {
  const typeObj = sourceOptions.value.find(item => item.value === form.type);
  return (
    typeObj?.children?.find(item => item.value === form.source)?.text ??
    (form.source
      ? `${form.source}(🚫)`
      : t("specificWord.unknownSource"))
  );
});

const updateSourceInput = () => {
  if (!form.type || !form.source) {
    sourceInput.value = "";
    return;
  }
  sourceInput.value = `${displayType.value} - ${displaySourceName.value}`;
};

const sourceChange = (value: string[]) => {
  form.type = value[0];
  form.source = value[1];
  updateSourceInput();
};

const currentTag = computed(() => form.tag || "");
const showTagPopup = () => {
  tagPopupVisible.value = true;
};
const setTagValue = (tag: string) => {
  form.tag = tag;
};

watchEffect(() => {
  if (isInit.value) return;

  if (!isEditMode.value) {
    isInit.value = true;
    return;
  }

  const artifact = artifactsStore.artifacts.find(item => item.name === configName);
  if (!artifact) {
    if (!fetchReady.value) return;
    router.replace("/sync");
    return;
  }

  const sourceData = JSON.parse(JSON.stringify(toRaw(artifact)));
  form.name = sourceData.name;
  form.displayName = sourceData.displayName || sourceData["display-name"] || "";
  form.remark = sourceData.remark || "";
  form.tag = Array.isArray(sourceData.tag) ? sourceData.tag.join(", ") : sourceData.tag || "";
  form.icon = sourceData.icon || "";
  form.isIconColor = sourceData.isIconColor !== false;
  form.source = sourceData.source;
  form.type = sourceData.type;
  form.platform = sourceData.platform || "Stash";
  form.sync = sourceData.sync ?? false;
  form.includeUnsupportedProxy = sourceData.includeUnsupportedProxy ?? false;
  form.updated = sourceData.updated;
  form.url = sourceData.url;
  sourceModel.value = [form.type, form.source];
  updateSourceInput();
  isInit.value = true;
});

watch(
  [sourceOptions, () => form.type, () => form.source],
  () => {
    updateSourceInput();
  },
  { deep: true }
);

onMounted(async () => {
  if (isEditMode.value && artifactsStore.artifacts.length === 0) {
    await artifactsStore.fetchArtifactsData();
  }
  fetchReady.value = true;
});

const onClickNameInput = () => {
  if (isEditMode.value) {
    Toast.warn("同步配置的名称不支持修改", { duration: 1000 });
  }
};

const showIconPopup = () => {
  iconPopupVisible.value = true;
};

const setIcon = (icon: any) => {
  form.icon = icon.url;
};

const includeUnsupportedProxyTips = () => {
  window.open(
    "https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E"
  );
};

const qxTips = () => {
  Toast.warn(
    "由于 QX 资源解析器对 QX 格式的输入支持不完善, 请勿对 Sub-Store 链接启用资源解析器. 如果一定要用资源解析器, 请手动选择 V2Ray 输出, 将形如 ?target=V2Ray 的链接填入 QX",
    {
      duration: 5000,
    }
  );
};

const nameValidator = (value: string): Promise<boolean> => {
  const name = value ?? form.name;
  return new Promise(resolve => {
    if (name === "UNTITLED") {
      resolve(false);
      return;
    }
    resolve(/^[a-zA-Z\d._-]*$/.test(name));
  });
};

const duplicateNameValidator = (value: string): Promise<boolean> => {
  const name = value ?? form.name;
  return new Promise(resolve => {
    if (isEditMode.value) {
      resolve(true);
      return;
    }
    const duplicate = artifactsStore.artifacts.find(
      artifact => artifact.name === name
    );
    resolve(!duplicate);
  });
};

const customerBlurValidate = (prop: string) => {
  ruleForm.value.validate(prop);
};

const submit = () => {
  if (isSubmitting.value) {
    showNotify({
      type: "success",
      title: "请勿重复点击...",
    });
    return;
  }

  ruleForm.value.validate().then(async ({ valid, errors }: any) => {
    isSubmitting.value = true;
    if (!valid) {
      isSubmitting.value = false;
      Dialog({
        title: t(`syncPage.addArtForm.pop.errorTitle`),
        content: errors[0].message,
        popClass: "auto-dialog",
        noCancelBtn: true,
        okText: t(`syncPage.addArtForm.pop.errorBtn`),
        closeOnClickOverlay: true,
      });
      return;
    }

    const data: any = JSON.parse(JSON.stringify(toRaw(form)));
    data.tag = [
      ...new Set(
        (form.tag || "")
          .split(",")
          .map((item: string) => item.trim())
          .filter((item: string) => item.length)
      ),
    ];
    data["display-name"] = data.displayName;

    Toast.loading(t("syncPage.addArtForm.submitLoading"), {
      cover: true,
      id: "artifact-submit-loading",
    });

    const isSuccess = isEditMode.value
      ? await artifactsStore.editArtifact(configName, data)
      : await artifactsStore.createArtifact(data);

    Toast.hide("artifact-submit-loading");
    isSubmitting.value = false;
    if (isSuccess) {
      router.replace("/sync");
    }
  });
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0 var(--safe-area-side) calc(v-bind("padding") + 63px)
    var(--safe-area-side);

  :deep(.nut-cell-group__warp) {
    border-radius: var(--item-card-radios);
  }

  :deep(.nut-icon-shop:before) {
    cursor: pointer;
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

  .source-input {
    :deep(.input-text) {
      cursor: pointer;
    }
  }

  :deep(.nut-input-text) {
    .nut-input-inner {

      .nut-input-right-icon {
        margin-left: 10px;
      }
    }
  }

  .include-unsupported-proxy-wrapper {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    :deep(.nut-form-item__label) {
      width: auto;
    }

    .label {
      color: var(--comment-text-color);
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        margin: 0;
        text-align: left;
        padding-right: 20px;
      }

      .nut-icon {
        flex-shrink: 0;
        margin-right: 6px;
      }
    }
  }

  :deep(.artifact-radio-group) {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .nut-radio {
      margin: 20px 0 0 0;
    }
  }
}

.switch-wrapper {
  display: flex;
  justify-content: flex-end;
}

.bottom-btn-wrapper {
  position: fixed;
  display: flex;
  justify-content: flex-end;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px var(--safe-area-side) calc(v-bind("padding") + 8px)
    var(--safe-area-side);
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

  .submit-btn {
    width: 100%;
  }
}
</style>
