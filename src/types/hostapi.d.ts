type HostAPI = {
  name: string;
  url: string;
  bearer_token: string;
  d_token: string;
};

type HostAPIStorage = {
  current: string;
  apis: HostAPI[];
};
