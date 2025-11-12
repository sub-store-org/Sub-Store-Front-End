export default {
  // specific word of Sub-Store
  specificWord: {
    singleSub: "Single",
    collectionSub: "Collection",
    file: "File",
    unknownType: "Unknown Type",
    unknownSource: "Unknown Source",
    unknown: "Unknown",
    all: "All",
    untagged: "Untagged",
    or: "or",
    type: "Type",
    none: "None",
  },
  globalNotify: {
    refresh: {
      succeed: "Refresh Completed",
      flowFailed: "Refresh of {name} failed!",
      failed: "Refresh Failed\n",
      loading: "Refreshing Data...",
      rePwaing: 'Resetting PWA cache...',
      rePwa: 'PWA cache reset successfully. The page will refresh soon...',
    },
  },
  // Title Bar
  navBar: {
    langSwitcher: {
      cellTitle: "Tap a language which you want to use",
      zh: "简体中文",
      en: "English",
    },
    pagesTitle: {
      sub: "Management",
      file: "File",
      sync: "Sync",
      my: "My Profile",
      editScript: "Script Edit",
      subEditor: "Subscription Editor",
      fileEditor: "File Editor",
      preview: 'Preview',
      shareManage: "Share Manage",
      iconCollection: "Icon Collection",
      themeSetting: "Theme Setting",
      moreSetting: "More Setting",
      apiSetting: "Backend Setting",
      aboutUs: "About Sub-Store",
      notFound: "404 Not Found",
      askWhat: {
        sync: {
          title: "What is Sync?",
          content:
            "Upload your subscriptions/files to a private Gist, which can be accessed at any time on devices that do not run the Sub Store (e.g. routers, etc.).",
        },
        subEditor: {
          title: "Download no subscription?",
          content: "Try replacing UA· Download. The default isQuanX UA",
        },
        moreSetting: {
          title: "Try",
          content: "Try",
        },
      },
    },
  },
  // Tab Bar
  tabBar: {
    sub: "Subscription",
    sync: "Sync",
    my: "Profile",
  },
  // 404 页
  notFoundPage: {
    title: "Oops! URL Error!",
    desc: "Back to Home Page",
    backendDesc:
      "If you are seeing this, it is probably due to a routing interception issue on the front end of your browser. You can force a refresh to see it or use the link directly without affecting the use of this link.",
  },
  filePage: {
    type: {
      mihomoProfile: 'Mihomo Profile',
      mihomoProfileTips: 'Override is supported',
      mihomoProfileTips2: 'Override(JavaScript/YAML) is supported',
    },
    addFileTitle: "Create File",
    importFileTitle: "Import File data",
    importFileTips: "On the File Management page, click the Export icon button in the More items section of a file.",
    deleteFile: {
      succeedNotify: "Successfully deleted!",
    },
    content: {
      placeholder: "The content of the file",
    },
    url: {
      label: "URL",
      placeholder:
        "Supports mixing three types of formats with line breaks: 1. Full remote URL 2. Internal file reference like /api/file/name 3. Absolute path for local file. Supported parameters: noCache - do not use cache; insecure - do not verify the server certificate. For example: http://a.com#noCache&insecure",
      isEmpty: "URL cannot be empty",
      isIllegal: "Invalid URL",
    },
    copyNotify: {
      succeed:
        "Successfully copied link!\nIf you use it internally, just {path}",
      failed: "Failed to copy file link!\n{e}",
    },
    emptySub: {
      title: "You have no File yet",
      desc: "After adding you can enjoy the love of YM Peng",
      btn: "Create File Now",
    },
    source: {
      local: "Local",
      remote: "Remote",
    },
    ignoreFailedRemoteFile: {
      label: "Ignore failed remote file(s)",
      quiet: 'Enabled (without notification)',
      disabled: 'Disabled',
      enabled : 'Enabled (with notification)'
    },
    download: {
      label: "Enable download (filename: display name)",
    },
  },
  // subscription management page
  subPage: {
    import: {
      label: "Import",
      succeed: "Successfully imported!",
      failed: "Failed to import!\n{e}",
      tipsTitle: "Import Subscription data",
      tipsContent: "On the Subscription management page, click on the Export icon button on the left/right slide of a subscription with more items.",
    },
    addSubTitle: "Choose Subscription type",
    previewTitle: "Copy/Preview a subscription",
    tag: {
      addTagTitle: "Add Tag",
      tagPlaceholder: "Please enter tag name",
      addTagBtn: "+ New Tag",
    },
    emptySub: {
      title: "You have no Subscription yet",
      desc: "After adding you can enjoy the love of YM Peng",
      btn: "Create Subscription Now",
    },
    loadFailed: {
      title: "Load data failed",
      desc: "Please check MITM, Rewrite and others in Proxy Tool",
      btn: "Retry",
      doc: "Visit Sub-Store Docs",
      followOfficialChannel:
        "You can also follow Sub-Store official channel and join the group to ask questions",
      officialChannel: "Official channel:",
    },
    collectionItem: {
      noSub: "No subscription included",
      contain: "Included subs",
      containTag: "Included subscription tags",
    },
    subItem: {
      local: "Local subscription",
      loading: "Loading...",
      flow: "Usage / Total",
      showRemainingFlow: "Remaining / Total",
      expires: "Expires",
      remainingDays: "Remaining Reset Days",
      remainingDaysUnit: "",
      noRecord: "Refresh to get usage",
      noFlow: "No flow",
      noFlowInfo: "No flow info",
      flowError: "Failed to get usage",
      noExpiresInfo: "No expires info",
    },
    deleteSub: {
      title: "Delete",
      desc: "Are you sure to delete {displayName}? \nDeleted cannot be restored!",
      succeedNotify: "Successfully deleted!",
      btn: {
        confirm: "Delete",
        cancel: "Cancel",
      },
    },
    copyNotify: {
      succeed: "Successfully copied link!",
      failed: "Failed to copy subscription link!\n{e}",
    },
    copyConfigNotify: {
      loading: "Cloning...",
      succeed: "Successfully cloned config!",
      failed: "Failed to clone config!\n{e}",
    },
    exportConfigNotify: {
      loading: "Exporting...",
      succeed: "Successfully exported config!",
      failed: "Failed to exporte config!\n{e}",
    },
    panel: {
      general: "General",
      tips: {
        ok: "View Document",
        cancel: "Cancel",
        desc: "Some functions require parameters. Please check the document.",
        title: "Subscription Link Parameters",
        content:
          '"target=SurgeMac"\n+ ShadowsocksR/External Proxy Program\n\n"includeUnsupportedProxy=true"\nIncludes protocols not supported by the official/store version',
      },
    },
  },
  editorPage: {
    subConfig: {
      btn: {
        compare: "Preview",
        save: "Save",
      },
      pop: {
        helpTitle: "Help",
        helpContent:
          "Proxy node actions will be executed in order, and you can drag and drop to sort them.\n\nThe preview switch is used to control whether the action takes effect in the instant preview.\n\nPlease note that node actions will be saved and take effect regardless of whether the preview switch is on or off.",
        helpBtn: "I Understand",
        errorTitle: "Submit Error!",
        errorBtn: "OK",
        succeedMsg: "Save Successfully!",
        deleteTitle: "Delete Confirm",
        deleteDes:
          "Do you really want to delete this action? Deleted action cannot be restored!",
        deleteConfirm: "Delete it",
        deleteCancel: "Cancel",
        clearTitle: "Clear Confirm",
        clearDes: "Do you really want to clear this content?",
        clearConfirm: "Clear it",
        clearCancel: "Cancel",
        leaveCancel: "Continue Editing",
        leaveConfirm: "Leave",
        leaveConfirmTitle: "Unsaved Changes",
        leaveContent:
          "Unsave changes will be lost without saving.\n\nDo you want to leave editing?",
        clickTag: {
          title: "Click Tag To Edit",
          content:
            "There is unsaved content in the input box. Now editing other tags will lose the unsaved content\n\nPlease confirm?",
          confirm: "confirm",
          cancel: "cancel",
        },
      },
      basic: {
        label: "Subscription Config",
        previewSwitch: "Preview",
        nodeActionsHelp: "Node Actions Help",
        name: {
          label: "Name",
          placeholder: "Unique name(do not include / )",
          isEmpty: "Name cannot be empty",
          isInvalid: "The name has been used or is invalid",
        },
        remark: {
          label: "Remarks",
          placeholder: "The remarks",
        },
        displayName: {
          label: "Display Name",
          placeholder: "The display name",
        },
        subInfoUrl: {
          label: "Sub Info URL",
          placeholder: "The URL for fetching subscription usage info",
        },
        subInfoUserAgent: {
          label: "Sub Info User-Agent",
          placeholder: "User-Agent for fetching subscription usage info",
        },
        tag: {
          label: "Tag(s)",
          placeholder:
            "Click on the right icon, The tag(s) (separated by comma) will be used for grouping.",
        },
        subscriptionTags: {
          label: "Subscription Tag(s)",
          placeholder:
            "Click on the right icon, Include all subscriptions that contain one of these tag(s) (separated by comma)",
        },
        source: {
          label: "Source",
          remote: "Remote URL",
          local: "Local",
          mergeSources: "Merge Sources",
          noMerge: "Disabled",
          localFirst: "Local Fist",
          remoteFirst: "Remote First",
        },
        url: {
          label: "URL",
          placeholder:
            "Multiple lines and parameters are supported, please click the button on the left to see the usage.",
          tips: {
            importFromFile: 'Import From File',
            fullScreenEdit: "Full Screen Editing",
            fullScreenEditCancel: "Exit Full Screen Editing",
            label: "Usage",
            title: "Subscription URL(s)",
            content:
              "Supports mixing three types of formats with line breaks:\n1. Full remote URL\n2. Internal file reference like /api/file/name 3.\nAbsolute path for local file\n\nSupported parameters:\n\ninsecure: https requests will not verify the server certificate\ncacheKey: Setting the name of the optimistic cache. Its value can be managed in the persistent store(suitable for subscriptions that often fail to fetch).\n\nvalidCheck: error will be reported when expired or there is no remaining traffic\n\nflowUserAgent: the User-Agent for fetching subscription usage info\n\nflowUrl: the URL for fetching subscription usage info(using the content of the response body)\n\nshowRemaining: show remaining traffic instead of usage\n\nnoFlow: do not query for flow\n\nhideExpire: hide expiration time\n\nnoCache: do not use cache\n\nresetDay: the day when monthly data usage resets\n\nstartDate: subscription start date\n\ncycleDays: reset cycle (in days).\n\nFor example: http://a.com?token=1#cycleDays=31&startDate=2024-06-04 \nor http://a.com?token=1#resetDay=15",
          },
          isEmpty: "URL cannot be empty",
          isIllegal: "Invalid URL",
        },
        subscriptions: {
          label: "Select included subscriptions",
          empty: 'Please create a subscription first, then use the collection feature',
        },
        content: {
          label: "Content",
          placeholder: "",
          tips: {
            title: "The content of the subscription",
            content:
              "Subscription content:\n\n1. Multiple single-line proxy protocols/JSON5/YAML/URI\n\n2. Complete Base64/YAML",
          },
        },
        icon: {
          label: "Icon",
          placeholder:
            "Click on the left or top icon, fill in the icon link from the icon library, do not use jpg.",
        },
        isIconColor: {
          label: 'Custom Icon Use Original Color',
        },
        ignoreFailedRemoteSub: {
          label: "Ignore failed remote subscription(s)",
          quiet: 'Enabled (without notification)',
          disabled: 'Disabled',
          enabled : 'Enabled (with notification)'
        },
        ua: {
          label: "User-Agent",
          placeholder: "The User-Agent for downloading resource(s)",
          placeholderDisabled: 'Disable custom UA when passing through',
        },
        subUserinfo: {
          label: "Subscription-Userinfo",
          placeholder: "Value or URL(use response content)",
        },
        passThroughUA: {
          label: 'Pass Through Request User-Agent',
          warning: 'Pass Through Request User-Agent and Custom UA cannot be enabled at the same time',
        },
        proxy: {
          label: "Proxy/Policy",
          placeholder: "The proxy/node/policy for downloading resource(s)",
        },
      },
      commonOptions: {
        label: "Common Settings",
        useless: {
          label: "Remove Useless Nodes",
          disabled: "Retain",
          enabled: "Remove",
        },
        udp: {
          label: "UDP Relay",
          default: "Default",
          enabled: "Force Enable",
          disabled: "Force Disable",
        },
        scert: {
          label: "Skip TLS Verification",
          default: "Default",
          enabled: "Force Enable",
          disabled: "Force Disable",
        },
        tfo: {
          label: "TCP Fast Open",
          default: "Default",
          enabled: "Force Enable",
          disabled: "Force Disable",
        },
        "vmess aead": {
          label: "Vmess AEAD",
          default: "Default",
          enabled: "Force Enable",
          disabled: "Force Disable",
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
        label: "Node Actions",
        addAction: {
          title: "Add an action",
          cancel: "Cancel",
          confirm: "Confirm",
        },
        pasteAction: {
          label: "Import Data From Clipboard",
          placeholder:
            "Failed to read the clipboard automatically, please paste the data manually in this text box.",
        },
        enable: 'Enable',
        disable: 'Disable',
      },
      nodeActions: {
        "Flag Operator": {
          label: "Flags Options",
          des: "Mode",
          options: ["Add Flag", "Remove Flag"],
          twOptions: ["⇒ 🇨🇳", "⇒ 🇼🇸", "Unchanged"],
          tipsTitle: "flags Tips",
          tipsDes: "Flag operation instructions",
        },
        "Sort Operator": {
          label: "Node Sort",
          des: "Order",
          options: ["Ascending", "Descending", "Random"],
          tipsTitle: "sort Tips",
          tipsDes: "Description of node sorting operation",
        },
        "Resolve Domain Operator": {
          label: "Resolve Domain",
          des: 'Providers(can be controlled by the node field "_no-resolve")',
          options: [
            "Google",
            "IP-API",
            "Cloudflare",
            "Ali",
            "Tencent",
            "Custom",
          ],
          types: ["IPv4", "IPv6"],
          filters: [
            "Disabled",
            "Remove Failed",
            "IP Only",
            "IPv4 Only",
            "IPv6 Only",
          ],
          cache: ["Enabled", "Disabled"],
          tipsTitle: "domain Tips",
          tipsDes: "Operation instructions for node domain name resolution",
        },
        "Region Filter": {
          label: "Region Filter",
          des: ["Region", "Mode"],
          modeOptions: ["Retain", "Remove"],
          options: [
            "🇭🇰 HK",
            "🇨🇳 TW",
            "🇸🇬 SG",
            "🇯🇵 JP",
            "🇬🇧 UK",
            "🇺🇸 US",
            "🇩🇪 DE",
            "🇰🇷 KR",
          ],
          tipsTitle: "Region Filter Tips",
          tipsDes: "Region filter operating instructions",
        },
        "Type Filter": {
          label: "Node Type Filter",
          des: ["Type", "Mode"],
          modeOptions: ["Retain", "Remove"],
          options: [
            "Shadowsocks",
            "ShadowsocksR",
            "VMess",
            "VLESS",
            "Trojan",
            "HTTP(s)",
            "SOCKS5",
            "Snell",
            "TUIC",
            "Hysteria",
            "Hysteria 2",
            "Juicity",
            "mieru",
            "AnyTLS",
            "WireGuard",
            "SSH",
            "External Proxy Program",
            "Direct",
          ],
          tipsTitle: "Node Type Filter Tips",
          tipsDes: "Node type filter Operation Description",
        },
        "Regex Filter": {
          label: "Regex Filter",
          des: ["Regular Expressions", "Mode"],
          options: ["Retain", "Remove"],
          placeholder: ["Regular Expressions"],
          tipsTitle: "Regex Filter Tips",
          tipsDes: "Regular filtering operation instructions",
        },
        "Regex Sort Operator": {
          label: "Regex Sort",
          des: ["Regular Expressions", "Sort of Unmatched Nodes"],
          options: ["Ascending", "Descending", "Original"],
          placeholder: ["Regular Expressions"],
          tipsTitle: "Regex Sort Tips",
          tipsDes: "Regular sorting operation instructions",
        },
        "Regex Delete Operator": {
          label: "Regex Delete",
          des: ["Regular Expressions"],
          placeholder: ["Regular Expressions"],
          tipsTitle: "Regex Delete Tips",
          tipsDes: "Regular deletion operation instructions",
        },
        "Regex Rename Operator": {
          label: "Regex Rename",
          des: ["Regular Expressions"],
          placeholder: ["Regular Expressions", "Replace with"],
          tipsTitle: "Regex Rename Tips",
          tipsDes: "Regular renaming operation instructions",
        },
        "Handle Duplicate Operator": {
          label: "Handle Duplicate",
          action: { options: ["Rename", "Delete"], des: "Operate" },
          position: { options: ["Prefix", "Suffix"], des: "Number Position" },
          template: {
            des: "Number Format",
            placeholder: "Serial number display format, separated by spaces",
          },
          link: {
            des: "Separator",
            placeholder:
              "The connector between the node name and the sequence number",
          },
          tipsTitle: "Handle Duplicate Tips",
          tipsDes: "Node deduplication operation instructions",
        },
        "Script Filter": {
          label: "Script Filter",
          options: ["Link", "Script"],
          des: ["Type", "Content"],
          placeholder:
            "Input Script Link or Internal File like /api/file/name. In addition to the parameters of the script itself, there is support for additional parameters: noCache - do not use cache, insecure - do not verify the server certificate. For example: http://a.com#a=1&b=2#noCache&insecure",
          openEditorBtn: "Open Code Editor",
          tipsTitle: "Script Filter Tips",
          tipsDes: "Use a JavaScript script to filter nodes",
          helpTitle: 'Tips',
          noCache: 'noCache',
          insecure: 'insecure',
          noCacheTips: 'When the cache is turned off, the script is refetched for each request.',
          insecureTips: 'When the insecure is turned on, the server certificate will not be verified.',
          paramsEditTips: 'Visual parameter editor, duplicate key names will adopt the principle of prioritizing the latter value.',
          paramsAdd: 'Add',
          paramsDelete: 'Delete',
          paramsOptions: 'Options',
          paramsEmpty: 'No parameters',
          duplicateKeyWarning: 'Duplicate key names',
        },
        "Script Operator": {
          label: "Script Operator",
          options: ["Link", "Script"],
          des: ["Type", "Content"],
          placeholder:
            "Input Script Link or Internal File like /api/file/name. In addition to the parameters of the script itself, there is support for additional parameters: noCache - do not use cache, insecure - do not verify the server certificate. For example: http://a.com#a=1&b=2#noCache&insecure",
          openEditorBtn: "Open Code Editor",
          tipsTitle: "Script Operator Tips",
          tipsDes: "Use a JavaScript script to modify node information",
          paramsEdit: 'Edit Parameters',
          noCache: 'noCache',
          insecure: 'insecure',
          helpTitle: 'Tips',
          noCacheTips: 'When the cache is turned off, the script is refetched for each request.',
          insecureTips: 'When the insecure is turned on, the server certificate will not be verified.',
          paramsEditTips: 'Visual parameter editor, duplicate key names will adopt the principle of prioritizing the latter value.',
          paramsAdd: 'Add',
          paramsDelete: 'Delete',
          paramsOptions: 'Options',
          paramsEmpty: 'No parameters',
          duplicateKeyWarning: 'Duplicate key names',
        },
      },
      sourceNamePicker: {
        title: 'Select Subscription Name',
        cancel: 'Cancel',
        confirm: 'Confirm',
        emptyTips: 'Subscription not found? Click to add a subscription',
      },
    },
  },
  myPage: {
    placeholder: {
      name: "Gist Sync not set",
      des: "Sync available after Gist configuration",
      uploadTime: "Last upload time",
      haveNotDownload: "Not download yet",
      githubUser: "Please input GitHub username",
      gistToken: "Please input Gist Token",
      githubProxy: "Please input GitHub Proxy",
      defaultUserAgent: "Please input Default User-Agent",
      defaultProxy: "Please input Default Proxy/Policy",
      defaultTimeout: "Default Timeout (in milliseconds, default: 8000)",
      cacheThreshold: "Cache Threshold (in KB, default: 1024)",
      noGithubUser: "Not set GitHub username",
      noGistToken: "Not set Gist Token",
      noGithubProxy: "Not set GitHub Proxy",
      noDefaultUserAgent: "Not set default user-agent",
      noDefaultProxy: "Not set default proxy/policy",
      noDefaultTimeout: "Not set default timeout",
      noCacheThreshold: "Not set cache threshold",
    },
    btn: {
      download: "Download",
      upload: "Upload",
      cancel: "Cancel",
      edit: "Edit",
      save: "Save",
      clear: "Clear",
    },
    notify: {
      save: {
        succeed: "Save succeed",
        failed: "Save failed",
      },
      restore: {
        succeed: "Restore succeed",
        failed: "Restore failed",
      },
      download: {
        succeed: "Download succeed",
        failed: "Download failed",
      },
      upload: {
        succeed: "Upload succeed",
        failed: "Upload failed",
      },
      sortsub: {
        failed: "Sort failed",
      },
    },
    config: "Configuration",
    storage: {
      gist: {
        label: "Gist",
        info: 'Sync file/subscription(s) to Gist in "Sync Page"',
      },
      manual: {
        label: "Manual",
        info: "",
        desc: "To prevent accidents, backup your data before restoring.",
        backup: "Backup",
        restore: "Restore",
      },
    },
  },
  comparePage: {
    title: "Instant Preview",
    remain: {
      title: "remain nodes",
      beforeIndicator: "before",
      afterIndicator: "after",
    },
    divider: "Following is filtered nodes",
    filter: {
      title: "filtered nodes",
    },
    tableHead: {
      name: "Name&Server",
      udp: "UDP",
      "skip-cert-verify": "SCV",
      tfo: "TFO",
      aead: "AEAD",
    },
    nodeInfo: {
      loading: "Getting Node Info...",
      loadFailed: "Get Node Info Failed",
      ipApi: {
        title: "IP-API",
      },
      node: {
        title: "Node Info",
        server: "Server",
        password: "Password",
        UUID: "UUID",
      },
    },
  },
  codePage: {
    title: "Editor",
    des: "Auto save when exit",
  },
  syncPage: {
    title: "Sync Artifacts",
    syncSwitcher: "Enable Sync",
    syncAllSucceed: "Sync succeed",
    emptySub: {
      title: "You haven't add any synced artifacts",
      desc: "You can access the artifact anywhere via Gist",
      btn: "Add an artifact",
    },
    detail: {
      firstLine: "Type: {type}, Source: {name}",
      secondLine: "Last Time: {time}",
      notSync: "Not sync yet",
    },
    deleteArt: {
      title: "Delete Sync Configuration",
      desc: "Are you sure to delete sync configuration {displayName}? \nDeleted cannot be restored!\n\n⚠️ If the current item has been synced before, an attempt will be made to delete gist files with the original filename and the encoded filename.",
      succeedNotify: "Successfully deleted!",
      btn: {
        confirm: "Delete",
        cancel: "Cancel",
      },
    },
    copyNotify: {
      succeed: "Copy Gist link successfully",
      failed: "Failed to copy Gist link\n{e}",
    },
    addArtForm: {
      title: "Add Synced Artifact",
      cancel: "Cancel",
      confirm: "Add",
      name: {
        label: "Name",
        placeholder: "Name",
        isRequired: "Name is required",
        isExist: "Name is already taken",
        isValid:
          "Name should only include letters, numbers, underscores, and dashes",
      },
      displayName: {
        label: "Display Name",
        placeholder: "Display name",
      },
      source: {
        label: "Source",
        isRequired: "Source is required",
        placeholder: "Please select a source",
      },
      includeUnsupportedProxy: {
        label: "Includes protocols not supported by the official/store/unrenewed subscription version",
        tips: {
          title:
            "Includes protocols not supported by the official/store/unrenewed subscription version",
          content: "sing-box: +ShadowsocksR\nQuantumult X: +VLESS",
        },
      },
      platform: {
        label: "Target Platform",
        isRequired: "Target platform is required",
      },
      pop: {
        errorTitle: "Failed to save artifact",
        errorBtn: "Modify",
      },
      succeedNotify: "Added artifact successfully!",
      submitLoading: "Saving...",
    },
    editArtForm: {
      title: "Edit Synced Artifacts",
      succeedNotify: "Edited artifact successfully!",
    },
    selectSource: {
      title: "Select Source",
    },
    preview: {
      title: "Sub-Store Gist",
      content:
        "⚠️ The status of the latest check: {status}.\nYou can update the configuration to trigger a new check.",
      url: "The current gist is the last one that was checked successfully.",
      noUrl:
        "Once you have successfully checked and uploaded the synchronized configuration, you can view the gist.",
      cancel: "Cancel",
      confirm: "View Gist",
    },
    download: {
      content:
        "⚠️ This feature will only add files to the sync configuration that are not already in the sync configuration.\nYou need to manually set the source.",
      confirm: "Restore From Gist",
    },
  },
  sharePage: {
    title: "Share",
    noOriginalTips: "Failed to jump, check if the source data has been deleted.",
    leftTime: "Remaining time",
    expired: "Expired",
    expiredLabel: "Expiration Time: ",
    createTimeLabel: "Creation Time: ",
    magicPathErrorNotify: "SUB_STORE_FRONTEND_BACKEND_PATH should start with /, please check the configuration!",
    createShare: {
      expiresValue: {
        label: "Valid for",
        placeholder: "Enter valid for",
        regex: "Please enter a number within the range of 0.01 to 99999.99",
        empty: "Valid for cannot be empty",
      },
      expiresUnit: {
        label: "Validity unit",
      },
      token: {
        label: "Custom Token",
        placeholder: "default random Token"
      },
      remark: {
        label: "Remarks",
        placeholder: "The remarks",
      },
      displayName: {
        label: "显示名称",
        placeholder: "输入展示的名称",
      },
      shareUrl: {
        label: "Share Link",
        placeholder: "Share Link",
      },
      unit: {
        day: "Day",
        month: "Month",
        season: "Season",
        year: "Year",
      },
      copyBtn: "Copy Link",
      updateBtn: "Update",
      createBtn: "Create",
      succeedNotify: "Create share successfully!",
    },
    copyShare: {
      succeedNotify: "Copy share link successfully!",
    },
    emptyShare: {
      title: "No share yet",
      desc: "Create and share, then start using.",
      emptyTips: "Please go to the Subs, Files Management page to add the share",
      btn: "Create Now",
    },
    updateShare: {
      failNotify: "Update share failed",
      title: "Update Share",
      tips: "After updating the share, the original share link will not work, should I continue?",
      confirm: "Confirm",
      cancel: "Cancel",
    },
    deleteShare: {
      title: "Delete Share",
      desc: "Are you sure you want to delete {displayName}? Deletion is not recoverable!",
      succeedNotify: "Successfully deleted!",
      btn: {
        confirm: "Confirm",
        cancel: "Cancel",
      },
    },
  },
  // 图标仓库页
  iconCollectionPage: {
    iconCollection: "Icon Collection",
    iconCollectionPlaceholder: "Please input icon collection url",
    iconName: "Icon Name",
    iconNamePlaceholder: "Please input icon name",
    iconCollectionKey: "Icon Collection Key",
    iconCollectionKeyPlaceholder: "Default Key: icons",
    iconUrlKey: "Icon url key",
    iconUrlKeyPlaceholder: "Default Key: url",
    errorIconCollectionUrlTips: "Please enter correct url",
    copySuccessTips: "The icon url has been copied",
    emptyCollectionTitle: "No icon data yet",
    emptyCollectionDesc:
      "Please manually refresh or select a different icon collection",
    refreshBtn: "Manual refresh",
    selectCollectionBtn: "Select a icon collection",
    more: "More",
    useCustomIconCollection: "Use Custom Icon Collection",
    resetDefaultIconCollection: "Reset Default",
    collectionPicker: {
      title: "Select a icon collection",
      cancel: "Cancel",
      confirm: "Confirm",
    },
  },
  themeSettingPage: {
    themeSettingTitle: "Appearance",
    auto: "Auto Switch",
    light: "Light Mode",
    dark: "Dark Mode",
    themePicker: {
      title: "Pick a Theme",
      cancel: "Cancel",
      confirm: "Confirm",
    },
  },
  apiSettingPage: {
    apiSettingTitle: "Backend Setting",
    apiSettingDesc0: `1. When the backend server address is https://api.com, an attempt is made to request https://api.com/api/utils/env to verify backend availability. When the backend server address cannot be added, try accessing this address first.`,
    apiSettingDesc1: `2. HTTPS front-end cannot request non-local HTTP backend(Some browsers also cannot access the local HTTP backend.). Please configure a reverse proxy or host your own HTTP front-end on your LAN.`,
    apiSettingDesc2: `Add the backend server address, such as the backend service built on server/NAS/Android/cloud platform. You can refer to XiaoYi's tutorial on setting up a backend: `,
    currentApi: {
      title: "Current Backend",
    },
    apiList: {
      title: "Backend List",
      desc: "This list is saved locally in the browser. If you change your browser/device, you will need to add it again. Click to switch to the corresponding backend.",
      defaultName: "Default",
      currentTag: "Current",
    },
    addApi: {
      title: "Add New Backend Connection",
      placeholder: {
        name: "Please input backend name, must be unique",
        url: "Please input backend path or address",
      },
      errors: {
        nameEmpty: "Name cannot be empty",
      },
      btn: "Add",
    },
  },
  moreSettingPage: {
    gistUpload: {
      title: 'Gist Upload',
      base64: 'Base64 Encoded',
      plaintext: 'Plaintext(w/o GitHub Token)',
    },
    subProgress: {
      title: "Subscription Progress Style",
      hidden: "Hidden",
      background: "Show As Background",
    },
    moreSettingTitle: "More Setting",
    shareManageTitle: 'Share Management',
    clearData: {
      label: "Clear Backend Data",
      title: "Clear Backend Data",
      content: "Are you sure?",
      conform: "Confirm",
      cancel: "Cancel",
      succeed: "Clear succeed",
      failed: "Clear failed",
    },
    clearFrontEndData: {
      label: "Clear Front-End Data",
      title: "Clear Front-End Data",
      content: "Are you sure?",
      conform: "Confirm",
      cancel: "Cancel",
      succeed: "Clear succeed",
      failed: "Clear failed",
    },
    other: "Other",
    simple: "Simple Mode",
    islr: "Card right swipe to call out",
    isIC: "Use original color for custom icons",
    isDefaultIcon: "Restore default icon",
    isShowIcon: 'Show icon',
    isSubItemMenuFold: "Fold sub item menu",
    isEditorCommon: "Show editor common settings",
    isSimpleReicon: "Show items refresh button",
    isSimpleShowRemarks: "Simple Mode Show items remarks",
    showFloatingRefreshButton: "Show floating refresh button",
    showFloatingAddButton: "Show floating add button",
    displayPreviewInWebPage: 'Display preview in web page',
    tabBar: 'Hide "Sync" Page',
    tabBar2: 'Hide "File" Page',
    auto2: "MoreSetting Key",
    hostapi: "Custom Backend API",
    currentHostApi: "Current Backend API",
    yhostapi: "Default:https://sub.store ",
    serverDesc:
      "Configure the back-end server address, such as the back-end service set up on VPS or Render. After the configuration, restart the Sub Store to take effect. To delete the api, use the original default backend to manually delete the address and click Save",
    InputHostApi: {
      title: "Link validation failed invalid link",
      content:
        "Mainstream browsers have already blocked HTTP requests on HTTPS pages. Please use the HTTPS protocol instead",
    },
  },
  aboutUsPage: {
    projectInfo: {
      title: "Project Info (Please Star 🌟)",
      fe: "Front-End",
      be: "Back-End",
      module: "Module",
      team: "Project Team",
      link: "View on Github",
    },
    changelogs: {
      title: "Changelogs",
    },
  },
  magicPath: {
    title: "Backend Connection Configuration",
    description: "Custom backend configuration needed. Please enter the backend path or address<br><br>Supports three formats:<br>• Path prefix (/path)<br>• Host+path (host:port/path)<br>• Full URL (http(s)://host:port/path)",
    placeholder: "Please enter backend path or address",
    connect: "Connect",
    skip: "Skip",
    info: "You can configure this later in the Backend Settings in the My Profile page",
    customInfo: "Self-Hosted: Backend path can be set via SUB_STORE_FRONTEND_BACKEND_PATH environment variable",
    troubleshooting: 'You may refer to this troubleshooting guide',
    preview: "Preview",
    inputTypes: {
      path: "Path only mode (using current domain)",
      host: "Host+Path mode",
      full: "Full URL mode"
    },
    success: "Connected successfully!",
    errors: {
      empty: "Input cannot be empty",
      invalid: "Invalid backend address",
      connection: "Connection failed, please check if the input is correct",
      unknown: "An unknown error occurred",
      portRequired: "Host format must include port number"
    }
  },
};
