<template>
  <div class="page-wrapper">
    <template v-if="isEnvReady">
      <nut-cell-group :title="$t(`apiSettingPage.currentApi.title`)">
        <nut-cell class="cell" center>
          <template #icon>
            <img :src="backendIcon" alt="" class="auto-reverse backend-icon">
          </template>
          <template #title>
            <span class="backend-title">{{
              currentName === ''
                ? $t(`apiSettingPage.apiList.defaultName`)
                : currentName
            }}</span>
          </template>
          <template #link>
            <span class="backend-version">{{
              `${env.meta?.node?.env?.SUB_STORE_BACKEND_CUSTOM_NAME || env.backend} - ${env.version}`
            }}</span>
          </template>
        </nut-cell>
      </nut-cell-group>
    </template>

    <nut-cell-group
      :title="$t(`apiSettingPage.apiList.title`)"
      :desc="$t(`apiSettingPage.apiList.desc`)"
    >
      <nut-cell @click="handleSwitchClick('')">
        <div class="api-list-item">
          <div class="api-item-left">
            <h2>
              {{ $t(`apiSettingPage.apiList.defaultName`) }}
              <nut-tag v-if="currentName === ''" type="primary" plain>
                {{ $t(`apiSettingPage.apiList.currentTag`) }}
              </nut-tag>
            </h2>
            <p>{{ defaultAPI }}</p>
          </div>
        </div>
      </nut-cell>

      <nut-cell
        v-for="api in apis"
        :key="api.name"
        @click="handleSwitchClick(api.name)"
      >
        <div class="api-list-item">
          <div class="api-item-left">
            <h2>
              <nut-input
                v-if="editingApiName === api.name"
                v-model="editApiNameInput"
                class="api-name-input"
                type="text"
                input-align="left"
                @click.stop
                @keyup.enter.stop="saveApiName(api)"
              />
              <template v-else>
                {{ api.name }}
              </template>
              <nut-tag v-if="currentName === api.name" type="primary" plain>
                {{ $t(`apiSettingPage.apiList.currentTag`) }}
              </nut-tag>
            </h2>
            <p>{{ `${api.url.slice(0, 20)}******` }}</p>
          </div>
          <div class="api-item-right">
            <template v-if="editingApiName === api.name">
              <button
                type="button"
                class="api-action-btn"
                :title="$t(`apiSettingPage.apiList.saveName`)"
                @click.stop="saveApiName(api)"
              >
                <font-awesome-icon icon="fa-solid fa-floppy-disk" />
              </button>
              <button
                type="button"
                class="api-action-btn"
                :title="$t(`apiSettingPage.apiList.cancelEditName`)"
                @click.stop="cancelEditApiName"
              >
                <font-awesome-icon icon="fa-solid fa-ban" />
              </button>
            </template>
            <template v-else>
              <button
                type="button"
                class="api-action-btn"
                :title="$t(`apiSettingPage.apiList.copy`)"
                @click.stop="copyApi(api)"
              >
                <font-awesome-icon icon="fa-solid fa-clone" />
              </button>
              <button
                type="button"
                class="api-action-btn"
                :title="$t(`apiSettingPage.apiList.editName`)"
                @click.stop="startEditApiName(api)"
              >
                <font-awesome-icon icon="fa-solid fa-pen-nib" />
              </button>
              <button
                type="button"
                class="api-action-btn"
                :title="$t(`apiSettingPage.apiList.delete`)"
                @click.stop="deleteApi(api.name)"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </button>
            </template>
          </div>
        </div>
      </nut-cell>
    </nut-cell-group>

    <nut-cell-group :title="$t(`apiSettingPage.addApi.title`)">
      <div class="add-api-wrapper">
        <div class="add-form-wrapper">
          <nut-input
            v-model="addForm.name"
            class="input"
            :placeholder="$t(`apiSettingPage.addApi.placeholder.name`)"
            type="text"
            input-align="left"
          />
          <nut-input
            v-model="addForm.url"
            class="input"
            :placeholder="$t(`apiSettingPage.addApi.placeholder.url`)"
            type="text"
            input-align="left"
            :error="!!error"
            :error-message="error"
            @blur="validateInput"
            @keyup.enter="addApiHandler"
          />


          <div v-if="addForm.url.trim()" class="preview-container">
            <div class="preview-label">{{ $t('magicPath.preview') }}:</div>
            <div class="preview-url">
              <span v-if="inputType === 'full'" class="preview-full">{{ previewUrl }}</span>
              <template v-else-if="inputType === 'host'">
                <span class="preview-protocol">http://</span>
                <span class="preview-host">{{ parsedHost }}</span>
                <span class="preview-path">{{ (parsedPath && parsedPath !== '/') ? `/${parsedPath}` : '' }}</span>
              </template>
              <template v-else>
                <span class="preview-origin">{{ currentOrigin }}</span>
                <span class="preview-path">{{ (parsedPath && parsedPath !== '/') ? `/${parsedPath}` : '' }}</span>
              </template>
            </div>
            <div class="preview-type">
              {{ $t(`magicPath.inputTypes.${inputType}`) }}
            </div>
          </div>
        </div>
        <nut-button
          class="save-btn"
          type="primary"
          :disabled="!addForm.name || !addForm.url"
          :loading="checkingAPI"
          @click="addApiHandler"
        >
          <font-awesome-icon
            v-if="!checkingAPI"
            icon="fa-solid fa-floppy-disk"
          />

        </nut-button>
      </div>
    </nut-cell-group>

    <p class="desc-text">
      <p>{{ $t(`apiSettingPage.apiSettingDesc0`) }}</p>
      <p>{{ $t(`apiSettingPage.apiSettingDesc1`) }}</p>
      <span>{{ $t(`apiSettingPage.apiSettingDesc2`) }}</span>
      <a
        href="https://xream.notion.site/Sub-Store-abe6a96944724dc6a36833d5c9ab7c87"
        target="_blank"
      >
        https://xream.notion.site/Sub-Store-abe6a96944724dc6a36833d5c9ab7c87</a>
      <br/>
      4. <a href="https://t.me/zhetengsha/218" target="_blank">{{ $t('magicPath.troubleshooting') }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Dialog, Toast } from "@nutui/nutui";
