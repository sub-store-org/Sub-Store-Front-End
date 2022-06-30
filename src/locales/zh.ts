export default {
  // Sub-Store 的专有名词
  specificWord: {
    singleSub: '单条订阅',
    collectionSub: '组合订阅',
  },
  globalNotify: {
    refresh: {
      succeed: '数据刷新成功！\n感受大佬的拥抱吧～',
      failed: '数据刷新失败\n',
    },
  },
  // 顶部标题栏
  navBar: {
    langSwitcher: {
      cellTitle: '轻点你想要使用的语言以切换',
      zh: '简体中文',
      en: 'English',
    },
    pagesTitle: {
      sub: '订阅管理',
      sync: '同步订阅',
      my: '我的',
      subEditor: '订阅编辑',
      notFound: '地址未找到',
    },
  },
  // 底部标签栏
  tabBar: {
    sub: '订阅',
    sync: '同步',
    my: '我的',
  },
  // 404页
  notFoundPage: {
    title: '啊哦～ URL 错误！',
    desc: '回首页',
  },
  // 订阅管理页
  subPage: {
    addSubTitle: '选择要创建的订阅类型',
    previewTitle: '选择想要预览的平台',

    emptySub: {
      title: '你还没有添加订阅',
      desc: '添加后即可尽情享受 YM Peng 大佬的关爱～',
      btn: '立即添加',
    },
    loadFailed: {
      title: '数据加载失败',
      desc: '请检查代理工具的 MITM、Rewrite 等配置',
      btn: '重试',
      doc: '查看 Sub-Store 教程',
    },
    collectionItem: {
      noSub: '没有包含子订阅',
      contain: '包含的订阅',
    },
    subItem: {
      local: '本地订阅',
      loading: '加载中...',
      flow: '已用/总流量',
      expires: '到期时间',
    },
    deleteSub: {
      title: '删除订阅',
      desc: '是否确认删除订阅 {displayName}？删除后不可恢复！',
      succeedNotify: '删除成功！',
      btn: {
        confirm: '确认删除',
        cancel: '取消',
      },
    },
    copyNotify: {
      succeed: '复制订阅链接成功\n可以前往代理工具使用咯～',
      failed: '复制订阅链接失败\n{e}',
    },
  },
};
