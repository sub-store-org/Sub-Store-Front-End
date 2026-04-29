type CreateItemPosition = 'top' | 'bottom';
type ListPageViewMode = 'single-column' | 'dual-column';

type SettingsStoreState = SettingsBase & SettingsPostData;

interface SettingsBase {
  syncTime: number;
  avatarUrl: string;
  artifactStore: string;
  artifactStoreStatus?: string;
  // ishostApi: string;
}

interface SettingsPostData {
  syncPlatform?: string;
  gistToken?: string;
  githubProxy?: string;
  githubProxyRegex?: string;
  githubUser?: string;
  defaultProxy?: string;
  defaultUserAgent?: string;
  defaultFlowUserAgent?: string;
  defaultTimeout?: string;
  cacheThreshold?: string;
  resourceCacheTtl?: string;
  headersCacheTtl?: string;
  scriptCacheTtl?: string;
  logsMaxCount?: string;
  theme?: {
    auto: boolean;
    name?: CustomTheme;
    dark: CustomTheme;
    light: CustomTheme;
  };
  gistUpload?: base64 | plaintext;
  appearanceSetting?: {
    isSimpleMode?: boolean; // 简洁模式
    isLeftRight?: boolean; // 卡片右滑呼出
    isDefaultIcon?: boolean; // 恢复默认图标
    isShowIcon?: boolean; // 展示图标
    isIconColor?: boolean; // 自定义图标使用原始颜色
    isEditorCommon?: boolean; // 展示编辑页常用配置
    isSimpleReicon?: boolean; // 展示订阅刷新按钮
    isSimpleShowRemark?: boolean; // 展示简洁模式下的备注
    isSubItemMenuFold?: boolean; // 订阅项菜单折叠
    showFloatingRefreshButton?: boolean; // 显示悬浮刷新按钮
    showFloatingAddButton?: boolean; // 显示悬浮添加按钮
    createItemPosition?: CreateItemPosition; // 新建条目插入位置
    displayPreviewInWebPage?: boolean; // 在网页中预览
    invalidShareFakeNode?: boolean; // 无效分享返回假节点(防客户端缓存)
    istabBar?: boolean; // 隐藏 "Gist 同步" 页
    istabBar2?: boolean; // 隐藏 "文件" 页
    subProgressStyle?: string; // 订阅进度样式
    listPageViewMode?: ListPageViewMode; // 列表页视图模式
    listPageViewModeInWideScreenNarrowMode?: ListPageViewMode; // 宽屏窄导航下列表页视图模式
    useNarrowModeOnWideScreen?: boolean; // 宽屏下使用窄屏导航模式
  },
}

interface StoragePostData {
  content: String;
}

type CustomTheme = "light" | "dark";
