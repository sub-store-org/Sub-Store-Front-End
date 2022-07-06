export default {
  // Sub-Store 的专有名词
  specificWord: {
    singleSub: '单条订阅',
    collectionSub: '组合订阅',
  },
  globalNotify: {
    refresh: {
      succeed: '数据刷新成功！\n感受大佬的拥抱吧～',
      flowFailed: '刷新 {name} 流量失败！',
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
      noRecord: '刷新后可获取流量情况',
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
        leaveCancel: '继续编辑',
        leaveConfirm: '确认离开',
        leaveConfirmTitle: '有内容未保存',
        leaveContent:
          '输入框存在未保存内容，离开后未保存的操作将丢失\n\n请确认是否离开？',
      },
      basic: {
        label: '订阅配置',
        previewSwitch: '预览',
        nodeActionsHelp: '节点操作帮助',
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
          placeholder: '填入图标链接，不要使用jpg',
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
          disabled: '保留',
          enabled: '删除',
        },
        udp: {
          label: 'UDP转发',
          default: '默认',
          enabled: '强制开启',
          disabled: '强制关闭',
        },
        scert: {
          label: '跳过证书验证',
          default: '默认',
          enabled: '强制开启',
          disabled: '强制关闭',
        },
        tfo: {
          label: 'TCP Fast Open',
          default: '默认',
          enabled: '强制开启',
          disabled: '强制关闭',
        },
        'vmess aead': {
          label: 'Vmess AEAD',
          default: '默认',
          enabled: '强制开启',
          disabled: '强制关闭',
        },
      },
      // surgeOptions: {
      //   label: 'Surge 配置',
      //   hybrid: {
      //     label: 'Hybrid 策略',
      //     default: '默认',
      //     open: '强制开启',
      //     close: '强制关闭',
      //   },
      // },
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
        'Regex Filter': {
          label: '正则过滤',
          des: ['正则表达式', '工作模式'],
          options: ['保留模式', '过滤模式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: '正则过滤操作提示',
          tipsDes: '正则过滤操作说明',
        },
        'Regex Sort Operator': {
          label: '正则排序',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: '正则排序操作提示',
          tipsDes: '正则排序操作说明',
        },
        'Regex Delete Operator': {
          label: '正则删除',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: '正则删除操作提示',
          tipsDes: '正则删除操作说明',
        },
        'Regex Rename Operator': {
          label: '正则重命名',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式', '替换为'],
          tipsTitle: '正则重命名操作提示',
          tipsDes: '正则重命名操作说明',
        },
        'Handle Duplicate Operator': {
          label: '节点去重',
          action: { options: ['重命名', '删除'], des: '操作' },
          position: { options: ['前缀', '后缀'], des: '序号位置' },
          template: {
            des: '序号格式',
            placeholder: '序号显示格式，用空格分隔',
          },
          link: {
            des: '连接符',
            placeholder: '节点名和序号之间的连接符',
          },
          tipsTitle: '节点去重操作提示',
          tipsDes: '节点去重操作说明',
        },
        'Script Filter': {
          label: '脚本过滤器',
          options: ['链接', '脚本'],
          des: ['类型', '内容'],
          placeholder: '填入脚本链接',
          openEditorBtn: '打开脚本编辑器',
          tipsTitle: '脚本过滤器操作提示',
          tipsDes: '脚本过滤器操作说明',
        },
        'Script Operator': {
          label: '脚本操作',
          options: ['链接', '脚本'],
          des: ['类型', '内容'],
          placeholder: '填入脚本链接',
          openEditorBtn: '打开脚本编辑器',
          tipsTitle: '脚本操作操作提示',
          tipsDes: '脚本操作操作说明',
        },
      },
    },
  },
  myPage: {
    placeholder: {
      name: '未设置 Gist 同步',
      des: '同步功能配置 Gist 后可用',
      syncTime: '上次同步 ',
      haveNotSync: '暂无同步记录',
      githubUser: '请输入 Github 用户名',
      gistToken: '请输入 Gist Token',
      noGithubUser: '未配置 Github 用户名',
      noGistToken: '未配置 Gist Token',
    },
    notify: {
      save: {
        succeed: '保存成功',
        failed: '保存失败',
      },
      download: {
        succeed: '下载成功',
        failed: '下载失败',
      },
      upload: {
        succeed: '同步成功',
        failed: '同步失败',
      },
    },
    btn: {
      sync: '同步',
      upload: '上传',
      cancel: '取消',
      edit: '编辑',
      save: '保存',
    },
    config: 'Gist 配置',
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
  codePage: {
    title: '代码编辑',
    des: '右上角退出时自动保存',
  },
};
