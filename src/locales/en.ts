export default {
  // specific word of Sub-Store
  specificWord: {
    singleSub: 'Single',
    collectionSub: 'Collection',
  },
  globalNotify: {
    refresh: {
      succeed: 'Refresh Successful!\nEnjoy the feeling',
      flowFailed: 'Refresh flow of {name} failed！',
      failed: 'Refresh Failed\n',
    },
  },
  // Title Bar
  navBar: {
    langSwitcher: {
      cellTitle: 'Tap a language which you want to use',
      zh: '简体中文',
      en: 'English',
    },
    pagesTitle: {
      sub: 'Subscription Management',
      sync: 'Sync Subscription',
      my: 'My Profile',
      subEditor: 'Subscription Editor',
      notFound: '404 Not Found',
    },
  },
  // Tab Bar
  tabBar: {
    sub: 'Subscription',
    sync: 'Sync',
    my: 'Profile',
  },
  // 404页
  notFoundPage: {
    title: 'Oops! URL Error!',
    desc: 'Back to Home Page',
  },
  // subscription management page
  subPage: {
    addSubTitle: 'Which type you want to create?',
    previewTitle: 'Which you want to preview?',

    emptySub: {
      title: 'You have no Subscription yet',
      desc: 'After adding you can enjoy the love of YM Peng',
      btn: 'Create Subscription Now',
    },
    loadFailed: {
      title: 'Load data failed',
      desc: 'Please check MITM、Rewrite and others in Proxy Tool',
      btn: 'Retry',
      doc: 'Visit Sub-Store Docs',
    },
    collectionItem: {
      noSub: 'Not contains subscription',
      contain: 'Contains subs',
    },
    subItem: {
      local: 'Local subscription',
      loading: 'Loading...',
      flow: 'Usage / Total',
      expires: 'Expires',
      noRecord: 'Refresh to get usage',
    },
    deleteSub: {
      title: 'Delete Subscription',
      desc: 'Are you sure to delete subscription {displayName}? \nDeleted cannot be restored!',
      succeedNotify: 'Successfully deleted!',
      btn: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    },
    copyNotify: {
      succeed: 'Successfully copied link!\nYou can paste in Proxy Tool now!',
      failed: 'Failed to copy subscription link!\n{e}',
    },
  },
  editorPage: {
    subConfig: {
      btn: {
        compare: 'Compare',
        save: 'Save',
      },
      pop: {
        helpTitle: '订阅配置',
        helpContent:
          '预览开关：可控制即时预览时该模块是否生效，保存时无论开启关闭都会保存并生效于订阅。\n\n' +
          '生效顺序：所有节点操作均为有序生效，可按住手柄拖动排序，点击即时预览对比。',
        helpBtn: '我知道了',
        errorTitle: 'Submit Error！',
        errorBtn: 'OK',
        succeedMsg: 'Successfully saved!',
        deleteTitle: 'Delete Confirm',
        deleteDes:
          '是否确认删除此操作？删除后不可恢复！\ntips: 可使用开关控制即时预览时是否生效',
        deleteConfirm: 'Delete it',
        deleteCancel: 'Cancel',
        leaveCancel: '继续编辑',
        leaveConfirm: '确认离开',
        leaveConfirmTitle: '有内容未保存',
        leaveContent:
          '输入框存在未保存内容，离开后未保存的操作将丢失\n\n请确认是否离开？',
      },
      basic: {
        label: 'Subscription Config',
        previewSwitch: 'Preview',
        nodeActionsHelp: 'Node Actions Help',
        name: {
          label: 'Name',
          placeholder: '请输入唯一的标识名称',
          isEmpty: '订阅名称不能为空',
          isExist: 'The name has been used',
        },
        displayName: {
          label: 'Display Name',
          placeholder: '输入展示的订阅名称',
        },
        source: {
          label: 'Source',
          remote: '远程订阅',
          local: '本地订阅',
        },
        url: {
          label: 'URL',
          placeholder: '填入机场原始订阅链接',
          isEmpty: '订阅链接不能为空',
          isIllegal: '订阅链接格式非法',
        },
        subscriptions: {
          label: 'select include subs',
        },
        content: {
          label: 'Content',
          placeholder: '填入订阅内容',
        },
        icon: {
          label: 'Icon',
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
          title: 'Add a Operator',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
      },
      nodeActions: {
        'Flag Operator': {
          label: 'Flags Options',
          des: '工作模式',
          options: ['添加', '移除'],
          tipsTitle: 'flags Tips',
          tipsDes: '国旗操作说明',
        },
        'Sort Operator': {
          label: 'Node Sort',
          des: '模式',
          options: ['正序', '逆序', '随机'],
          tipsTitle: 'sort Tips',
          tipsDes: '节点排序操作说明',
        },
        'Resolve Domain Operator': {
          label: 'Node Resolve Domain',
          des: '服务提供商',
          options: ['Google', 'IP-API', 'Cloudflare'],
          tipsTitle: 'domain Tips',
          tipsDes: '节点域名解析操作说明',
        },
        'Region Filter': {
          label: 'Region Filter',
          options: ['🇭🇰 HK', '🇨🇳 TW', '🇸🇬 SG', '🇯🇵 JP', '🇬🇧 UK', '🇺🇸 US'],
          tipsTitle: 'Region Filter Tips',
          tipsDes: '区域过滤器操作说明',
        },
        'Type Filter': {
          label: 'Node Type Filter',
          options: ['Google', 'IP-API', 'Cloudflare'],
          tipsTitle: 'Node Type Filter Tips',
          tipsDes: '节点类型过滤器操作说明',
        },
        'Regex Filter': {
          label: 'Regex Filter',
          des: ['正则表达式', '工作模式'],
          options: ['保留模式', '过滤模式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: 'Regex Filter Tips',
          tipsDes: '正则过滤操作说明',
        },
        'Regex Sort Operator': {
          label: 'Regex Sort',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: 'Regex Sort Tips',
          tipsDes: '正则排序操作说明',
        },
        'Regex Delete Operator': {
          label: 'Regex Delete',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式'],
          tipsTitle: 'Regex Delete Tips',
          tipsDes: '正则删除操作说明',
        },
        'Regex Rename Operator': {
          label: 'Regex Rename',
          des: ['正则表达式'],
          placeholder: ['填入正则表达式', '替换为'],
          tipsTitle: 'Regex Rename Tips',
          tipsDes: '正则重命名操作说明',
        },
        'Handle Duplicate Operator': {
          label: 'Handle Duplicate',
          action: { options: ['Rename', 'Delete'], des: 'Operate' },
          position: { options: ['Prefix', 'Suffix'], des: 'Number Position' },
          template: {
            des: 'Number Format',
            placeholder: '序号显示格式，用空格分隔',
          },
          link: {
            des: 'Separator',
            placeholder: '节点名和序号之间的连接符',
          },
          tipsTitle: 'Handle Duplicate Tips',
          tipsDes: '节点去重操作说明',
        },
        'Script Filter': {
          label: 'Script Filter',
          options: ['Link', 'Script'],
          des: ['Type', 'Content'],
          placeholder: 'Input Script Link',
          openEditorBtn: 'Open Code Editor',
          tipsTitle: 'Script Filter Tips',
          tipsDes: '脚本操作操作说明',
        },
        'Script Operator': {
          label: 'Script Operator',
          options: ['Link', 'Script'],
          des: ['Type', 'Content'],
          placeholder: 'Input Script Link',
          openEditorBtn: 'Open Code Editor',
          tipsTitle: 'Script Operator Tips',
          tipsDes: '脚本操作操作说明',
        },
      },
    },
  },
  myPage: {
    placeholder: {
      name: 'Gist Sync not set',
      des: 'Sync available after Gist configuration',
      syncTime: 'Last sync time ',
      haveNotSync: 'Not sync yet',
      githubUser: 'Please input Github username',
      gistToken: 'Please input Gist Token',
      noGithubUser: 'Not set Github username',
      noGistToken: 'Not set Gist Token',
    },
    btn: {
      sync: 'Sync',
      upload: 'Upload',
      cancel: 'Cancel',
      edit: 'Edit',
      save: 'Save',
    },
    notify: {
      save: {
        succeed: 'Save succeed',
        failed: 'Save failed',
      },
      download: {
        succeed: 'Download succeed',
        failed: 'Download failed',
      },
      upload: {
        succeed: 'Upload succeed',
        failed: 'Upload failed',
      },
    },
    config: 'Gist Configuration',
  },
  comparePage: {
    title: 'Conversion results comparison',
    remain: {
      title: 'remain nodes',
      beforeIndicator: 'before',
      afterIndicator: 'after',
    },
    divider: 'Following is filtered nodes',
    filter: {
      title: 'filtered nodes',
    },
    tableHead: {
      name: 'Name&Server',
      udp: 'UDP',
      'skip-cert-verify': 'SCV',
      tfo: 'TFO',
      aead: 'AEAD',
    },
  },
  codePage: {
    title: 'Code Editor',
    des: 'Auto save when exit',
  },
  syncPage: {
    title: '同步配置',
    syncSwitcher: '定时',
    syncAllSucceed: 'Sync succeed',
    emptySub: {
      title: '你还没有添加同步',
      desc: '添加后即可在其他工具使用 gist 链接',
      btn: '立即添加',
    },
    detail: {
      firstLine: 'Type: {type}, Sub: {name}',
      secondLine: 'Last Time: {time}',
      notSync: 'Not sync yet',
    },
    deleteSub: {
      title: 'Delete Sync Configuration',
      desc: 'Are you sure to delete sync configuration {displayName}? \nDeleted cannot be restored!',
      succeedNotify: 'Successfully deleted!',
      btn: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    },
    copyNotify: {
      succeed: '复制 gist 链接成功\n可以前往代理工具使用咯～',
      failed: '复制 gist 链接失败\n{e}',
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
      succeedNotify: '添加同步配置成功！',
      submitLoading: '保存中...',
    },
    editArtForm: {
      title: '编辑同步配置',
      succeedNotify: '编辑同步配置成功！',
    },
    selectSource: {
      title: 'Select Source',
    },
  },
};
