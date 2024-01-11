<template>
  <nut-swipe class="sub-item-swipe" ref="swipe" :disabled="$props.disabled">
    <div class="sub-item-wrapper" :style="{'padding': isSimpleMode ? '9px' : '16px' }" @click.stop="previewSource">
      <a class="sub-img-wrappers" :href="artifact.url" target="_blank">
        <nut-avatar class="sub-item-customer-icon"  :size="isSimpleMode ? '36' : '48'" :url="icon" bg-color=""></nut-avatar>
      </a>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 class="sub-item-title">
            {{ displayName }}
          </h3>
          <div class="title-right-wrapper" v-if="!isSimpleMode">
            <button class="copy-sub-link" style="padding: 0 12px;" v-if="artifact.url" @click.stop="onClickCopyLink">
              <font-awesome-icon icon="fa-solid fa-clone"></font-awesome-icon>
            </button>

            <button class="copy-sub-link" @click.stop="swipeController" v-if="!isMobile()" ref="moreAction">
              <font-awesome-icon icon="fa-solid fa-angles-right" />
            </button>
          </div>
        </div>

        <div class="sub-item-detail">
          <p>
            {{ detail.firstLine }}
          </p>
          <div class="second-line-wrapper">
            <p>{{ detail.secondLine }}</p>
            <div class="task-switch" :style="{'margin-top': isSimpleMode ? '-22px' : '0' }">
              <div v-if="isSimpleMode">
                <button v-if="artifact.url" class="copy-sub-link"
                  style="padding: 0 12px;" @click.stop="onClickCopyLink">
                  <font-awesome-icon icon="fa-solid fa-clone"></font-awesome-icon>
                  <button class="copy-sub-link" @click.stop="swipeController" v-if="!isMobile()" ref="moreAction">
                  <font-awesome-icon icon="fa-solid fa-angles-right" />
                  </button>
                </button>
              </div>
              <span v-if="!isSimpleMode">
                {{ $t(`syncPage.syncSwitcher`) }}
              </span>
              <span @click.stop>
                <nut-switch class="my-switch" v-model="isSyncOpen" :loading="isSwitcherLoading" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <template v-if="isLeftRight" #left>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="primary" class="sub-item-swipe-btn" @click="onClickSync">
          <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="warning" class="sub-item-swipe-btn" @click="onClickEdit">
          <font-awesome-icon icon="fa-solid fa-pen-nib" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="danger" class="sub-item-swipe-btn" @click="onClickDelete">
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>
    </template>

    <template v-else #right>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="primary" class="sub-item-swipe-btn" @click="onClickSync">
          <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="warning" class="sub-item-swipe-btn" @click="onClickEdit">
          <font-awesome-icon icon="fa-solid fa-pen-nib" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="danger" class="sub-item-swipe-btn" @click="onClickDelete">
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>
    </template>
  </nut-swipe>
</template>

<script lang="ts" setup>
import clashIcon from '@/assets/icons/clash.png';
import clashMetaIcon from '@/assets/icons/clashmeta.png';
import loonIcon from '@/assets/icons/loon.png';
import quanxIcon from '@/assets/icons/quanx.png';
import shadowRocketIcon from '@/assets/icons/shadowrocket.png';
import stashIcon from '@/assets/icons/stash.png';
import surgeIcon from '@/assets/icons/surge.png';
import v2rayIcon from '@/assets/icons/v2ray.png';
import { useAppNotifyStore } from '@/store/appNotify';
import { useArtifactsStore } from '@/store/artifacts';
import { useSubsStore } from '@/store/subs';
import { butifyDate } from '@/utils/butifyDate';
import { isMobile } from '@/utils/isMobile';
import { Dialog, Toast } from '@nutui/nutui';
import { useClipboard } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, createVNode, ref, toRaw, watch, watchEffect } from 'vue';
import useV3Clipboard from 'vue-clipboard3';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '@/store/global';
import { useHostAPI } from '@/hooks/useHostAPI';
const globalStore = useGlobalStore();

