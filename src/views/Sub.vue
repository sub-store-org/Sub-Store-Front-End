<template>
  <!--顶部通知 组件式暂时有bug，先使用函数调用式-->
  <!--<nut-notify-->
  <!--  pop-class="pop-notify"-->
  <!--  v-model:visible="notifySettings.notifyIsVisible"-->
  <!--  :type="notifySettings.notifyType"-->
  <!--&gt;-->
  <!--  <span>{{ notifySettings.notifyMsg }}</span>-->
  <!--</nut-notify>-->

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
  <!--有数据-->
  <div v-if="hasSubs" class="subs-list-wrapper">
    <p class="list-title">单条订阅</p>
    <ul>
      <li v-for="sub in subs" :key="sub.name">
        <SubListItem :sub="sub" type="sub" />
      </li>
    </ul>
  </div>

  <div v-if="hasCollections" class="subs-list-wrapper">
    <p class="list-title">组合订阅</p>
    <ul>
      <li v-for="collection in collections" :key="collection.name">
        <SubListItem :sub="collection" type="collection" />
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
        <h3>还没有添加订阅</h3>
        <p>添加后即可尽情享受 YM Peng 大佬的关爱～</p>
      </template>
    </nut-empty>
    <nut-button @click="addSubBtnIsVisible = true" type="primary"
      >立即添加
    </nut-button>
  </div>

  <!--数据加载失败-->
  <div v-if="!isLoading && !fetchResult" class="no-data-wrapper">
    <nut-empty image="error">
      <template #description>
        <h3>数据加载失败</h3>
        <p>请检查代理工具的 MITM、Rewrite 等配置</p>
      </template>
    </nut-empty>
    <nut-button icon="refresh" type="primary" @click="fetchData"
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
  import { useGlobalStore } from '@/store/global'
  import { ref, reactive } from 'vue'
  import SubListItem from '@/components/SubListItem.vue'
  import { storeToRefs } from 'pinia'
  import { Notify } from '@nutui/nutui'

  const notifySettings = reactive({
    // notifyIsVisible: false,
    notifyType: 'primary',
    notifyDuration: 2500,
    notifyMsg: '',
  })

  const addSubBtnIsVisible = ref(false)
  const isLoading = ref(true)
  const fetchResult = ref(true)

  const subsStore = useSubsStore()
  const globalStore = useGlobalStore()
  const { hasSubs, hasCollections, subs, collections } = storeToRefs(subsStore)
  const { bottomSafeArea } = storeToRefs(globalStore)

  const timer = ref(null)

  const fetchData = () => {
    subsStore
      .fetchSubsData()
      .then(() => {
        fetchResult.value = true
        notifySettings.notifyMsg = '数据刷新成功！\n感受大佬的拥抱吧～'
        notifySettings.notifyType = 'primary'
      })
      .catch(e => {
        fetchResult.value = false
        notifySettings.notifyMsg = `数据刷新失败\nE: ${e.status} ${
          e.data?.message ?? ''
        }`
        notifySettings.notifyType = 'danger'
      })
      .finally(() => {
        isLoading.value = false
        Notify[notifySettings.notifyType](notifySettings.notifyMsg, {
          duration: notifySettings.notifyDuration,
        })
      })
  }

  fetchData()
</script>

<style lang="scss">
  @import '@/assets/custom_theme_variables.scss';

  .drag-btn-wrapper {
    position: relative;
    z-index: 999;

    .drag-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-image: linear-gradient(
        to bottom right,
        $primary-color,
        $primary-color-end
      );
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

  .add-sub-popup {
    .dark-mode & {
      background-color: $dark-popup-color;
    }
    .light-mode & {
      background-color: $light-popup-color;
    }

    .add-sub-panel-title {
      width: 100%;
      text-align: center;
      font-size: 16px;

      .dark-mode & {
        color: $dark-comment-text-color;
      }

      .light-mode & {
        color: $light-comment-text-color;
      }
    }

    .add-sub-panel-list {
      padding: 16px 0;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      width: 100%;

      .dark-mode & {
        color: $dark-second-text-color;
      }

      .light-mode & {
        color: $light-second-text-color;
      }

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
  }

  .subs-list-wrapper {
    margin-bottom: 36px;
    position: relative;

    .list-title {
      font-size: 14px;
      font-weight: bold;
      position: sticky;
      z-index: 10;
      line-height: 36px;
      top: 0;

      .dark-mode & {
        color: $dark-comment-text-color;
        background-color: $dark-background-color;
      }

      .light-mode & {
        color: $light-comment-text-color;
        background-color: $light-background-color;
      }
    }

    & > ul {
      margin: 8px 0;

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

      .dark-mode & {
        color: $dark-primary-text-color;
      }

      .light-mode & {
        color: $light-primary-text-color;
      }
    }

    p {
      font-size: 14px;

      .dark-mode & {
        color: $dark-comment-text-color;
      }

      .light-mode & {
        color: $light-comment-text-color;
      }
    }

    a {
      font-size: 14px;
      margin-top: 24px;

      .dark-mode & {
        color: $dark-comment-text-color;
      }

      .light-mode & {
        color: $light-comment-text-color;
      }

      span {
        margin-right: 4px;
      }
    }
  }
</style>
