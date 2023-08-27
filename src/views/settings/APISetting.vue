<template>
  <div class="page-wrapper">
    <template v-if="isEnvReady">
      <h1 class="block-title">当前后端</h1>
      <nut-cell class="cell" center>
        <template v-slot:icon>
          <img :src="icon" alt="" class="auto-reverse backend-icon" />
        </template>
        <template v-slot:link>
          <span class="backend-version">{{
            `${env.backend} - ${env.version}`
          }}</span>
        </template>
      </nut-cell>
    </template>

    <ul>
      <li v-for="api in apis" :key="api.name">{{ api.name + api.url }}</li>
    </ul>

    <h1 class="block-title">{{ $t(`apiSettingPage.addApi.title`) }}</h1>
    <div class="add-api-wrapper">
      <nut-input
        class="input"
        v-model="addForm.name"
        :placeholder="$t(`apiSettingPage.addApi.placeholder.name`)"
        type="text"
        input-align="left"
      />
      <nut-input
        class="input"
        v-model="addForm.url"
        :placeholder="$t(`apiSettingPage.addApi.placeholder.url`)"
        type="text"
        input-align="left"
      />
      <nut-button
        class="save-btn"
        type="primary"
        size="mini"
        @click="addApiHandler"
        :disabled="!addForm.name || !addForm.url"
      >
        <font-awesome-icon icon="fa-solid fa-floppy-disk" />
        {{ $t(`apiSettingPage.addApi.btn`) }}
      </nut-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useBackend } from '@/hooks/useBackend';
  import { useHostAPI } from '@/hooks/useHostAPI';
  import { ref } from 'vue';

  const { icon, env, isEnvReady } = useBackend();
  const { currentName, apis, addApi } = useHostAPI();

  const addForm = ref<HostAPI>({
    name: '',
    url: '',
  });
  const addApiHandler = () => {
    if (!addForm.value.name || !addForm.value.url) return;
    addApi(addForm.value);
    addForm.value = {
      name: '',
      url: '',
    };
  };
</script>

<style scoped>
  .page-wrapper {
    min-height: 100%;
    padding: 16px var(--safe-area-side);
    color: var(--second-text-color);

    .block-title {
      font-size: 16px;
      font-weight: 500;
    }

    .cell {
      box-shadow: none;
      font-weight: bold;

      .backend-icon {
        opacity: 0.64;
        height: 48px;
        aspect-ratio: 1;
      }

      .backend-version {
        font-size: 14px;
        color: var(--comment-text-color);
        margin-left: auto;
      }
    }

    .add-api-wrapper {
      margin-top: 8px;
      background: var(--card-color);
      padding: 16px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: 16px;

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
      }
    }
  }
</style>
