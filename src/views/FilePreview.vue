<template>
  <Teleport to="#app">
    <div class="compare-page-wrapper">
      <header class="compare-page-header">
        <h1>
          <font-awesome-icon icon="fa-solid fa-eye" />
          {{ $t(`comparePage.title`) }}
          <span
            ><font-awesome-icon icon="fa-solid fa-angles-right" />{{
              displayName
            }}</span
          >
        </h1>
        <button @click="clickClose">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </button>
      </header>
      <div class="compare-page-body">
        <div class="block-wrapper">
          <div class="input-wrapper">
            <nut-textarea v-model="processedData" :rows="23" autosize placeholder=" " readonly />
          </div>
          
        </div>


      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { useSubsApi } from '@/api/subs';
  import { useSubsStore } from '@/store/subs';
  import { Toast } from '@nutui/nutui';
  import { computed, ref, toRaw } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const subsStore = useSubsStore();
  const { previewData, name } = defineProps<{
    previewData: any;
    name: string;
  }>();

  const emit = defineEmits(['closePreview']);

  const isOriginalVisible = ref(true);
  const isProcessedVisible = ref(true);

  const displayName = computed(() => {
    const sub = subsStore.getOneFile(name)
    return sub?.displayName || sub?.['display-name'] || name;
  });



  const originalData = previewData.original;
  const processedData = previewData.processed;


  const clickClose = () => {
    emit('closePreview');
  };
</script>

<style lang="scss" scoped>
  .type-tag {
    padding: 1px 4px;
    line-height: 1;
    margin-right: 3px;
    color: var(--compare-tag-text-color);
    background: var(--compare-tag-background-color);
  }

  .item-true {
    color: var(--primary-color);
  }

  .item-false {
    width: 8px;
    height: 1px;
    border-radius: 2px;
    background: var(--lowest-text-color);
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
  }

  .compare-table-body {
    width: 100%;

    .processed-tr {
      padding-top: 20px;
      padding-bottom: 0;
    }

    .original-tr {
      padding-top: 10px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--divider-color);
    }
  }

  .compare-table-row {
    padding: 0 var(--safe-area-side);
  }

  .compare-table-head {
    padding: 10px var(--safe-area-side);
  }

  .compare-table-head,
  .compare-table-row {
    margin: 0;
    display: grid;
    grid-template-columns: 46% 1fr 1fr 1fr 1fr;

    li {
    }
    li,
    td {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    li:first-child,
    td:first-child {
      justify-content: start;
    }
  }

  .compare-table-head {
    position: sticky;
    z-index: 7;
    top: 114px;
    border-bottom: 1px solid var(--divider-color);
    font-weight: bold;
    background: var(--background-color);
    color: var(--comment-text-color);

    &.filter-table-head {
      top: 84px;
    }
  }

  .processed-item,
  .original-item {
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 10px;
      background: var(--primary-color);
    }
  }

  .indicator {
    margin-right: 24px;
  }

  .processed-item::before {
    background: var(--third-color);
  }

  .block-wrapper {
    position: relative;
    background: var(--compare-item-background-color);

    .compare-title {
      padding: 0 var(--safe-area-side);
      z-index: 9;
      margin-top: 0;
      top: 56px;
      background: var(--background-color);
    }

    .compare-des {
      padding: 6px var(--safe-area-side);
      z-index: 8;
      display: flex;
      position: sticky;
      top: 84px;
      background: var(--background-color);
      color: var(--comment-text-color);
    }
  }

  .compare-page-body {
    font-size: 12px;
    background: inherit;
    color: var(--comment-text-color);
  }

  .compare-page-header {
    padding: var(--safe-area-side);
    position: sticky;
    top: 0;
    z-index: 19;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    border-bottom: 1px solid;
    color: var(--primary-text-color);
    background: var(--background-color);
    border-color: var(--divider-color);

    h1 {
      display: flex;
      align-items: center;
      font-size: 20px;
      line-height: 1;
      font-weight: 500;

      > svg {
        margin-right: 6px;
        width: 20px;
        height: 20px;
      }

      span {
        margin-left: 8px;
        font-size: 14px;
        color: var(--second-text-color);

        > svg {
          margin-right: 4px;
          color: var(--comment-text-color);
        }
      }
    }

    button {
      cursor: pointer;
      background: none;
      border: none;
      font-size: 20px;
      padding: 8px;
      color: var(--lowest-text-color);
    }
  }

  .compare-page-wrapper {
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: var(--background-color);
  }

  .divider,
  .divider::before,
  .divider::after {
    color: var(--lowest-text-color);
    border-color: var(--lowest-text-color);
  }
  .input-wrapper {
  display: flex;
  align-items: center;

  >view.nut-textarea {
    background: transparent;
    padding: 8px 12px;
    // border-bottom: 1px solid;
    color: var(--second-text-color);
    border-color: var(--lowest-text-color);

    :deep(textarea) {
      color: inherit;
    }
  }
}
</style>
