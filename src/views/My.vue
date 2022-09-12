<template>
  <div class="my-page-wrapper">
    <div class="profile-block">
      <div class="info">
        <div class="avatar-wrapper">
          <nut-avatar
            :class="{ 'avatar-normal': !githubUser }"
            size="72"
            :icon="displayAvatar"
          />
          <div class="name">
            <p class="title">
              {{ githubUser || $t(`myPage.placeholder.name`) }}
            </p>
            <p class="des">
              <span class="des-line1">{{ desText[0] }}</span>
              <span class="des-line2" v-if="desText.length === 2">{{
                desText[1]
              }}</span>
            </p>
          </div>
        </div>
        <div class="actions">
          <nut-button
            class="upload-btn"
            plain
            type="primary"
            :disabled="syncIsDisabled"
            size="small"
            :loading="uploadIsLoading"
            @click="sync('upload')"
          >
            <font-awesome-icon
              icon="fa-solid fa-cloud-arrow-up"
              v-if="!uploadIsLoading"
            />
            {{ $t(`myPage.btn.upload`) }}</nut-button
          >
          <nut-button
            class="download-btn"
            type="primary"
            size="small"
            :disabled="syncIsDisabled"
            :loading="downloadIsLoading"
            @click="sync('download')"
          >
            <font-awesome-icon
              v-if="!downloadIsLoading"
              icon="fa-solid fa-cloud-arrow-down"
            />
            {{ $t(`myPage.btn.download`) }}</nut-button
          >
        </div>
      </div>
      <div class="config-card">
        <div class="title-wrapper">
          <h1>{{ $t(`myPage.config`) }}</h1>
          <div class="config-btn-wrapper">
            <nut-button
              v-if="isEditing"
              class="cancel-btn"
              plain
              type="info"
              size="mini"
              @click="exitEditMode"
              :disabled="isEditLoading"
            >
              <font-awesome-icon icon="fa-solid fa-ban" />
              {{ $t(`myPage.btn.cancel`) }}
            </nut-button>
            <nut-button
              class="save-btn"
              type="primary"
              size="mini"
              @click="toggleEditMode"
              :loading="isEditLoading"
            >
              <font-awesome-icon
                v-if="!isEditing"
                icon="fa-solid fa-pen-to-square"
              />
              <font-awesome-icon
                v-else-if="!isEditLoading && isEditing"
                icon="fa-solid fa-floppy-disk"
              />
              {{ !isEditing ? $t(`myPage.btn.edit`) : $t(`myPage.btn.save`) }}
            </nut-button>
          </div>
        </div>
        <div class="config-input-wrapper">
          <nut-input
            class="input"
            v-model="userInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.githubUser`)"
            type="text"
            input-align="left"
            :left-icon="iconUser"
          />
          <nut-input
            class="input"
            v-model="tokenInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.gistToken`)"
            type="text"
            input-align="left"
            :left-icon="iconKey"
          />
        </div>
      </div>
      <nut-cell
        class="change-theme"
        :title="$t(`themeSettingPage.themeSettingTitle`)"
        to="/settings/theme"
        is-link
      ></nut-cell>
    </div>

    <div class="env-block">
      <img
        v-if="backendIcon()"
        :src="backendIcon()"
        alt=""
        class="auto-reverse"
      />
      <p>{{ env.backend }}</p>
      <p>v{{ env.version }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSettingsApi } from '@/api/settings';
  import avatar from '@/assets/icons/avatar.svg?url';
  import clash from '@/assets/icons/clash.png?url';
  import iconKey from '@/assets/icons/key-solid.svg';
  import loon from '@/assets/icons/loon.png?url';
  import node from '@/assets/icons/node.svg?url';
  import quanx from '@/assets/icons/quanx.png?url';
  import stash from '@/assets/icons/stash.png?url';
  import surge from '@/assets/icons/surge.png?url';
  import iconUser from '@/assets/icons/user-solid.svg';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { useGlobalStore } from '@/store/global';
  import { useSettingsStore } from '@/store/settings';
  import { butifyDate } from '@/utils/butifyDate';
  import { initStores } from '@/utils/initApp';
  import { storeToRefs } from 'pinia';
  import { computed, ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const router = useRouter();
  const { showNotify } = useAppNotifyStore();
  const settingsStore = useSettingsStore();
  const globalStore = useGlobalStore();
  const { env } = storeToRefs(globalStore);
  const { githubUser, gistToken, syncTime, avatarUrl } =
    storeToRefs(settingsStore);

  const displayAvatar = computed(() => {
    return !githubUser.value ? avatar : avatarUrl.value;
  });

  const backendIcon = () => {
    switch (env.value.backend) {
      case 'Surge':
        return surge;
      case 'Clash':
        return clash;
      case 'QX':
        return quanx;
      case 'Loon':
        return loon;
      case 'Stash':
        return stash;
      case 'Node':
        return node;
    }
  };

  // 编辑 更新
  const userInput = ref('');
  const tokenInput = ref('');
  const isEditing = ref(false);
  const isEditLoading = ref(false);
  const isInit = ref(false);

  const toggleEditMode = async () => {
    isEditLoading.value = true;
    if (isEditing.value) {
      await settingsStore.editSettings({
        githubUser: userInput.value,
        gistToken: tokenInput.value,
      });
      setDisplayInfo();
    } else {
      userInput.value = githubUser.value;
      tokenInput.value = gistToken.value;
    }
    isEditLoading.value = false;
    isEditing.value = !isEditing.value;
  };

  const exitEditMode = () => {
    setDisplayInfo();
    isEditing.value = false;
    isEditLoading.value = false;
  };

  const setDisplayInfo = () => {
    userInput.value = githubUser.value || t(`myPage.placeholder.noGithubUser`);
    tokenInput.value = gistToken.value
      ? gistToken.value.slice(0, 6) + '************'
      : t(`myPage.placeholder.noGistToken`);
  };

  // 同步 上传
  const downloadIsLoading = ref(false);
  const uploadIsLoading = ref(false);
  const syncIsDisabled = computed(() => {
    return (
      uploadIsLoading.value ||
      downloadIsLoading.value ||
      !gistToken.value ||
      !githubUser.value
    );
  });

  const desText = computed(() => {
    if (!gistToken.value || !githubUser.value) {
      return [t(`myPage.placeholder.des`), ''];
    } else {
      if (!syncTime.value) return [t(`myPage.placeholder.haveNotDownload`), ''];
      return [t(`myPage.placeholder.uploadTime`), butifyDate(syncTime.value)];
    }
  });

  const sync = async (query: 'download' | 'upload') => {
    switch (query) {
      case 'download':
        downloadIsLoading.value = true;
        break;
      case 'upload':
        uploadIsLoading.value = true;
        break;
    }

    const res = await useSettingsApi().syncSettings(query);

    if (res.data.status === 'success') {
      switch (query) {
        case 'download':
          await initStores(false, true, true);
          break;
        case 'upload':
          await useSettingsStore().fetchSettings();
          break;
      }
      showNotify({
        type: 'success',
        title: t(`myPage.notify.${query}.succeed`),
      });
    }

    downloadIsLoading.value = false;
    uploadIsLoading.value = false;
  };

  // store 刷新数据完成后 复制内容给 input 绑定
  const { isLoading: storeIsLoading } = storeToRefs(useGlobalStore());
  watchEffect(() => {
    if (!storeIsLoading.value && !isInit.value) {
      setDisplayInfo();
      isInit.value = true;
    }
  });
</script>

<style lang="scss" scoped>
  .my-page-wrapper {
    height: 100%;
    padding: var(--safe-area-side);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .profile-block {
      width: 100%;

      .config-card {
        margin-top: 20px;
        width: 100%;
        padding: 12px;
        border-radius: var(--item-card-radios);
        color: var(--second-text-color);
        background: var(--card-color);

        .title-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h1 {
          font-size: 14px;
          padding: 8px 0;
          margin-bottom: 8px;
        }

        .config-input-wrapper {
          padding: 0 12px;

          .input.nut-input-disabled {
            :deep(input):disabled {
              -webkit-text-fill-color: var(--lowest-text-color);
            }
          }

          .input {
            background: transparent;
            padding: 16px;
            color: var(--second-text-color);

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

        .config-btn-wrapper {
          display: flex;
          justify-content: flex-end;

          .cancel-btn {
            background: transparent;
          }

          .save-btn {
            margin-left: 8px;
          }
        }
      }

      .info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0;

        .avatar-wrapper {
          display: flex;
          align-items: center;
          max-width: 64%;

          .avatar-normal {
            :deep(img) {
              width: 72%;
            }
          }

          .name {
            margin-left: 12px;
            font-size: 18px;
            font-weight: bold;
            max-width: 64%;
            display: flex;
            flex-direction: column;

            p.title {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: var(--primary-text-color);
            }

            .des {
              margin-top: 6px;
              font-size: 12px;
              font-weight: normal;
              display: flex;
              flex-direction: column;
              color: var(--comment-text-color);
            }
          }
        }

        .actions {
          margin-left: 12px;
          display: flex;
          flex-direction: column;

          svg {
            margin-right: 4px;
          }

          .upload-btn,
          .download-btn {
            padding: 0 12px;
            width: 116px;
          }

          .upload-btn {
            background: transparent;
          }

          .download-btn {
            margin-top: 12px;
          }
        }
      }

      .change-theme {
        box-shadow: none;
        font-weight: bold;
      }
    }

    .env-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: var(--lowest-text-color);

      img {
        opacity: 0.4;
        width: 64px;
        height: 64px;
      }
    }
  }
</style>
