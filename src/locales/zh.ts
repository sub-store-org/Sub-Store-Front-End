export default {
  // Sub-Store 的专有名词
  specificWord: {
    singleSub: '单条订阅',
    collectionSub: '组合订阅',
    file: '文件',
    unknownType: '未知类型',
    unknownSource: '未知来源',
    unknown: '未知',
    all: '全部',
    untagged: '未分组',
    or: '或',
    type: '类型',
    none: '无',
  },
  globalNotify: {
    refresh: {
      succeed: '数据刷新完成',
      flowFailed: '刷新 {name} 失败！',
      failed: '数据刷新失败\n',
      loading: '刷新数据中...',
      rePwa: '重置 PWA 缓存成功，即将刷新页面...',
      rePwaing: '重置 PWA 缓存中...',
    },
    share: {
      title: '分享',
      expiresValue: '有效期时长',
      expiresValueEmpty: '有效期时长不可为空',
      expiresValuePlaceholder: '请输入有效期时长',
      expiresValueRegex: '请输入0.01-99999.99范围内的数字',
      expiresUnit: '有效期单位',
      token: '自定义Token',
      tokenPlaceholder: '默认后端随机Token',
      remark: '备注',
      remarkPlaceholder: '请输入备注',
      shareUrl: '分享链接',
      shareUrlPlaceholder: '请点击按钮创建分享链接',
      tipsTitle: '温馨提示',
      userKnow: '我知道了',
      confirm: '确定',
      cancel: '返回',
      createShare: '创建分享',
      copyShare: '复制链接',
      copyShareSuccessTips: '复制分享链接成功！',
      createShareSuccessTips: '创建分享成功！',
      unit: {
        day: '天',
        month: '月',
        season: '季',
        year: '年',
      }
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
      file: '文件管理',
      sync: '同步',
      my: '我的',
      editScript: '脚本编辑',
      subEditor: '订阅编辑',
      fileEditor: '文件编辑',
      preview: '预览',
      shareManage: '分享管理',
      iconCollection: '图标仓库',
      themeSetting: '主题设置',
      moreSetting: '更多设置',
      apiSetting: '后端设置',
      aboutUs: '关于 Sub-Store',
      notFound: '地址未找到',
      askWhat: {
        sync: {
          title: '什么是同步？',
          content:
            '将订阅/文件上传到私有 Gist，在无法运行 Sub Store 的设备（例如路由器等）上也可以随时访问。',
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
    backendDesc: '如果你看到这个 可能是因为浏览器前端路由拦截的问题 可以强制刷新查看或直接使用该链接 不影响此链接的使用',
  },
  filePage: {
    type: {
      mihomoProfile: 'Mihomo 配置',
      mihomoProfileTips: '可使用覆写',
      mihomoProfileTips2: '可使用 JavaScript/YAML 覆写',
    },
    addFileTitle: '创建文件',
    importFileTitle: '导入 Sub-Store 文件数据',
    importFileTips: '文件管理页面, 在某个文件左滑/右滑的更多项中, 点击导出图标按钮',
    deleteFile: {
      succeedNotify: '删除文件成功',
    },
    content: {
      placeholder: '填入文件内容'
    },
    url: {
      label: '链接',
      placeholder: '支持换行混写三种格式: 1. 完整远程链接 2. 类似 /api/file/name 的内部文件调用路径 3. 本地文件的绝对路径. 支持参数: noCache 不使用缓存; insecure 不验证服务器证书. 例: http://a.com#noCache&insecure',
      isEmpty: '链接不能为空',
      isIllegal: '链接格式非法',
    },
    copyNotify: {
      succeed: '复制文件链接成功\n如果你只在内部使用, 仅需 {path}',
      failed: '复制文件链接失败\n{e}',
    },
    emptySub: {
      title: '你还没有添加文件',
      desc: '添加后开始使用文件',
      btn: '立即添加',
    },
    source: {
      local: '本地',
      remote: '远程',
    },
    ignoreFailedRemoteFile: {
      label: '忽略失败的远程文件',
      quiet: '启用(无通知)',
      disabled: '禁用',
      enabled : '启用(有通知)'
    },
    download: {
      label: '启用下载(文件名为显示名称)'
    },
  },
  // 订阅管理页
  subPage: {
    import: {
      label: '导入',
      succeed: '导入成功',
      failed: '导入失败\n{e}',
      tipsTitle: '导入 Sub-Store 订阅数据',
      tipsContent: '订阅管理页面, 在某个订阅左滑/右滑的更多项中, 点击导出图标按钮',
    },
    addSubTitle: '选择要创建的订阅类型',
    previewTitle: '预览/拷贝订阅',
    tag: {
      addTagTitle: '添加标签',
      tagPlaceholder: '请输入标签名称',
      addTagBtn: '+ 新建标签',
    },
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
      contain: '手动选择的订阅',
      containTag: '关联的订阅标签',
    },
    subItem: {
      local: '本地订阅',
      loading: '加载中...',
      flow: '已用/总流量',
      showRemainingFlow: '剩余/总流量',
      expires: '到期',
      remainingDays: '重置',
      remainingDaysUnit: ' 天',
      noRecord: '刷新后可获取流量情况',
      noFlow: '不查询流量',
      noFlowInfo: '无流量信息',
      flowError: '无法获取流量信息',
      noExpiresInfo: '无有效期信息',
    },
    deleteSub: {
      title: '删除',
      desc: '是否确认删除 {displayName}？删除后不可恢复！',
      succeedNotify: '删除成功！',
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
      loading: '克隆配置中...',
      succeed: '配置克隆成功！',
      failed: '配置克隆失败！\n{e}',
    },
    exportConfigNotify: {
      loading: '导出配置中...',
      succeed: '导出成功！',
      failed: '导出失败！\n{e}',
    },
    panel: {
      general: '通用订阅',
      tips: {
        ok: '查看文档',
        cancel: '取消',
        desc: '部分功能需使用参数 请查看文档',
        title: '订阅链接参数',
        content: '"target=SurgeMac"\n+ ShadowsocksR/External Proxy Program\n\n"includeUnsupportedProxy=true" 包含官方/商店版不支持的协议',
      }
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
          placeholder: '唯一的标识名称(请勿包含 / )',
          isEmpty: '名称不能为空',
          isInvalid: '名称已存在或不合法'
        },
        remark: {
          label: '备注',
          placeholder: '请输入备注信息',
        },
        displayName: {
          label: '显示名称',
          placeholder: '输入展示的名称',
        },
        subInfoUrl: {
          label: '查询流量信息订阅链接',
          placeholder: '用于传递流量信息',
        },
        subInfoUserAgent: {
          label: '查询流量信息 User-Agent',
          placeholder: '不设置则使用默认 User-Agent',
        },
        tag: {
          label: '标签',
          placeholder: '点击右侧图标选择，标签(用 , 分隔) 将用于分组',
        },
        subscriptionTags: {
          label: '关联订阅标签',
          placeholder: '点击右侧图标选择，使用标签关联单条订阅(用 , 分隔)',
        },
        source: {
          label: '来源',
          remote: '远程订阅',
          local: '本地订阅',
          mergeSources: '合并来源',
          noMerge: '不合并',
          localFirst: '本地优先',
          remoteFirst: '远程优先',
        },
        url: {
          label: '链接',
          placeholder: '支持多行和参数, 请点击左侧的使用说明查看用法',
          tips: {
            importFromFile: '从文件导入',
            fullScreenEdit: '全屏编辑',
            fullScreenEditCancel: '取消全屏',
            label: '使用说明',
            title: '订阅链接',
            content: '支持使用换行混写三种格式:\n1. 完整远程链接\n2. 类似 /api/file/name 的内部文件调用路径\n3. 本地文件的绝对路径\n\n支持以下参数\n\ninsecure: 不验证服务器证书\ncacheKey: 设置乐观缓存的名称 开启后也可自行在持久化缓存中管理(适合经常拉取失败的订阅)\nvalidCheck: 过期或无剩余流量时报错\nflowUserAgent: 查询流量时使用的 User-Agent\nflowUrl: 自定义查询流量的 URL(将使用响应体的内容)\nnoFlow: 不查询流量\nhideExpire: 隐藏到期\nshowRemaining: 显示剩余流量而不是已用流量\nnoCache: 不使用缓存\nresetDay: 每月流量重置日\nstartDate: 订阅开始日期\ncycleDays: 订阅重置周期(单位: 天)\n\n例: http://a.com?token=1#cycleDays=31&startDate=2024-06-04\n或 http://a.com?token=1#resetDay=15',
          },
          isEmpty: '订阅链接不能为空',
          isIllegal: '订阅链接格式非法',
        },
        subscriptions: {
          label: '手动选择的订阅',
          empty: '请先创建单条订阅, 再使用组合订阅功能',
        },
        content: {
          label: '内容',
          placeholder: '',
          tips: {
            title: '本地订阅节点',
            content: '填入订阅内容:\n\n1. 换行输入多个单行的代理协议/JSON5/YAML/URI\n\n2. 完整 Base64/YAML',
          },
        },
        icon: {
          label: '图标链接',
          placeholder: '可点击左侧或顶部图标, 从图标库填入图标链接，不要使用 jpg',
        },
        isIconColor: {
          label: '图标原色',
        },
        ignoreFailedRemoteSub: {
          label: '忽略失败的远程订阅',
          quiet: '启用(无通知)',
          disabled: '禁用',
          enabled : '启用(有通知)'
        },
        ua: {
          label: 'User-Agent',
          placeholder: '下载时使用的 UA，不填使用默认',
          placeholderDisabled: '透传时禁用自定义 UA',
        },
        subUserinfo: {
          label: '订阅流量信息',
          placeholder: '填写值或链接(使用响应内容)',
        },
        passThroughUA: {
          label: '透传请求的 User-Agent',
          warning: '透传请求的 User-Agent 和 自定义 UA 不可同时启用',
        },
        proxy: {
          label: '代理/策略',
          placeholder: '通过代理/节点/策略获取远程资源，不填使用默认',
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
        pasteAction: {
          label: '从剪贴板导入',
          placeholder: '自动读取剪贴板失败, 请在此文本框内手动粘贴数据'
        },
        enable: '启用',
        disable: '禁用',
      },
      nodeActions: {
        'Script Operator': {
          label: '脚本操作',
          options: ['链接', '脚本'],
          des: ['类型', '内容'],
          placeholder: '1. 完整远程脚本链接 2. 类似 /api/file/name 的内部文件调用路径 3. 本地文件的绝对路径. 除了脚本本身的参数外, 支持叠加参数: noCache 不使用缓存, insecure 不验证服务器证书. 例: http://a.com#a=1&b=2#noCache&insecure',
          openEditorBtn: '打开脚本编辑器',
          tipsTitle: '脚本操作操作提示',
          tipsDes: '使用一段 JavaScript 脚本来修改节点信息',
          paramsEdit: '参数编辑',
          noCache: '关闭缓存',
          insecure: '不验证服务器证书',
          helpTitle: '温馨提示',
          noCacheTips: '关闭缓存后, 每次请求都会重新获取脚本内容',
          paramsEditTips: '可视化参数编辑器，重复键名将采用后值优先原则',
          paramsAdd: '添加参数',
          paramsDelete: '删除',
          paramsOptions: '操作',
          paramsEmpty: '暂无参数数据',
          duplicateKeyWarning: '重复的键名',
          insecureTips: '开启后，将不对服务器证书进行验证。',
        },
        'Flag Operator': {
          label: '旗帜操作',
          des: '工作模式',
          options: ['添加', '移除'],
          twOptions: ['替换为 🇨🇳', '替换为 🇼🇸', '保持不变'],
          tipsTitle: '旗帜操作提示',
          tipsDes: '为节点添加或者移除旗帜\n\n免责声明: 旗帜 指 Emoji 旗帜, 不包含任何政治意味',
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
          des: '提供商(可由节点字段 "_no-resolve" 控制)',
          options: ['Google', 'IP-API', 'Cloudflare', 'Ali', 'Tencent', '自定义'],
          types: ['IPv4', 'IPv6'],
          filters: ['不过滤', '移除失败', '只保留 IP', '只保留 IPv4', '只保留 IPv6'],
          cache: ['启用', '禁用'],
          tipsTitle: '域名解析操作提示',
          tipsDes: '将节点域名解析成为 IP 地址，减少一次额外的 DNS 请求',
        },
        'Region Filter': {
          label: '区域过滤',
          des: ['区域', '工作模式'],
          modeOptions: ['保留模式', '过滤模式'],
          options: ['🇭🇰 HK', '🇨🇳 TW', '🇸🇬 SG', '🇯🇵 JP', '🇬🇧 UK', '🇺🇸 US', '🇩🇪 DE', '🇰🇷 KR'],
          tipsTitle: '区域过滤操作提示',
          tipsDes: '按照国家和区域过滤节点',
        },
        'Type Filter': {
          label: '协议过滤',
          des: ['协议', '工作模式'],
          modeOptions: ['保留模式', '过滤模式'],
          options: [
            'Shadowsocks',
            'ShadowsocksR',
            'VMess',
            'VLESS',
            'Trojan',
            'HTTP(s)',
            'SOCKS5',
            'Snell',
            'TUIC',
            'Hysteria',
            'Hysteria 2',
            'Juicity',
            'mieru',
            'AnyTLS',
            'WireGuard',
            'SSH',
            'External Proxy Program',
            "Direct",
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
          des: ['正则表达式', '未匹配节点排序方式'],
          options: ['正序', '逆序', '不变'],
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
          placeholder: '1. 完整远程脚本链接 2. 类似 /api/file/name 的内部文件调用路径 3. 本地文件的绝对路径. 除了脚本本身的参数外, 支持叠加参数: noCache 不使用缓存, insecure 不验证服务器证书. 例: http://a.com#a=1&b=2#noCache&insecure',
          openEditorBtn: '打开脚本编辑器',
          tipsTitle: '脚本过滤器操作提示',
          tipsDes: '使用一段 JavaScript 脚本来过滤节点',
          paramsEdit: '参数编辑',
          noCache: '关闭缓存',
          insecure: '不验证服务器证书',
          helpTitle: '温馨提示',
          noCacheTips: '关闭缓存后, 每次请求都会重新获取脚本内容',
          paramsEditTips: '可视化参数编辑器，重复键名将采用后值优先原则',
          paramsAdd: '添加参数',
          paramsDelete: '删除',
          paramsOptions: '操作',
          paramsEmpty: '暂无参数数据',
          duplicateKeyWarning: '重复的键名',
        },
      },
      sourceNamePicker: {
        title: '选择订阅名称',
        cancel: '取消',
        confirm: '确定',
        emptyTips: '未找到订阅？点击去添加订阅',
      },
    },
  },
  myPage: {
    placeholder: {
      name: '未设置 GitHub 同步',
      des: '同步功能配置 GitHub 用户名以及 Token 后可用',
      uploadTime: '上次上传',
      haveNotDownload: '暂无下载记录',
      githubUser: '请输入 GitHub 用户名',
      gistToken: '请输入 GitHub 令牌',
      githubProxy: '请输入 GitHub 加速代理',
      defaultUserAgent: '请输入默认 User-Agent',
      defaultProxy: '请输入默认代理/策略',
      defaultTimeout: '默认超时(单位: 毫秒, 默认: 8000)',
      cacheThreshold: '缓存阈值(单位: KB, 默认: 1024)',
      noGithubUser: '未配置 GitHub 用户名',
      noGistToken: '未配置 GitHub 令牌',
      noGithubProxy: '未配置 GitHub 加速代理',
      noDefaultUserAgent: '未配置默认 User-Agent',
      noDefaultProxy: '未配置默认代理/策略',
      noDefaultTimeout: '未配置默认超时',
      noCacheThreshold: '未配置缓存阈值',
    },
    notify: {
      save: {
        succeed: '保存成功',
        failed: '保存失败',
      },
      restore: {
        succeed: '恢复成功',
        failed: '恢复失败',
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
    config: '配置',
    storage: {
      gist: {
        label: 'Gist 同步',
        info: '在同步配置中同步文件/订阅至 Gist'
      },
      manual: {
        label: '手动管理',
        info: '',
        desc: '为防止意外 请先备份数据 再进行恢复操作',
        backup: '备份',
        restore: '恢复',
      }
    }
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
      firstLine: '类型：{type}，来源：{name}',
      secondLine: '上次同步：{time}',
      notSync: '从未同步',
    },
    deleteArt: {
      title: '删除同步配置',
      desc: '是否确认删除同步配置 {displayName}？删除后不可恢复！\n\n⚠️ 若当前同步配置进行过同步, 将尝试原文件名和编码后的文件名对应的文件',
      succeedNotify: '删除同步配置成功！',
      btn: {
        confirm: '确认删除',
        cancel: '取消',
      },
    },
    copyNotify: {
      succeed: '复制 Gist 链接成功',
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
      includeUnsupportedProxy: {
        label: '包含官方/商店版/未续费订阅不支持的协议',
        tips: {
          title: '包含官方/商店版未续费订阅不支持的协议',
          content: 'sing-box: +ShadowsocksR\nQuantumult X: +VLESS'
        }
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
    preview: {
      title: 'Sub-Store Gist',
      content: '最近一次检查的状态: {status}\n更新配置后将自动触发一次检查',
      url: '当前的 gist 为最后一次检查正常的 gist',
      noUrl: '检查成功并上传同步配置后 即可查看',
      cancel: '取消',
      confirm: '查看 gist',
    },
    download: {
      content: '⚠️ 只会获取不在同步配置中的 gist 文件\n你需要手动设置来源',
      confirm: '从 gist 恢复',
    }
  },
  sharePage: {
    title: "分享编辑",
    noOriginalTips: "跳转失败, 检查源数据是否已删除",
    leftTime: "剩余",
    expired: "已过期",
    expiredLabel: "过期时间：",
    createTimeLabel: "创建时间：",
    magicPathErrorNotify: "SUB_STORE_FRONTEND_BACKEND_PATH 必须以 / 开头，当前分享链接异常，请检查运行环境",
    createShare: {
      expiresValue: {
        label: "有效期时长",
        placeholder: "请输入有效期时长",
        regex: "请输入0.01-99999.99范围内的数字",
        empty: "有效期时长不可为空",
      },
      expiresUnit: {
        label: "有效期单位",
      },
      token: {
        label: "自定义Token",
        placeholder: "默认后端随机Token"
      },
      remark: {
        label: "备注",
        placeholder: "请输入备注",
      },
      displayName: {
        label: "显示名称",
        placeholder: "输入展示的名称",
      },
      shareUrl: {
        label: "分享链接",
        placeholder: "请点击按钮创建分享链接"
      },
      unit: {
        day: "天",
        month: "月",
        season: "季",
        year: "年",
      },
      copyBtn: "复制链接",
      updateBtn: "更新分享",
      createBtn: "创建分享",
      succeedNotify: "创建分享成功！",
    },
    copyShare: {
      succeedNotify: "复制分享链接成功",
    },
    emptyShare: {
      title: '你还没有创建分享',
      desc: '创建分享后开始使用',
      btn: '立即创建',
    },
    updateShare: {
      failNotify: "更新分享失败",
      title: "温馨提示",
      tips: "更新分享后，原分享链接将失效，是否继续?",
      confirm: "确认",
      cancel: "取消",
    },
    deleteShare: {
      title: "温馨提示",
      desc: "是否确认删除 {displayName}？删除后不可恢复！",
      succeedNotify: "删除分享成功！",
      btn: {
        confirm: "确认删除",
        cancel: "取消",
      },
    },
  },
  // 图标仓库页
  iconCollectionPage: {
    iconCollection: '图标仓库',
    iconCollectionPlaceholder: '请输入图标仓库地址',
    iconName: '图标名称',
    iconNamePlaceholder: '请输入图标名称',
    iconCollectionKey: '图标仓库字段',
    iconCollectionKeyPlaceholder: '默认: icons',
    iconUrlKey: '图标地址字段',
    iconUrlKeyPlaceholder: '默认: url',
    errorIconCollectionUrlTips: '请输入正确的图标仓库地址',
    copySuccessTips: '已复制图标地址',
    emptyCollectionTitle: '暂无图标数据',
    emptyCollectionDesc: '请手动刷新或选择其他图标仓库',
    refreshBtn: '手动刷新',
    selectCollectionBtn: '切换图标仓库',
    more: '更多',
    useCustomIconCollection: '使用自定义仓库',
    resetDefaultIconCollection: '恢复默认',
    collectionPicker: {
      title: '选择一个图标仓库',
      cancel: '取消',
      confirm: '确定',
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
    apiSettingDesc0: `1. 后端地址为 https://api.com 时, 将尝试请求 https://api.com/api/utils/env 验证后端可用性. 当无法添加后端地址时, 可先尝试访问此地址`,
    apiSettingDesc1: `2. HTTPS 前端无法请求非本地的 HTTP 后端(部分浏览器上也无法访问本地 HTTP 后端). 请配置反代或在局域网自建 HTTP 前端. `,
    apiSettingDesc2: `3. 添加后端服务器地址，例如 服务器/NAS/Android/云平台 上搭建的后端服务。可以查看小一佬的后端搭建教程：`,
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
      title: '添加新的后端连接配置',
      placeholder: {
        name: '请输入后端名称，必须唯一',
        url: '请输入后端路径或地址',
      },
      errors: {
        nameEmpty: '名称不能为空',
      },
      btn: '添加',
    },
  },
  moreSettingPage: {
    gistUpload: {
      title: 'Gist 上传',
      base64: 'Base64 编码',
      plaintext: '明文(不带 GitHub Token)',
    },
    subProgress: {
      title: '订阅进度样式',
      hidden: '不显示',
      background: '显示为背景',
    },
    moreSettingTitle: '更多设置',
    shareManageTitle: '分享管理',
    clearData: {
      label: '清除后端数据',
      title: '清除后端数据',
      content: '确定要清除数据吗?',
      conform: '确定',
      cancel: '取消',
      succeed: '清除成功',
      failed: '清除失败',
    },
    clearFrontEndData: {
      label: '清除前端数据',
      title: '清除前端数据',
      content: '确定要清除前端数据吗?',
      conform: '确定',
      cancel: '取消',
      succeed: '清除成功',
      failed: '清除失败',
    },
    other: '其他设置',
    simple: '简洁模式',
    islr: '卡片右滑呼出',
    isIC: '自定义图标使用原始颜色',
    isDefaultIcon: '恢复默认图标',
    isShowIcon: '展示图标',
    isSubItemMenuFold: '收纳订阅页菜单功能',
    isEditorCommon: '展示编辑页常用配置',
    isSimpleReicon: '简洁模式展示刷新按钮',
    isSimpleShowRemarks: '简洁模式列表展示备注',
    showFloatingRefreshButton: '显示悬浮刷新按钮',
    showFloatingAddButton: '显示悬浮添加按钮',
    displayPreviewInWebPage: '在网页中预览',
    tabBar: '隐藏 "Gist 同步" 页',
    tabBar2: '隐藏 "文件" 页',
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
      team: '项目组',
      link: '在 GitHub 上查看',
    },
    changelogs: {
      title: '更新日志',
    },
  },
  magicPath: {
    title: '后端连接配置',
    description: '检测到您需要配置自定义后端，请输入后端路径或地址<br><br>支持三种格式：<br>• 路径前缀（/path）<br>• 主机+路径（host:port/path）<br>• 完整URL（http(s)://host:port/path）',
    placeholder: '请输入后端路径或地址',
    connect: '连接',
    skip: '跳过',
    info: '您可以稍后在"我的"页面中的"后端设置"中配置',
    customInfo: '自建后端: 可通过环境变量 SUB_STORE_FRONTEND_BACKEND_PATH 设置后端路径',
    troubleshooting: '你可以查看此排查指南',
    preview: '预览',
    inputTypes: {
      path: '仅路径模式 (使用当前域名)',
      host: '主机+路径模式',
      full: '完整URL模式'
    },
    success: '连接成功！',
    errors: {
      empty: '输入不能为空',
      invalid: '无效的后端地址',
      connection: '连接失败，请检查输入是否正确',
      unknown: '发生未知错误',
      portRequired: '主机格式需要包含端口号'
    }
  },
};
