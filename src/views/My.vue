<template>
  <div class="my-page-wrapper">
    <div class="profile-block">
      <div class="radio-wrapper" >
        <nut-radiogroup v-model="storageType" direction="horizontal">
          <nut-radio shape="button" label="gist">{{ $t(`myPage.storage.gist.label`) }}</nut-radio>
          <nut-radio shape="button" label="manual">{{ $t(`myPage.storage.manual.label`) }}</nut-radio>
        </nut-radiogroup>
      </div>
    
      <div class="info">
        <div v-if="storageType === 'manual'" class="avatar-wrapper">
          <nut-avatar
            :class="{ 'avatar-normal': !githubUser }"
            size="72"
            :icon="displayAvatar"
          />
          <div class="name">
            <p class="title">
              {{ $t(`myPage.storage.manual.label`) }}
            </p>
            <p class="des">
              <span class="des-line1">{{ $t(`myPage.storage.manual.desc`) }}</span>
              <!-- <span class="des-line2" v-if="desText.length === 2">
                {{ desText[1] }}
              </span> -->
            </p>
          </div>
        </div>
        <div v-else class="avatar-wrapper">
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
              <span class="des-line2" v-if="desText.length === 2">
                {{ desText[1] }}
              </span>
            </p>
          </div>
        </div>
        <div v-if="storageType === 'manual'" class="actions">
          <!-- <input type="file" @change="uploadFile" /> -->
          <input type="file" ref="fileInput" accept="application/json,text/json,.json" @change="fileChange" style="display: none">
          <nut-button
            class="upload-btn"
            plain
            type="primary"
            :disabled="restoreIsLoading"
            size="small"
            :loading="restoreIsLoading"
            @click="upload()"
          >
            <font-awesome-icon
              icon="fa-solid fa-cloud-arrow-up"
              v-if="!uploadIsLoading"
            />
            {{ $t(`myPage.storage.manual.restore`) }}
          </nut-button>
          <a :href="host + '/api/storage'" target="_blank">
            <nut-button
              class="download-btn"
              type="primary"
              size="small"
            >
              <font-awesome-icon
                icon="fa-solid fa-cloud-arrow-down"
              />
              {{ $t(`myPage.storage.manual.backup`) }}
            </nut-button>
          </a>
        </div>
        <div v-else class="actions">
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
            {{ $t(`myPage.btn.upload`) }}
          </nut-button>
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
            {{ $t(`myPage.btn.download`) }}
          </nut-button>
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
            v-if="storageType !== 'manual'"
            class="input"
            v-model="userInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.githubUser`)"
            type="text"
            input-align="left"
            :left-icon="iconUser"
          />
          <nut-input
            v-if="storageType !== 'manual'"
            class="input"
            v-model="tokenInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.gistToken`)"
            type="text"
            input-align="left"
            :left-icon="iconKey"
          />
          <nut-input
            class="input"
            v-model="uaInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.defaultUserAgent`)"
            type="text"
            input-align="left"
            :left-icon="iconUA"
          />
          <nut-input
            class="input"
            v-model="timeoutInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.defaultTimeout`)"
            type="number"
            input-align="left"
            :left-icon="iconTimeout"
          />
        </div>
      </div>

      <nut-cell-group>
        <nut-cell
          :title="$t(`apiSettingPage.apiSettingTitle`)"
          class="change-themes"
          @click.stop="onClickAPISetting"
          is-link
        ></nut-cell>
        

        <nut-cell
          :title="$t(`moreSettingPage.moreSettingTitle`)"
          class="change-themes"
          @click.stop="onClickMore"
          is-link
        ></nut-cell>

        <nut-cell
          :title="$t(`navBar.pagesTitle.aboutUs`)"
          class="change-themes"
          @click.stop="onClickAbout"
          is-link
        ></nut-cell>
      </nut-cell-group>
    </div>

    <div class="env-block">
      <img v-if="icon" :src="icon" alt="" class="auto-reverse" />
      <a
        v-if="env.hasNewVersion"
        target="_blank"
        :href="
          env.backend === 'Node'
            ? 'https://github.com/sub-store-org/Sub-Store/releases'
            : 'https://github.com/sub-store-org/Sub-Store/tree/master/config'
        "
      >
        <nut-badge value="NEW">v{{ env.version }}</nut-badge>
      </a>
      <p v-else>v{{ env.version }}</p>
      <p>{{ env.backend }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsApi } from "@/api/settings";
import avatar from "@/assets/icons/avatar.svg?url";
import iconKey from "@/assets/icons/key-solid.png";
import iconUser from "@/assets/icons/user-solid.png";
import iconUA from "@/assets/icons/user-agent.svg";
import iconTimeout from "@/assets/icons/timeout.svg";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { butifyDate } from "@/utils/butifyDate";
import { initStores } from "@/utils/initApp";
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from '@/hooks/useHostAPI';

