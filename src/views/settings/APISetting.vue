<template>
  <div class="page-wrapper">
    <template v-if="isEnvReady">
      <nut-cell-group :title="$t(`apiSettingPage.currentApi.title`)">
        <nut-cell class="cell" center>
          <template #icon>
            <img :src="env.meta?.node?.env?.SUB_STORE_BACKEND_CUSTOM_ICON || icon" alt="" class="auto-reverse backend-icon">
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
      <nut-cell @click="setCurrent('')">
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
        @click="setCurrent(api.name)"
      >
        <div class="api-list-item">
          <div class="api-item-left">
            <h2>
              {{ api.name }}
              <nut-tag v-if="currentName === api.name" type="primary" plain>
                {{ $t(`apiSettingPage.apiList.currentTag`) }}
              </nut-tag>
            </h2>
            <p>{{ `${api.url.slice(0, 20)}******` }}</p>
          </div>
          <div class="api-item-right">
            <font-awesome-icon
              class="copy-icon"
              icon="fa-solid fa-clone"
              @click.stop="copyApi(api)"
            />
            <font-awesome-icon
              icon="fa-solid fa-xmark"
              @click.stop="deleteApi(api.name)"
            />
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
                <span class="preview-path">/{{ parsedPath }}</span>
              </template>
              <template v-else>
                <span class="preview-origin">{{ currentOrigin }}/</span>
                <span class="preview-path">{{ parsedPath }}</span>
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
      {{ $t(`apiSettingPage.apiSettingDesc2`) }}
      <a
        href="https://xream.notion.site/Sub-Store-abe6a96944724dc6a36833d5c9ab7c87"
        target="_blank"
      >
        https://xream.notion.site/Sub-Store-abe6a96944724dc6a36833d5c9ab7c87</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Dialog, Toast } from "@nutui/nutui";
import { ref, onMounted, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBackend } from '@/hooks/useBackend';
import { useHostAPI } from '@/hooks/useHostAPI';
import axios from 'axios';

import { useClipboard } from '@vueuse/core';
import useV3Clipboard from 'vue-clipboard3';
import { useAppNotifyStore } from '@/store/appNotify';

const { t } = useI18n();
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();

const { icon, env, isEnvReady } = useBackend();
const { defaultAPI, currentName, apis, setCurrent, addApi, deleteApi }
    = useHostAPI();

const addForm = ref<HostAPI>({
  name: '',
  url: '',
});


const error = ref('');
const checkingAPI = ref(false);


const inputType = ref('path');
const parsedHost = ref('');
const parsedPath = ref('');
const previewUrl = ref('');
const currentOrigin = ref(window.location.origin);

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

  checkingAPI.value = true;

  try {

    const apiUrl = previewUrl.value;

    if (!apiUrl) {
      error.value = t('magicPath.errors.empty');
      return;
    }


    try {
      const res = await axios.get(`${apiUrl}/api/utils/env`);
      if (res?.data?.status !== 'success') {
        error.value = t('magicPath.errors.invalid');
        showNotify({
          title: error.value,
          type: 'danger'
        });
        return;
      }


      const result = await addApi({ name: addForm.value.name, url: apiUrl });

      if (result) {
        setCurrent(addForm.value.name);

        showNotify({
          title: t('magicPath.success'),
          type: 'success'
        });


        addForm.value = {
          name: '',
          url: '',
        };
        error.value = '';
      }
    } catch (e) {
      error.value = t('magicPath.errors.connection');
      showNotify({
        title: t('magicPath.errors.connection'),
        type: 'danger'
      });
    }
  } catch (e) {
    error.value = t('magicPath.errors.unknown');
    showNotify({
      title: t('magicPath.errors.unknown'),
      type: 'danger'
    });
  } finally {
    checkingAPI.value = false;
  }
};

const copyApi = async (api: HostAPI) => {
  const url = `${window.location.origin}?api=${encodeURIComponent(api.url)}`;
  if (isSupported) {
    await copy(url);
  } else {
    await copyFallback(url);
  }
  showNotify({ title: url });
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

    previewUrl.value = `http://${parsedHost.value}/${parsedPath.value}`;
  } else {
    inputType.value = 'path';
    parsedPath.value = input.replace(/^\/+/, '');
    parsedHost.value = '';
    previewUrl.value = `${currentOrigin.value}/${parsedPath.value}`;
  }
});

onMounted(() => {
  if (apis.value.length) return;
  try {
    if (localStorage.getItem('api-desc-read')) return;
  } catch (e) {

  }
  Dialog({
    title: '后端设置',
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

      .api-item-left {
        display: flex;
        flex-direction: column;
        gap: 4px;

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

        > p {
          font-size: 12px;
          color: var(--comment-text-color);
        }
      }

      .api-item-right {
        font-size: 20px;
        color: var(--comment-text-color);
        cursor: pointer;
        .copy-icon {
          margin-right: 16px;
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
