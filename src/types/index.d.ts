type SubsType = 'sub' | 'collection';

interface ErrorResponse {
  status: 'failed';
  error: {
    code: string;
    type: string;
    message: string;
    detail?: string;
  };
}
