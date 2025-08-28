<template>
  <div class="page-wrapper">
    <div class="about-wrapper">
      <!-- <h1 class="block-title">{{ $t(`aboutUsPage.projectInfo.title`) }}</h1> -->
      <div class="block-content">
        <nut-cell-group :title="$t(`aboutUsPage.projectInfo.title`)">
          <nut-cell
            class="cell-item"
            :desc="$t(`aboutUsPage.projectInfo.link`)"
            url="https://github.com/sub-store-org/Sub-Store-Front-End"
          >
            <template v-slot:title>
              <span
                >{{ $t(`aboutUsPage.projectInfo.fe`) }}
                <b class="bclass">v{{ version }}</b></span
              >
            </template>
          </nut-cell>

          <nut-cell
            class="cell-item"
            :desc="$t(`aboutUsPage.projectInfo.link`)"
            :url="env.backend === 'Node' ? 'https://github.com/sub-store-org/Sub-Store/releases' : 'https://github.com/sub-store-org/Sub-Store/tree/master/config'"
          >
            <template v-slot:title>
              <span
                >{{ env.backend === 'Node' ? $t(`aboutUsPage.projectInfo.be`) : $t(`aboutUsPage.projectInfo.module`) }}
                <b v-if="env.hasNewVersion" class="bclass"><a target="_blank" :href="env.backend === 'Node' ? 'https://github.com/sub-store-org/Sub-Store/releases' : 'https://github.com/sub-store-org/Sub-Store/tree/master/config'"><nut-badge value="NEW">v{{env.version}}</nut-badge></a></b>
                <b v-else class="bclass">v{{ env.version }}</b>
              </span>
            </template>
          </nut-cell>

          <nut-cell
            class="cell-item"
            :desc="$t(`aboutUsPage.projectInfo.link`)"
            url="https://github.com/sub-store-org"
          >
            <template v-slot:title>
              <span>{{ $t(`aboutUsPage.projectInfo.team`) }}</span>
            </template>
          </nut-cell>
        </nut-cell-group>

        <!-- <div class="project-block">
          <p>
            <span>{{ $t(`aboutUsPage.projectInfo.fe`) }}</span><span>v2.14.12</span>
          </p>
          <a target="_blank" href="https://github.com/sub-store-org/Sub-Store-Front-End">
            {{ $t(`aboutUsPage.projectInfo.link`) }}
          </a>
        </div>


        <div class="project-block">
          <p>
            <span>{{ $t(`aboutUsPage.projectInfo.be`) }}</span><span>v{{ env.version }}</span>
          </p>
          <a target="_blank" href="https://github.com/sub-store-org/Sub-Store">
            {{ $t(`aboutUsPage.projectInfo.link`) }}
          </a>
        </div>


        <div class="project-block">
          <p>
            <span>{{ $t(`aboutUsPage.projectInfo.mock`) }}</span>
          </p>
          <a target="_blank" href="https://github.com/Keywos/rule/raw/main/module/Sub-Store-Mock.sgmodule">
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
        </div> -->
      </div>
    </div>

    <div class="changelog-wrapper">
      <h1 class="block-title">{{ $t(`aboutUsPage.changelogs.title`) }}</h1>
      <div class="block-content">
        <nut-collapse
          v-model:active="active"
          icon="rect-right"
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

  const version = import.meta.env.PACKAGE_VERSION
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/custom_variables.scss';

  .cell-item {
    box-shadow: none;
    background: var(--card-color);
    border-radius: var(--item-card-radios);
    font-weight: bold;
    display: flex;
    align-items: center;

    :deep(.nut-cell__value) {
      font-weight: normal;
      color: var(--primary-color);
      cursor: pointer;
    }

    .bclass {
      margin-left: 10px;
      color: $text-color-3;
      font-size: 12px;
      font-weight: 100;
    }
  }

  .page-wrapper {
    min-height: 100%;

    .block-title {
      color: $text-color-3;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      margin-left: 30px;
      // padding: 0 var(--safe-area-side);
    }

    .block-content {
      display: flex;
      flex-direction: column;
      gap: 1px;
      margin: 0 var(--safe-area-side);
      border-radius: var(--item-card-radios);
      overflow: hidden;
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
          gap: 1px;
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
        padding-bottom: 12px;
      }
    }
  }
</style>
