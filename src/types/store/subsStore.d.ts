interface SubsStoreState {
  subs: Sub[];
  collections: Collection[];
  flows: FlowsDict;
  files: any[];
}

interface FlowsDict {
  [key: string]: Flow | ErrorResponse;
}

// 结构有点乱 太难定义
// type Process1 = {
//   key: string;
//   value: boolean;
// };
//
// type Process2 = {
//   [key: string]: string;
// };

type ProcessArg = any;

interface Process {
  type: string;
  id?: string;
  customName?: string;
  args?: ProcessArg;
}

interface Sub {
  name: string;
  content?: string;
  displayName?: string;
  url?: string;
  source: 'remote' | 'local';
  icon?: string;
  ua?: string;
  mergeSources?: string;
  subUserinfo?: string;
  tag?: string[];
  process: Process[];
}

interface Collection {
  name: string;
  displayName?: string;
  process: Process[];
  subscriptions: string[];
  subscriptionTags?: string[];
  icon?: string;
  tag?: string[];
}

interface Artifacts {
  name: string;
  displayName?: string;
  type: string;
  source: string;
  platform: string;
  sync:boolean;
  updated:number;
  url:string;
}

interface Flow {
  status: 'success' | 'noFlow';
  showRemaining?: boolean;
  hideExpire?: boolean;
  data: {
    remainingDays?: number;
    expires?: number;
    total: number;
    usage: {
      upload: number;
      download: number;
    };
  };
}

type GetOne<T extends Sub | Collection> = (name: string) => T;
