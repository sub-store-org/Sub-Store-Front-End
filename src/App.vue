<template>
  <NavBar />
  <main class="page-body">
    <router-view />
  </main>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
  import { setColorThemeClass } from '@/utils/setColorThemeClass'
  import { provide, onMounted } from 'vue'
  import { Notify } from '@nutui/nutui'
  import { useSubsStore } from '@/store/subs'
  import { useGlobalStore } from '@/store/global'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const subsStore = useSubsStore()
  const globalStore = useGlobalStore()

  // 处于 pwa 时将底部安全距离写入 global store
  type NavigatorExtend = Navigator & {
    standalone?: boolean
  }
  const navigator: NavigatorExtend = window.navigator
  globalStore.setBottomSafeArea(navigator.standalone ? 32 : 6)

  // 初始化颜色主题
  setColorThemeClass()

  // 定义初始化应用数据方法
  const initStores = async (needNotify: boolean, needFetchFlow: boolean) => {
    const notify = {
      type: '',
      msg: '',
      duration: 2500,
    }
    globalStore.setLoading(true)
    globalStore.setFetchResult(true)

    // 拉取应用数据
    const fetchAllStoreData = async () => {
      return new Promise((resolve, reject) => {
        const list = [subsStore.fetchSubsData()]
        Promise.all(list)
          .then(async () => {
            if (needFetchFlow) await subsStore.fetchFlows()
            resolve('')
          })
          .catch(e => {
            reject(e)
          })
      })
    }

    try {
      await fetchAllStoreData()
      notify.msg = t('globalNotify.refresh.succeed')
      notify.type = 'primary'
    } catch (e) {
      console.log('e', e)
      notify.type = 'danger'
      globalStore.setFetchResult(false)
      notify.msg = t('globalNotify.refresh.failed')

      if (Array.isArray(e)) {
        const msgList = e.map(i => i?.data?.error?.message ?? '')
        notify.msg += msgList.join('\n')
      } else {
        const code = `Code ${e.status}`
        const msg = e?.error?.message ?? ''
        notify.msg += msg ? code + ', ' + msg : code
      }

      subsStore.subs = {}
      subsStore.collections = {}
    }
    globalStore.setLoading(false)

    // 发送通知
    if (needNotify) {
      Notify[notify.type](notify.msg, {
        duration: notify.duration,
      })
    }
  }
  provide<Function>('refreshWithNotify', initStores)

  // 引入 inoBounce 禁止过度滑动橡皮筋效果
  onMounted(() => {
    let externalScript = document.createElement('script')
    externalScript.src =
      'https://cdnjs.cloudflare.com/ajax/libs/inobounce/0.2.1/inobounce.min.js'
    document.head.appendChild(externalScript)
  })

  // 初始化应用数据（顶部通知）
  initStores(true, true)
</script>

<style lang="scss">
  @import '@/assets/custom_theme_variables.scss';

  #app {
    font-family: 'Roboto', 'Noto Sans', Arial, 'PingFang SC',
      'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'ST Heiti',
      SimHei, sans-serif;
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    width: 100%;

    .light-mode & {
      color: $light-primary-text-color;
      background: $light-background-color;
    }

    .dark-mode & {
      color: $dark-primary-text-color;
      background: $dark-background-color;
    }

    .page-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
</style>
