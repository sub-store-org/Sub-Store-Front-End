<template>
  <div class="share-editor-page">
    <section v-if="isLoading" class="share-editor-state">
      <div class="share-editor-state-card">
        <h3>{{ $t("globalNotify.refresh.loading") }}</h3>
      </div>
    </section>

    <section v-else-if="hasLoadError" class="share-editor-state">
      <nut-empty image="error">
        <template #description>
          <h3>{{ $t("sharePage.editor.loadFailed.title") }}</h3>
          <p>{{ $t("sharePage.editor.loadFailed.desc") }}</p>
        </template>
      </nut-empty>
      <div class="share-editor-state-actions">
        <nut-button plain shape="round" @click="loadEditorData">
          {{ $t("sharePage.editor.loadFailed.retry") }}
        </nut-button>
        <nut-button type="primary" shape="round" @click="router.push('/shares')">
          {{ $t("sharePage.editor.loadFailed.back") }}
        </nut-button>
      </div>
    </section>

    <div v-else class="page-wrapper">
      <div class="form-block-wrapper">
        <div v-if="appearanceSetting.isShowIcon" class="sticky-title-icon-container">
          <nut-image
            :class="{ 'sub-item-customer-icon': !shareDisplayIsIconColor }"
            :src="shareDisplayIcon"
            fit="cover"
            show-loading
            @click="showIconPopup"
          />
        </div>
        <nut-form ref="ruleForm" class="form share-editor-form" :model-value="form">
          <nut-form-item
            :label="$t(`editorPage.subConfig.basic.source.label`)"
            prop="source"
            required
            :rules="[
              {
                required: true,
                message: $t(`syncPage.addArtForm.source.isRequired`),
              },
            ]"
          >
            <nut-input
              class="nut-input-text source-input"
              :class="{ 'source-input-disabled': isSourceSelectorDisabled }"
              :border="false"
              input-align="right"
              :placeholder="$t(`syncPage.addArtForm.source.placeholder`)"
              v-model="sourceInput"
              readonly
              :right-icon="isSourceSelectorDisabled ? undefined : 'rect-right'"
              @click="openSourceSelector"
              @click-right-icon="openSourceSelector"
              type="text"
            />
          </nut-form-item>

          <nut-form-item
            :label="$t(`sharePage.createShare.expirationMode.label`)"
            prop="expirationMode"
          >
            <div class="radio-wrapper">
              <nut-radiogroup v-model="form.expirationMode" direction="horizontal">
                <nut-radio
                  v-for="(item, index) in expirationModeList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </nut-radio>
              </nut-radiogroup>
            </div>
          </nut-form-item>

          <template v-if="!isExactExpirationMode">
            <nut-form-item
              :label="$t(`sharePage.createShare.expiresValue.label`)"
              prop="expiresValue"
              required
              :rules="[
                {
                  required: true,
                  message: $t(`sharePage.createShare.expiresValue.empty`),
                },
                {
                  validator: validateExpiresValue,
                  message: $t(`sharePage.createShare.expiresValue.regex`),
                },
              ]"
            >
              <nut-input
                v-model="form.expiresValue"
                class="nut-input-text"
                :border="false"
                :placeholder="$t(`sharePage.createShare.expiresValue.placeholder`)"
                type="number"
                input-align="right"
                max-length="8"
                format-trigger="onBlur"
                @blur="customerBlurValidate('expiresValue')"
              />
            </nut-form-item>
            <nut-form-item
              :label="$t(`sharePage.createShare.expiresUnit.label`)"
              prop="expiresUnit"
            >
              <div class="radio-wrapper">
                <nut-radiogroup v-model="form.expiresUnit" direction="horizontal">
                  <nut-radio
                    v-for="(item, index) in expiresUnitList"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </nut-radio>
                </nut-radiogroup>
              </div>
            </nut-form-item>
          </template>

          <template v-else>
            <nut-form-item
              :label="$t(`sharePage.createShare.exactDatetime.label`)"
              prop="exactDatetime"
              body-align="right"
              required
              :rules="[
                {
                  required: true,
                  message: $t(`sharePage.createShare.exactDatetime.empty`),
                },
                {
                  validator: validateExactDatetime,
                  message: $t(`sharePage.createShare.exactDatetime.invalid`),
                },
              ]"
            >
              <ShareExactDatetimeField
                v-model="form.exactDatetime"
                :placeholder="$t(`sharePage.createShare.exactDatetime.placeholder`)"
                :locale="datetimePickerLocale"
                :confirm-text="$t(`sharePage.createShare.exactDatetime.confirm`)"
                :cancel-text="$t(`sharePage.createShare.exactDatetime.cancel`)"
                :dark-theme="isDatetimeInputDarkTheme"
                @blur="customerBlurValidate('exactDatetime')"
                @closed="handleExactDatetimeClosed"
              />
            </nut-form-item>
          </template>

          <nut-form-item
            :label="$t(`sharePage.createShare.token.label`)"
            prop="token"
            :rules="[
              {
                validator: duplicateTokenValidator,
                message: $t(`sharePage.createShare.token.isExist`),
              },
            ]"
          >
            <nut-input
              v-model="form.token"
              class="nut-input-text"
              :border="false"
              :placeholder="$t(`sharePage.createShare.token.placeholder`)"
              type="text"
              input-align="right"
              max-length="100"
              @blur="customerBlurValidate('token')"
            />
          </nut-form-item>

          <nut-form-item
            :label="$t(`sharePage.createShare.displayName.label`)"
            prop="displayName"
          >
            <nut-input
              v-model="form.displayName"
              class="nut-input-text"
              :border="false"
              :placeholder="$t(`sharePage.createShare.displayName.placeholder`)"
              type="text"
              input-align="right"
              max-length="100"
            />
          </nut-form-item>

          <nut-form-item
            :label="$t(`sharePage.createShare.remark.label`)"
            prop="remark"
          >
            <nut-textarea
              v-model="form.remark"
              class="nut-input-text"
              :border="false"
              :placeholder="$t(`sharePage.createShare.remark.placeholder`)"
              type="text"
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
              v-model.trim="form.tag"
              class="nut-input-text"
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
              v-model.trim="form.icon"
              class="nut-input-text"
              :border="false"
              :placeholder="$t(`editorPage.subConfig.basic.icon.placeholder`)"
              type="text"
              input-align="right"
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
            v-if="shouldShowShareUrlRow"
            :label="$t(`sharePage.createShare.shareUrl.label`)"
            prop="shareUrl"
          >
            <nut-input
              v-model="form.shareUrl"
              class="nut-input-text share-url-input"
              :border="false"
              :placeholder="$t(`sharePage.createShare.shareUrl.placeholder`)"
              type="text"
              input-align="right"
              readonly
            />
          </nut-form-item>

          <div v-if="shouldShowShareQrCode" class="qrcode-wrapper">
            <nut-image
              :src="shareUrlQrCode"
              class="qrcode"
              fit="cover"
              alt="QR Code"
            />
          </div>
        </nut-form>
      </div>

      <div class="bottom-btn-wrapper">
        <nut-button
          class="copy-btn btn"
          plain
          shape="square"
          :disabled="!form.shareUrl"
          @click="handleCopyShare"
        >
          <font-awesome-icon icon="fa-solid fa-link" />
          {{ $t("sharePage.createShare.copyBtn") }}
        </nut-button>
        <nut-button
          class="submit-btn btn"
          type="primary"
          shape="square"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          <font-awesome-icon icon="fa-solid fa-floppy-disk" />
          {{ submitButtonLabel }}
        </nut-button>
      </div>

    </div>

    <TagPopup
      v-model:visible="tagPopupVisible"
      :current-tag="currentTag"
      type="share"
      @set-tag="setTagValue"
    />

    <IconPopup
      v-if="iconPopupVisible"
      v-model:visible="iconPopupVisible"
      @set-icon="setIcon"
    />

    <Teleport to="#ztop">
      <nut-cascader
        :title="$t('syncPage.selectSource.title')"
        v-model:visible="sourceSelectorIsVisible"
        v-model="sourceModel"
        @change="sourceChange"
        :options="sourceOptions"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Toast } from "@nutui/nutui";
