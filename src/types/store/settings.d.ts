interface SettingsStoreState {
  gistToken: string;
  githubUser: string;
  syncTime: number;
  theme: {
    darkMode: boolean;
  };
  avatarUrl: string;
  artifactStore: string;
}

interface SettingsPostData {
  gistToken: string;
  githubUser: string;
}
