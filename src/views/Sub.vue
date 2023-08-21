

<template>
  <div @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" style="overflow: hidden;">
    <!--添加订阅弹窗-->
    <div>
      <nut-popup pop-class="add-sub-popup" lock-scroll position="bottom" :style="{
        height: bottomSafeArea + 200 + 'px',
        padding: '20px 12px 0 12px',

      }" close-icon="close-little" z-index="11000" v-model:visible="addSubBtnIsVisible" closeable round>
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
    </div>
    <!--浮动按钮-->
    <Teleport to="body">
      <div class="drag-btn-wrapper" v-if="hasSubs || hasCollections">
        <nut-drag :attract="true" :boundary="{
          top: 56 + 8,
          left: 16,
          bottom: bottomSafeArea + 48 + 12 + 8,
          right: 16,
        }" :style="{ right: '16px', bottom: `${bottomSafeArea + 48 + 36}px` }">

          <!-- 刷新 -->
          <div class="drag-btn refresh" @click="refresh">
            <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
          </div>

          <!-- 加号 -->
          <div class="drag-btn" @click="addSubBtnIsVisible = true">
            <font-awesome-icon icon="fa-solid fa-plus" />
          </div>

        </nut-drag>
      </div>
    </Teleport>

    <!--页面内容-->
      <!--有数据-->
    <div class="subs-list-wrapper">
      <div v-if="hasSubs">
        <div class="sticky-title-wrappers">
          <p class="list-title">{{ $t(`specificWord.singleSub`) }}</p>
        </div>

        <draggable v-model="subs" @input="sortSubs" @change="changeSubs" itemKey="name" :scroll-sensitivity="200"
          :force-fallback="true" :scrollSpeed="8" :scroll="true" v-bind="{
            animation: 200,
            disabled: false,
            delay: 200,
            chosenClass: 'chosensub',
            handle: 'div'
          }">
          <template #item="{ element }">
            <div :key="element.name" class="draggable-item">
              <SubListItem :sub="element" type="sub"/>
            </div>
          </template>
        </draggable>
      </div>

      <div v-if="hasCollections">
        <div class="sticky-title-wrappers">
          <p class="list-title">{{ $t(`specificWord.collectionSub`) }}</p>
        </div>

        <draggable v-model="collections" @input="sortCollections" @change="changeCollections" itemKey="name"
          :scroll-sensitivity="200" :force-fallback="true" :scrollSpeed="8" :scroll="true" v-bind="{
            animation: 200,
            disabled: false,
            delay: 200,
            chosenClass: 'chosensub',
            handle: 'div'
          }">
          <template #item="{ element }">
            <div :key="element.name" class="draggable-item">
              <SubListItem :collection="element" type="collection" />
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <!--没有数据-->
    <div v-if="!isLoading && fetchResult && !hasSubs && !hasCollections" class="no-data-wrapper">
      <nut-empty image="empty">
        <template #description>
          <h3>{{ $t(`subPage.emptySub.title`) }}</h3>
          <p>{{ $t(`subPage.emptySub.desc`) }}</p>
        </template>
      </nut-empty>
      <nut-button @click="addSubBtnIsVisible = true" type="primary">{{ $t(`subPage.emptySub.btn`) }}
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
      <a href="https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46" target="_blank"><span>{{
        $t(`subPage.loadFailed.doc`) }}</span>
        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" /></a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SubListItem from '@/components/SubListItem.vue';
import { useGlobalStore } from '@/store/global';
import { useSubsStore } from '@/store/subs';
import { initStores } from '@/utils/initApp';
import { storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';
import draggable from 'vuedraggable';

// import { useAppNotifyStore } from '@/store/appNotify';
// import { Dialog, Toast } from '@nutui/nutui';
// const { showNotify } = useAppNotifyStore();

import { useSubsApi } from '@/api/subs';
const subsApi = useSubsApi();

const addSubBtnIsVisible = ref(false);
const subsStore = useSubsStore();
const globalStore = useGlobalStore();
const { hasSubs, hasCollections, subs, collections } = storeToRefs(subsStore);
const { isLoading, fetchResult, bottomSafeArea } = storeToRefs(globalStore);

const touchStartY = ref(null);
const touchStartX = ref(null);

const onTouchStart = (event: TouchEvent) => {
  touchStartY.value = Math.abs(event.touches[0].clientY);
  touchStartX.value = Math.abs(event.touches[0].clientX);
};

const onTouchMove = (event: TouchEvent) => {
  const deltaY = Math.abs(event.changedTouches[0].clientY - touchStartY.value);
  const deltaX = Math.abs(event.changedTouches[0].clientX - touchStartX.value);

  const isScrollingUp = deltaX > 2;
  const isScrollingUps = deltaY < 10;

  if (isScrollingUp && isScrollingUps) {
    event.preventDefault();
  }
};

const onTouchEnd = () => {
  touchStartY.value = null;
  touchStartX.value = null;
};



const refresh = () => {
  initStores(true, true, true);
};

const sortSubs = (newSub:any) => {
  subs.value = newSub;
};
const changeSubs = async () => {
  await subsApi.sortSub('subs', JSON.parse(JSON.stringify(toRaw(subs.value))));
};


const sortCollections = (newCollections:any) => {
  collections.value = newCollections;
};

const changeCollections = async () => {
  await subsApi.sortSub('collections', JSON.parse(JSON.stringify(toRaw(collections.value))));
  // showNotify({ title: '6666' });
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
    background-image: linear-gradient(to bottom right,
        var(--primary-color),
        var(--primary-color-end));
    box-shadow: 0 4px 8px #0003;
    display: flex;
    justify-content: center;
    align-items: center;

    &.refresh {
      background: var(--second-color);
      margin-bottom: 12px;
    }

    >svg {
      width: 20px;
      height: 20px;
      color: #fffb;
    }
  }
}

.add-sub-popup {
  background-color: var(--popup-color);
  // position: relative;

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

    >li {
      width: 50%;
      display: flex;
      justify-content: center;

      .router-link {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        >svg {
          width: 44px;
          height: 44px;
          color: var(--primary-color);
          margin-bottom: 12px;
        }
      }
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

.list-title {
  padding-left: 20px;
  font-weight: bold;
  // padding-left: var(--safe-area-side);
}

.sticky-title-wrappers {
  margin-top: var(--safe-area-side);
  // backdrop-filter: blur(var(--sticky-title-blur));
  // -webkit-backdrop-filter: blur(var(--sticky-title-blur));
  color: var(--comment-text-color);
  // background-color: var(--nav-bar-color);
}

.desc-about {
  display: block;
  padding: 100px 30px 50px;
  color: var(--comment-text-color);
  font-size: 12px;
  line-height: 20px;
  margin-top: 8px;
  margin-bottom: 20px;
  text-align: left;

}

.desc-about span {
  display: inline-block;
  padding: 6px 0 0 0;
}

.desc-title a,
.desc-about a {
  color: var(--primary-color);

}

.draggable-item {
  margin-top: 12px;
  margin-bottom: 12px;
}

.drag-handler {
  padding-left: 16px;
  color: var(--lowest-text-color);
}

.chosensub {
  box-shadow: 0 0 10px var(--primary-color);
  border-radius: var(--item-card-radios);
}

.subs-list-wrapper{
  width: calc(100% - 1.5rem);
  margin-left: auto;
  margin-right: auto;
}

</style>
