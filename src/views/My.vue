<template>
  <div class="my-page-wrapper">
    <div class="profile-block">
      <div class="radio-wrapper" >
        <span v-for="i in [{value: 'gist'}, {value:'manual'}]" :class="{ 'tag': true, 'current': i.value === storageType }" @click="setTag(i.value)">{{$t(`myPage.storage.${i.value}.label`) }}</span>
        <p class="storage-info">{{ $t(`myPage.storage.${storageType}.info`) }}</p>
      </div>
      <!-- <div class="radio-wrapper" >
        <nut-radiogroup v-model="storageType" direction="horizontal">
          <nut-radio shape="button" label="gist">{{ $t(`myPage.storage.gist.label`) }}</nut-radio>
          <nut-radio shape="button" label="manual">{{ $t(`myPage.storage.manual.label`) }}</nut-radio>
        </nut-radiogroup>
      </div> -->
    
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
          <!-- accept="application/json,text/json,.json"  -->
          <input type="file" ref="fileInput" @change="fileChange" style="display: none">
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
            @click="uploadBtn"
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
            @click="downloadBtn"
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
          >
            <!-- <template #button>
              <nut-button :disabled="!isEditing" :plain="!isEditing" size="mini" :type="isEditing ? 'primary' : 'info' " @click="toggleSyncPlatform">{{ syncPlatformInput === 'gitlab' ? ( isEditing ?'切换回 Gist' : 'GitLab Snippet (β)') : ( isEditing ?'切换到 GitLab Snippet (β)' : 'Gist') }}</nut-button>
            </template> -->
          </nut-input>
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
            v-if="storageType !== 'manual'"
            class="input"
            v-model="githubProxyInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.githubProxy`)"
            type="text"
            input-align="left"
            :left-icon="icongithubProxy"
            right-icon="tips"
            @click-right-icon="githubProxyTips"
          />
          <nut-input
            class="input"
            v-model="proxyInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.defaultProxy`)"
            type="text"
            input-align="left"
            :left-icon="iconProxy"
            right-icon="tips"
            @click-right-icon="proxyTips"
          />
          <nut-input
            class="input"
            v-model="uaInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.defaultUserAgent`)"
            type="text"
            input-align="left"
            :left-icon="iconUA"
            right-icon="tips"
            @click-right-icon="uaTips"
          />
          <nut-input
            class="input"
            v-model="timeoutInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.defaultTimeout`)"
            type="number"
            input-align="left"
            :left-icon="iconTimeout"
            right-icon="tips"
            @click-right-icon="timeoutTips"
          />
          <nut-input
            class="input"
            v-model="cacheThresholdInput"
            :disabled="!isEditing"
            :placeholder="$t(`myPage.placeholder.cacheThreshold`)"
            type="number"
            input-align="left"
            :left-icon="iconMax"
            right-icon="tips"
            @click-right-icon="cacheThresholdTips"
          />
        </div>
      </div>

      <nut-cell-group>
        <nut-cell
          v-if="shareBtnVisible"
          :title="$t(`moreSettingPage.shareManageTitle`)"
          class="change-themes"
          @click.stop="onClickShareManage"
          is-link
        ></nut-cell>
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
      <img v-if="icon" :src="env.meta?.node?.env?.SUB_STORE_BACKEND_CUSTOM_ICON || icon" alt="" class="auto-reverse" />
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
      <p>{{ env.meta?.node?.env?.SUB_STORE_BACKEND_CUSTOM_NAME || env.backend }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsApi } from "@/api/settings";
import avatar from "@/assets/icons/avatar.svg?url";
import iconKey from "@/assets/icons/key-solid.png";
import iconUser from "@/assets/icons/user-solid.png";
import iconProxy from "@/assets/icons/proxy.svg";
import icongithubProxy from "@/assets/icons/githubProxy.svg";
import iconUA from "@/assets/icons/user-agent.svg";
import iconMax from "@/assets/icons/max.svg";
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
import { Dialog, Toast } from '@nutui/nutui';

const { t } = useI18n();

// const route = useRoute();
const router = useRouter();
const { showNotify } = useAppNotifyStore();
const { currentUrl: host } = useHostAPI();
const settingsStore = useSettingsStore();
const { githubUser, gistToken, syncTime, avatarUrl, defaultUserAgent, defaultProxy, defaultTimeout, cacheThreshold, syncPlatform, githubProxy } =
  storeToRefs(settingsStore);

const displayAvatar = computed(() => {
  return !githubUser.value ? avatar : avatarUrl.value;
});

