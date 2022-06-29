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
          <img :src="platform.icon" alt="" />
        </div>
        <p>{{ platform.name }}</p>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import surge from '@/assets/icons/surge.png?url'
  import clash from '@/assets/icons/clash.png?url'
  import quanx from '@/assets/icons/quanx.png?url'
  import loon from '@/assets/icons/loon.png?url'
  import stash from '@/assets/icons/stash.png?url'

  const { name, type } = defineProps<{
    name: string
    type: 'sub' | 'collection'
  }>()
  const host = import.meta.env.VITE_API_URL
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
  ]
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

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

      .dark-mode &:not(:last-child) {
        border-bottom: 1px solid $dark-divider-color;
      }

      .light-mode &:not(:last-child) {
        border-bottom: 1px solid $light-divider-color;
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

          .dark-mode & {
            filter: brightness(100);
          }

          .light-mode & {
            filter: brightness(0);
          }
        }

        p {
          font-size: 16px;

          .dark & {
            color: $dark-primary-text-color;
          }

          .light & {
            color: $light-primary-text-color;
          }
        }
      }
    }
  }
</style>