import { useClipboard, usePreferredDark } from "@vueuse/core";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import ShareExactDatetimeField from "@/components/ShareExactDatetimeField.vue";
import TagPopup from "@/components/TagPopup.vue";
import IconPopup from "@/views/icon/IconPopup.vue";
import { useShareApi } from "@/api/share";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from "@/hooks/useHostAPI";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { useSubsStore } from "@/store/subs";
import { createGithubProxyUrlRewriter } from "@/utils/githubProxy";
import {
  findShareByRouteIdentity,
  getShareEditPath,
  getShareExpirationFormState,
  getSharePublicUrl,
  isShareType,
  isValidShareExactDatetime,
  parseShareEditorRouteIdentity,
  resolveShareDisplayIconState,
  SHARE_EXPIRATION_DATETIME_BACKEND_VERSION,
  supportsShareExpirationDatetime,
  type ShareExpirationMode,
} from "@/utils/share";
import { normalizeTagArray, stringifyTagInput } from "@/utils/shareTags";

type EditorMode = "create" | "edit";
type ShareSourceType = "sub" | "col" | "file";
type ShareEditorData = Share & {
  type: ShareSourceType;
  name: string;
  shareUrl?: string;
};
type ActiveShareEditorData = ShareEditorData & {
  token: string;
};

