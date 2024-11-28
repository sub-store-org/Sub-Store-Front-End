<template>
  <div>
    <div class="desc" @click="tips">
      <span>{{ desc }}</span>
      <nut-icon name="tips"></nut-icon>
    </div>
    <div class="includeUnsupportedProxy">
      <input type="checkbox" id="includeUnsupportedProxy" name="includeUnsupportedProxy" value="includeUnsupportedProxy" v-model="includeUnsupportedProxy">
      <label for="includeUnsupportedProxy">包含官方/商店版/未续费订阅不支持的协议</label>
    </div>
    <ul class="preview-list">
      <li v-for="platform in platformList" :key="platform.name">
        <div class="infos">
          <div>
            <img :src="platform.icon" class="auto-reverse" />
          </div>
          <p>{{ platform.name }}</p>
          <nut-icon name="tips" v-if="platform.path === 'SurgeMac'" @click="tips"></nut-icon>
        </div>

        <div class="actions">
          <a
            :href="getUrl(platform.path)"
            target="_blank"
          >
            <svg-icon
              name="view"
              class="action-icon"
              color="var(--comment-text-color)"
            />
          </a>
          <button class="copy-sub-link" @click.stop="targetCopy(platform.path)">
            <svg-icon
              name="copy"
              class="action-icon"
              color="var(--comment-text-color)"
            />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Toast, Dialog } from '@nutui/nutui';
  import json from '@/assets/icons/json.svg';
  import uri from '@/assets/icons/uri.svg';
  import surfboard from '@/assets/icons/surfboard.png';
  import surge from '@/assets/icons/surge.png';
  import surgeMac from '@/assets/icons/surgeformac_text.png';
  import clash from '@/assets/icons/clash.png';
  import egern from '@/assets/icons/egern.png';
  import quanx from '@/assets/icons/quanx.png';
  import loon from '@/assets/icons/loon.png';
  import stash from '@/assets/icons/stash.png';
  import shadowrocket from '@/assets/icons/shadowrocket.png';
  import v2ray from '@/assets/icons/v2ray.png';
  import singbox from '@/assets/icons/sing-box.png';
  import clashmeta from '@/assets/icons/clashmeta.png';
  import logoIcon from '@/assets/icons/logo.png';
  import { useClipboard } from '@vueuse/core';
  import useV3Clipboard from 'vue-clipboard3';
  import { useAppNotifyStore } from '@/store/appNotify';
  import SvgIcon from '@/components/SvgIcon.vue';
  import { useHostAPI } from '@/hooks/useHostAPI';

  const includeUnsupportedProxy = ref(false);
  const { copy, isSupported } = useClipboard();
  const { toClipboard: copyFallback } = useV3Clipboard();
  const { showNotify } = useAppNotifyStore();
  const { name, type, general, notify, tipsTitle, tipsContent, desc,tipsCancelText, tipsOkText } = defineProps<{
    name: string;
    type: 'sub' | 'collection';
    general: string;
    notify: string;
    desc: string;
    tipsTitle?: string;
    tipsContent?: string;
    tipsCancelText?: string;
    tipsOkText?: string;
  }>();

  const { currentUrl: host } = useHostAPI();
  const getUrl = (path: string) => {
    const query = {} as Record<string, string | boolean>
    if(path !== null) query.target = path;
    if(includeUnsupportedProxy.value) query.includeUnsupportedProxy = true;
    return `${host.value}/download/${
      type === 'sub' ? '' : 'collection/'
    }${encodeURIComponent(name)}${Object.keys(query).length > 0 ? `?${Object.entries(query).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : ''}`;
  }
  const targetCopy = async (path: string) => {
    const url = getUrl(path);
    if (isSupported) {
      await copy(url);
    } else {
      await copyFallback(url);
    }
    showNotify({ title: notify });
  };
  const platformList = [
    {
      name: general,
      path: null,
      icon: logoIcon,
    },
    {
      name: 'Stash',
      path: 'Stash',
      icon: stash,
    },
    {
      name: 'Clash.Meta(mihomo)',
      path: 'ClashMeta',
      icon: clashmeta,
    },
    {
      name: 'Clash(Deprecated)',
      path: 'Clash',
      icon: clash,
    },
    {
      name: 'Egern',
      path: 'Egern',
      icon: egern,
    },
    {
      name: 'Surfboard',
      path: 'Surfboard',
      icon: surfboard,
    },
    {
      name: 'Surge',
      path: 'Surge',
      icon: surge,
    },
    {
      name: 'Surge(macOS)',
      path: 'SurgeMac',
      icon: surgeMac,
    },

    {
      name: 'Loon',
      path: 'Loon',
      icon: loon,
    },
    {
      name: 'Shadowrocket',
      path: 'ShadowRocket',
      icon: shadowrocket,
    },
    {
      name: 'Quantumult X',
      path: 'QX',
      icon: quanx,
    },
    {
      name: 'sing-box',
      path: 'sing-box',
      icon: singbox,
    },
    {
      name: 'V2Ray',
      path: 'V2Ray',
      icon: v2ray,
    },
    {
      name: 'URI',
      path: 'URI',
      icon: uri,
    },
    {
      name: 'JSON',
      path: 'JSON',
      icon: json,
    },
  ];
  const tips = () => {
    window.open('https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E');
    // Dialog({
    //   title: tipsTitle,
    //   content: tipsContent,
    //   popClass: 'auto-dialog',
    //   onOk: () => {
    //     window.open('https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E');
    //   },
    //   okText: tipsOkText,
    //   cancelText: tipsCancelText,
    //   // noCancelBtn: true,
    //   closeOnPopstate: true,
    //   lockScroll: false,
    // });

  };
</script>

<style lang="scss" scoped>
  .includeUnsupportedProxy {
    margin: 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      cursor: pointer;
      padding: 0;
      margin: 0 4px 0 0;
    }
    label {
      cursor: pointer;
    }
  }
  .desc {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .preview-list {
    flex: 1;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    > li {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:not(:last-child) {
        border-bottom: 1px solid var(--divider-color);
      }

      .infos {
        flex: 1;
        padding: 3px 0;
        display: flex;
        align-items: center;
        gap: 4px;

        div {
          width: 32px;
          aspect-ratio: 1;
        }

        p {
          font-size: 14px;
          color: var(--second-text-color);
        }
      }

      .actions {
        flex-shrink: 0;
        flex-grow: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        font-size: 20px;

        > button {
          background-color: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }
      }
    }
  }
</style>
