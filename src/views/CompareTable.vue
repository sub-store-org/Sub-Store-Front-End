<template>
  <Teleport to="#app">
    <div class="compare-table-wrapper">
      <header class="compare-header">
        <h1>
          <font-awesome-icon icon="fa-solid fa-eye" />
          {{ $t(`comparePage.title`) }}
        </h1>
        <button @click="clickClose">
          <font-awesome-icon icon="fa-solid fa-circle-xmark" />
        </button>
      </header>
      <div class="compare-body-wrapper">
        <div class="remain-compare-body compare-body">
          <div class="sticky-title-wrapper compare-title">
            <p>{{ $t(`comparePage.remain.title`) }}</p>
          </div>
          <div class="compare-des">
            <span class="processed-point-item processed-indicator">{{
              $t(`comparePage.remain.beforeIndicator`)
            }}</span>
            <span class="original-point-item original-indicator">{{
              $t(`comparePage.remain.afterIndicator`)
            }}</span>
          </div>
          <div
            v-for="[processed, original] in data"
            :key="processed.id"
            class="compare-item-wrapper"
          >
            <div class="processed-row processed-point-item">
              <p>{{ processed.name }}</p>
              <p>{{ processed.server }}</p>
              <p>{{ processed.udp }}</p>
              <p>{{ processed.tfo }}</p>
              <p>{{ processed['surge-hybrid'] }}</p>
              <p>{{ processed['skip-cert-verify'] }}</p>
            </div>
            <div class="original-row original-point-item">
              <p>{{ original.name }}</p>
              <p>{{ original.server }}</p>
              <p>{{ original.udp }}</p>
              <p>{{ original.tfo }}</p>
              <p>{{ original['surge-hybrid'] }}</p>
              <p>{{ original['skip-cert-verify'] }}</p>
            </div>
          </div>
        </div>
        <nut-divider
          class="divider"
          dashed
          hairline
          :style="{
            padding: '0 16px',
          }"
          >{{ $t(`comparePage.divider`) }}
        </nut-divider>
        <div class="compare-body-wrapper">
          <div class="remain-compare-body compare-body">
            <div class="sticky-title-wrapper compare-title">
              <p>{{ $t(`comparePage.filter.title`) }}</p>
            </div>
            <div
              v-for="node in originalData"
              :key="node.id"
              class="compare-item-wrapper"
            >
              <div class="original-row">
                <p>{{ node.name }}</p>
                <p>{{ node.server }}</p>
                <p>{{ node.udp }}</p>
                <p>{{ node.tfo }}</p>
                <p>{{ node['surge-hybrid'] }}</p>
                <p>{{ node['skip-cert-verify'] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const { compareData } = defineProps<{
    compareData: any
  }>()

  const emit = defineEmits(['closeCompare'])

  const originalData = compareData.original
  const processedData = compareData.processed
  const data = computed(() => {
    const result = []
    for (let i = 0; i < processedData.length; i++) {
      const item = []
      item.push(processedData[i])
      const id = processedData[i].id
      const originalIndex = originalData.findIndex(item => item.id === id)
      item.push(originalData[originalIndex])
      result.push(item)
      originalData.splice(originalIndex, 1)
    }
    console.log(processedData)
    console.log(result)
    // console.log(originalData)
    return result
  })

  const clickClose = () => {
    emit('closeCompare')
  }

  const columns = [
    {
      title: '节点名',
      key: 'name',
    },
    {
      title: '类型',
      key: 'type',
    },
    {
      title: '服务器',
      key: 'server',
    },
    {
      title: 'udp',
      key: 'udp',
    },
    {
      title: 'tfo',
      key: 'tfo',
    },
    {
      title: 'scv',
      key: 'skip-cert-verify',
    },
  ]
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .compare-table-wrapper {
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

    .compare-header {
      padding: $safe-area-side;
      position: sticky;
      top: 0;
      z-index: 19;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 56px;
      border-bottom: 1px solid;
      box-shadow: 0 4px 12px #00000006;

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
    }

    .compare-body {
      font-size: 12px;
      padding: $safe-area-side;
      background: inherit;
      .dark-mode & {
        color: $dark-comment-text-color;
      }
      .light-mode & {
        color: $light-second-text-color;
      }
    }

    .compare-title {
      top: 56px;
      margin-top: 0;

      .dark-mode & {
        background: $dark-background-color;
      }

      .light-mode & {
        background: $light-background-color;
      }
    }

    .remain-compare-body {
      .compare-des {
        display: flex;
        align-items: center;
        padding: 12px 0;
        position: sticky;
        top: 84px;

        .dark-mode & {
          background: $dark-background-color;
        }

        .light-mode & {
          background: $light-background-color;
        }
      }
    }

    .processed-indicator {
      margin-right: 24px;
    }

    .processed-indicator,
    .original-indicator {
      display: flex;
      align-items: center;
    }

    .original-row,
    .processed-row {
      display: flex;
      align-items: center;
    }

    .original-point-item,
    .processed-point-item {
      &::before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 6px;
        background: $dark-primary-text-color;
      }
    }

    .processed-point-item {
      &::before {
        background: #0ed57d;
      }
    }

    .original-point-item::before {
      background: $primary-color;
    }

    .compare-item-wrapper {
      padding: 12px 0;

      .dark-mode & {
        border-bottom: 1px solid $dark-divider-color;
      }
      .light-mode & {
        border-bottom: 1px solid $light-divider-color;
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
  }
</style>