const shareThemeModules = import.meta.globEager("@/themes/*.ts");
const shareThemeLabelMap = Object.keys(shareThemeModules).reduce((map, path) => {
  const key = path.split("/").pop()?.replace(".ts", "");
  if (!key) {
    return map;
  }

  map[key] = (shareThemeModules[path] as any)?.default?.meta?.label;
  return map;
}, {} as Record<string, string | undefined>);

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const shareApi = useShareApi();
const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const subsStore = useSubsStore();
const { bottomSafeArea } = storeToRefs(globalStore);
const { appearanceSetting, githubProxy, githubProxyRegex, theme } = storeToRefs(settingsStore);
const { showNotify } = useAppNotifyStore();
const { currentUrl: host } = useHostAPI();
const { env } = useBackend();
const { copy, isSupported } = useClipboard();
const preferredDark = usePreferredDark();
const { toClipboard: copyFallback } = useV3Clipboard();
const padding = computed(() => `${bottomSafeArea.value}px`);

const ruleForm = ref<any>(null);
const isLoading = ref(true);
const hasLoadError = ref(false);
const isSubmitting = ref(false);
const editorData = ref<ShareEditorData | null>(null);
const isHydratingForm = ref(false);
const tagPopupVisible = ref(false);
const iconPopupVisible = ref(false);
const sourceSelectorIsVisible = ref(false);
const sourceInput = ref("");
const sourceModel = ref<string[]>([]);
const latestLoadRequestId = ref(0);
const isRetryingCreateAfterDelete = ref(false);

const form = reactive({
  sourceType: "" as ShareSourceType | "",
  sourceName: "",
  expirationMode: "duration" as ShareExpirationMode,
  expiresValue: "",
  expiresUnit: "day",
  exactDatetime: null as number | null,
  remark: "",
  token: "",
  displayName: "",
  tag: "",
  icon: "",
  isIconColor: true,
  shareUrl: "",
});

const getRouteParam = (value: string | string[] | null | undefined) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const routeNameParam = computed(() => getRouteParam(route.params.name));
const routeIdentity = computed(() => {
  return parseShareEditorRouteIdentity({
    name: routeNameParam.value,
    queryType: getRouteParam(route.query.type),
    queryToken: getRouteParam(route.query.token),
  });
});
const routeMode = computed<EditorMode>(() => routeIdentity.value.mode);
const isEditMode = computed(() => routeMode.value === "edit");
const routeShareType = computed(() => routeIdentity.value.type);
const routeShareName = computed(() => routeIdentity.value.name);
const routeToken = computed(() => routeIdentity.value.token);
const isSourceSelectorDisabled = computed(() => isEditMode.value);

const submitButtonLabel = computed(() => {
  return routeMode.value === "create"
    ? t("sharePage.editor.create.submit")
    : t("sharePage.editor.edit.submit");
});
const isExactExpirationMode = computed(() => form.expirationMode === "datetime");
const shouldShowShareUrlRow = computed(() => isEditMode.value);
const shouldShowShareQrCode = computed(() => {
  return isEditMode.value && Boolean(form.shareUrl);
});
const resolvedThemeName = computed(() => {
  if (theme.value?.auto) {
    return preferredDark.value ? theme.value?.dark : theme.value?.light;
  }

  return theme.value?.name;
});
const isDatetimeInputDarkTheme = computed(() => {
  const resolvedName = resolvedThemeName.value;
  if (!resolvedName) {
    return preferredDark.value;
  }

  const label = shareThemeLabelMap[resolvedName];
  return label ? label === "dark" : preferredDark.value;
});
const datetimePickerLocale = computed(() => {
  return locale.value === "zh" ? "zh-CN" : "en-US";
});

const currentTag = computed(() => form.tag || "");
const normalizedSourceName = computed(() => form.sourceName.trim());
const secretPath = computed(() => {
  return env.value?.meta?.node?.env?.SUB_STORE_FRONTEND_BACKEND_PATH || "";
});

const normalizedFormToken = computed(() => {
  return form.token.trim();
});
const normalizedFormIcon = computed(() => {
  return form.icon.trim();
});
const selectedSourceType = computed<ShareSourceType | null>(() => {
  return isShareType(form.sourceType) ? form.sourceType : null;
});

const isCurrentEditingShare = (share: Share) => {
  if (routeIdentity.value.mode !== "edit") {
    return false;
  }

  return share.type === routeIdentity.value.type
    && share.name === routeIdentity.value.name
    && share.token === routeIdentity.value.token;
};

const hasDuplicateTokenForSource = (token: string) => {
  if (!token || !selectedSourceType.value || !normalizedSourceName.value) {
    return false;
  }

  return subsStore.shares.some((share) => {
    const shareToken = typeof share.token === "string" ? share.token.trim() : "";
    return share.type === selectedSourceType.value
      && share.name === normalizedSourceName.value
      && shareToken === token
      && !isCurrentEditingShare(share);
  });
};

const duplicateTokenValidator = (value: string) => {
  const nextToken = (value ?? form.token ?? "").trim();
  return Promise.resolve(!hasDuplicateTokenForSource(nextToken));
};

