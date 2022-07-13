<template>
  <ul class="preview-list">
    <li v-for="platform in platformList" :key="platform.name">
      <a
        :href="`${host}/download/${
          type === 'sub' ? '' : 'collection/'
        }${name}?target=${platform.path}`"
        target="_blank"
      >
        <div>
          <img :src="platform.icon" alt="" class="auto-reverse" />
        </div>
        <p>{{ platform.name }}</p>
      </a>
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

  const { name, type } = defineProps<{
    name: string;
    type: 'sub' | 'collection';
  }>();
  const host = import.meta.env.VITE_API_URL;
  const platformList = [
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
  ];
</script>

<style lang="scss" scoped>
  .preview-list {
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

      &:not(:last-child) {
        border-bottom: 1px solid var(--divider-color);
      }

      a {
        width: 100%;
        padding: 12px 0;
        display: flex;
        align-items: center;

        div {
          width: 40px;
          height: 40px;
          margin-right: 16px;
        }

        p {
          font-size: 16px;
          color: var(--comment-text-color);
        }
      }
    }
  }
</style>
