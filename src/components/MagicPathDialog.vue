<template>
  <nut-popup
    v-model:visible="visible"
    pop-class="magic-path-popup"
    position="center"
    :style="{
      width: isMobile() ? '90%' : '400px',
      borderRadius: '12px',
      padding: '20px',
    }"
    z-index="11000"
    :close-on-click-overlay="false"
  >
    <div class="magic-path-container">
      <h3 class="title">{{ $t('magicPath.title') }}</h3>
      <p class="description" v-html="$t('magicPath.description')"></p>

      <div class="input-container">
        <nut-input
          v-model="magicPath"
          :placeholder="$t('magicPath.placeholder')"
          class="magic-path-input"
          :error="!!error"
          :error-message="error"
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
  if (!magicPath.value.trim()) {
    error.value = t('magicPath.errors.empty');
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    // 使用已经解析好的预览URL
    const apiUrl = previewUrl.value;

    if (!apiUrl) {
      error.value = t('magicPath.errors.empty');
      return;
    }

    console.log('尝试连接到API:', apiUrl);

    // 测试API连接
    try {
      const res = await axios.get(`${apiUrl}/api/utils/env`);
      if (res?.data?.status !== 'success') {
        throw new Error(t('magicPath.errors.invalid'));
      }

      // 添加API并设置为当前API
      const apiName = `Custom_${new Date().getTime()}`;
      await addApi({ name: apiName, url: apiUrl });
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
      console.error('API连接测试失败:', e);
    }
  } catch (e) {
    error.value = t('magicPath.errors.unknown');
    console.error('处理magicPath时出错:', e);
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

// 当对话框关闭时重置状态
watch(visible, (newValue) => {
  if (!newValue) {
    magicPath.value = '';
    error.value = '';
    // 清除sessionStorage中的状态
    sessionStorage.removeItem('showMagicPathDialog');
  }
});

// 实时解析输入
watchEffect(() => {
  const input = magicPath.value.trim();
  console.log('输入变化 (watchEffect):', input);

  if (!input) {
    inputType.value = 'path';
    parsedHost.value = '';
    parsedPath.value = '';
    previewUrl.value = '';
    return;
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
  }

  .input-container {
    margin-bottom: 20px;

    .magic-path-input {
      width: 100%;
    }

    .preview-container {
      margin-top: 10px;
      padding: 10px;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 13px;

      .preview-label {
        font-weight: bold;
        margin-bottom: 5px;
        color: var(--second-text-color);
      }

      .preview-url {
        word-break: break-all;
        margin-bottom: 5px;
        padding: 5px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.05);
        font-family: monospace;

        .preview-protocol, .preview-origin {
          color: var(--comment-text-color);
        }

        .preview-host {
          color: var(--primary-color);
          font-weight: bold;
        }

        .preview-path {
          color: var(--second-text-color);
        }

        .preview-full {
          color: var(--primary-text-color);
        }
      }

      .preview-type {
        font-size: 12px;
        color: var(--comment-text-color);
        font-style: italic;
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

    p {
      margin: 4px 0;
    }
  }
}

.magic-path-popup {
  background-color: var(--popup-color);
}
</style>
