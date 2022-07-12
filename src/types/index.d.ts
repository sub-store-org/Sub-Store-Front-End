type SubsType = 'sub' | 'collection';

type MyAxiosRes = ErrorResponse | SucceedResponse;

interface ErrorResponse {
  status: 'failed';
  error: {
    code: string;
    type: string;
    message: string;
    details?: string;
  };
}

interface SucceedResponse {
  status: 'success';
  data?: any;
}

interface IpApiData {
  shareUrl: string;
  info: {
    query: string;
    status: string;
    continent: string;
    continentCode: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    district: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    offset: number;
    currency: string;
    isp: string;
    org: string;
    as: string;
    asname: string;
    mobile: boolean;
    proxy: boolean;
    hosting: boolean;
  };
}

interface IpApiResponse {
  status: 'success' | 'failed';
  data: IpApiData;
}

interface NodeInfo {
  name: string;
  server: string;
  port: number;
  id: number;
  password?: string;
  UUID?: string;
  tls?: boolean;
  'skip-cert-verify'?: boolean;
  tfo?: boolean;
  udp?: boolean;
  type?:
    | 'trojan'
    | 'ss'
    | 'socks5'
    | 'http'
    | 'shadowsocks'
    | 'vmess'
    | 'custom';
}
