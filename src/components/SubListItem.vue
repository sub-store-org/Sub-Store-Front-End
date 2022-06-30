<template>
  <nut-swipe class="sub-item-swipe" ref="swipe">
    <div class="sub-item-wrapper">
      <div class="sub-img-wrapper">
        <nut-avatar
          size="60"
          shape="square"
          color="rgb(245, 106, 0)"
          bg-color="rgb(253, 227, 207)"
          :icon="icon"
        ></nut-avatar>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 class="sub-item-title">{{ displayName }}</h3>
          <button class="copy-sub-link" @click="onClickCopyLink">
            <font-awesome-icon icon="fa-solid fa-clone"></font-awesome-icon>
          </button>
        </div>

        <p v-if="type === 'sub'" class="sub-item-detail">
          <span>
            {{
              typeof flow === 'string'
                ? flow
                : `已用/总流量：${getString(
                    flow.usage.upload + flow.usage.download,
                    flow.total,
                    'B'
                  )}`
            }}
          </span>
          <span v-if="typeof flow !== 'string'">
            {{ `到期时间：${dayjs.unix(flow.expires).format('YYYY-MM-DD')}` }}
          </span>
        </p>
        <p v-else-if="type === 'collection'" class="sub-item-detail">
          {{ collectionDetail }}
        </p>
      </div>
    </div>
    <template #right>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="success"
          class="sub-item-swipe-btn"
          @click="onClickPreview"
        >
          <font-awesome-icon icon="fa-solid fa-eye" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="warning"
          class="sub-item-swipe-btn"
          @click="onClickEdit"
        >
          <font-awesome-icon icon="fa-solid fa-pen-nib" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="danger"
          class="sub-item-swipe-btn"
          @click="onClickDelete"
        >
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>
    </template>
  </nut-swipe>
</template>

<script lang="ts" setup>
  import PreviewPanel from '@/components/PreviewPanel.vue'
  import icon from '@/assets/icons/logo.png'
  import { Dialog, Notify } from '@nutui/nutui'
  import dayjs from 'dayjs'
  import { createVNode, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import useClipboard from 'vue-clipboard3'
  import { useSubsStore } from '@/store/subs'
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '@/store/global'
  import { getString } from '@/utils/flowTransfer'
  const { toClipboard } = useClipboard()

  const { sub, type, collection } = defineProps<{
    type: 'sub' | 'collection'
    sub?: Sub
    collection?: Collection
  }>()

  const swipe = ref()
  const router = useRouter()
  const globalStore = useGlobalStore()
  const subsStore = useSubsStore()
  const displayName =
    sub?.displayName ||
    sub?.['display-name'] ||
    collection?.displayName ||
    collection?.['display-name']

  const name = sub?.name || collection?.name
  const { flows } = storeToRefs(subsStore)
  const collectionDetail = computed(() => {
    const nameList = collection?.subscriptions || []
    if (nameList.length === 0) {
      return '没有包含子订阅'
    } else {
      const displayNameList = nameList.map(name => {
        const sub = subsStore.getOneSub(name)
        return sub?.displayName || sub?.['display-name']
      })
      return `包含的订阅：${displayNameList.join('、')}`
    }
  })
  const { isLoading } = storeToRefs(globalStore)

  const flow = computed(() => {
    const nameList = Object.keys(flows.value)
    if (!nameList.includes(name)) return '本地订阅'
    if (isLoading.value) return '加载中...'

    const target = flows.value[name]
    if (target.status === 'success') return target.data
    if (target.status === 'failed') return target.error.message
  })

  const onDeleteConfirm = async () => {
    try {
      await subsStore.deleteSub(type, name)
      await subsStore.fetchSubsData()
      Notify.danger('删除成功！', { duration: 1500 })
    } catch (e) {
      Notify.danger(e.message, { duration: 1500 })
    }
  }

  const onClickPreview = () => {
    Dialog({
      title: '选择想要预览的平台',
      content: createVNode(PreviewPanel, { name, type }),
      onOpened: () => swipe.value.close(),
      popClass: 'auto-dialog',
      // @ts-ignore-next-line  组件库bug，类型错误但功能正常
      closeOnClickOverlay: true,
      noOkBtn: true,
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: true,
    })
  }

  const onClickEdit = () => {
    router.push(`/edit/${type}/${name}`)
  }

  const onClickDelete = () => {
    Dialog({
      title: '删除订阅确认',
      content: createVNode(
        'span',
        {},
        `是否确认删除 ${displayName} 订阅？删除后不可恢复！`
      ),
      onCancel: () => {},
      onOk: onDeleteConfirm,
      onOpened: () => swipe.value.close(),
      popClass: 'auto-dialog',
      cancelText: '取消',
      okText: '确认删除',
      closeOnPopstate: true,
      lockScroll: true,
    })
  }

  const onClickCopyLink = async () => {
    try {
      const host = import.meta.env.VITE_API_URL
      const url = `${host}/download/${
        type === 'collection' ? 'collection/' : ''
      }${name}`
      await toClipboard(url)
      Notify.success('复制订阅链接成功\n可以前往代理工具使用咯～', {
        duration: 1500,
      })
    } catch (e) {
      Notify.danger(`复制订阅链接失败\n${e}`, {
        duration: 1500,
      })
      console.error(e)
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .sub-item-wrapper {
    width: calc(100% - 24px);
    margin-left: auto;
    margin-right: auto;
    border-radius: 12px;
    padding: 16px;
    display: flex;

    .dark-mode & {
      background: $dark-card-color;
    }

    .light-mode & {
      background: $light-card-color;
    }

    :deep(.nut-avatar) {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      margin-right: 20px;
      border-radius: 12px;

      img {
        border-radius: 10px;
      }
    }

    > .sub-item-content {
      flex: 1;

      .sub-item-title-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .sub-item-title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
          font-size: 16px;

          .dark-mode & {
            color: $dark-primary-text-color;
          }

          .light-mode & {
            color: $light-primary-text-color;
          }
        }

        .copy-sub-link {
          background-color: transparent;
          border: none;
          padding: 0 12px;

          svg {
            width: 16px;
            height: 16px;

            .dark-mode & {
              color: $dark-lowest-text-color;
            }

            .light-mode & {
              color: $light-lowest-text-color;
            }
          }
        }
      }

      .sub-item-detail {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        margin-top: 6px;
        font-size: 14px;

        span {
          display: block;
          line-height: 1.8;
        }

        .dark-mode & {
          color: $dark-comment-text-color;
        }

        .light-mode & {
          color: $light-comment-text-color;
        }
      }
    }
  }

  .sub-item-swipe {
    :deep(.nut-swipe__right) {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .sub-item-swipe-btn-wrapper {
        padding-left: 24px;

        &:last-child {
          padding-right: 12px;
        }

        .sub-item-swipe-btn {
          border-radius: 50%;
          height: 48px;
          width: 48px;
        }
      }
    }
  }
</style>
