interface GlobalStoreState {
  isLoading: boolean;
  isDefaultIcon: boolean;
  isFlowFetching: boolean;
  fetchResult: boolean;
  bottomSafeArea: number;
  isDarkMode: boolean;
  env: ENV;
  isDockerDeployment: boolean;
  isSimpleMode: boolean;
  isLeftRight: boolean;
  isIconColor: boolean;
  isEditorCommon: boolean;
  isSimpleReicon: boolean;
  showFloatingRefreshButton: boolean;
  istabBar: boolean;
  istabBar2: boolean;
  ishostApi: string;
  savedPositions: any;
  subProgressStyle: any;
  gistUpload: any;
  defaultIconCollection: string;
  defaultIconCollections?: any;
  customIconCollections?: any[];
}

interface ENV {
  meta?: any;
  hasNewVersion?: boolean;
  latestVersion?: string;
  version?: string;
  feature?: any;
  backend?:
    | 'sing-box'
    | 'Stash'
    | 'QX'
    | 'Loon'
    | 'Surge'
    | 'ShadowRocket'
    | 'Egern'
    | 'Clash'
    | 'ClashMeta'
    | 'V2Ray'
    | 'Node';
}
