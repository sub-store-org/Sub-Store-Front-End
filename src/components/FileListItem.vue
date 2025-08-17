<template>
  <!-- 滚动内容 -->
  <nut-swipe
    class="sub-item-swipe"
    ref="swipe"
    :disabled="props.disabled"
    @close="setIsMoveClose()"
    @open="setIsMoveOpen()"
  >
    <div
      class="sub-item-wrapper"
      :style="{ padding: appearanceSetting.isSimpleMode ? '9px' : '16px' }"
      @click="handleContentClick"
    >
      <div
        @click.stop="previewFile"
        class="sub-img-wrappers"
        :style="{ 'margin-top': appearanceSetting.isSimpleMode ? '5px' : '0' }"
      >
        <!-- icon visible -->
        <div v-if="appearanceSetting.isShowIcon">
          <div v-if="isIconColor">
            <nut-avatar
              v-if="props[props.type].icon"
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="props[props.type].icon"
              bg-color=""
            />
            <nut-avatar
              v-else
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="icon"
              bg-color=""
            />
          </div>
          <div v-else>
            <nut-avatar
              class="sub-item-customer-icon"
              :size="appearanceSetting.isSimpleMode ? '36' : '48'"
              :url="props[props.type].icon || icon"
              bg-color=""
            />
          </div>
        </div>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 v-if="!appearanceSetting.isSimpleMode" class="sub-item-title">
            {{ displayName || name }}
            <span v-for="i in tag" :key="i" class="tag">
              <nut-tag>{{ i }}</nut-tag>
            </span>
          </h3>
          <h3 v-else class="sub-item-title" style="color: var(--primary-text-color); font-size: 16px">
            {{ displayName || name }}
            <span v-for="i in tag" :key="i" class="tag">
              <nut-tag>{{ i }}</nut-tag>
            </span>
          </h3>

          <!-- onClickCopyLink 拷贝 -->
          <div
            style="position: relative"
            :style="{ top: appearanceSetting.isSimpleMode ? '8px' : '0' }"
          >
            <!-- 预览 -->
            <button
              v-if="!appearanceSetting.isShowIcon"
              class="compare-sub-link"
              @click.stop="previewFile"
            >
              <font-awesome-icon icon="fa-solid fa-eye" />
            </button>
            <button
              v-if="shareBtnVisible"
              class="share-sub-link"
              @click.stop="onClickShareLink"
            >
              <font-awesome-icon icon="fa-solid fa-share-nodes" />
            </button>
            <button class="copy-sub-link" @click.stop="onClickCopyLink">
              <font-awesome-icon icon="fa-solid fa-clone" />
            </button>
            <!-- 编辑 -->
            <button
              v-if="!appearanceSetting.isSimpleMode"
              class="copy-sub-link"
              @click.stop="onClickEdit"
            >
              <font-awesome-icon icon="fa-solid fa-pen-nib" />
            </button>
            <button class="refresh-sub-flow" @click.stop="onClickEdit" v-else>
              <font-awesome-icon icon="fa-solid fa-pen-nib" />
            </button>

            <button
              class="copy-sub-link"
              @click.stop="swipeController"
              v-if="!isMobile()"
              ref="moreAction"
            >
              <font-awesome-icon icon="fa-solid fa-angles-right" />
            </button>
          </div>
        </div>
        <template v-if="!appearanceSetting.isSimpleMode">
          <p class="sub-item-detail">
            <template v-if="typeof flow === 'string'">
              <span>
                {{ flow }}
              </span>
            </template>
          </p>
          <p v-if="remark" class="sub-item-remark">
            <span>{{ remarkText }}</span>
          </p>
        </template>

        <template v-else>
          <p class="sub-item-detail-isSimple">
            <template v-if="typeof flow === 'string'">
              <span style="font-weight: normal">
                {{ flow }}
              </span>
            </template>
          </p>
          <p
            v-if="remark && appearanceSetting.isSimpleShowRemark"
            class="sub-item-remark"
          >
            <span>{{ remarkText }}</span>
          </p>
        </template>
      </div>
    </div>
    <!-- 加入判断 开启拖动不显示 -->
    <template v-if="appearanceSetting.isLeftRight" #left>
      <!-- Copy -->
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="primary"
          class="sub-item-swipe-btn"
          @click="onClickCopyConfig"
        >
          <font-awesome-icon icon="fa-solid fa-paste" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <!-- <a
          :href="`${host}/api/wholeFile/${encodeURIComponent(name)}?raw=1`"
          target="_blank"
        > -->
        <nut-button
          shape="square"
          type="success"
          class="sub-item-swipe-btn"
          @click="onClickExportFile(name)"
        >
          <font-awesome-icon icon="fa-solid fa-file-export" />
        </nut-button>
      </div>
      <!-- preview -->
      <!-- <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="success" class="sub-item-swipe-btn" @click="onClickPreview">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </nut-button>
      </div> -->
      <!-- del -->
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

    <template v-else #right>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="primary"
          class="sub-item-swipe-btn"
          @click="onClickCopyConfig"
        >
          <font-awesome-icon icon="fa-solid fa-paste" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="success"
          class="sub-item-swipe-btn"
          @click="onClickExportFile(name)"
        >
          <font-awesome-icon icon="fa-solid fa-file-export" />
        </nut-button>
      </div>
      <!-- <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="success" class="sub-item-swipe-btn" @click="onClickPreview">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </nut-button>
      </div> -->
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

  <FilePreview
    v-if="filePreviewIsVisible"
    :name="name"
    :previewData="previewData"
    @closePreview="closePreview"
  />
