interface SubsStoreState {
  subs: Sub[];
  collections: Collection[];
  flows: FlowsDict;
  files: any[];
  shares: Share[];
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
  remark?: string;
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
  remark?: string;
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
    planName?: string;
    appUrl?: string;
    remainingDays?: number;
    expires?: number;
    total: number;
    usage: {
      upload: number;
      download: number;
    };
  };
}

interface Share {
  type?: 'sub' | 'col'| 'file',
  name?: string;
  displayName?: string | null;
  remark?: string | null;
  token?: string | null;
  expiresIn?: string | null;
  exp?: number | null;
  createdAt?: number | null;
}

interface ShareToken {
  payload: Share;
  options?: {
    expiresIn: number | string | undefined;
  }
}

type GetOne<T extends Sub | Collection | Share> = (name: string) => T;