const { icon, env } = useBackend();

const shareBtnVisible = computed(() => {
  return env.value?.feature?.share;
});

const onClickAPISetting = () => {
  router.push(`/settings/api`);
};

const onClickShareManage = () => {
  router.push(`/shares`);
};
const onClickMore = () => {
  router.push(`/settings/more`);
};
const onClickAbout = () => {
  router.push(`/aboutUs`);
};


// 编辑 更新
const syncPlatformInput = ref("");
const userInput = ref("");
const tokenInput = ref("");
const githubProxyInput = ref("");
const uaInput = ref("");
const proxyInput = ref("");
const timeoutInput = ref("");
const cacheThresholdInput = ref("");
const isEditing = ref(false);
const isEditLoading = ref(false);
const isInit = ref(false);
const storageType = ref('gist');
const fileInput = ref(null);

const toggleEditMode = async () => {
  isEditLoading.value = true;
  if (isEditing.value) {
    await settingsStore.editGistSettings({
      syncPlatform: syncPlatformInput.value,
      githubUser: userInput.value,
      gistToken: tokenInput.value,
      githubProxy: githubProxyInput.value,
      defaultUserAgent: uaInput.value,
      defaultProxy: proxyInput.value,
      defaultTimeout: timeoutInput.value,
      cacheThreshold: cacheThresholdInput.value,
    });
    setDisplayInfo();
  } else {
    syncPlatformInput.value = syncPlatform.value;
    userInput.value = githubUser.value;
    tokenInput.value = gistToken.value;
    githubProxyInput.value = githubProxy.value;
    uaInput.value = defaultUserAgent.value;
    proxyInput.value = defaultProxy.value;
    timeoutInput.value = defaultTimeout.value;
    cacheThresholdInput.value = cacheThreshold.value;
  }
  isEditLoading.value = false;
  isEditing.value = !isEditing.value;
};

const exitEditMode = () => {
  setDisplayInfo();
  isEditing.value = false;
  isEditLoading.value = false;
};
const toggleSyncPlatform = () => {
  if (syncPlatformInput.value === 'gitlab') {
    syncPlatformInput.value = ''
    Toast.text(`已切换到 ${syncPlatformInput.value === 'gitlab' ? 'GitLab Snippet' : 'Gist'}`);
  } else {
      Dialog({
        title: '切换同步平台',
        content: 'GitLab Snippet 正在测试中, 相关文案仍然是 Gist, 请备份数据后使用',
        popClass: 'auto-dialog',
        okText: `使用 ${syncPlatformInput.value === 'gitlab' ? 'Gist' : ' Snippet'}`,
        cancelText: '取消',
        onOk: () => {
          if (syncPlatformInput.value === 'gitlab') {
            syncPlatformInput.value = ''
          } else {
            syncPlatformInput.value = 'gitlab'
          }
          Toast.text(`已切换到 ${syncPlatformInput.value === 'gitlab' ? 'GitLab Snippet' : 'Gist'}`);
        },
        closeOnPopstate: true,
        lockScroll: false,
      });
  }

  
};
const setDisplayInfo = () => {
  syncPlatformInput.value = syncPlatform.value || "";
  userInput.value = githubUser.value || "";
  githubProxyInput.value = githubProxy.value || "";
  tokenInput.value = gistToken.value
    ? `${gistToken.value.slice(0, 6)}************`
    : "";
  uaInput.value = defaultUserAgent.value || "";
  proxyInput.value = defaultProxy.value || "";
  timeoutInput.value = defaultTimeout.value || "";
  cacheThresholdInput.value = cacheThreshold.value || "";
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
        window.location.reload()
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

const sync = async (query: "download" | "upload", options?: { keep?: string[], encode?: 'base64' | 'plaintext' }) => {
  switch (query) {
    case "download":
      downloadIsLoading.value = true;
      break;
    case "upload":
      uploadIsLoading.value = true;
      break;
  }

  const res = await useSettingsApi().syncSettings(query, options);

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
    if (query === "download") {
      window.location.reload()
    }
  }

  downloadIsLoading.value = false;
  uploadIsLoading.value = false;
};

