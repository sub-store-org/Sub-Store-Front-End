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
  </div>
</template>

<script setup lang="ts">
  import { useBackend } from '@/hooks/useBackend';

  const { icon, env, isEnvReady } = useBackend();
</script>

<style scoped>
  .page-wrapper {
    min-height: 100%;
    padding: 16px var(--safe-area-side);
    color: var(--second-text-color);

    .block-title {
      font-size: 18px;
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
  }
</style>