import { computed, ref, onMounted, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBackend } from '@/hooks/useBackend';
import { useHostAPI } from '@/hooks/useHostAPI';
import axios from 'axios';

import { useClipboard } from '@vueuse/core';
import useV3Clipboard from 'vue-clipboard3';
import { storeToRefs } from 'pinia';
import { useAppNotifyStore } from '@/store/appNotify';
import { useSettingsStore } from '@/store/settings';
import { createGithubProxyUrlRewriter } from '@/utils/githubProxy';

const { t } = useI18n();
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();

const { icon, env, isEnvReady } = useBackend();
const settingsStore = useSettingsStore();
const { githubProxy, githubProxyRegex } = storeToRefs(settingsStore);
const { defaultAPI, currentName, apis, setCurrent, addApi, editApiName: updateApiName, deleteApi }
    = useHostAPI();
const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const backendIcon = computed(() => {
  return githubUrlRewriter.value(
    env.value?.meta?.node?.env?.SUB_STORE_BACKEND_CUSTOM_ICON || icon.value,
  ) || icon.value;
});

const addForm = ref<HostAPI>({
  name: '',
  url: '',
});
const editingApiName = ref('');
const editApiNameInput = ref('');


const error = ref('');
const checkingAPI = ref(false);
const switchingAPI = ref(false);


const inputType = ref('path');
const parsedHost = ref('');
const parsedPath = ref('');
const previewUrl = ref('');
const currentOrigin = ref(window.location.origin);

const copyApi = async (api: HostAPI) => {
  const url = `${window.location.origin}?api=${encodeURIComponent(api.url)}`;
  if (isSupported) {
    await copy(url);
  } else {
    await copyFallback(url);
  }
  showNotify({ title: url });
};

const startEditApiName = (api: HostAPI) => {
  editingApiName.value = api.name;
  editApiNameInput.value = api.name;
};

const cancelEditApiName = () => {
  editingApiName.value = '';
  editApiNameInput.value = '';
};

