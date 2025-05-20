<template>
  <nut-popup
    v-model:visible="visible"
    pop-class="magic-path-popup"
    position="center"
    :style="{
      width: isMobile() ? '90%' : '400px',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: 'var(--popup-color)',
    }"
    z-index="11000"
    :close-on-click-overlay="false"
  >
    <div class="magic-path-container">
      <div class="title">{{ $t('magicPath.title') }}</div>
      <div class="description" v-html="$t('magicPath.description')"></div>

      <!-- 显示URL参数错误信息 -->
      <div v-if="props.urlApiError" class="url-api-error">
        <nut-icon name="failure" size="16"></nut-icon>
        <span>{{ props.urlApiError }}</span>
      </div>

      <div class="input-container">
        <nut-input
          v-model="magicPath"
          :placeholder="$t('magicPath.placeholder')"
          class="magic-path-input"
          :error="!!error"
          :error-message="error"
          @blur="validateInput"
          @keyup.enter="handleSubmit"
        />

        <!-- 实时预览区域 -->
        <div v-if="magicPath.trim()" class="preview-container">
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

      <div class="buttons">
        <nut-button
          type="primary"
          block
          :loading="loading"
          @click="handleSubmit"
        >
          {{ $t('magicPath.connect') }}
        </nut-button>
        <nut-button
          plain
          block
          @click="handleSkip"
        >
          {{ $t('magicPath.skip') }}
        </nut-button>
      </div>

      <div class="info">
        <p>{{ $t('magicPath.info') }}</p>
        <p>{{ $t('magicPath.dockerInfo') }}</p>
      </div>
    </div>
  </nut-popup>
</template>

<script lang="ts" setup>
import { ref, computed, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useHostAPI } from '@/hooks/useHostAPI';
import { useAppNotifyStore } from '@/store/appNotify';
import { isMobile } from '@/utils/isMobile';
import axios from 'axios';

const { t } = useI18n();
const { showNotify } = useAppNotifyStore();
const { addApi, setCurrent } = useHostAPI();

const props = defineProps<{
  modelValue: boolean;
  urlApiError?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const magicPath = ref('');
const error = ref('');
const loading = ref(false);

// 输入类型：'path'(仅路径), 'host'(主机+路径), 'full'(完整URL)
const inputType = ref('path');
const parsedHost = ref('');
const parsedPath = ref('');
const previewUrl = ref('');
const currentOrigin = ref(window.location.origin);

// 处理提交
const handleSubmit = async () => {
  // 先进行输入验证
  if (!validateInput()) {
    // 强制更新错误状态，确保错误信息显示
    error.value = error.value || t('magicPath.errors.invalid');

    // 如果没有显示通知，则显示一个
    showNotify({
      title: error.value,
      type: 'danger'
    });
    return;
  }

  loading.value = true;

  try {
    // 使用已经解析好的预览URL
    const apiUrl = previewUrl.value;

    if (!apiUrl) {
      error.value = t('magicPath.errors.empty');
      return;
    }

    // 测试API连接
    try {
      const res = await axios.get(`${apiUrl}/api/utils/env`);
      if (res?.data?.status !== 'success') {
        error.value = t('magicPath.errors.invalid');
        return;
      }

      // 添加API并设置为当前API
      const apiName = `Custom_${new Date().getTime()}`;
      const addResult = await addApi({ name: apiName, url: apiUrl });

      if (!addResult) {
        // addApi内部已经显示了错误通知，这里不需要再设置error
        return;
      }

      setCurrent(apiName);

      showNotify({
        title: t('magicPath.success'),
        type: 'success'
      });

      // 关闭对话框
      visible.value = false;

      // 设置已配置标志
      localStorage.setItem('backendConfigured', 'true');
      // 兼容旧版本
      localStorage.setItem('magicPathConfigured', 'true');

      // 清除sessionStorage中的状态
      sessionStorage.removeItem('showMagicPathDialog');
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
    loading.value = false;
  }
};

// 跳过配置
const handleSkip = () => {
  localStorage.setItem('backendConfigured', 'true');
  localStorage.setItem('magicPathConfigured', 'true'); // 兼容旧版本
  sessionStorage.removeItem('showMagicPathDialog');
  visible.value = false;
};

// 验证输入
const validateInput = () => {
  const input = magicPath.value.trim();

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

// 当对话框关闭时重置状态，当对话框打开时检查URL参数错误
watch(visible, (newValue) => {
  if (!newValue) {
    magicPath.value = '';
    error.value = '';
    // 清除sessionStorage中的状态
    sessionStorage.removeItem('showMagicPathDialog');
  } else if (newValue && props.urlApiError) {
    // 如果有URL参数错误信息，显示在错误提示中
    error.value = props.urlApiError;
  }
});

// 监听URL参数错误信息的变化
watch(() => props.urlApiError, (newValue) => {
  if (newValue && visible.value) {
    // 如果有新的URL参数错误信息且对话框正在显示，更新错误提示
    error.value = newValue;
  }
});

// 实时解析输入
watchEffect(() => {
  const input = magicPath.value.trim();

  // 如果输入为空，设置默认值并返回
  if (!input) {
    inputType.value = 'path';
    parsedHost.value = '';
    parsedPath.value = '';
    previewUrl.value = '';
    return;
  }

  // 只有当用户正在输入时才清除错误状态
  // 如果用户刚刚完成输入（通过blur事件触发验证），我们不应该清除错误
  if (document.activeElement === document.querySelector('.magic-path-input input')) {
    error.value = '';
  }

  // 判断输入类型
  if (input.includes('://')) {
    // 完整URL
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
    // 带端口的主机+路径 (IP:端口/路径 或 localhost:端口/路径)
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
    // 仅路径
    inputType.value = 'path';
    parsedPath.value = input.replace(/^\/+/, '');
    parsedHost.value = '';
    previewUrl.value = `${currentOrigin.value}/${parsedPath.value}`;
  }
});
</script>

<style lang="scss" scoped>
.magic-path-container {
  display: flex;
  flex-direction: column;
  width: 100%;

  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    text-align: center;
    color: var(--primary-text-color);
  }

  .description {
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
    color: var(--second-text-color);

    :deep(br) {
      display: block;
      content: "";
      margin-top: 8px;
    }

    :deep(a) {
      color: var(--primary-color);
      text-decoration: none;
    }
  }

  .url-api-error {
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 8px;
    background-color: rgba(255, 0, 0, 0.05);
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    .nut-icon {
      flex-shrink: 0;
    }

    span {
      flex: 1;
    }
  }

  .input-container {
    margin-bottom: 20px;

    .magic-path-input {
      width: 100%;
      background: transparent;

      :deep(.nut-input-inner) {
        background-color: var(--card-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 10px 12px;
      }

      :deep(.nut-input__text) {
        color: var(--primary-text-color);
      }

      :deep(.nut-input__placeholder) {
        color: var(--comment-text-color);
      }

      :deep(input) {
        background-color: transparent;
        color: var(--primary-text-color);
      }

      :deep(.nut-input-clear) {
        color: var(--comment-text-color);
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

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }

  .info {
    font-size: 12px;
    color: var(--comment-text-color);
    text-align: center;
    background-color: var(--card-color);
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    margin-top: 5px;

    p {
      margin: 5px 0;
      line-height: 1.4;
    }
  }
}

.magic-path-popup {
  background-color: var(--popup-color);

  :deep(.nut-input) {
    background-color: transparent;
  }

  :deep(input) {
    background-color: transparent;
    color: var(--primary-text-color);
  }
}
</style>
