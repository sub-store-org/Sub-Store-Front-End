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
};
