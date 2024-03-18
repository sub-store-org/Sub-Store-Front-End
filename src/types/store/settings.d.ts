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
  githubUser?: string;
  defaultUserAgent?: string;
  defaultTimeout?: string;
  cacheThreshold?: string;
  theme?: {
    auto: boolean;
    name?: CustomTheme;
    dark: CustomTheme;
    light: CustomTheme;
  };
}

interface StoragePostData {
  content: String;
}

type CustomTheme = "light" | "dark";