const { isLeftRight, isSimpleMode } = storeToRefs(globalStore);
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t } = useI18n();
const { currentUrl: host } = useHostAPI();

const { name } = defineProps<{
  name: string;
  disabled?: boolean,
}>();

const { showNotify } = useAppNotifyStore();
const subsStore = useSubsStore();
const artifactsStore = useArtifactsStore();
const { artifacts } = storeToRefs(artifactsStore);
const artifact = computed(() => {
  return artifacts.value.find(item => item.name === name);
});
const emit = defineEmits(['edit']);

const icon = computed(() => {
  switch (artifact.value.platform) {
    case 'Surge':
      return surgeIcon;
    case 'QX':
      return quanxIcon;
    case 'Loon':
      return loonIcon;
    case 'Clash':
      return clashIcon;
    case 'ClashMeta':
      return clashMetaIcon;
    case 'Stash':
      return stashIcon;
    case 'ShadowRocket':
      return shadowRocketIcon;
    case 'V2Ray':
      return v2rayIcon;
  }
});

const displayName = computed(() => {
  return (
    artifact.value.displayName ||
    artifact.value['display-name'] ||
    artifact.value.name
  );
});

const isInit = ref(false);
const isSyncOpen = ref(false);
const isSwitcherLoading = ref(false);
const moreAction = ref();
const swipe = ref();
const swipeIsOpen = ref(false);

const sourceSub = computed(() => {
  const name = artifact.value.source;
  switch (artifact.value.type) {
    case 'collection':
      return subsStore.getOneCollection(name);
    case 'subscription':
      return subsStore.getOneSub(name);
    case 'file':
      return subsStore.getOneFile(name);
  }
});

const sourceUrl = computed(() => {
  const urlTarget: string = artifact.value.platform !== null ? `?target=${artifact.value.platform}` : '';
  return `${host.value}/download/${
    artifact.value.type === 'subscription' ? '' : 'collection/'
  }${encodeURIComponent(artifact.value.source)}${urlTarget}`;
});

const previewSource = () => {
  Dialog({
    title: t('tabBar.sub'),
    content: sourceUrl.value,
    onCancel: () => { },
    onOk: () => {
      window.open(sourceUrl.value);
    },
    onOpened: () => swipe.value.close(),
    popClass: 'auto-dialog',
    okText: t('editorPage.subConfig.basic.previewSwitch'),
    closeOnPopstate: true,
    lockScroll: true,
  });
  
};

const transferText = (type: string) => {
  const transType = () => {
    switch (artifact.value.type) {
      case 'subscription':
        return t('specificWord.singleSub');
      case 'collection':
        return t('specificWord.collectionSub');
      case 'file':
        return t('specificWord.file');
    }
  };

  const transTime = () => {
    if (isSimpleMode.value) {
      return artifact.value.updated
        ? butifyDate(artifact.value.updated)
        : '';
    } else {
      return artifact.value.updated
        ? t(`syncPage.detail.secondLine`, {
          time: butifyDate(artifact.value.updated),
        })
        : t(`syncPage.detail.notSync`);
    }

  };

  switch (type) {
    case 'type':
      return transType();
    case 'time':
      return transTime();
  }
};


const detail = computed(() => {
  if (isSimpleMode.value) {
    const name =
      sourceSub.value?.displayName ||
      sourceSub.value?.['display-name'] ||
      sourceSub.value?.name;
    return {
      firstLine: '',
      secondLine: transferText('type') + ' ' + name + ' ' + transferText('time'),
    };
  } else {
    return {
      firstLine: t(`syncPage.detail.firstLine`, {
        type: transferText('type'),
        name:
          sourceSub.value?.displayName ||
          sourceSub.value?.['display-name'] ||
          sourceSub.value?.name,
      }),
      secondLine: transferText('time'),
    };
  }
});