const sourceOptions = computed(() => {
  const buildChildren = <T extends { name: string; displayName?: string; ["display-name"]?: string }>(
    items: T[],
  ) =>
    items.map((item) => ({
      value: item.name,
      text: item.displayName || item["display-name"] || item.name,
    }));

  const options: Array<{ value: ShareSourceType; text: string; children: Array<{ value: string; text: string }> }> = [];

  if (subsStore.subs.length > 0) {
    options.push({
      value: "sub",
      text: t("specificWord.singleSub"),
      children: buildChildren(subsStore.subs),
    });
  }

  if (subsStore.collections.length > 0) {
    options.push({
      value: "col",
      text: t("specificWord.collectionSub"),
      children: buildChildren(subsStore.collections),
    });
  }

  if (subsStore.files.length > 0) {
    options.push({
      value: "file",
      text: t("specificWord.file"),
      children: buildChildren(subsStore.files),
    });
  }

  return options;
});

const sourceTypeLabel = computed(() => {
  return sourceOptions.value.find((item) => item.value === selectedSourceType.value)?.text
    || t("specificWord.unknownType");
});

const sourceDisplayName = computed(() => {
  const typeOption = sourceOptions.value.find((item) => item.value === selectedSourceType.value);
  return typeOption?.children?.find((item) => item.value === normalizedSourceName.value)?.text
    || (
      normalizedSourceName.value
        ? `${normalizedSourceName.value}(🚫)`
        : t("specificWord.unknownSource")
    );
});

const expirationModeList = computed(() => [
  {
    label: t("sharePage.createShare.expirationMode.duration"),
    value: "duration",
  },
  {
    label: t("sharePage.createShare.expirationMode.datetime"),
    value: "datetime",
  },
]);
const expiresUnitList = computed(() => [
  {
    label: t("sharePage.createShare.unit.day"),
    value: "day",
  },
  {
    label: t("sharePage.createShare.unit.month"),
    value: "month",
  },
  {
    label: t("sharePage.createShare.unit.season"),
    value: "season",
  },
  {
    label: t("sharePage.createShare.unit.year"),
    value: "year",
  },
]);

const shareUrlQrCode = useQRCode(computed(() => form.shareUrl));

const buildShareUrl = (
  type: "sub" | "col" | "file",
  name: string,
  token: string,
  notifyOnError: boolean = false,
) => {
  try {
    return getSharePublicUrl({
      host: host.value,
      secretPath: secretPath.value,
      type,
      name,
      token,
    });
  } catch (error) {
    if (notifyOnError) {
      Toast.fail(t("sharePage.magicPathErrorNotify"));
    }
    return "";
  }
};

const resetFormState = () => {
  isRetryingCreateAfterDelete.value = false;
  sourceInput.value = "";
  sourceModel.value = [];
  form.sourceType = "";
  form.sourceName = "";
  form.expirationMode = "duration";
  form.expiresValue = "";
  form.expiresUnit = "day";
  form.exactDatetime = null;
  form.remark = "";
  form.token = "";
  form.displayName = "";
  form.tag = "";
  form.icon = "";
  form.isIconColor = true;
  form.shareUrl = "";
};

const getSourceDefaultDisplayName = (
  source?: {
    displayName?: string | null;
    "display-name"?: string | null;
  } | null,
) => {
  if (typeof source?.displayName === "string") {
    return source.displayName;
  }
  if (typeof source?.["display-name"] === "string") {
    return source["display-name"];
  }
  return "";
};

const getSourceDefaultTag = (
  source?: {
    tag?: string[];
  } | null,
) => {
  return stringifyTagInput(source?.tag);
};

const hydrateForm = () => {
  isHydratingForm.value = true;
  const activeSource = editorData.value;

  if (!activeSource) {
    resetFormState();
    isHydratingForm.value = false;
    return;
  }

  form.sourceType = activeSource.type;
  form.sourceName = activeSource.name;
  syncSourceModel();
  const expirationState = getShareExpirationFormState({
    mode: activeSource.mode,
    expiresAt: activeSource.expiresAt,
    expiresIn: activeSource.expiresIn,
    exp: activeSource.exp,
  });
  form.expirationMode = expirationState.mode;
  form.expiresValue = expirationState.expiresValue;
  form.expiresUnit = expirationState.expiresUnit;
  form.exactDatetime = expirationState.exactDatetime;

  form.remark = activeSource.remark || "";
  form.token = activeSource.token || "";
  form.displayName = routeMode.value === "create"
    ? getSourceDefaultDisplayName(activeSource)
    : activeSource.displayName || "";
  form.tag = routeMode.value === "create"
    ? getSourceDefaultTag(activeSource)
    : stringifyTagInput(activeSource.tag);
  form.icon = routeMode.value === "create"
    ? ""
    : activeSource.icon || "";
  form.isIconColor = routeMode.value === "edit" && activeSource.icon
    ? activeSource.isIconColor !== false
    : true;
  form.shareUrl =
    activeSource.shareUrl
    || (
      routeMode.value === "edit" && activeSource.token
        ? buildShareUrl(activeSource.type, activeSource.name, activeSource.token)
        : ""
    );
  Promise.resolve().then(() => {
    isHydratingForm.value = false;
  });
};

const refreshShares = async () => {
  try {
    await subsStore.fetchShareData();
  } catch (error) {
    console.error(error);
  }
  return subsStore.shares;
};

