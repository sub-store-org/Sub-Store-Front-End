interface SubsStoreState {
  subs: SubsDict<Sub>;
  collections: SubsDict<Collection>;
  flows: FlowsDict;
}

interface SubsDict<T> {
  [key: string]: T;
}

interface FlowsDict {
  [key: string]: Flow | ErrorResponse;
}

interface ProcessArg {
  [key: string]: any;
}

interface Process {
  type: string;
  args: ProcessArg[];
}
interface Sub {
  name: string;
  content?: string;
  displayName?: string;
  url?: string;
  source: 'remote' | 'local';
  icon?: string;
  ua?: string;
  process: Process[];
}

interface Collection {
  name: string;
  displayName?: string;
  process: Process[];
  subscriptions: string[];
  ua?: string;
}

interface Flow {
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

type GetOne<T extends Sub | Collection> = (name: string) => T;
