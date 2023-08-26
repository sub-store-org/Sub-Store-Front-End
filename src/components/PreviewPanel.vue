<template>
  <ul class="preview-list">
    <li v-for="platform in platformList" :key="platform.name">
      <div>
        <div>
          <a :href="`${host}/download/${type === 'sub' ? '' : 'collection/'}${name}${platform.path !== null ? `?target=${platform.path}` : ''}`"
            target="_blank">
            <img :src="platform.icon" class="auto-reverse" /></a>
        </div>
        <div class="copy-div" @click.stop="targetCopy(platform.path)">
          {{ platform.name }}
          <button class="copy-sub-link">
            <img :src="copyicon" />
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import surge from '@/assets/icons/surge.png';
import clash from '@/assets/icons/clash.png';
import quanx from '@/assets/icons/quanx.png';
import loon from '@/assets/icons/loon.png';
import stash from '@/assets/icons/stash.png';
import shadowrocket from '@/assets/icons/shadowrocket.png';
import v2ray from '@/assets/icons/v2ray.png';
import copyicon from '@/assets/icons/copy.svg';
import logoicon from '@/assets/icons/logo.svg';
import { useClipboard } from '@vueuse/core';
import useV3Clipboard from 'vue-clipboard3';
import { useAppNotifyStore } from '@/store/appNotify';
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();
const { name, type, general, notify } = defineProps<{
  name: string;
  type: 'sub' | 'collection';
  general: string;
  notify: string;
}>();
const host = localStorage.getItem('hostApi') || import.meta.env.VITE_API_URL || 'https://sub.store';
const targetCopy = async (path: string) => {
  const urlTarget: string = path !== null ? `?target=${path}` : '';
  const url = `${host}/download/${type === 'sub' ? '' : 'collection/'}${name}${urlTarget}`;
  if (isSupported) {
    await copy(encodeURI(url));
  } else {
    await copyFallback(encodeURI(url));
  }
  showNotify({ title: notify, content: url });
};
const platformList = [
  {
    name: general,
    path: null,
    icon: logoicon,
  },
  {
    name: 'Clash',
    path: 'Clash',
    icon: clash,
  },
  {
    name: 'Quantumult X',
    path: 'QX',
    icon: quanx,
  },
  {
    name: 'Surge',
    path: 'Surge',
    icon: surge,
  },
  {
    name: 'Loon',
    path: 'Loon',
    icon: loon,
  },
  {
    name: 'Stash',
    path: 'Stash',
    icon: stash,
  },
  {
    name: 'ShadowRocket',
    path: 'ShadowRocket',
    icon: shadowrocket,
  },
  {
    name: 'V2Ray',
    path: 'V2Ray',
    icon: v2ray,
  }
];
</script>

<style lang="scss" scoped>
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

  >li {
    width: 100%;

    &:not(:last-child) {
      border-bottom: 1px solid var(--divider-color);
    }

    div {

      width: 100%;
      padding: 12px 0;
      display: flex;
      align-items: center;

      div {
        width: 40px;
        height: 36px;
      }

      p {
        font-size: 16px;
        color: var(--comment-text-color);
      }
    }


    .copy-div {
      flex: 1;
      font-size: 16px;
      padding-left: 20px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
    }

    .copy-sub-link {
      background-color: transparent;
      border: none;

      img {
        width: 20px;
        height: 20px;
        opacity: 0.30;
        filter: brightness(var(--img-brightness));
      }
    }
  }
}
</style>