const findSourceItem = (type: ShareSourceType, name: string) => {
  if (type === "sub") {
    return subsStore.getOneSub(name);
  }
  if (type === "col") {
    return subsStore.getOneCollection(name);
  }
  return subsStore.getOneFile(name);
};

const selectedSourceItem = computed(() => {
  if (!selectedSourceType.value || !normalizedSourceName.value) {
    return null;
  }

  return findSourceItem(selectedSourceType.value, normalizedSourceName.value) || null;
});
const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const rewriteGithubUrl = (url?: string | null) => {
  return githubUrlRewriter.value(url);
};
const defaultShareIcon = computed(() => {
  return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon;
});
const shareDisplayIconState = computed(() => {
  return resolveShareDisplayIconState({
    share: form.icon
      ? {
          icon: form.icon,
          isIconColor: form.isIconColor,
        }
      : null,
    source: selectedSourceItem.value,
    fallbackIcon: defaultShareIcon.value,
  });
});
const shareDisplayIcon = computed(() => {
  return rewriteGithubUrl(shareDisplayIconState.value.icon) || shareDisplayIconState.value.icon;
});
const shareDisplayIsIconColor = computed(() => {
  return shareDisplayIconState.value.isIconColor;
});

const syncSourceModel = () => {
  if (!selectedSourceType.value || !normalizedSourceName.value) {
    sourceModel.value = [];
    return;
  }

  sourceModel.value = [selectedSourceType.value, normalizedSourceName.value];
};

const updateSourceInput = () => {
  if (!selectedSourceType.value || !normalizedSourceName.value) {
    sourceInput.value = "";
    return;
  }

  sourceInput.value = `${sourceTypeLabel.value} - ${sourceDisplayName.value}`;
};

const applyCreateSourceDefaults = (force: boolean = false) => {
  if (routeMode.value !== "create") {
    return;
  }

  const sourceItem = selectedSourceItem.value;
  if (!sourceItem) {
    return;
  }

  if (force || !form.remark) {
    form.remark = sourceItem.remark || "";
  }
  if (force || !form.displayName) {
    form.displayName = getSourceDefaultDisplayName(sourceItem);
  }
  if (force || !form.tag) {
    form.tag = getSourceDefaultTag(sourceItem);
  }
};

const sourceChange = (value: string[]) => {
  if (isSourceSelectorDisabled.value) {
    return;
  }

  const [nextType, nextName] = value;
  if (!isShareType(nextType) || !nextName) {
    return;
  }

  form.sourceType = nextType;
  form.sourceName = nextName;
  syncSourceModel();
  applyCreateSourceDefaults(true);
};

const openSourceSelector = () => {
  if (isSourceSelectorDisabled.value) {
    return;
  }

  sourceSelectorIsVisible.value = true;
};

const ensureEnvLoaded = async (
  options: {
    forceRefresh?: boolean;
    strict?: boolean;
  } = {},
) => {
  if (!options.forceRefresh && env.value?.backend) {
    return env.value;
  }

  return globalStore.setEnv({
    bypassCache: options.forceRefresh === true,
    strict: options.strict === true,
  });
};

const isLoadRequestActive = (requestId: number) => latestLoadRequestId.value === requestId;

const applyLoadError = (requestId: number) => {
  if (!isLoadRequestActive(requestId)) {
    return;
  }

  isRetryingCreateAfterDelete.value = false;
  hasLoadError.value = true;
  isLoading.value = false;
};

const finishLoad = (requestId: number, nextData: ShareEditorData | null, isError: boolean = false) => {
  if (!isLoadRequestActive(requestId)) {
    return;
  }

  isRetryingCreateAfterDelete.value = false;
  editorData.value = nextData;
  hydrateForm();
  hasLoadError.value = isError;
  isLoading.value = false;
};

const loadEditorData = async () => {
  const requestId = latestLoadRequestId.value + 1;
  latestLoadRequestId.value = requestId;
  isLoading.value = true;
  hasLoadError.value = false;
  editorData.value = null;

  const type = routeShareType.value;
  const name = routeShareName.value;
  const token = routeToken.value;

  if (routeMode.value === "edit" && (!token || !type || !name)) {
    applyLoadError(requestId);
    return;
  }

  try {
    if (routeMode.value === "edit") {
      let nextData = findShareByRouteIdentity(subsStore.shares, routeIdentity.value);

      if (!nextData) {
        await Promise.all([
          subsStore.fetchSubsData(),
          subsStore.fetchShareData(),
        ]);
        if (!isLoadRequestActive(requestId)) {
          return;
        }
        nextData = findShareByRouteIdentity(subsStore.shares, routeIdentity.value);
      }

      if (!nextData || !isShareType(nextData.type) || !nextData.name) {
        applyLoadError(requestId);
        return;
      }

      await ensureEnvLoaded();
      if (!isLoadRequestActive(requestId)) {
        return;
      }
      finishLoad(requestId, {
        ...nextData,
        type: nextData.type,
        name: nextData.name,
        shareUrl: buildShareUrl(nextData.type, nextData.name, nextData.token || token),
      });
      return;
    }

    if (type && name) {
      let nextData = findSourceItem(type, name);
      if (!nextData) {
        await subsStore.fetchSubsData();
        if (!isLoadRequestActive(requestId)) {
          return;
        }
        nextData = findSourceItem(type, name);
      }
      if (nextData) {
        finishLoad(requestId, {
          ...nextData,
          type,
          name,
        });
        return;
      }
      finishLoad(requestId, {
        type,
        name,
      });
      return;
    }

    if (subsStore.subs.length === 0 && subsStore.collections.length === 0 && subsStore.files.length === 0) {
      await subsStore.fetchSubsData();
      if (!isLoadRequestActive(requestId)) {
        return;
      }
    }

    finishLoad(requestId, null);
  } catch (error) {
    console.error(error);
    applyLoadError(requestId);
  }
};

