export default {
  // specific word of Sub-Store
  specificWord: {
    singleSub: 'Single',
    collectionSub: 'Collection',
  },
  globalNotify: {
    refresh: {
      succeed: 'Refresh Successful!\nEnjoy the feeling',
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
      },
      basic: {
        label: 'Subscription Config',
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
      },
    },
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
  },
};