</template>

<script lang="ts" setup>
  import { useSubsApi } from '@/api/subs';
  import { useFilesApi } from '@/api/files';
  import logoIcon from '@/assets/icons/logo.png';
  import logoRedIcon from '@/assets/icons/logo-red.png';
  import { usePopupRoute } from '@/hooks/usePopupRoute';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { useGlobalStore } from '@/store/global';
  import { useSettingsStore } from '@/store/settings';
  import { useSubsStore } from '@/store/subs';
  import { getString } from '@/utils/flowTransfer';
  import { isMobile } from '@/utils/isMobile';
  import FilePreview from '@/views/FilePreview.vue';
  import { Dialog, Toast } from '@nutui/nutui';
  import { useClipboard } from '@vueuse/core';
  import dayjs from 'dayjs';
  import { storeToRefs } from 'pinia';
  import { computed, createVNode, ref, toRaw } from 'vue';
  import useV3Clipboard from 'vue-clipboard3';
  import { useI18n } from 'vue-i18n';
  import { useRouter, useRoute } from 'vue-router';
  import { useHostAPI } from '@/hooks/useHostAPI';
  import { useBackend } from "@/hooks/useBackend";
  import clashmetaIcon from '@/assets/icons/clashmeta_color.png';

  const { copy, isSupported } = useClipboard();
  const { toClipboard: copyFallback } = useV3Clipboard();

  const { t } = useI18n();
  const { env } = useBackend();

  const props = defineProps<{
    type: 'sub' | 'collection' | 'file';
    file?: any;
    sub?: Sub;
    collection?: Collection;
    disabled?: boolean;
  }>();
  // console.log('props.disabled')
  // console.log(props.disabled)
  let scrollTop = 0;
  const filePreviewIsVisible = ref(false);
  usePopupRoute(filePreviewIsVisible);
  const previewData = ref();
  const moreAction = ref();
  const swipe = ref();
  const swipeIsOpen = ref(false);
  const compareData = ref();
  const router = useRouter();
  const route = useRoute();
  const globalStore = useGlobalStore();
  const settingsStore = useSettingsStore();
  const subsStore = useSubsStore();
  const subsApi = useSubsApi();
  const filesApi = useFilesApi();
  const { appearanceSetting } = storeToRefs(settingsStore);
  const {
    isFlowFetching,
    // isSimpleMode,
    // isLeftRight,
    // isIconColor,
    // isSimpleReicon,
    // isDefaultIcon
  } = storeToRefs(globalStore);

  const displayName =
    props[props.type].displayName || props[props.type]['display-name'];

  const name = props[props.type].name;
  const tag = props[props.type].tag;
  const remark = props[props.type].remark;
  const remarkText = computed(() => {
    if (remark) {
      return remark;
    } else {
      return "";
    }
  })
  const { flows } = storeToRefs(subsStore);
  const icon = computed(() => {
    if (props.file.type === 'mihomoProfile') return clashmetaIcon;
    return appearanceSetting.value.isDefaultIcon ? logoIcon : logoRedIcon;
  })
  const isIconColor = computed(() => {
    return props.file.isIconColor !== false;
  });

  const collectionDetail = computed(() => {
    const nameList = props?.collection.subscriptions || [];
    if (nameList.length === 0) {
      return t('subPage.collectionItem.noSub');
    } else {
      const displayNameList = nameList.map(name => {
        const sub = subsStore.getOneSub(name);
        return sub?.displayName || sub?.['display-name'] || sub.name;
      });
      return `${t('subPage.collectionItem.contain')}：${displayNameList.join(
        '、'
      )}`;
    }
  });

  const flow = computed(() => {
    if (props.file.type === 'mihomoProfile') return t('filePage.type.mihomoProfile');
    if (props.file.source === 'remote') return t('filePage.source.remote');
    return t('filePage.source.local');
  });

  const closePreview = () => {
    document.querySelector('html').style['overflow-y'] = '';
    document.querySelector('html').style.height = '';
    document.body.style.height = '';
    document.body.style['overflow-y'] = '';
    (document.querySelector('#app') as HTMLElement).style['overflow-y'] = '';
    (document.querySelector('#app') as HTMLElement).style.height = '';

    filePreviewIsVisible.value = false;

    window.scrollTo({
        top: scrollTop,
        behavior: "instant" as any,
    });

    router.back();
  };

  const previewFile = async () => {
    Toast.loading('生成中...', { id: 'compare', cover: true, duration: 1500 });
    const res = await useSubsApi().compareSub(
      'file',
      props.file
    );

    if (res?.data?.status === 'success') {
      previewData.value = res.data.data;

      scrollTop = document.documentElement.scrollTop || document.body.scrollTop

      globalStore.setSavedPositions(route.path, { left: 0, top: scrollTop })

      document.querySelector('html').style['overflow-y'] = 'hidden';
      document.querySelector('html').style.height = '100%';
      document.body.style.height = '100%';
      document.body.style['overflow-y'] = 'hidden';
      (document.querySelector('#app') as HTMLElement).style['overflow-y'] = 'hidden';
      (document.querySelector('#app') as HTMLElement).style.height = '100%';

      filePreviewIsVisible.value = true;
      Toast.hide('compare');
    }
  };

  const swipeClose = () => {
    swipe.value.close();
  };

  const swipeController = () => {
    if (swipeIsOpen.value) {
      swipe.value.close();
      swipeIsOpen.value = false;
      if(moreAction.value) moreAction.value.style.transform = 'rotate(0deg)';

      document.removeEventListener('click', handleGlobalClick);
    } else {
      if (appearanceSetting.value.isLeftRight) {
        swipe.value.open('right');
        setTimeout(() => {
          swipeIsOpen.value = true;
          setTimeout(() => {
            document.addEventListener('click', handleGlobalClick);
          }, 10);
        }, 100);
      } else {
        swipe.value.open('left');
        setTimeout(() => {
          swipeIsOpen.value = true;
          if(moreAction.value) moreAction.value.style.transform = 'rotate(180deg)';

          setTimeout(() => {
            document.addEventListener('click', handleGlobalClick);
          }, 10);
        }, 100);
      }
    }
  };

  const handleGlobalClick = (event) => {
    const swipeRightEl = document.querySelector('.nut-swipe__right');
    const swipeLeftEl = document.querySelector('.nut-swipe__left');

    if ((swipeRightEl && swipeRightEl.contains(event.target)) ||
        (swipeLeftEl && swipeLeftEl.contains(event.target))) {
      return;
    }

    swipe.value.close();
    swipeIsOpen.value = false;
    if (moreAction.value) moreAction.value.style.transform = 'rotate(0deg)';

    document.removeEventListener('click', handleGlobalClick);
  };

  const ismove = ref(false);

  const setIsMoveOpen = () => {
    ismove.value = true;

    setTimeout(() => {
      swipeIsOpen.value = true;
      if (moreAction.value) moreAction.value.style.transform = 'rotate(180deg)';
    }, 100);

    setTimeoutTF();
  };

  const setIsMoveClose = () => {
    ismove.value = true;
    swipeIsOpen.value = false;
    if (moreAction.value) moreAction.value.style.transform = 'rotate(0deg)';
    setTimeoutTF();
  };

  const setTimeoutTF = () => {
    setTimeout(() => {
      ismove.value = false;
    }, 200);
  };

  const handleContentClick = (event) => {
    event.stopPropagation();

    if (swipeIsOpen.value) {
      swipe.value.close();
      swipeIsOpen.value = false;
      if (moreAction.value) moreAction.value.style.transform = 'rotate(0deg)';
      return;
    }

    if (!ismove.value) {
      previewFile();
    }
  };

  const onDeleteConfirm = async () => {
    await subsStore.deleteFile(name);
    // Notify.danger(t('subPage.deleteSub.succeedNotify'), { duration: 1500 });
  };


  const onClickCopyConfig = async () => {
    const data = JSON.parse(JSON.stringify(toRaw(props.file)));
    data.name += `-copy${~~(Math.random() * 10000)}`;

    Toast.loading(t('subPage.copyConfigNotify.loading'), { id: 'copyConfig' });
    await filesApi.createFile(data);
    await subsStore.fetchSubsData();
    Toast.hide('copyConfig');
    showNotify({ title: t('subPage.copyConfigNotify.succeed') });
  };

  const onClickEdit = () => {
    router.push(`/edit/${props.type}s/${encodeURIComponent(name)}`);
  };

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
      onOpened: () => {},
      popClass: 'auto-dialog',
      cancelText: t('subPage.deleteSub.btn.cancel'),
      okText: t('subPage.deleteSub.btn.confirm'),
      closeOnPopstate: true,
      lockScroll: false,
    });
  };

  const { showNotify } = useAppNotifyStore();
  const { currentUrl: host } = useHostAPI();
  const emit = defineEmits(["share"]);

  const shareBtnVisible = computed(() => {
    return env.value?.feature?.share;
  });

  const onClickExportFile = (name) => {
    const url = `${host.value}/api/wholeFile/${encodeURIComponent(name)}?raw=1`;
    console.log('url', url);
    window.open(url, '_blank');  // 在新窗口中打开链接
  };

  const onClickShareLink = async () => {
    console.log('props', props)
    const type = props.type;
    const data = props.file;
    emit("share", data, type);
  };
  const onClickCopyLink = async () => {
    const path = `/api/file/${encodeURIComponent(name)}`;
    const url = `${host.value}${path}`;

    if (isSupported) {
      await copy(url);
    } else {
      await copyFallback(url);
    }
    showNotify({ title: t('filePage.copyNotify.succeed', { path }) });
  };


