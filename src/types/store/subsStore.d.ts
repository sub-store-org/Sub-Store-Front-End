interface SubsStoreState {
  subs: SubsDict;
  collections: CollectionsDict;
  flows: FlowsDict;
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

type GetOneData<T extends SubsData | CollectionsData> = (name: string) => T;

interface FlowsDict {
  [key: string]: FlowData | ErrorResponse;
}

interface FlowData {
  status: 'success';
  data: {
    expires: number;
    total: number;
    usage: {
      upload: number;
      download: number;
    };
  };
}
