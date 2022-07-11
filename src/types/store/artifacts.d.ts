interface ArtifactsStoreState {
  artifacts: Artifact[];
}

type ArtifactsPlatform =
  | 'Surge'
  | 'QX'
  | 'Loon'
  | 'Clash'
  | 'Stash'
  | 'ShadowRocket';

type ArtifactType = 'collection' | 'subscription';

interface Artifact {
  name: string;
  displayName?: string;
  type: ArtifactType;
  source: string;
  platform: ArtifactsPlatform;
  sync?: boolean;
  updated?: number;
  url?: string;
}

interface ArtifactForm {
  name: string;
  displayName?: string;
  type: ArtifactType;
  source: [string, string];
  platform: ArtifactsPlatform;
  sync?: boolean;
  updated?: number;
  url?: string;
}