const saveApiName = async (api: HostAPI) => {
  const nextName = editApiNameInput.value.trim();

  if (!nextName) {
    showNotify({
      title: t('apiSettingPage.addApi.errors.nameEmpty'),
      type: 'danger',
    });
    return;
  }

  if (nextName === api.name) {
    cancelEditApiName();
    return;
  }

  if (apis.value.some(item => item.url !== api.url && item.name === nextName)) {
    showNotify({
      title: t('apiSettingPage.addApi.errors.nameDuplicate'),
      type: 'danger',
    });
    return;
  }

  const result = await updateApiName({ name: nextName, url: api.url });
  if (result) {
    cancelEditApiName();
    showNotify({ title: t('magicPath.success'), type: 'success' });
  }
};

// 验证输入
const validateInput = () => {
  const input = addForm.value.url.trim();

  if (!input) {
    error.value = t('magicPath.errors.empty');
    return false;
  }

  // 根据输入内容判断类型并验证
  if (input.includes('://')) {
    // 完整URL格式
    try {
      new URL(input);
    } catch (e) {
      error.value = t('magicPath.errors.invalid');
      showNotify({
        title: t('magicPath.errors.invalid'),
        type: 'danger'
      });
      return false;
    }
  } else if (/^\d+\.\d+\.\d+\.\d+(?::\d+)?$/.test(input) || /^localhost(?::\d+)?$/.test(input)) {
    // IP地址或localhost格式
    if (!input.includes(':')) {
      error.value = t('magicPath.errors.invalid');
      showNotify({
        title: t('magicPath.errors.invalid') + ' - ' + t('magicPath.errors.portRequired'),
        type: 'danger'
      });
      return false;
    }
  } else if (/^https?:\/\//.test(input)) {
    // 不完整的URL格式（有http(s):// 但格式不正确）
    error.value = t('magicPath.errors.invalid');
    showNotify({
      title: t('magicPath.errors.invalid'),
      type: 'danger'
    });
    return false;
  }

  // 如果通过所有验证，清除错误
  error.value = '';
  return true;
};


const addApiHandler = async () => {

  if (!validateInput()) {

    error.value = error.value || t('magicPath.errors.invalid');


    showNotify({
      title: error.value,
      type: 'danger'
    });
    return;
  }

  if (!addForm.value.name) {
    error.value = t('apiSettingPage.addApi.errors.nameEmpty');
    showNotify({
      title: error.value,
      type: 'danger'
    });
    return;
  }
  // 使用解析后的完整URL（host:port 类型会被 previewUrl 补全为 http://...）
  const addFormUrl = previewUrl.value || (addForm.value.url && addForm.value.url.trim());
  const addFormName = addForm.value.name && addForm.value.name.trim();
  // 默认API地址
  const defaultApiUrl = defaultAPI && defaultAPI.trim();
  
  // 如果输入的地址与默认API地址不同，且不为空，则进行重复检查
  if (addFormUrl && addFormUrl !== defaultApiUrl) {
    const existingApi = apis.value.find(api => api.url === addFormUrl);
    // 如果存在相同地址的API，提示用户选择是切换还是覆盖
    if (existingApi) {
      Dialog({
        title: t('apiSettingPage.addApi.duplicate.title'),
        content: t('apiSettingPage.addApi.duplicate.content', { name: existingApi.name }),
        onOk: async () => {
          checkingAPI.value = true;
          try {
            const ok = await checkApiConnectivity(existingApi.url);
            if (ok) {
              setCurrent(existingApi.name);
              await resetAddForm();
              showNotify({ title: t('magicPath.success'), type: 'success' });
            }
          } finally {
            checkingAPI.value = false;
          }
        },
        onCancel: async () => {
          await setApi({ name: addFormName, url: addFormUrl, isEditName: true });
        },
        popClass: "auto-dialog",
        noCancelBtn: false,
        okText: t('apiSettingPage.addApi.duplicate.confirm'),
        cancelText: t('apiSettingPage.addApi.duplicate.cancel'),
        closeOnClickOverlay: true,
        lockScroll: false,
      });
      return;
    }
  }
  // 如果没有重复，直接添加
  await setApi({ name: addFormName, url: addFormUrl });
};

// 检查API连通性，成功返回 true，失败自动 showNotify 并返回 false
const checkApiConnectivity = async (url: string): Promise<boolean> => {
  try {
    const res = await axios.get(`${url}/api/utils/env`);
    if (res?.data?.status !== 'success') {
      showNotify({ title: t('magicPath.errors.invalid'), type: 'danger' });
      return false;
    }
    return true;
  } catch (e) {
    showNotify({ title: t('magicPath.errors.connection'), type: 'danger' });
    return false;
  }
};

