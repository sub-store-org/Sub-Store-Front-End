<template>
  <Teleport to="#app">
    <div class="compare-page-wrapper">
      <header class="compare-page-header">
        <h1>
          <font-awesome-icon icon="fa-solid fa-eye" />
          {{ $t(`comparePage.title`) }}
        </h1>
        <button @click="clickClose">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </button>
      </header>
      <div class="compare-page-body">
        <div class="block-wrapper">
          <!--块标题-->
          <div class="sticky-title-wrapper compare-title">
            <p>{{ $t(`comparePage.remain.title`) }}</p>
          </div>

          <!--指示器说明-->
          <div class="compare-des">
            <span
              @click="toggleProcessedVisible"
              class="processed-item indicator"
              >{{ $t(`comparePage.remain.afterIndicator`) }}</span
            >
            <span
              @click="toggleOriginalVisible"
              class="original-item indicator"
              >{{ $t(`comparePage.remain.beforeIndicator`) }}</span
            >
          </div>

          <!--表格标题-->
          <ul class="compare-table-head">
            <li v-for="title in titleList" :key="title">
              {{ $t(`comparePage.tableHead.${title}`) }}
            </li>
          </ul>

          <!--表格内容-->
          <table class="compare-table-body">
            <template v-for="[processed, original] in data" :key="processed.id">
              <tr
                v-if="isProcessedVisible"
                class="compare-table-row processed-tr"
              >
                <td class="processed-item">
                  <div class="name-wrapper">
                    <div>
                      <nut-tag class="type-tag">{{ processed.type }}</nut-tag
                      >{{ processed.name }}
                    </div>
                    <div>{{ processed.server }}</div>
                  </div>
                </td>
                <td>
                  <span :class="processed.udp ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="processed.udp"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span :class="processed.tfo ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="processed.tfo"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span
                    :class="
                      processed['skip-cert-verify'] ? 'item-true' : 'item-false'
                    "
                    ><font-awesome-icon
                      v-if="processed['skip-cert-verify']"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
                <td>
                  <span :class="processed.aead ? 'item-true' : 'item-false'"
                    ><font-awesome-icon
                      v-if="processed.aead"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
              </tr>
              <tr
                v-if="isOriginalVisible"
                class="compare-table-row original-tr"
              >
                <td class="original-item">
                  <div class="name-wrapper">
                    <div>
                      {{ original.name }}
                    </div>
                    <div>{{ original.server }}</div>
                  </div>
                </td>
                <td>
                  <span :class="original.udp ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="original.udp"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span :class="original.tfo ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="original.tfo"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span
                    :class="
                      original['skip-cert-verify'] ? 'item-true' : 'item-false'
                    "
                    ><font-awesome-icon
                      v-if="original['skip-cert-verify']"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
                <td>
                  <span :class="original.aead ? 'item-true' : 'item-false'"
                    ><font-awesome-icon
                      v-if="original.aead"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
              </tr>
            </template>
          </table>
        </div>

        <nut-divider
          v-if="originalData.length > 0"
          class="divider"
          dashed
          hairline
          :style="{
            padding: '0 16px',
          }"
          >{{ $t(`comparePage.divider`) }}
        </nut-divider>

        <div class="block-wrapper" v-if="originalData.length > 0">
          <!--块标题-->
          <div class="sticky-title-wrapper compare-title">
            <p>{{ $t(`comparePage.filter.title`) }}</p>
          </div>

          <!--表格标题-->
          <ul class="compare-table-head filter-table-head">
            <li v-for="title in titleList" :key="title">
              {{ $t(`comparePage.tableHead.${title}`) }}
            </li>
          </ul>

          <!--表格内容-->
          <table class="compare-table-body">
            <template v-for="node in originalData" :key="node.id">
              <tr class="compare-table-row original-tr">
                <td class="original-item">
                  <div class="name-wrapper">
                    <div>
                      <nut-tag class="type-tag">{{ node.type }} </nut-tag
                      >{{ node.name }}
                    </div>
                    <div>{{ node.server }}</div>
                  </div>
                </td>
                <td>
                  <span :class="node.udp ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="node.udp"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span :class="node.tfo ? 'item-true' : 'item-false'">
                    <font-awesome-icon
                      v-if="node.tfo"
                      icon="fa-solid fa-check"
                    />
                  </span>
                </td>
                <td>
                  <span
                    :class="
                      node['skip-cert-verify'] ? 'item-true' : 'item-false'
                    "
                    ><font-awesome-icon
                      v-if="node['skip-cert-verify']"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
                <td>
                  <span :class="node.aead ? 'item-true' : 'item-false'"
                    ><font-awesome-icon
                      v-if="node.aead"
                      icon="fa-solid fa-check"
                  /></span>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const { compareData } = defineProps<{
    compareData: any;
  }>();

  const titleList = ['name', 'udp', 'tfo', 'skip-cert-verify', 'aead'];

  const emit = defineEmits(['closeCompare']);

  const isOriginalVisible = ref(true);
  const isProcessedVisible = ref(true);

  const toggleProcessedVisible = () => {
    if (isProcessedVisible.value && !isOriginalVisible.value) {
      isOriginalVisible.value = true;
    } else if (isProcessedVisible.value && isOriginalVisible.value) {
      isOriginalVisible.value = false;
    } else if (!isProcessedVisible.value && isOriginalVisible.value) {
      isProcessedVisible.value = true;
      isOriginalVisible.value = false;
    }
  };

  const toggleOriginalVisible = () => {
    if (!isProcessedVisible.value && isOriginalVisible.value) {
      isProcessedVisible.value = true;
    } else if (isProcessedVisible.value && isOriginalVisible.value) {
      isProcessedVisible.value = false;
    } else if (isProcessedVisible.value && !isOriginalVisible.value) {
      isProcessedVisible.value = false;
      isOriginalVisible.value = true;
    }
  };

  const originalData = compareData.original;
  const processedData = compareData.processed;
  const data = computed(() => {
    const result = [];
    for (let i = 0; i < processedData.length; i++) {
      const item = [];
      item.push(processedData[i]);
      const id = processedData[i].id;
      const originalIndex = originalData.findIndex(item => item.id === id);
      item.push(originalData[originalIndex]);
      result.push(item);
      originalData.splice(originalIndex, 1);
    }
    return result;
  });

  const clickClose = () => {
    emit('closeCompare');
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .type-tag {
    padding: 1px 4px;
    line-height: 1;
    margin-right: 3px;

    .dark-mode & {
      color: $dark-second-text-color;
      background: $dark-lowest-text-color;
    }

    .light-mode & {
      color: $light-second-text-color;
      background: $light-lowest-text-color;
    }
  }

  .item-true {
    color: #478ef2;
  }

  .item-false {
    width: 8px;
    height: 1px;
    border-radius: 2px;

    .dark-mode & {
      background: $dark-lowest-text-color;
    }

    .light-mode & {
      background: $light-lowest-text-color;
    }
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

      .dark-mode & {
        border-bottom: 1px solid $dark-divider-color;
      }

      .light-mode & {
        border-bottom: 1px solid $light-divider-color;
      }
    }
  }

  .compare-table-row {
    padding: 0 $safe-area-side;
  }

  .compare-table-head {
    padding: 10px $safe-area-side;
  }

  .compare-table-head,
  .compare-table-row {
    margin: 0;
    display: grid;
    grid-template-columns: 220px 1fr 1fr 1fr 1fr;

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
    top: 118px;
    background: inherit;
    border-bottom: 1px solid;
    font-weight: bold;

    .dark-mode & {
      background: $dark-background-color;
      color: $dark-comment-text-color;
      border-color: $dark-divider-color;
    }

    .light-mode & {
      background: $light-background-color;
      color: $light-comment-text-color;
      border-color: $light-divider-color;
    }

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
      background: $primary-color;
    }
  }

  .indicator {
    margin-right: 24px;
  }

  .processed-item::before {
    background: #0ed57d;
  }

  .block-wrapper {
    position: relative;

    .dark-mode & {
      background: $dark-compare-item-background-color;
    }

    .light-mode & {
      background: $light-compare-item-background-color;
    }

    .compare-title {
      padding: 0 $safe-area-side;
      z-index: 9;
      margin-top: 0;
      top: 56px;

      .dark-mode & {
        background: $dark-background-color;
      }

      .light-mode & {
        background: $light-background-color;
      }
    }

    .compare-des {
      padding: 8px $safe-area-side;
      z-index: 8;
      display: flex;
      position: sticky;
      top: 84px;

      .dark-mode & {
        background: $dark-background-color;
        color: $dark-comment-text-color;
      }

      .light-mode & {
        background: $light-background-color;
        color: $light-comment-text-color;
      }
    }
  }

  .compare-page-body {
    font-size: 12px;
    background: inherit;

    .dark-mode & {
      color: $dark-comment-text-color;
    }

    .light-mode & {
      color: $light-second-text-color;
    }
  }

  .compare-page-header {
    padding: $safe-area-side;
    position: sticky;
    top: 0;
    z-index: 19;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    border-bottom: 1px solid;

    .dark-mode & {
      color: $dark-primary-text-color;
      background: $dark-background-color;
      border-color: $dark-divider-color;
    }

    .light-mode & {
      color: $light-primary-text-color;
      background: $light-background-color;
      border-color: $light-divider-color;
    }

    h1 {
      font-size: 20px;
      line-height: 1;
      font-weight: 500;

      svg {
        margin-right: 6px;
        width: 20px;
        height: 20px;
      }
    }

    button {
      background: none;
      border: none;
      font-size: 20px;
      padding: 8px;

      .dark-mode & {
        color: $dark-lowest-text-color;
      }

      .light-mode & {
        color: $light-lowest-text-color;
      }
    }
  }

  .compare-page-wrapper {
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .dark-mode & {
      background: $dark-background-color;
    }

    .light-mode & {
      background: $light-background-color;
    }
  }

  .divider,
  .divider::before,
  .divider::after {
    .dark-mode & {
      color: $dark-lowest-text-color;
      border-color: $dark-lowest-text-color;
    }

    .light-mode & {
      color: $light-lowest-text-color;
      border-color: $light-lowest-text-color;
    }
  }
</style>
