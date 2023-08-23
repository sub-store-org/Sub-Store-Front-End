<template>
  <div class="page-wrapper">
    <div class="about-wrapper">
      <h1 class="block-title">{{ $t(`aboutUsPage.projectInfo.title`) }}</h1>
      <div class="block-content">
        <div class="project-block">
          <p>
            <span>{{ $t(`aboutUsPage.projectInfo.fe`) }}</span
            ><span>v2.14.11</span>
          </p>
          <a
            target="_blank"
            href="https://github.com/sub-store-org/Sub-Store-Front-End"
          >
            {{ $t(`aboutUsPage.projectInfo.link`) }}
          </a>
        </div>

        <div class="project-block">
          <p>
            <span>{{ $t(`aboutUsPage.projectInfo.be`) }}</span
            ><span>v{{ env.version }}</span>
          </p>
          <a target="_blank" href="https://github.com/sub-store-org/Sub-Store">
            {{ $t(`aboutUsPage.projectInfo.link`) }}
          </a>
        </div>

        <div class="project-block">
          <p>
            <span>{{ $t(`aboutUsPage.projectInfo.mock`) }}</span>
          </p>
          <a
            target="_blank"
            href="https://github.com/Keywos/rule/raw/main/module/Sub-Store-Mock.sgmodule"
          >
            {{ $t(`aboutUsPage.projectInfo.link`) }}
          </a>
        </div>

        <div class="project-block">
          <p>
            <span>{{ $t(`aboutUsPage.projectInfo.team`) }}</span>
          </p>
          <a target="_blank" href="https://github.com/sub-store-org">
            {{ $t(`aboutUsPage.projectInfo.link`) }}
          </a>
        </div>
      </div>
    </div>

    <div class="changelog-wrapper">
      <h1 class="block-title">{{ $t(`aboutUsPage.changelogs.title`) }}</h1>

      <div class="block-content">
        <nut-collapse
          v-model:active="active"
          icon="arrow-right2"
          rotate="90"
          accordion
        >
          <nut-collapse-item
            v-for="changelog in changelogs"
            :key="changelog.htmlContent"
            :name="changelog.date.format('YYYY-MM-DD')"
          >
            <template #mTitle>
              <h2 class="changelog-title">
                {{ changelog.date.format('YYYY-MM-DD') }}
              </h2>
            </template>
            <div class="changelog-content" v-html="changelog.htmlContent" />
          </nut-collapse-item>
        </nut-collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/global';
  import { useChangelogs } from '@/hooks/useChangelogs';
  import { ref } from 'vue';

  const globalStore = useGlobalStore();
  const { env } = storeToRefs(globalStore);

  const changelogs = useChangelogs();
  const active = ref(changelogs[0].date.format('YYYY-MM-DD'));
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/custom_variables.scss';

  .page-wrapper {
    height: 100%;

    .block-title {
      color: $text-color-1;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      padding: 0 var(--safe-area-side);
    }
    .block-content {
      display: flex;
      flex-direction: column;
      gap: 1px;
      margin: 0 var(--safe-area-side);
      border-radius: var(--item-card-radios);
      overflow: hidden;
      view:first-of-type {
        :deep(.nut-collapse-item) {
          .collapse-wrapper {
            height: auto;
          }
        }
      }
    }

    .about-wrapper {
      margin-top: 16px;

      .project-block {
        padding: var(--safe-area-side);
        background: var(--card-color);
        display: flex;
        justify-content: space-between;

        > p {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: $text-color-3;

          span:first-child {
            font-size: 14px;
            color: $text-color-1;
          }
        }

        > a {
          color: $primary-color;
          font-size: 12px;
          text-decoration: none;
        }
      }
    }

    .changelog-wrapper {
      margin-top: 44px;
      padding-bottom: 36px;

      .changelog-title {
        font-size: 16px;
        font-weight: normal;
      }

      .changelog-content {
        font-size: 12px;
      }
    }
  }
</style>