const uploadBtn = () => {
  Dialog({
    title: '请选择',
    content: '若选择明文, 将不会保留 GitHub Token. 若选择 Base64 编码, 将完整保留数据(后端版本必须 >= 2.19.85)',
    footerDirection: 'vertical',
    onCancel: () => {
      sync('upload', {
        encode: 'plaintext'
      });
    },
    cancelText: '明文(将不会保留 GitHub Token)',
    okText: 'Base64 编码上传',
    onOk: () => {
      sync('upload', {
        encode: 'base64'
      });
    },
    popClass: "auto-dialog",
    closeOnPopstate: true,
    lockScroll: false,
  });
}
const downloadBtn = () => {
  Dialog({
    title: '请选择',
    content: '若想保留本地当前已设置的 GitHub Token, 请选择保留(后端版本必须 >= 2.19.83)',
    footerDirection: 'vertical',
    onCancel: () => {
      sync('download');
    },
    okText: '保留当前 Token, 覆盖其他数据',
    cancelText: '覆盖(可能需重新设置 Token)',
    onOk: () => {
      sync('download', {
        keep: ['settings.gistToken']
      });
    },
    popClass: "auto-dialog",
    closeOnPopstate: true,
    lockScroll: false,
  });
}
const githubProxyTips = () => {
  Dialog({
      title: '请填写完整 GitHub 加速代理地址',
      content: '后端需 >= 2.19.97\n\n1. 仅用于上传/下载 Gist 和获取 GitHub 头像\n\n2. 请填写完整 如 https://a.com\n\n3. 需支持代理 https://api.github.com\n\n测试方式:\n浏览器打开\nhttps://a.com/https://api.github.com/users/xream\n有正常的响应\n\n4. 使用此方式时, 自行注意安全隐私问题',
      popClass: 'auto-dialog',
      textAlign: 'left',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const proxyTips = () => {
  Dialog({
      title: '通过代理/节点/策略进行下载',
      content: '1. Surge(参数 policy/policy-descriptor)\n\n可设置节点代理 例: Test = snell, 1.2.3.4, 80, psk=password, version=4\n\n或设置策略/节点 例: 国外加速\n\n2. Loon(参数 node)\n\nLoon 官方文档: \n\n指定该请求使用哪一个节点或者策略组（可以使节点名称、策略组名称，也可以说是一个Loon格式的节点描述，如：shadowsocksr,example.com,1070,chacha20-ietf,"password",protocol=auth_aes128_sha1,protocol-param=test,obfs=plain,obfs-param=edge.microsoft.com）\n\n3. Stash(参数 headers["X-Surge-Policy"])/Shadowrocket(参数 headers.X-Surge-Policy)/QX(参数 opts.policy)\n\n可设置策略/节点\n\n4. Node.js 版(http/https/socks5):\n\n例: socks5://a:b@127.0.0.1:7890\n\n※ 优先级由高到低: 单条订阅, 组合订阅, 默认配置',
      popClass: 'auto-dialog',
      textAlign: 'left',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const uaTips = () => {
  Dialog({
      title: '默认为 clash.meta',
      content: '可尝试设置为 clash-verge/v1.5.1 等客户端的 User-Agent 让机场后端下发更多协议',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const timeoutTips = () => {
  Dialog({
      title: '可尝试设置为 3000~4000',
      content: '防止拉取结果的总时长超过代理 app 加载外部资源的最大等待时长, 确保拉取成功',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const cacheThresholdTips = () => {
  Dialog({
      title: '可尝试设置为 1024',
      content: '下载资源过大时\n若要写入缓存\n代理 app 可能会崩溃重启\n可尝试设置此值',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
// store 刷新数据完成后 复制内容给 input 绑定
const { isLoading: storeIsLoading, env: backendEnv } = storeToRefs(useGlobalStore());
watchEffect(() => {
  if (!storeIsLoading.value && !isInit.value) {
    setDisplayInfo();
    isInit.value = true;
  }
});
const setTag = (current) => {
  storageType.value = current
};
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
      align-items: center;
      

      .tag {
        font-size: 12px;
        color: var(--second-text-color);
        margin: 0px 5px;
        padding: 7.5px 2.5px 4px;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;
        flex-shrink: 0;
      }
      .current {
        border-bottom: 1px solid var(--primary-color);
        color: var(--primary-color);
      }
      .storage-info {
        margin-left: auto;
        font-size: 12px;
        color: var(--lowest-text-color);
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
        padding: 0 0 0 10px;
      }

      h1 {
        font-size: 14px;
        padding: 8px 0 2px 0;
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
          padding: 12px;
          color: var(--second-text-color);

          :deep(img) {
            width: 16px;
            height: 16px;
            margin-right: 6px;
            opacity: 0.2;
            filter: brightness(var(--img-brightness));
          }
          :deep(.nut-icon-tips:before) {
            cursor: pointer;
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
          padding: 0 10px;
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