const showTagPopup = () => {
  tagPopupVisible.value = true;
};

const setTagValue = (tag: string) => {
  form.tag = tag;
};

const showIconPopup = () => {
  iconPopupVisible.value = true;
};

const setIcon = (icon: { url?: string | null }) => {
  form.icon = icon?.url || "";
};

const validateExpiresValue = (value: string) => {
  return /^(?:0\.0[1-9]\d*|[1-9]\d{0,4}(?:\.\d*)?|0\.[1-9]\d*)$/.test(value);
};

const validateExactDatetime = (value: number | null) => {
  return value == null || isValidShareExactDatetime(value);
};

const customerBlurValidate = (prop: string) => {
  ruleForm.value?.validate?.(prop);
};

const handleExactDatetimeClosed = () => {
  customerBlurValidate("exactDatetime");
};

const validateTokenBeforeSubmit = () => {
  if (!hasDuplicateTokenForSource(normalizedFormToken.value)) {
    return true;
  }

  customerBlurValidate("token");
  Toast.warn(t("sharePage.createShare.token.isExist"));
  return false;
};

const genExpiresIn = (expireValue: string, expireUnit: string) => {
  const unitMap: Record<string, { multiplier: number; suffix: string }> = {
    day: {
      multiplier: 1,
      suffix: "d",
    },
    month: {
      multiplier: 30,
      suffix: "d",
    },
    season: {
      multiplier: 90,
      suffix: "d",
    },
    year: {
      multiplier: 365,
      suffix: "d",
    },
  };
  const value = Number(Number.parseFloat(expireValue).toFixed(2));
  const unitConfig = unitMap[expireUnit] || unitMap.day;
  return `${value * unitConfig.multiplier}${unitConfig.suffix}`;
};

const getDurationExpirationOptions = (): ShareToken["options"] | null => {
  if (!form.expiresValue) {
    Toast.warn(t("sharePage.createShare.expiresValue.empty"));
    return null;
  }

  if (!validateExpiresValue(form.expiresValue)) {
    Toast.warn(t("sharePage.createShare.expiresValue.regex"));
    return null;
  }

  return {
    expiresIn: genExpiresIn(form.expiresValue, form.expiresUnit),
  };
};

const getDatetimeExpirationOptions = async (): Promise<ShareToken["options"] | null> => {
  if (form.exactDatetime == null) {
    Toast.warn(t("sharePage.createShare.exactDatetime.empty"));
    return null;
  }

  if (!isValidShareExactDatetime(form.exactDatetime)) {
    Toast.warn(t("sharePage.createShare.exactDatetime.invalid"));
    return null;
  }

  let verifiedEnv: { version?: string | null } | null = null;
  try {
    // Temporary safety check for mixed-version deployments.
    // Once exact datetime support is baseline everywhere, we can remove the forced refresh gate.
    verifiedEnv = await ensureEnvLoaded({
      forceRefresh: true,
      strict: true,
    });
  } catch (error) {
    console.error(error);
    showNotify({
      title: t("sharePage.editor.datetimeBackendCheckFailed.title"),
      content: t("sharePage.editor.datetimeBackendCheckFailed.desc"),
      type: "danger",
      duration: 3600,
    });
    return null;
  }

  if (!supportsShareExpirationDatetime(verifiedEnv?.version)) {
    showNotify({
      title: t("sharePage.editor.datetimeBackendRequired.title"),
      content: t("sharePage.editor.datetimeBackendRequired.desc", {
        currentVersion: verifiedEnv?.version || t("specificWord.unknown"),
        minVersion: SHARE_EXPIRATION_DATETIME_BACKEND_VERSION,
      }),
      type: "danger",
      duration: 3600,
    });
    return null;
  }

  if (!isValidShareExactDatetime(form.exactDatetime)) {
    Toast.warn(t("sharePage.createShare.exactDatetime.invalid"));
    return null;
  }

  return {
    mode: "datetime",
    exp: Number(form.exactDatetime),
  };
};