const swipeController = () => {
  if (swipeIsOpen.value) {
    swipe.value.close();
    swipeIsOpen.value = false;
    moreAction.value.style.transform = 'rotate(0deg)';
  } else {
    if (isLeftRight.value) {
      swipe.value.open('right');
    } else {
      swipe.value.open('left');
      swipeIsOpen.value = true;
      moreAction.value.style.transform = 'rotate(180deg)';
    }
  }
};

const onClickCopyLink = async () => {
  if (isSupported) {
    await copy(encodeURI(artifact.value.url));
  } else {
    await copyFallback(encodeURI(artifact.value.url));
  }
  showNotify({ title: t('syncPage.copyNotify.succeed'), type: 'success' });
};

const onDeleteConfirm = async () => {
  await artifactsStore.deleteArtifact(artifact.value.name);
};

const onClickSync = async () => {
  swipe.value.close();
  Toast.loading('同步中...', {
    cover: true,
    id: 'sync-toast',
  });
  await artifactsStore.syncOneArtifact(artifact.value.name);
  Toast.hide('sync-toast');
};

const onClickEdit = () => {
  swipe.value.close();
  emit('edit', artifact.value);
};

const onclose = () => {
  swipe.value.close();
};

const onClickDelete = () => {
  Dialog({
    title: t('syncPage.deleteArt.title'),
    content: createVNode(
      'span',
      {},
      t('syncPage.deleteArt.desc', { displayName: displayName.value })
    ),
    onCancel: () => { },
    onOk: onDeleteConfirm,
    onOpened: () => swipe.value.close(),
    popClass: 'auto-dialog',
    cancelText: t('syncPage.deleteArt.btn.cancel'),
    okText: t('syncPage.deleteArt.btn.confirm'),
    closeOnPopstate: true,
    lockScroll: true,
  });
};

// 初始化开关状态
watchEffect(() => {
  if (!isInit.value && artifact.value.name) {
    isSyncOpen.value = artifact.value.sync;
    isInit.value = true;
  } else {
  }
});

// 切换开关修改数据
watch(isSyncOpen, async () => {
  if (!isInit.value) return;
  isSwitcherLoading.value = true;
  const data = toRaw(artifact.value);
  data.sync = !artifact.value.sync;
  await artifactsStore.editArtifact(artifact.value.name, data);
  isSwitcherLoading.value = false;
});
</script>

<style lang="scss" scoped>
.sub-item-customer-icon {
  :deep(img) {
    & {
      filter: brightness(var(--img-brightness));
    }
  }
}

.sub-item-wrapper {
  line-height: 1.6;
  // width: calc(100% - 24px);
  margin-left: auto;
  margin-right: auto;
  border-radius: var(--item-card-radios);
  // padding: var(--safe-area-side);
  display: flex;
  flex-direction: row;//
  justify-content: flex-end; //
  background: var(--card-color);

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

  .sub-item-content {
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
        color: var(--primary-text-color);
      }


    }

    .sub-item-detail {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      word-wrap: break-word;
      word-break: break-all;
      // overflow: hidden;
      // margin-top: 3.5px;
      font-size: 12px;

      .second-line-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .task-switch {
          flex: 1;
          display: flex;
          align-items: center;
          // justify-content: end;
          flex-direction: row;
          justify-content: flex-end; // ios 14

          span {
            margin-right: 8px;
            font-weight: normal;
            // line-height: 2.8;
            color: var(--comment-text-color);
          }

          .my-switch {
            height: 22px;
            width: 45px;
            min-width: 40px;

            :deep(.switch-button) {
              width: 18px;
              height: 18px;
            }
          }

        }
      }

      p {
        display: block;
        line-height: 1.8;
      }

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

.copy-sub-link {
  background-color: transparent;
  border: none;
  padding: 0 12px;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 12px;

  svg {
    width: 16px;
    height: 16px;
    color: var(--lowest-text-color);
  }
}
.sub-img-wrappers {
  display: flex;
  align-items: center;
}
</style>
