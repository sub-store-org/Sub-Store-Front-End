type HostAPI = {
  name: string;
  url: string;
  shareBaseUrl?: string;
};

type HostAPIStorage = {
  current: string;
  apis: HostAPI[];
};