const handleCopyShare = async (isNotify: boolean = true) => {
  if (!form.shareUrl) {
    return;
  }

  try {
    if (isSupported) {
      await copy(form.shareUrl);
    } else {
      await copyFallback(form.shareUrl);
    }
  } catch (error) {
    try {
      await copyFallback(form.shareUrl);
    } catch (fallbackError) {
      console.error(error);
      console.error(fallbackError);
      return;
    }
  }

  if (isNotify) {
    showNotify({ title: t("sharePage.copyShare.succeedNotify") });
  }
};

const getSubmitParams = async (): Promise<ShareToken | null> => {
  if (!selectedSourceType.value || !normalizedSourceName.value) {
    Toast.warn(t("syncPage.addArtForm.source.isRequired"));
    return null;
  }

  if (!validateTokenBeforeSubmit()) {
    return null;
  }

  const options = isExactExpirationMode.value
    ? await getDatetimeExpirationOptions()
    : getDurationExpirationOptions();
  if (!options) {
    return null;
  }

  const payload: SharePayload = {
    type: selectedSourceType.value,
    name: normalizedSourceName.value,
    displayName: form.displayName || "",
    remark: form.remark || "",
    tag: normalizeTagArray(form.tag),
  };

  if (normalizedFormIcon.value) {
    payload.icon = normalizedFormIcon.value;
    payload.isIconColor = form.isIconColor !== false;
  }

  if (routeMode.value === "create") {
    if (normalizedFormToken.value) {
      payload.token = normalizedFormToken.value;
    }
  } else {
    payload.token = normalizedFormToken.value || null;
  }

  return {
    payload,
    options,
  };
};

const createShareFromParams = async (params: ShareToken) => {
  const res = await shareApi.createShare(getCreateSubmitParams(params));
  if (res?.data?.status !== "success") {
    return null;
  }

  return res.data.data?.token || null;
};

const getCreateSubmitParams = (params: ShareToken): ShareToken => {
  const payload = {
    ...params.payload,
  };

  if (payload.token == null || payload.token === "") {
    delete payload.token;
  }

  return {
    payload,
    options: {
      ...params.options,
    },
  };
};

const getSubmitRouteSnapshot = () => ({
  fullPath: route.fullPath,
  mode: routeMode.value,
  type: routeIdentity.value.type,
  name: routeIdentity.value.name,
  token: routeToken.value,
});

const syncEditorRouteToShare = async (
  shareType: ShareSourceType,
  shareName: string,
  nextToken: string,
  submitRouteSnapshot: ReturnType<typeof getSubmitRouteSnapshot>,
) => {
  if (route.fullPath !== submitRouteSnapshot.fullPath) {
    return;
  }

  const shouldReplaceRoute =
    submitRouteSnapshot.mode === "create"
    || submitRouteSnapshot.type !== shareType
    || submitRouteSnapshot.name !== shareName
    || submitRouteSnapshot.token !== nextToken;

  if (shouldReplaceRoute) {
    await router.replace(getShareEditPath(shareType, shareName, nextToken));
    return;
  }

  await loadEditorData();
};

const finalizeSuccessfulSave = async (
  shareType: ShareSourceType,
  shareName: string,
  nextToken: string,
  notifyKey: string,
  submitRouteSnapshot: ReturnType<typeof getSubmitRouteSnapshot>,
) => {
  form.shareUrl = buildShareUrl(shareType, shareName, nextToken, true);
  showNotify({ title: t(notifyKey) });
  await handleCopyShare(false);
  await refreshShares();
  await syncEditorRouteToShare(shareType, shareName, nextToken, submitRouteSnapshot);
};

const finalizeFailedUpdate = async () => {
  Toast.fail(t("sharePage.editor.failNotify"));
  await refreshShares();
  await loadEditorData();
};

const finalizeRetryableUpdateFailure = () => {
  isRetryingCreateAfterDelete.value = true;
};

const handleCreate = async () => {
  const params = await getSubmitParams();
  if (!params) {
    return;
  }
  const submitRouteSnapshot = getSubmitRouteSnapshot();
  const nextToken = await createShareFromParams(params);
  if (!nextToken) {
    return;
  }

  await finalizeSuccessfulSave(
    params.payload.type,
    params.payload.name,
    nextToken,
    "sharePage.editor.create.succeedNotify",
    submitRouteSnapshot,
  );
};

