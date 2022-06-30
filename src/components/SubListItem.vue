<template>
  <nut-swipe class="sub-item-swipe" ref="swipe">
    <div class="sub-item-wrapper">
      <!--TODO: Add compare feature-->

      <div class="sub-img-wrapper">
        <nut-avatar
          class="sub-item-customer-icon"
          v-if="props[props.type].icon"
          size="60"
          :url="props[props.type].icon"
          bg-color=""
        ></nut-avatar>
        <nut-avatar v-else :icon="icon"></nut-avatar>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 class="sub-item-title">{{ displayName }}</h3>
          <button class="copy-sub-link" @click="onClickCopyLink">
            <font-awesome-icon icon="fa-solid fa-clone"></font-awesome-icon>
          </button>
        </div>

        <p v-if="type === 'sub'" class="sub-item-detail">
          <template v-if="typeof flow === 'string'">
            <span>
              {{ flow }}
            </span>
          </template>
          <template v-else>
            <span>
              {{ flow.firstLine }}
            </span>
            <span> {{ flow.secondLine }} </span>
          </template>
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
  import { createVNode, ref, computed, toRaw } from 'vue'
  import { useRouter } from 'vue-router'
  import useClipboard from 'vue-clipboard3'
  import { useSubsStore } from '@/store/subs'
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '@/store/global'
  import { getString } from '@/utils/flowTransfer'
  import { useI18n } from 'vue-i18n'
  const { toClipboard } = useClipboard()
  const { t } = useI18n()

  const props = defineProps<{
    type: 'sub' | 'collection'
    sub?: Sub
    collection?: Collection
  }>()

  const swipe = ref()
  const router = useRouter()
  const globalStore = useGlobalStore()
  const subsStore = useSubsStore()
  const displayName =
    props[props.type].displayName || props[props.type]['display-name']

  const name = props[props.type].name
  const { flows } = storeToRefs(subsStore)
  const collectionDetail = computed(() => {
    const nameList = props?.collection.subscriptions || []
    if (nameList.length === 0) {
      return t('subPage.collectionItem.noSub')
    } else {
      const displayNameList = nameList.map(name => {
        const sub = subsStore.getOneSub(name)
        return sub?.displayName || sub?.['display-name']
      })
      return `${t('subPage.collectionItem.contain')}：${displayNameList.join(
        '、'
      )}`
    }
  })
  const { isLoading } = storeToRefs(globalStore)

  const flow = computed(() => {
    if (props.type === 'sub') {
      if (props.sub.source === 'local') return t('subPage.subItem.local')
      if (isLoading.value) return t('subPage.subItem.loading')

      const target = toRaw(flows.value[props.sub.url])
      if (target?.status === 'success') {
        const {
          expires,
          total,
          usage: { upload, download },
        } = target.data
        return {
          firstLine: `${t('subPage.subItem.flow')}：${getString(
            upload + download,
            total,
            'B'
          )}`,
          secondLine: `${t('subPage.subItem.expires')}：${dayjs
            .unix(expires)
            .format('YYYY-MM-DD')}`,
        }
      } else if (target?.status === 'failed') {
        return {
          firstLine: `${target.error?.message}`,
          secondLine: '',
        }
      } else {
        return {
          // TODO: API 暂未升级，额外判断当前出错情况跑通代码
          // @ts-ignore
          firstLine: `Code: ${target?.status}`,
          // @ts-ignore
          secondLine: `Msg: ${target?.statusText}`,
        }
      }
    }
  })

  const onDeleteConfirm = async () => {
    try {
      await subsStore.deleteSub(props.type, name)
      await subsStore.fetchSubsData()
      Notify.danger(t('subPage.deleteSub.succeedNotify'), { duration: 1500 })
    } catch (e) {
      Notify.danger(e.message, { duration: 1500 })
    }
  }

  const onClickPreview = () => {
    Dialog({
      title: t('subPage.previewTitle'),
      content: createVNode(PreviewPanel, { name, type: props.type }),
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
    router.push(`/edit/${props.type}/${name}`)
  }

  const onClickDelete = () => {
    Dialog({
      title: t('subPage.deleteSub.title'),
      content: createVNode(
        'span',
        {},
        t('subPage.deleteSub.desc', { displayName })
      ),
      onCancel: () => {},
      onOk: onDeleteConfirm,
      onOpened: () => swipe.value.close(),
      popClass: 'auto-dialog',
      cancelText: t('subPage.deleteSub.btn.cancel'),
      okText: t('subPage.deleteSub.btn.confirm'),
      closeOnPopstate: true,
      lockScroll: true,
    })
  }

  const onClickCopyLink = async () => {
    try {
      const host = import.meta.env.VITE_API_URL
      const url = `${host}/download/${
        props.type === 'collection' ? 'collection/' : ''
      }${name}`
      await toClipboard(url)
      Notify.success(t('subPage.copyNotify.succeed'), {
        duration: 1500,
      })
    } catch (e) {
      Notify.danger(t('subPage.copyNotify.succeed', { e }), {
        duration: 1500,
      })
      console.error(e)
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .dark-mode {
    background-color: $dark-background-color;
    .sub-item-customer-icon {
      :deep(img) {
        & {
          filter: brightness(1000%);
        }
      }
    }
  }

  .light-mode {
    background-color: $light-background-color;
    .sub-item-customer-icon {
      :deep(img) {
        & {
          filter: brightness(0);
        }
      }
    }
  }

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
        object-fit: contain;
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