</script>

<style lang="scss" scoped>
  .sub-item-customer-icon {
    :deep(img) {
      & {
        opacity: 0.8;
        filter: brightness(var(--img-brightness));
      }
    }
  }

  .sub-item-wrapper {
    line-height: 1.4;
    margin-left: auto;
    margin-right: auto;
    border-radius: var(--item-card-radios);
    display: flex;
    background: var(--card-color);
    cursor: pointer;

    :deep(.nut-avatar) {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      margin-right: 15px;
      border-radius: 12px;

      img {
        object-fit: contain;
        border-radius: 10px;
      }
    }

    > .sub-item-content {
      flex: 1;
      line-height: 1.6;

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
          color: var(--primary-text-color);
          vertical-align: middle;
        }
        .tag {
          margin: 0 2px;
        }
        .compare-sub-link,
        .share-sub-link,
        .copy-sub-link,
        .refresh-sub-flow {
          background-color: transparent;
          border: none;
          padding: 0 8px;
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          align-items: center;

          svg {
            width: 16px;
            height: 16px;
            color: var(--comment-text-color);
          }
        }

        button {
          white-space: nowrap;
        }

        div {
          display: flex;
          align-items: center;
        }
      }

      .sub-item-detail {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        margin-top: 4px;
        font-size: 12px;
        color: var(--comment-text-color);

        span {
          display: block;
          line-height: 1.8;
        }
      }
      .sub-item-remark {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        margin-top: 4px;
        font-size: 12px;
        color: var(--comment-text-color);

        span {
          display: block;
          line-height: 1.5;
        }
      }

      .sub-item-detail-isSimple {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        font-size: 12px;
        // margin-top: 3.5px;
        max-width: 80%;
        color: var(--comment-text-color);
      }
    }
  }

  .sub-item-swipe {
    :deep(.nut-swipe__left) {
      .sub-item-swipe-btn-wrapper {
        padding-left: 24px;
      }
    }

    :deep(.nut-swipe__right),
    :deep(.nut-swipe__left) {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .sub-item-swipe-btn-wrapper {
        padding-left: 14px;

        &:last-child {
          padding-right: 14px;
        }

        .sub-item-swipe-btn {
          border-radius: 50%;
          height: 46px;
          width: 44px;
        }
      }
    }
  }

  .desc-about {
    display: block;
    padding: 100px 30px 350px;
    color: var(--comment-text-color);
    font-size: 12px;
    line-height: 20px;
    margin-top: 8px;
    margin-bottom: 20px;
    text-align: left;
  }

  .desc-about span {
    display: inline-block;
    padding: 6px 0 0 0;
  }

  .desc-title a,
  .desc-about a {
    color: var(--primary-color);
  }

  .subs-list-wrapper {
    margin-bottom: 36px;
    position: relative;
  }

  .sub-img-wrappers {
    display: flex;
    align-items: center;
  }
</style>