const handleEdit = async () => {
  const activeSource = editorData.value;
  const params = await getSubmitParams();
  if (!activeSource || !params || !activeSource.token) {
    return;
  }
  const submitRouteSnapshot = getSubmitRouteSnapshot();
  if (isRetryingCreateAfterDelete.value) {
    const retryToken = await createShareFromParams(params);
    if (!retryToken) {
      finalizeRetryableUpdateFailure();
      return;
    }

    isRetryingCreateAfterDelete.value = false;
    await finalizeSuccessfulSave(
      params.payload.type,
      params.payload.name,
      retryToken,
      "sharePage.editor.edit.succeedNotify",
      submitRouteSnapshot,
    );
    return;
  }

  const activeShare = activeSource as ActiveShareEditorData;
  const updateResult = await subsStore.updateShare(
    activeShare.token,
    activeShare.type,
    activeShare.name,
    getCreateSubmitParams(params),
    false,
  );
  if (updateResult.status === "retry_create") {
    finalizeRetryableUpdateFailure();
    return;
  }

  if (updateResult.status !== "success" || !updateResult.token) {
    await finalizeFailedUpdate();
    return;
  }

  isRetryingCreateAfterDelete.value = false;
  await finalizeSuccessfulSave(
    params.payload.type,
    params.payload.name,
    updateResult.token,
    "sharePage.editor.edit.succeedNotify",
    submitRouteSnapshot,
  );
};

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    if (routeMode.value === "create") {
      await handleCreate();
    } else {
      await handleEdit();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => route.fullPath,
  () => {
    loadEditorData();
  },
  { immediate: true },
);

watch(
  () => [form.sourceType, form.sourceName],
  () => {
    if (isHydratingForm.value) {
      return;
    }

    syncSourceModel();
  },
  { immediate: true },
);

watch(
  [sourceOptions, () => form.sourceType, () => form.sourceName],
  () => {
    updateSourceInput();
  },
  { deep: true, immediate: true },
);

watch(
  () => [
    form.sourceType,
    form.sourceName,
    form.expirationMode,
    form.expiresValue,
    form.expiresUnit,
    form.exactDatetime,
    form.token,
    form.displayName,
    form.remark,
    form.tag,
  ],
  () => {
    if (isHydratingForm.value || !form.shareUrl) {
      return;
    }

    form.shareUrl = "";
  },
);

</script>

<style lang="scss" scoped>
.share-editor-page {
  width: 100%;
}

.page-wrapper {
  padding: 0 var(--safe-area-side) calc(v-bind("padding") + 63px)
    var(--safe-area-side);

  :deep(.nut-cell-group__warp) {
    border-radius: var(--item-card-radios);
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
  }

  .sub-item-customer-icon {
    :deep(img) {
      opacity: 0.8;
      filter: brightness(var(--img-brightness));
    }
  }

  :deep(.nut-form-item__label) {
    width: auto;
  }

  :deep(.nut-form-item__body) {
    justify-content: flex-end;
  }

  :deep(.nut-form-item__body__slots) {
    width: 100%;
  }

  :deep(.nut-input-text) {
    .nut-input-inner {
      justify-content: flex-end;

      .nut-input-value {
        text-align: right;
      }

      .nut-input-left-icon,
      .nut-input-right-icon {
        cursor: pointer;
      }

      .nut-input-left-icon {
        margin-right: 10px;
      }

      .nut-input-right-icon {
        margin-left: 10px;
      }
    }
  }

  :deep(.nut-icon-shop:before) {
    cursor: pointer;
  }

  :deep(.nut-input),
  :deep(.nut-textarea) {
    background: transparent;
    color: var(--second-text-color);
  }

  :deep(.nut-textarea__textarea) {
    text-align: right;
  }
}

.switch-wrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.radio-wrapper {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;

  :deep(.nut-radio__button.false) {
    background: var(--divider-color);
    border-color: transparent;
    color: var(--second-text-color);
  }

  :deep(.nut-radio__button) {
    padding: 5px 10px;
  }
}

.source-input {
  cursor: pointer;

  :deep(.nut-input-value),
  :deep(.nut-input-inner),
  :deep(.nut-input-box),
  :deep(.input-text),
  :deep(.nut-input-right-icon),
  :deep(.nut-input__text--readonly) {
    cursor: pointer;
  }
}

.share-editor-state {
  width: min(100%, 640px);
  margin: 18px auto 0;
  padding: 0 var(--safe-area-side);
  text-align: center;

  h3 {
    margin: 0 0 12px;
    color: var(--primary-text-color);
    font-size: 18px;
    line-height: 1.35;
  }

  p {
    margin: 0;
    color: var(--comment-text-color);
    font-size: 14px;
    line-height: 1.6;
  }
}

.share-editor-state-card {
  padding: 20px 18px 24px;
  border-radius: var(--item-card-radios);
  background: var(--background-color);
  box-shadow: 0 12px 40px rgb(0 0 0 / 6%);

  h3 {
    margin-bottom: 0;
  }
}

.share-editor-state-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.share-editor-form {
  width: 100%;
}

.source-input-disabled {
  opacity: 0.7;
}

.share-url-input {
  :deep(.nut-input-value),
  :deep(.nut-input__text--readonly),
  :deep(.nut-input-box),
  :deep(.input-text) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  padding-bottom: 24px;
}

.qrcode {
  width: 168px;
  height: 168px;
  border-radius: 16px;
  overflow: hidden;
}

.bottom-btn-wrapper {
  position: fixed;
  display: flex;
  justify-content: space-between;
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

  .copy-btn {
    background: transparent;
    width: 36%;
  }

  .submit-btn {
    width: 62%;
  }
}

@media (max-width: 640px) {
  .share-editor-state-actions {
    flex-direction: column;
  }
}
</style>
