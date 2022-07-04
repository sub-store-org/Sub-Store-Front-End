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
  editorPage: {
    subConfig: {
      btn: {
        compare: '即时预览',
        save: '保存',
      },
      pop: {
        helpTitle: '节点操作帮助',
        helpContent:
          '预览开关可控制即时预览时该模块是否生效，当保存时无论开启关闭都会保存并生效于订阅\n\n' +
          '所有节点操作均为有序生效，可按住手柄拖动排序，点击即时进行预览对比',
        helpBtn: '我知道了',
        errorTitle: '提交出错！',
        errorBtn: '去修改',
        succeedMsg: '保存成功！',
        deleteTitle: '删除确认',
        deleteDes:
          '是否确认删除此操作？删除后不可恢复！\ntips: 可使用开关控制即时预览时是否生效',
        deleteConfirm: '确认删除',
        deleteCancel: '取消',
      },
      basic: {
        label: '订阅配置',
        name: {
          label: '名称',
          placeholder: '请输入唯一的标识名称',
          isEmpty: '订阅名称不能为空',
          isExist: '订阅名称已存在',
        },
        displayName: {
          label: '显示名称',
          placeholder: '输入展示的订阅名称',
        },
        source: {
          label: '来源',
          remote: '远程订阅',
          local: '本地订阅',
        },
        url: {
          label: '链接',
          placeholder: '填入机场原始订阅链接',
          isEmpty: '订阅链接不能为空',
          isIllegal: '订阅链接格式非法',
        },
        subscriptions: {
          label: '包含的订阅',
        },
        content: {
          label: '内容',
          placeholder: '填入订阅内容',
        },
        icon: {
          label: '图标链接',
          placeholder: '填入想要展示的图标链接，png最佳',
        },
        ua: {
          label: 'User-Agent',
          placeholder: '下载订阅使用的UA，不填使用默认',
        },
      },
      commonOptions: {
        label: '常用配置',
        useless: {
          label: '过滤非法节点',
          keep: '保留',
          remove: '删除',
        },
        udp: {
          label: 'UDP转发',
          default: '默认',
          open: '强制开启',
          close: '强制关闭',
        },
        scv: {
          label: '跳过证书验证',
          default: '默认',
          open: '强制开启',
          close: '强制关闭',
        },
        tfo: {
          label: 'TCP Fast Open',
          default: '默认',
          open: '强制开启',
          close: '强制关闭',
        },
        aead: {
          label: 'Vmess AEAD',
          default: '默认',
          open: '强制开启',
          close: '强制关闭',
        },
      },
      surgeOptions: {
        label: 'Surge 配置',
        hybrid: {
          label: 'Hybrid 策略',
          default: '默认',
          open: '强制开启',
          close: '强制关闭',
        },
      },
      actions: {
        label: '节点操作',
        addAction: {
          title: '添加一个操作',
          cancel: '取消',
          confirm: '确认',
        },
      },
      nodeActions: {
        'Flag Operator': {
          label: '国旗操作',
          des: '工作模式',
          options: ['添加', '移除'],
          tipsTitle: '国旗操作提示',
          tipsDes: '国旗操作说明',
        },
        'Sort Operator': {
          label: '节点排序',
          des: '模式',
          options: ['正序', '逆序', '随机'],
          tipsTitle: '排序操作提示',
          tipsDes: '节点排序操作说明',
        },
        'Resolve Domain Operator': {
          label: '节点域名解析',
          des: '服务提供商',
          options: ['Google', 'IP-API', 'Cloudflare'],
          tipsTitle: '域名解析操作提示',
          tipsDes: '节点域名解析操作说明',
        },
        'Region Filter': {
          label: '区域过滤',
          options: ['🇭🇰 HK', '🇨🇳 TW', '🇸🇬 SG', '🇯🇵 JP', '🇬🇧 UK', '🇺🇸 US'],
          tipsTitle: '区域过滤操作提示',
          tipsDes: '区域过滤器操作说明',
        },
        'Type Filter': {
          label: '节点类型过滤',
          options: [
            'ShadowSocks',
            'ShadowSocks R',
            'VMess',
            'VLess',
            'Trojan',
            'Http(s)',
            'Socks5',
            'Snell',
          ],
          tipsTitle: '节点类型过滤操作提示',
          tipsDes: '节点类型过滤器操作说明',
        },
      },
    },
  },
  comparePage: {
    title: '即时预览',
    remain: {
      title: '保留的节点',
      beforeIndicator: '操作前',
      afterIndicator: '操作后',
    },
    divider: '以下为被过滤的节点',
    filter: {
      title: '被过滤的节点',
    },
    tableHead: {
      name: '节点名&服务器',
      udp: 'UDP',
      'skip-cert-verify': 'SCV',
      tfo: 'TFO',
      aead: 'AEAD',
    },
  },
};
