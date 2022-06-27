interface SubsStoreState {
  subs: SubsDict;
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

interface SubsProcess {
  type: string;
  args: SubsProcessArgs[];
}

interface SubsProcessArgs {
  [key: string]: any;
}