const { t } = useI18n();

// const route = useRoute();
const router = useRouter();
const { showNotify } = useAppNotifyStore();
const { currentUrl: host } = useHostAPI();
const settingsStore = useSettingsStore();
const { githubUser, gistToken, syncTime, avatarUrl, defaultUserAgent, defaultTimeout } =
  storeToRefs(settingsStore);

const displayAvatar = computed(() => {
  return !githubUser.value ? avatar : avatarUrl.value;
});

const { icon, env } = useBackend();

const onClickAPISetting = () => {
  router.push(`/settings/api`);
};

const onClickMore = () => {
  router.push(`/settings/more`);
};
const onClickAbout = () => {
  router.push(`/aboutUs`);
};

// 编辑 更新
const userInput = ref("");
const tokenInput = ref("");
const uaInput = ref("");
const timeoutInput = ref("");
const isEditing = ref(false);
const isEditLoading = ref(false);
const isInit = ref(false);
const storageType = ref('gist');
const fileInput = ref(null);

const toggleEditMode = async () => {
  isEditLoading.value = true;
  if (isEditing.value) {
    await settingsStore.editSettings({
      githubUser: userInput.value,
      gistToken: tokenInput.value,
      defaultUserAgent: uaInput.value,
      defaultTimeout: timeoutInput.value,
    });
    setDisplayInfo();
  } else {
    userInput.value = githubUser.value;
    tokenInput.value = gistToken.value;
    uaInput.value = defaultUserAgent.value;
    timeoutInput.value = defaultTimeout.value;
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
    ? gistToken.value.slice(0, 6) + "************"
    : t(`myPage.placeholder.noGistToken`);
    uaInput.value = defaultUserAgent.value || t(`myPage.placeholder.noDefaultUserAgent`);
    timeoutInput.value = defaultTimeout.value || t(`myPage.placeholder.noDefaultTimeout`);
};

// 同步 上传
const downloadIsLoading = ref(false);
const uploadIsLoading = ref(false);
const restoreIsLoading = ref(false);
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
    return [t(`myPage.placeholder.des`), ""];
  } else {
    if (!syncTime.value) return [t(`myPage.placeholder.haveNotDownload`), ""];
    return [t(`myPage.placeholder.uploadTime`), butifyDate(syncTime.value)];
  }
});
const fileChange = async (event) => {
  const file = event.target.files[0];
  if(!file) return
  try {
    restoreIsLoading.value = true;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      
      const res = await useSettingsApi().restoreSettings({ content: String(reader.result) });
      if (res?.data?.status === "success") {
        await initStores(false, true, true);
        showNotify({
          type: "success",
          title: t(`myPage.notify.restore.succeed`),
        });
      } else {
        throw new Error('restore failed')
      }
    }

    reader.onerror = e => {
      throw e
    }
    
  } catch (e) {
    showNotify({
      type: "danger",
      title: t(`myPage.notify.restore.failed`),
    });
    console.error(e);
  } finally {
    restoreIsLoading.value = false;
  }
};
const upload = async() => {
  try {
    fileInput.value.click()
  } catch (e) {
    console.error(e);
  }
}

const sync = async (query: "download" | "upload") => {
  switch (query) {
    case "download":
      downloadIsLoading.value = true;
      break;
    case "upload":
      uploadIsLoading.value = true;
      break;
  }

  const res = await useSettingsApi().syncSettings(query);

  if (res?.data?.status === "success") {
    switch (query) {
      case "download":
        await initStores(false, true, true);
        break;
      case "upload":
        await useSettingsStore().fetchSettings();
        break;
    }
    showNotify({
      type: "success",
      title: t(`myPage.notify.${query}.succeed`),
    });
  }

  downloadIsLoading.value = false;
  uploadIsLoading.value = false;
};

// store 刷新数据完成后 复制内容给 input 绑定
const { isLoading: storeIsLoading, env: backendEnv } = storeToRefs(useGlobalStore());
watchEffect(() => {
  if (!storeIsLoading.value && !isInit.value) {
    setDisplayInfo();
    isInit.value = true;
  }
});
    
</script>

<style lang="scss" scoped>
.my-page-wrapper {
  min-height: 100%;
  padding: var(--safe-area-side);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .profile-block {
    width: 100%;

    .radio-wrapper {
      display: flex;
      justify-content: end;

      :deep(.nut-radio__button.false) {
        background: var(--divider-color);
        border-color: transparent;
        color: var(--second-text-color);
      }
    }

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
      padding: 12px 0 0 0;

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

    .change-themes {
      // color: var(--comment-text-color);
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
      width: 54px;
      height: 54px;
    }
  }
}

.nut-icon {
  color: var(--lowest-text-color);
}
</style>
