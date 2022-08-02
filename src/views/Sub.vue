<template>
  <!--浮动按钮-->
  <Teleport to="body">
    <div class="drag-btn-wrapper" v-if="hasSubs || hasCollections">
      <nut-drag
        :attract="true"
        :boundary="{
          top: 56 + 8,
          left: 16,
          bottom: bottomSafeArea + 48 + 12 + 8,
          right: 16,
        }"
        :style="{ right: '16px', bottom: `${bottomSafeArea + 48 + 36}px` }"
      >
        <div class="drag-btn refresh" @click="refresh">
          <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
        </div>
        <div class="drag-btn" @click="addSubBtnIsVisible = true">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </div>
      </nut-drag>
    </div>
  </Teleport>

  <!--添加订阅弹窗-->
  <nut-popup
    pop-class="add-sub-popup"
    lock-scroll
    position="bottom"
    :style="{
      height: bottomSafeArea + 200 + 'px',
      padding: '20px 12px 0 12px',
    }"
    close-icon="close-little"
    z-index="1000"
    v-model:visible="addSubBtnIsVisible"
    closeable
    round
  >
    <p class="add-sub-panel-title">{{ $t(`subPage.addSubTitle`) }}</p>
    <ul class="add-sub-panel-list">
      <li>
        <router-link to="/edit/subs/UNTITLED" class="router-link">
          <svg-icon name="singleSubs" />
          <span>{{ $t(`specificWord.singleSub`) }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/edit/collections/UNTITLED" class="router-link">
          <svg-icon name="collectionSubs" />
          <span>{{ $t(`specificWord.collectionSub`) }}</span>
        </router-link>
      </li>
    </ul>
  </nut-popup>

  <!--页面内容-->
  <!--有数据-->
  <div v-if="hasSubs" class="subs-list-wrapper">
    <div class="sticky-title-wrapper">
      <p class="list-title">{{ $t(`specificWord.singleSub`) }}</p>
    </div>
    <ul>
      <li v-for="sub in subs" :key="sub.name">
        <SubListItem :sub="sub" type="sub" />
      </li>
    </ul>
  </div>

  <div v-if="hasCollections" class="subs-list-wrapper">
    <div class="sticky-title-wrapper">
      <p class="list-title">{{ $t(`specificWord.collectionSub`) }}</p>
    </div>
    <ul>
      <li v-for="collection in collections" :key="collection.name">
        <SubListItem :collection="collection" type="collection" />
      </li>
    </ul>
  </div>

  <!--没有数据-->
  <div
    v-if="!isLoading && fetchResult && !hasSubs && !hasCollections"
    class="no-data-wrapper"
  >
    <nut-empty image="empty">
      <template #description>
        <h3>{{ $t(`subPage.emptySub.title`) }}</h3>
        <p>{{ $t(`subPage.emptySub.desc`) }}</p>
      </template>
    </nut-empty>
    <nut-button @click="addSubBtnIsVisible = true" type="primary"
      >{{ $t(`subPage.emptySub.btn`) }}
    </nut-button>
  </div>

  <!--数据加载失败-->
  <div v-if="!isLoading && !fetchResult" class="no-data-wrapper">
    <nut-empty image="error">
      <template #description>
        <h3>{{ $t(`subPage.loadFailed.title`) }}</h3>
        <p>{{ $t(`subPage.loadFailed.desc`) }}</p>
      </template>
    </nut-empty>
    <nut-button icon="refresh" type="primary" @click="refresh">{{
      $t(`subPage.loadFailed.btn`)
    }}</nut-button>
    <a
      href="https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46"
      target="_blank"
      ><span>{{ $t(`subPage.loadFailed.doc`) }}</span>
      <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square"
    /></a>
  </div>
</template>

<script lang="ts" setup>
  import SubListItem from '@/components/SubListItem.vue';
  import { useGlobalStore } from '@/store/global';
  import { useSubsStore } from '@/store/subs';
  import { initStores } from '@/utils/initApp';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';

  const addSubBtnIsVisible = ref(false);

  const subsStore = useSubsStore();
  const globalStore = useGlobalStore();
  const { hasSubs, hasCollections, subs, collections } = storeToRefs(subsStore);
  const { isLoading, fetchResult, bottomSafeArea } = storeToRefs(globalStore);

  const refresh = () => {
    initStores(true, true, true);
  };
</script>

<style lang="scss">
  .drag-btn-wrapper {
    position: relative;
    z-index: 999;

    .drag-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-image: linear-gradient(
        to bottom right,
        var(--primary-color),
        var(--primary-color-end)
      );
      box-shadow: 0 4px 8px #0003;
      display: flex;
      justify-content: center;
      align-items: center;

      &.refresh {
        background: var(--second-color);
        margin-bottom: 12px;
      }
      > svg {
        width: 20px;
        height: 20px;
        color: #fffb;
      }
    }
  }

  .add-sub-popup {
    background-color: var(--popup-color) !important;

    .add-sub-panel-title {
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: var(--comment-text-color);
    }

    .add-sub-panel-list {
      padding: 16px 0;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      width: 100%;
      color: var(--second-text-color);

      > li {
        width: 50%;
        display: flex;
        justify-content: center;

        .router-link {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;

          > svg {
            width: 44px;
            height: 44px;
            color: var(--primary-color);
            margin-bottom: 12px;
          }
        }
      }
    }
  }

  .subs-list-wrapper {
    margin-bottom: 36px;
    position: relative;

    .list-title {
      padding-left: var(--safe-area-side);
    }

    & > ul {
      margin: 8px 0;
      overflow: hidden;

      > li:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }

  .no-data-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: var(--primary-text-color);
    }

    p {
      font-size: 14px;
      color: var(--comment-text-color);
    }

    a {
      font-size: 14px;
      margin-top: 24px;
      color: var(--comment-text-color);

      span {
        margin-right: 4px;
      }
    }
  }
</style>
