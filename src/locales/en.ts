export default {
  // specific word of Sub-Store
  specificWord: {
    singleSub: 'Single',
    collectionSub: 'Collection',
  },
  globalNotify: {
    refresh: {
      succeed: 'Refresh Successful!\nEnjoy the feeling',
      flowFailed: 'Refresh flow of {name} failed!',
      failed: 'Refresh Failed\n',
      loading: 'Refreshing Data...',
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
      sub: 'Management',
      sync: 'Sync Subscription',
      my: 'My Profile',
      subEditor: 'Subscription Editor',
      themeSetting: 'Theme Setting',
      moreSetting: 'More Setting',
      apiSetting: 'Backend Setting',
      aboutUs: 'About Sub-Store',
      notFound: '404 Not Found',
      askWhat: {
        sync: {
          title: 'What is Sync Subscription?',
          content:
            'Upload your subscriptions to a private Gist, which can be accessed at any time on devices that do not run the Sub Store (e.g. routers, etc.).',
        },
        subEditor: {
          title: 'Download no subscription?',
          content: 'Try replacing UA· Download. The default isQuanX UA',
        },
        moreSetting: {
          title: 'Try',
          content: 'Try',
        },
      },
    },
  },
  // Tab Bar
  tabBar: {
    sub: 'Subscription',
    sync: 'Sync',
    my: 'Profile',
  },
  // 404 页
  notFoundPage: {
    title: 'Oops! URL Error!',
    desc: 'Back to Home Page',
    backendDesc: 'If you are seeing this, it is probably due to a routing interception issue on the front end of your browser. You can force a refresh to see it or use the link directly without affecting the use of this link.',
  },
  // subscription management page
  subPage: {
    addSubTitle: 'Which type you want to create?',
    previewTitle: 'Copy/Preview a subscription',

    emptySub: {
      title: 'You have no Subscription yet',
      desc: 'After adding you can enjoy the love of YM Peng',
      btn: 'Create Subscription Now',
    },
    loadFailed: {
      title: 'Load data failed',
      desc: 'Please check MITM, Rewrite and others in Proxy Tool',
      btn: 'Retry',
      doc: 'Visit Sub-Store Docs',
      followOfficialChannel:
        'You can also follow Sub-Store official channel and join the group to ask questions',
      officialChannel: 'Official channel:',
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
      noFlowInfo: 'No flow info',
      noExpiresInfo: 'No expires info',
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
    copyConfigNotify: {
      loading: 'Copying...',
      succeed: 'Successfully copied config!',
      failed: 'Failed to copy config!\n{e}',
    },
    panel: {
      general: 'General',
    },
  },
  editorPage: {
    subConfig: {
      btn: {
        compare: 'Preview',
        save: 'Save',
      },
      pop: {
        helpTitle: 'Help',
        helpContent:
          'Proxy node actions will be executed in order, and you can drag and drop to sort them.\n\nThe preview switch is used to control whether the action takes effect in the instant preview.\n\nPlease note that node actions will be saved and take effect regardless of whether the preview switch is on or off.',
        helpBtn: 'I Understand',
        errorTitle: 'Submit Error!',
        errorBtn: 'OK',
        succeedMsg: 'Save Successfully!',
        deleteTitle: 'Delete Confirm',
        deleteDes:
          'Do you really want to delete this action? Deleted action cannot be restored!',
        deleteConfirm: 'Delete it',
        deleteCancel: 'Cancel',
        clearTitle: 'Clear Confirm',
        clearDes: 'Do you really want to clear this content?',
        clearConfirm: 'Clear it',
        clearCancel: 'Cancel',
        leaveCancel: 'Continue Editing',
        leaveConfirm: 'Leave',
        leaveConfirmTitle: 'Unsaved Changes',
        leaveContent:
          'Unsave changes will be lost without saving.\n\nDo you want to leave editing?',
        clickTag: {
          title: '编辑确认',
          content:
            '输入框存在未保存的内容，现在编辑其他标签当前未保存的内容将丢失\n\n请确认？',
          confirm: '确认',
          cancel: '取消',
        },
      },
      basic: {
        label: 'Subscription Config',
        previewSwitch: 'Preview',
        nodeActionsHelp: 'Node Actions Help',
        name: {
          label: 'Name',
          placeholder: 'Unique name(do not include / )',
          isEmpty: 'Name cannot be empty',
          isInvalid: 'The name has been used or is invalid',
        },
        displayName: {
          label: 'Display Name',
          placeholder: 'The display name for the subscription',
        },
        source: {
          label: 'Source',
          remote: 'Remote URL',
          local: 'Local',
          mergeSources: 'Merge Sources',
          noMerge: 'No Merge',
          localFirst: 'Local Fist',
          remoteFirst: 'Remote First',
        },
        url: {
          label: 'URL',
          placeholder: 'The original subscription URL',
          isEmpty: 'URL cannot be empty',
          isIllegal: 'Invalid URL',
        },
        subscriptions: {
          label: 'Select included subscriptions',
        },
        content: {
          label: 'Content',
          placeholder: 'The content of the subscription',
        },
        icon: {
          label: 'Icon',
          placeholder: 'The URL of the icon',
        },
        ignoreFailedRemoteSub: {
          label: 'Ignore failed remote subscription(s)'
        },
        ua: {
          label: 'User-Agent',
          placeholder:
            'The User-Agent for downloading the original subscription',
        },
      },
      commonOptions: {
        label: 'Common Settings',
        useless: {
          label: 'Remove Useless Nodes',
          disabled: 'Retain',
          enabled: 'Remove',
        },
        udp: {
          label: 'UDP Relay',
          default: 'Default',
          enabled: 'Force Enable',
          disabled: 'Force Disable',
        },
        scert: {
          label: 'Skip TLS Verification',
          default: 'Default',
          enabled: 'Force Enable',
          disabled: 'Force Disable',
        },
        tfo: {
          label: 'TCP Fast Open',
          default: 'Default',
          enabled: 'Force Enable',
          disabled: 'Force Disable',
        },
        'vmess aead': {
          label: 'Vmess AEAD',
          default: 'Default',
          enabled: 'Force Enable',
          disabled: 'Force Disable',
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
        label: 'Node Actions',
        addAction: {
          title: 'Add an action',
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
      },
      nodeActions: {
        'Flag Operator': {
          label: 'Flags Options',
          des: 'Mode',
          options: ['Add Flag', 'Remove Flag'],
          tipsTitle: 'flags Tips',
          tipsDes: '国旗操作说明',
        },
        'Sort Operator': {
          label: 'Node Sort',
          des: 'Order',
          options: ['Ascending', 'Descending', 'Random'],
          tipsTitle: 'sort Tips',
          tipsDes: '节点排序操作说明',
        },
        'Resolve Domain Operator': {
          label: 'Resolve Domain',
          des: 'Providers',
          options: ['Google', 'IP-API', 'Cloudflare', 'Ali', 'Tencent'],
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
          options: [
            'ShadowSocks',
            'ShadowSocks R',
            'VMess',
            'VLess',
            'Trojan',
            'Http(s)',
            'Socks5',
            'Snell',
            'TUIC',
            'Hysteria',
            'Hysteria2',
            'WireGuard',
          ],
          tipsTitle: 'Node Type Filter Tips',
          tipsDes: '节点类型过滤器操作说明',
        },
        'Regex Filter': {
          label: 'Regex Filter',
          des: ['Regular Expressions', 'Mode'],
          options: ['Retain', 'Remove'],
          placeholder: ['Regular Expressions'],
          tipsTitle: 'Regex Filter Tips',
          tipsDes: '正则过滤操作说明',
        },
        'Regex Sort Operator': {
          label: 'Regex Sort',
          des: ['Regular Expressions'],
          placeholder: ['Regular Expressions'],
          tipsTitle: 'Regex Sort Tips',
          tipsDes: '正则排序操作说明',
        },
        'Regex Delete Operator': {
          label: 'Regex Delete',
          des: ['Regular Expressions'],
          placeholder: ['Regular Expressions'],
          tipsTitle: 'Regex Delete Tips',
          tipsDes: '正则删除操作说明',
        },
        'Regex Rename Operator': {
          label: 'Regex Rename',
          des: ['Regular Expressions'],
          placeholder: ['Regular Expressions', 'Replace with'],
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
      uploadTime: 'Last upload time',
      haveNotDownload: 'Not download yet',
      githubUser: 'Please input GitHub username',
      gistToken: 'Please input Gist Token',
      defaultUserAgent: 'Please input Default User-Agent',
      noGithubUser: 'Not set GitHub username',
      noGistToken: 'Not set Gist Token',
      noDefaultUserAgent: 'Not set default user-agent'
    },
    btn: {
      download: 'Download',
      upload: 'Upload',
      cancel: 'Cancel',
      edit: 'Edit',
      save: 'Save',
      clear: 'Clear',
    },
    notify: {
      save: {
        succeed: 'Save succeed',
        failed: 'Save failed',
      },
      restore: {
        succeed: 'Restore succeed',
        failed: 'Restore failed',
      },
      download: {
        succeed: 'Download succeed',
        failed: 'Download failed',
      },
      upload: {
        succeed: 'Upload succeed',
        failed: 'Upload failed',
      },
      sortsub: {
        failed: 'Sort failed',
      }
    },
    config: 'Configuration',
    storage: {
      gist: {
        label: 'Gist'
      },
      manual: {
        label: 'Manual',
        desc: 'To prevent accidents, backup your data before restoring.',
        backup: 'Backup',
        restore: 'Restore',
      }
    }
  },
  comparePage: {
    title: 'Instant Preview',
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
    nodeInfo: {
      loading: 'Getting Node Info...',
      loadFailed: 'Get Node Info Failed',
      ipApi: {
        title: 'IP-API',
      },
      node: {
        title: 'Node Info',
        server: 'Server',
        password: 'Password',
        UUID: 'UUID',
      },
    },
  },
  codePage: {
    title: 'Editor',
    des: 'Auto save when exit',
  },
  syncPage: {
    title: 'Sync Artifacts',
    syncSwitcher: 'Enable Sync',
    syncAllSucceed: 'Sync succeed',
    emptySub: {
      title: "You haven' add any synced artifacts",
      desc: 'You can access the artifact anywhere via Gist',
      btn: 'Add an artifact',
    },
    detail: {
      firstLine: 'Type: {type}, Sub: {name}',
      secondLine: 'Last Time: {time}',
      notSync: 'Not sync yet',
    },
    deleteArt: {
      title: 'Delete Sync Configuration',
      desc: 'Are you sure to delete sync configuration {displayName}? \nDeleted cannot be restored!',
      succeedNotify: 'Successfully deleted!',
      btn: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
    },
    copyNotify: {
      succeed: 'Copy Gist link successfully',
      failed: 'Failed to copy Gist link\n{e}',
    },
    addArtForm: {
      title: 'Add Synced Artifact',
      cancel: 'Cancel',
      confirm: 'Add',
      name: {
        label: 'Name',
        placeholder: 'Name',
        isRequired: 'Name is required',
        isExist: 'Name is already taken',
        isValid:
          'Name should only include letters, numbers, underscores, and dashes',
      },
      displayName: {
        label: 'Display Name',
        placeholder: 'Display name',
      },
      source: {
        label: 'Source',
        isRequired: 'Source is required',
        placeholder: 'Please select a source',
      },
      platform: {
        label: 'Target Platform',
        isRequired: 'Target platform is required',
      },
      pop: {
        errorTitle: 'Failed to save artifact',
        errorBtn: 'Modify',
      },
      succeedNotify: 'Added artifact successfully!',
      submitLoading: 'Saving...',
    },
    editArtForm: {
      title: 'Edit Synced Artifacts',
      succeedNotify: 'Edited artifact successfully!',
    },
    selectSource: {
      title: 'Select Source',
    },
  },
  themeSettingPage: {
    themeSettingTitle: 'Appearance',
    auto: 'Auto Switch',
    light: 'Light Mode',
    dark: 'Dark Mode',
    themePicker: {
      title: 'Pick a Theme',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  },
  apiSettingPage: {
    apiSettingTitle: 'Backend Setting',
    apiSettingDesc0: `1. When the backend server address is https://api.com, an attempt is made to request https://api.com/api/utils/env to verify backend availability. When the backend server address cannot be added, try accessing this address first.`,
    apiSettingDesc1: `2. HTTPS front-end cannot request non-local HTTP backend. Please configure a reverse proxy or host your own HTTP front-end on your LAN.`,
    apiSettingDesc2: `Add the backend server address, such as the backend service built on server/NAS/Android/cloud platform. You can refer to XiaoYi's tutorial on setting up a backend: `,
    currentApi: {
      title: 'Current Backend',
    },
    apiList: {
      title: 'Backend List',
      desc: 'This list is saved locally in the browser. If you change your browser/device, you will need to add it again. Click to switch to the corresponding backend.',
      defaultName: 'Default',
      currentTag: 'Current',
    },
    addApi: {
      title: 'Add New Backend',
      placeholder: {
        name: 'Please input backend name, must be unique',
        url: 'Please input backend url',
      },
      btn: 'Add',
    },
  },
  moreSettingPage: {
    moreSettingTitle: 'More Setting',
    other: 'Other',
    auto: 'Auto Download Gist config on startup',
    desc: 'Note: Turning on this switch will automatically download and refresh the Gist remote configuration when SubStore is opened. The refresh operation overwrites the current configuration. To prevent data loss, you can manually upload the configuration after the modification. The switch will not be uploaded, and the configuration will be downloaded only after the restart.',
    simple: 'Simple Mode',
    islr: 'Card right swipe to call out',
    isIC: 'Use original color for icons',
    isEditorCommon: 'Show editor common settings',
    isSimpleReicon: 'Show items refresh button',
    tabBar: 'Hide "Sync" Page',
    auto2: 'MoreSetting Key',
    hostapi: 'Custom Backend API',
    currentHostApi: 'Current Backend API',
    yhostapi: 'Default:https://sub.store ',
    serverDesc:
      'Configure the back-end server address, such as the back-end service set up on VPS or Render. After the configuration, restart the Sub Store to take effect. To delete the api, use the original default backend to manually delete the address and click Save',
    InputHostApi: {
      title: 'Link validation failed invalid link',
      content:
        'Mainstream browsers have already blocked HTTP requests on HTTPS pages. Please use the HTTPS protocol instead',
    },
  },
  aboutUsPage: {
    projectInfo: {
      title: 'Project Info (Please Star 🌟)',
      fe: 'Front-End',
      be: 'Back-End',
      module: 'Module',
      mock: 'Mock Module',
      team: 'Project Team',
      link: 'View on Github',
    },
    changelogs: {
      title: 'Changelogs',
    },
  },
};