// 切换前先检查连通性再调用 setCurrent（使用独立 switchingAPI 避免影响表单 loading 状态）
const switchToApi = async (name: string) => {
  if (switchingAPI.value) return;
  if (name === currentName.value) return;

  const rawUrl = name === ''
    ? defaultAPI
    : apis.value.find(api => api.name === name)?.url;
  if (!rawUrl) {
    setCurrent(name);
    return;
  }
  // 补全协议头：纯 host:port 格式需要加 http://
  const url = /^\d+\.\d+\.\d+\.\d+:\d+/.test(rawUrl) || /^localhost:\d+/.test(rawUrl)
    ? `http://${rawUrl}`
    : rawUrl;
  switchingAPI.value = true;
  Toast.loading(t('apiSettingPage.switchApi.loading'), {
    cover: true,
    id: 'switch-api-loading',
    duration: 0
  });
  try {
    const ok = await checkApiConnectivity(url);
    if (ok) {
      setCurrent(name);
      showNotify({ title: t('magicPath.success'), type: 'success' });
    }
  } finally {
    Toast.hide('switch-api-loading');
    switchingAPI.value = false;
  }
};

const handleSwitchClick = async (name: string) => {
  if (switchingAPI.value) return;
  await switchToApi(name);
};

const setApi = async ({ name = '', url = '', isEditName = false }) => {
  // 开始检查后端API连接状态
  checkingAPI.value = true;

  try {
    const apiUrl = url;
    const apiName = name;
    if (!apiUrl) {
      error.value = t('magicPath.errors.empty');
      return;
    }
    const ok = await checkApiConnectivity(apiUrl);
    if (!ok) {
      error.value = t('magicPath.errors.connection');
      return;
    }

    let result = null;
    if (isEditName) {
      result = await updateApiName({ name: apiName, url: apiUrl });
    } else {
      // 已通过 checkApiConnectivity 验证，跳过 addApi 内部的重复检查
      result = await addApi({ name: apiName, url: apiUrl }, true);
    }
    console.log('result', result);
    if (result) {
      setCurrent(apiName);
      showNotify({ title: t('magicPath.success'), type: 'success' });
      addForm.value = { name: '', url: '' };
      error.value = '';
    }
  } catch (e) {
    error.value = t('magicPath.errors.unknown');
    showNotify({ title: t('magicPath.errors.unknown'), type: 'danger' });
  } finally {
    checkingAPI.value = false;
  }
};

const resetAddForm = async () => {
  addForm.value = {
    name: '',
    url: '',
  };
  error.value = '';
};

watchEffect(() => {
  const input = addForm.value.url.trim();


  if (!input) {
    inputType.value = 'path';
    parsedHost.value = '';
    parsedPath.value = '';
    previewUrl.value = '';
    return;
  }


  if (document.activeElement === document.querySelector('.add-form-wrapper .input:nth-child(2) input')) {
    error.value = '';
  }

  if (input.includes('://')) {
    inputType.value = 'full';
    previewUrl.value = input;

    try {
      const url = new URL(input);
      parsedHost.value = url.host;
      parsedPath.value = url.pathname.replace(/^\/+/, '');
    } catch (e) {
      parsedHost.value = '';
      parsedPath.value = input;
    }
  } else if (/^\d+\.\d+\.\d+\.\d+:\d+/.test(input) || /^localhost:\d+/.test(input)) {
    inputType.value = 'host';

    if (input.includes('/')) {
      const parts = input.split('/');
      parsedHost.value = parts[0];
      parsedPath.value = parts.slice(1).join('/');
    } else {
      parsedHost.value = input;
      parsedPath.value = '';
    }

    previewUrl.value = `http://${parsedHost.value}${(parsedPath.value && parsedPath.value !== '/') ? `/${parsedPath.value}` : ''}`;
  } else {
    inputType.value = 'path';
    parsedPath.value = input.replace(/^\/+/, '');
    parsedHost.value = '';
    previewUrl.value = `${currentOrigin.value}${(parsedPath.value && parsedPath.value !== '/') ? `/${parsedPath.value}` : ''}`;
  }
});

