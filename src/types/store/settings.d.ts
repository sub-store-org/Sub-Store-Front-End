interface SettingsStoreState {
  gistToken: string;
  githubUser: string;
  syncTime: number;
  theme: {
    name: CustomTheme;
    config?: ThemesConfig<name>;
  };
  avatarUrl: string;
  artifactStore: string;
}

interface SettingsPostData {
  gistToken?: string;
  githubUser?: string;
  theme?: {
    name: CustomTheme;
    config?: ThemesConfig<name>;
  };
}

type CustomTheme = 'light' | 'dark' | 'auto';
type ThemesConfig<T> = T extends 'auto'
  ? { dark: CustomTheme; light: CustomTheme }
  : never;
