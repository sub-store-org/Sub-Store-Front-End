<template>
  <nut-swipe class="sub-item-swipe" ref="swipe">
    <div class="sub-item-wrapper">
      <div class="sub-img-wrapper">
        <nut-avatar
          class="sub-item-customer-icon"
          size="60"
          :url="icon"
          bg-color=""
        ></nut-avatar>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">
          <h3 class="sub-item-title">
            {{ displayName }}
          </h3>
          <div class="title-right-wrapper">
            <button
              class="copy-sub-link"
              @click.stop="onClickCopyLink"
              v-if="artifact.url"
            >
              <font-awesome-icon icon="fa-solid fa-clone"></font-awesome-icon>
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

        <div class="sub-item-detail">
          <p>
            {{ detail.firstLine }}
          </p>
          <div class="second-line-wrapper">
            <p>{{ detail.secondLine }}</p>
            <div class="task-switch">
              <span>
                {{ $t(`syncPage.syncSwitcher`) }}
              </span>
              <nut-switch
                class="my-switch"
                v-model="isSyncOpen"
                :loading="isSwitcherLoading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #right>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button
          shape="square"
          type="primary"
          class="sub-item-swipe-btn"
          @click="onClickSync"
        >
          <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" />
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
  import surgeIcon from '@/assets/icons/surge.png';
  import quanxIcon from '@/assets/icons/quanx.png';
  import loonIcon from '@/assets/icons/loon.png';
  import clashIcon from '@/assets/icons/clash.png';
  import stashIcon from '@/assets/icons/stash.png';
  import shadowRocketIcon from '@/assets/icons/shadowrocket.png';
  import { isMobile } from '@/utils/isMobile';
  import { computed, ref, createVNode, watchEffect, watch, toRaw } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useSubsStore } from '@/store/subs';
  import { useArtifactsStore } from '@/store/artifacts';
  import { Dialog, Toast, Notify } from '@nutui/nutui';
  import { butifyDate } from '@/utils/butifyDate';
  import { storeToRefs } from 'pinia';
  import { useClipboard } from '@vueuse/core';

  const { copy } = useClipboard();

  const { t } = useI18n();

  const { name } = defineProps<{
    name: string;
  }>();

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
      case 'Stash':
        return stashIcon;
      case 'ShadowRocket':
        return shadowRocketIcon;
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
    }
  });

  const transferText = (type: string) => {
    const transType = () => {
      switch (artifact.value.type) {
        case 'subscription':
          return t('specificWord.singleSub');
        case 'collection':
          return t('specificWord.collectionSub');
      }
    };

    const transTime = () => {
      return artifact.value.updated
        ? t(`syncPage.detail.secondLine`, {
            time: butifyDate(artifact.value.updated),
          })
        : t(`syncPage.detail.notSync`);
    };

    switch (type) {
      case 'type':
        return transType();
      case 'time':
        return transTime();
    }
  };

  const detail = computed(() => {
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
  });

  const swipeController = () => {
    if (swipeIsOpen.value) {
      swipe.value.close();
      swipeIsOpen.value = false;
      moreAction.value.style.transform = 'rotate(0deg)';
    } else {
      swipe.value.open('left');
      swipeIsOpen.value = true;
      moreAction.value.style.transform = 'rotate(180deg)';
    }
  };

  const onClickCopyLink = () => {
    copy(encodeURI(artifact.value.url));
    Notify.success(t('syncPage.copyNotify.succeed'), {
      duration: 1500,
    });
  };

  const onDeleteConfirm = async () => {
    await artifactsStore.deleteArtifact(artifact.value.name);
  };

  const onClickSync = async () => {
    swipe.value.close();
    const loadingToast = Toast.loading('同步中...', {
      cover: true,
    });
    await artifactsStore.syncOneArtifact(artifact.value.name);
    loadingToast.hide();
  };

  const onClickEdit = () => {
    swipe.value.close();
    emit('edit', artifact.value);
  };

  const onClickDelete = () => {
    Dialog({
      title: t('syncPage.deleteArt.title'),
      content: createVNode(
        'span',
        {},
        t('syncPage.deleteArt.desc', { displayName: displayName.value })
      ),
      onCancel: () => {},
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
    border-radius: $item-card-radios;
    padding: $safe-area-side;
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
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin-left: 12px;

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

        .second-line-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .task-switch {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: end;

            span {
              margin-right: 8px;
              font-weight: normal;
              font-size: 12px;

              .light-mode & {
                color: $light-comment-text-color;
              }

              .dark-mode & {
                color: $dark-comment-text-color;
              }
            }

            .my-switch.switch-close {
              .light-mode & {
                background: $light-switch-background-color;
              }

              .dark-mode & {
                background: $dark-switch-background-color;
              }
            }

            .my-switch {
              height: 22px;
              width: 40px;
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
          line-height: 2.2;
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
