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
  data: any;
}
