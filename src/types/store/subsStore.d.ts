interface SubsStoreState {
  subs: SubsDict;
  collections: CollectionsDict;
}

interface SubsDict {
  [key: string]: SubsData;
}

interface SubsData {
  name: string;
  content?: string;
  displayName?: string;
  url?: string;
  source: 'remote' | 'local';
  icon?: string;
  ua?: string;
  process: SubsProcess[];
}

interface CollectionsDict {
  [key: string]: CollectionsData;
}

interface CollectionProcessId {
  id: string;
}

interface CollectionsData {
  name: string;
  displayName?: string;
  process: Array<SubsProcess & CollectionProcessId>;
  subscriptions: string[];
  ua?: string;
}

interface SubsProcess {
  type: string;
  args: SubsProcessArgs[];
}

interface SubsProcessArgs {
  [key: string]: any;
}
