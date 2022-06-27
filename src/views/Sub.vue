<template>
  <!--浮动按钮-->
  <div class="drag-btn-wrapper" v-if="hasSubs || hasCollections">
    <nut-drag
      direction="y"
      :style="{ right: '0px', bottom: `${tabBarSafeAreaBottom + 44 + 36}px` }"
    >
      <div class="drag-btn" @click="addSubBtnIsVisible = true">
        <font-awesome-icon icon="fa-solid fa-plus" />
      </div>
    </nut-drag>
  </div>

  <!--添加订阅弹窗-->
  <nut-popup
    position="bottom"
    :style="{ height: tabBarSafeAreaBottom + 200 + 'px' }"
    close-icon="close-little"
    v-model:visible="addSubBtnIsVisible"
    closeable
    round
  >
    <p class="add-sub-panel-title">选择要创建的订阅类型</p>
    <ul class="add-sub-panel-list">
      <li>
        <router-link to="/editor/single" class="router-link">
          <svg-icon name="singleSubs" />
          <span>单条订阅</span>
        </router-link>
      </li>
      <li>
        <router-link to="/editor/collection" class="router-link">
          <svg-icon name="collectionSubs" />
          <span>组合订阅</span>
        </router-link>
      </li>
    </ul>
  </nut-popup>

  <!--页面内容-->
  <div v-if="hasSubs">
    <p class="type-list-title">单条订阅</p>
    <ul>
      <li v-for="sub in subs" :key="sub.name">
        <SubListItem :sub="sub" type="sub" />
      </li>
    </ul>
  </div>

  <div v-if="hasCollections">
    <p class="type-list-title">组合订阅</p>
    <ul>
      <li v-for="collection in collections" :key="collection.id">
        <SubListItem :sub="collection" type="collection" />
      </li>
    </ul>
  </div>

  <div
    v-if="fetchResult && !hasSubs && !hasCollections"
    class="no-data-wrapper"
  >
    <nut-empty image="empty">
      <template #description>
        <h3>还没有添加订阅</h3>
        <p>添加后即可尽情享受 YM Peng 大佬的关爱～</p>
      </template>
    </nut-empty>
    <nut-button @click="addSubBtnIsVisible = true" type="primary"
      >立即添加
    </nut-button>
  </div>

  <div v-if="!fetchResult" class="no-data-wrapper">
    <nut-empty image="error">
      <template #description>
        <h3>数据加载失败</h3>
        <p>请检查代理工具的 MITM、Rewrite 等配置</p>
      </template>
    </nut-empty>
    <nut-button icon="refresh" type="danger" @click="fetchData"
      >重试</nut-button
    >
    <a
      href="https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46"
      target="_blank"
      ><span>查看 Sub-Store 教程</span>
      <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square"
    /></a>
  </div>
</template>

<script lang="ts" setup>
  import { useSubsStore } from '@/store/subs'
  import { inject, ref, watchEffect } from 'vue'
  import { banScroll, allowScroll } from '@/utils/switchCanScroll'
  import SubListItem from '@/components/SubListItem.vue'
  import { storeToRefs } from 'pinia'
  import { Notify } from '@nutui/nutui'

  const tabBarSafeAreaBottom = inject<number>('tabBarSafeAreaBottom')

  const addSubBtnIsVisible = ref(false)
  watchEffect(() => {
    addSubBtnIsVisible.value ? banScroll() : allowScroll()
  })

  const fetchResult = ref(true)
  const store = useSubsStore()
  const { hasSubs, hasCollections, subs, collections } = storeToRefs(store)

  const fetchData = () => {
    store
      .fetchSubsData()
      .then(() => {
        fetchResult.value = true
        Notify.success('数据加载成功！', { duration: 1500 })
      })
      .catch(e => {
        fetchResult.value = false
        Notify.danger(`数据加载失败\n${e.msg}`, { duration: 1500 })
      })
  }
  fetchData()
</script>

<style lang="scss" scoped>
  @import '@/assets/custom_theme_variables.scss';

  .drag-btn-wrapper {
    position: relative;
    z-index: 999;

    .drag-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-image: linear-gradient(
        to bottom right,
        $primary-color,
        $primary-color-end
      );
      margin-right: 16px;
      box-shadow: 0 4px 8px #0003;
      display: flex;
      justify-content: center;
      align-items: center;

      > svg {
        width: 20px;
        height: 20px;
        color: #fffb;
      }
    }
  }

  .add-sub-panel-title {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 20px;
    font-size: 16px;
    color: #606266;
  }

  .add-sub-panel-list {
    font-size: 16px;
    font-weight: bold;
    color: #404244;
    padding: 64px 12px 0 12px;
    display: flex;
    width: 100%;

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
          color: $primary-color;
          margin-bottom: 12px;
        }
      }
    }
  }

  .type-list-title {
    font-size: 14px;
    color: #909399;
    font-weight: bold;
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
      color: #303133;
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      color: #909399;
    }

    a {
      color: #909399;
      font-size: 14px;
      margin-top: 24px;

      span {
        margin-right: 4px;
      }
    }
  }
</style>
