export default {
  // Sub-Store 的专有名词
  specificWord: {
    singleSub: '单条订阅',
    collectionSub: '组合订阅',
  },
  globalNotify: {
    refresh: {
      succeed: '数据刷新成功！',
      flowFailed: '刷新 {name} 流量失败！',
      failed: '数据刷新失败\n',
      loading: '刷新数据中...',
    },
  },
  // 顶部标题栏
  navBar: {
    langSwitcher: {
      cellTitle: '轻点语言以切换',
      zh: '简体中文',
      en: 'English',
    },
    pagesTitle: {
      sub: '订阅管理',
      sync: '同步订阅',
      my: '我的',
      subEditor: '订阅编辑',
      themeSetting: '主题设置',
      moreSetting: '更多设置',
      apiSetting: '后端设置',
      aboutUs: '关于 Sub-Store',
      notFound: '地址未找到',
      askWhat: {
        sync: {
          title: '什么是同步订阅？',
          content:
            '将您的订阅信息上传到私有 Gist，在无法运行 Sub Store 的设备（例如路由器等）上也可以随时访问。',
        },
        subEditor: {
          title: '下载不了订阅？',
          content: '尝试更换 UA 下载试试，默认为 QuanX UA',
        },
        moreSetting: {
          title: '遇到问题？',
          content: '遇到问题？',
        },
      },
    },
  },
  // 底部标签栏
  tabBar: {
    sub: '订阅',
    sync: '同步',
    my: '我的',
  },
  // 404 页
  notFoundPage: {
    title: '啊哦～ URL 错误！',
    desc: '回首页',
  },
  // 订阅管理页
  subPage: {
    addSubTitle: '选择要创建的订阅类型',
    previewTitle: '预览/拷贝订阅',

    emptySub: {
      title: '你还没有添加订阅',
      desc: '添加后开始使用 Sub-Store',
      btn: '立即添加',
    },
    loadFailed: {
      title: '数据加载失败',
      desc: '请检查代理工具的 MITM、Rewrite 等配置',
      btn: '重试',
      doc: '查看 Sub-Store 教程',
      followOfficialChannel: '或关注 Sub-Store 官方频道并进群提问',
      officialChannel: '官方频道：',
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
      noFlowInfo: '无流量信息',
      noExpiresInfo: '无有效期信息',
    },
    deleteSub: {
      title: '删除订阅',
      desc: '是否确认删除订阅 {displayName}？删除后不可恢复！',
      succeedNotify: '删除订阅成功！',
      btn: {
        confirm: '确认删除',
        cancel: '取消',
      },
    },
    copyNotify: {
      succeed: '复制订阅链接成功\n请导入代理工具使用',
      failed: '复制订阅链接失败\n{e}',
    },
    copyConfigNotify: {
      loading: '拷贝配置中...',
      succeed: '配置拷贝成功！',
      failed: '配置拷贝失败！\n{e}',
    },
    panel: {
      general: '通用订阅',
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
          '是否确认删除此操作？删除后不可恢复！\n\ntips: 可使用开关控制即时预览时是否生效',
        deleteConfirm: '确认删除',
        deleteCancel: '取消',
        clearTitle: '清空确认',
        clearDes: '是否确认清空？',
        clearConfirm: '确认清空',
        clearCancel: '取消',
        leaveCancel: '继续编辑',
        leaveConfirm: '确认离开',
        leaveConfirmTitle: '有内容未保存',
        leaveContent:
          '输入框存在未保存内容，离开后未保存的操作将丢失\n\n请确认是否离开？',
        clickTag: {
          title: '编辑确认',
          content:
            '输入框存在未保存的内容，现在编辑其他标签当前未保存的内容将丢失\n\n请确认？',
          confirm: '确认',
          cancel: '取消',
        },
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
          placeholder: '填入图标链接，不要使用 jpg',
        },
        ua: {
          label: 'User-Agent',
          placeholder: '下载订阅使用的 UA，不填使用默认',
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
          label: 'UDP 转发',
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
        'Script Operator': {
          label: '脚本操作',
          options: ['链接', '脚本'],
          des: ['类型', '内容'],
          placeholder: '填入脚本链接',
          openEditorBtn: '打开脚本编辑器',
          tipsTitle: '脚本操作操作提示',
          tipsDes: '使用一段 JavaScript 脚本来修改节点信息',
        },
        'Flag Operator': {
          label: '国旗操作',
          des: '工作模式',
          options: ['添加', '移除'],
          tipsTitle: '国旗操作提示',
          tipsDes: '为节点添加或者移除国旗',
        },
        'Sort Operator': {
          label: '节点排序',
          des: '顺序',
          options: ['正序', '逆序', '随机'],
          tipsTitle: '排序操作提示',
          tipsDes: '按照节点名字进行排序',
        },
        'Resolve Domain Operator': {
          label: '域名解析',
          des: '服务提供商',
          options: ['Google', 'IP-API', 'Cloudflare', 'Ali', 'Tencent'],
          tipsTitle: '域名解析操作提示',
          tipsDes: '将节点域名解析成为 IP 地址，减少一次额外的 DNS 请求',
        },
        'Region Filter': {
          label: '区域过滤',
          options: ['🇭🇰 HK', '🇨🇳 TW', '🇸🇬 SG', '🇯🇵 JP', '🇬🇧 UK', '🇺🇸 US'],
          tipsTitle: '区域过滤操作提示',
          tipsDes: '按照国家和区域过滤节点',
        },
        'Type Filter': {
          label: '类型过滤',
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
          tipsDes: '按照代理协议类型过滤节点',
        },
        'Regex Filter': {
          label: '正则过滤',
          des: ['正则表达式', '工作模式'],
          options: ['保留模式', '过滤模式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: '正则过滤操作提示',
          tipsDes:
            '按照正则表达式过滤节点。保留模式下，节点名匹配到任何一个正则表达式的都会被保留；过滤模式下，节点名匹配到任何一个正则表达式的都会被移除',
        },
        'Regex Sort Operator': {
          label: '正则排序',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: '正则排序操作提示',
          tipsDes:
            '按照正则表达式进行排序。节点名匹配到第一个正则表达式的会排在最前面，匹配到第二个正则表达式的会排在第二个位置，以此类推',
        },
        'Regex Delete Operator': {
          label: '正则删除',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: '正则删除操作提示',
          tipsDes: '按照正则表达式删除节点名中的字段',
        },
        'Regex Rename Operator': {
          label: '正则命名',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式', '替换为'],
          tipsTitle: '正则重命名操作提示',
          tipsDes: '按照正则表达式对节点进行重命名。',
        },
        'Handle Duplicate Operator': {
          label: '节点去重',
          action: { options: ['重命名', '删除'], des: '操作' },
          position: { options: ['前缀', '后缀'], des: '序号位置' },
          template: {
            des: '序号格式',
            placeholder: '序号显示格式，用空格分隔，如：1 2 3 4 5 6 7 8 9',
          },
          link: {
            des: '连接符',
            placeholder: '节点名和序号之间的连接符，如：- ',
          },
          tipsTitle: '节点去重操作提示',
          tipsDes:
            '对名字重复的节点进行操作（移除/重命名）。重命名模式下，会自动为重名节点添加序号，序号样式和位置可以自定义。同时序号和名字之间的连接符也可以自定义',
        },
        'Script Filter': {
          label: '脚本过滤',
          options: ['链接', '脚本'],
          des: ['类型', '内容'],
          placeholder: '填入脚本链接',
          openEditorBtn: '打开脚本编辑器',
          tipsTitle: '脚本过滤器操作提示',
          tipsDes: '使用一段 JavaScript 脚本来过滤节点',
        },
      },
    },
  },
  myPage: {
    placeholder: {
      name: '未设置 GitHub 同步',
      des: '同步功能配置 GitHub 用户名以及 Token 后可用',
      uploadTime: '上次上传',
      haveNotDownload: '暂无下载记录',
      githubUser: '请输入 Github 用户名',
      gistToken: '请输入 GitHub 令牌',
      noGithubUser: '未配置 Github 用户名',
      noGistToken: '未配置 GitHub 令牌',
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
        succeed: '上传成功',
        failed: '上传失败',
      },
      sortsub: {
        failed: '排序保存失败',
      }
    },
    btn: {
      download: '下载',
      upload: '上传',
      cancel: '取消',
      edit: '编辑',
      save: '保存',
      clear: '清空',
    },
    config: 'GitHub 配置',
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
      'skip-cert-verify': 'SCERT',
      tfo: 'TFO',
      aead: 'AEAD',
    },
    nodeInfo: {
      loading: '获取节点信息中...',
      loadFailed: '获取节点信息失败',
      ipApi: {
        title: 'IP API',
      },
      node: {
        title: '节点信息',
        server: '服务器',
        password: '密码',
        UUID: 'UUID',
      },
    },
  },
  codePage: {
    title: '编辑',
    des: '右上角退出时自动保存',
  },
  syncPage: {
    title: '同步配置',
    syncSwitcher: '定时',
    syncAllSucceed: '同步成功',
    emptySub: {
      title: '你还没有添加同步',
      desc: '添加后即可在其他工具使用 gist 链接',
      btn: '立即添加',
    },
    detail: {
      firstLine: '类型：{type}，订阅：{name}',
      secondLine: '上次同步：{time}',
      notSync: '从未同步',
    },
    deleteArt: {
      title: '删除同步配置',
      desc: '是否确认删除同步配置 {displayName}？删除后不可恢复！',
      succeedNotify: '删除同步配置成功！',
      btn: {
        confirm: '确认删除',
        cancel: '取消',
      },
    },
    copyNotify: {
      succeed: '复制 Gist 链接成功\n可以前往代理工具使用咯～',
      failed: '复制 Gist 链接失败\n{e}',
    },
    addArtForm: {
      title: '添加同步配置',
      cancel: '取消',
      confirm: '确定',
      name: {
        label: '名称',
        placeholder: '请输入名称',
        isRequired: '名称不能为空',
        isExist: '名称已存在',
        isValid: '只能包含字母数字、下划线、中划线、点号',
      },
      displayName: {
        label: '显示名称',
        placeholder: '请输入显示名称',
      },
      source: {
        label: '来源',
        isRequired: '来源不能为空',
        placeholder: '请选择来源',
      },
      platform: {
        label: '目标平台',
        isRequired: '目标平台不能为空',
      },
      pop: {
        errorTitle: '提交出错',
        errorBtn: '去修改',
      },
      submitLoading: '保存中...',
      succeedNotify: '添加同步配置成功！',
    },
    editArtForm: {
      title: '编辑同步配置',
      succeedNotify: '编辑同步配置成功！',
    },
    selectSource: {
      title: '选择来源',
    },
  },
  themeSettingPage: {
    themeSettingTitle: '外观设置',
    // themeSettingDes: '',
    auto: '自动切换主题',
    light: '浅色主题',
    dark: '深色主题',
    themePicker: {
      title: '选择一个主题',
      cancel: '取消',
      confirm: '确定',
    },
  },
  apiSettingPage: {
    apiSettingTitle: '后端设置',
    apiSettingDesc: `添加后端服务器地址，例如 VPS 或 Render 上搭建的后端服务。可以查看小一佬的后端搭建教程：`,
    currentApi: {
      title: '当前后端',
    },
    apiList: {
      title: '已保存后端列表',
      desc: '此列表为浏览器本地保存，更换浏览器/设备需重新添加，点击即可切换至对应后端',
      defaultName: '默认后端',
      currentTag: '当前',
    },
    addApi: {
      title: '添加新后端',
      placeholder: {
        name: '请输入后端名称，必须唯一',
        url: '请输入后端地址',
      },
      btn: '添加',
    },
  },
  moreSettingPage: {
    moreSettingTitle: '更多设置',
    other: '其他设置',
    auto: '启动时自动下载 Gist 配置',
    desc: `注意事项：开启此开关会在打开 SubStore 时自动下载 Gist 远程配置并刷新。
          刷新操作会覆盖当前配置，为防止数据丢失，可在修改后手动上传配置。
          打开开关不会上传，只有在重启后才会下载配置。`,
    simple: '简洁模式',
    islr: '卡片右滑呼出',
    isIC: '使用订阅图标原始颜色',
    isEditorCommon: '展示编辑页常用配置',
    isSimpleReicon: '展示订阅刷新按钮',
    tabBar: '隐藏“Gist 同步”页',
    auto2: '自定义设置 Key',
    hostapi: '自定义后端 API',
    currentHostApi: '当前后端 API',
    yhostapi: '默认:https://sub.store ',
    serverDesc: `配置后端服务器地址，例如 VPS 或 Render 上搭建的后端服务。
                配置后需要重启 Sub Store 以生效。如需删除 api，
                使用原本的’默认后端‘需要手动删除地址后点击保存。可以跳转链接 查看 小一佬的后端搭建教程：`,
    InputHostApi: {
      title: '链接验证失败 或无效链接',
      content:
        '主流浏览器都已经 Block 掉了 HTTPS 页面上的 HTTP 请求 请使用 Https 链接',
    },
  },
  aboutUsPage: {
    projectInfo: {
      title: '项目信息（欢迎 Star 🌟）',
      fe: '前端',
      be: '后端',
      module: '模块',
      mock: 'Mock 模块',
      team: '项目组',
      link: '在 GitHub 上查看',
    },
    changelogs: {
      title: '更新日志',
    },
  },
};
