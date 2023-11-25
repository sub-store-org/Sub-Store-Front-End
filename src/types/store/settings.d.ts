type SettingsStoreState = SettingsBase & SettingsPostData;

interface SettingsBase {
  syncTime: number;
  avatarUrl: string;
  artifactStore: string;
  // ishostApi: string;
}

interface SettingsPostData {
  gistToken?: string;
  githubUser?: string;
  defaultUserAgent?: string;
  theme?: {
    auto: boolean;
    name?: CustomTheme;
    dark: CustomTheme;
    light: CustomTheme;
  };
  autoDownloadGistSync?: boolean;
}

type CustomTheme = 'light' | 'dark';
