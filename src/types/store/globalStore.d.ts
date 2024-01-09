interface GlobalStoreState {
  isLoading: boolean;
  isFlowFetching: boolean;
  fetchResult: boolean;
  bottomSafeArea: number;
  isDarkMode: boolean;
  env: ENV;
  isSimpleMode: boolean;
  isLeftRight: boolean;
  isIconColor: boolean;
  isEditorCommon: boolean;
  isSimpleReicon: boolean;
  showFloatingRefreshButton: boolean;
  istabBar: boolean;
  ishostApi: string;
}

interface ENV {
  hasNewVersion?: boolean;
  latestVersion?: string;
  version?: string;
  backend?:
    | 'Stash'
    | 'QX'
    | 'Loon'
    | 'Surge'
    | 'ShadowRocket'
    | 'Clash'
    | 'ClashMeta'
    | 'V2Ray'
    | 'Node';
}