onMounted(() => {
  if (apis.value.length) return;
  try {
    if (localStorage.getItem('api-desc-read')) return;
  } catch (e) {

  }
  Dialog({
    title: '后端管理',
    content: `请仔细阅读页面底部的说明\n\n该写的都写了`,
    onCancel: () => {
      localStorage.setItem('api-desc-read', '1')
    },
    onOk: () => {
      localStorage.setItem('api-desc-read', '1')
    },
    popClass: "auto-dialog",
    okText: '我马上看',
    cancelText: '我立刻看',
    closeOnClickOverlay: false,
    lockScroll: false,
  });
});

</script>

<style lang="scss" scoped>
  .page-wrapper {
    min-height: 100%;
    padding: 16px var(--safe-area-side);
    color: var(--second-text-color);

    .cell {
      box-shadow: none;
      font-weight: bold;

      .backend-icon {
        opacity: 0.64;
        height: 48px;
        aspect-ratio: 1;
      }

      .backend-title {
        margin-left: 12px;
        font-size: 16px;
      }

      .backend-version {
        font-size: 14px;
        color: var(--comment-text-color);
        margin-left: auto;
      }
    }

    .api-list-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      cursor: pointer;

      .api-item-left {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
        min-width: 0;

        :deep(.nut-tag) {
          background: transparent !important;
          height: 20px;
        }

        > h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          line-height: 20px;
          font-weight: bold;
          color: var(--second-text-color);
        }

        .api-name-input {
          width: 160px;
          min-width: 0;
          padding: 0;
          background: transparent;
          color: var(--second-text-color);
          font-size: 16px;
          font-weight: bold;
        }

        > p {
          font-size: 12px;
          color: var(--comment-text-color);
        }
      }

      .api-item-right {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
        color: var(--comment-text-color);

        .api-action-btn {
          width: 28px;
          height: 28px;
          padding: 0;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--comment-text-color);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          opacity: 0.78;

          svg {
            width: 15px;
            height: 15px;
          }

          &:hover,
          &:focus-visible {
            background: var(--card-color);
            color: var(--primary-color);
            opacity: 1;
          }
        }
      }
    }

    .add-api-wrapper {
      margin-top: 8px;
      background: var(--card-color);
      padding: 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 16px;

      .add-form-wrapper {
        flex: 1;

        .input {
          background: transparent;
          padding: 8px;
          color: var(--second-text-color);
          font-size: 14px;

          :deep(img) {
            width: 16px;
            height: 16px;
            margin-right: 6px;
            opacity: 0.2;
            filter: brightness(var(--img-brightness));
          }

          &:not(:first-child) {
            margin-top: 8px;
          }

          :deep(.nut-input-error-message) {
            color: var(--danger-color);
            font-size: 12px;
            padding: 4px 0;
            display: block;
            font-weight: bold;
            background-color: rgba(255, 0, 0, 0.05);
            border-radius: 4px;
            padding: 6px 8px;
            margin-top: 4px;
          }
        }

        .preview-container {
          margin-top: 10px;
          padding: 10px;
          border-radius: 8px;
          background-color: var(--card-color);
          border: 1px solid var(--divider-color);
          font-size: 13px;

          .preview-label {
            font-weight: bold;
            margin-bottom: 8px;
            color: var(--second-text-color);
          }

          .preview-url {
            word-break: break-all;
            margin-bottom: 8px;
            padding: 8px;
            border-radius: 4px;
            background-color: var(--background-color);
            font-family: monospace;
            border: 1px solid var(--divider-color);

            .preview-protocol, .preview-origin {
              color: var(--comment-text-color);
            }

            .preview-host {
              color: var(--primary-color);
              font-weight: bold;
            }

            .preview-path {
              color: var(--primary-text-color);
            }

            .preview-full {
              color: var(--primary-text-color);
            }
          }

          .preview-type {
            font-size: 12px;
            color: var(--comment-text-color);
            font-style: italic;
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px solid var(--divider-color);
          }
        }
      }

      .save-btn {
        width: 5%;
        flex-shrink: 0;
        flex-grow: 0;
        font-size: 18px;
      }
    }

    .desc-text {
      padding: 0 16px;
      font-size: 12px;
      color: var(--comment-text-color);

      > a {
        color: var(--primary-color);
      }
    }

  }
</style>
