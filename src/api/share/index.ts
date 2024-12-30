import type { AxiosPromise } from "axios";

import request from "@/api";

export function useShareApi() {
  return {
    createShare: (data: ShareToken): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/token`,
        method: "post",
        data,
      });
    },
    deleteShare: (token: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/token/${encodeURIComponent(token)}`,
        method: "delete",
      });
    },
    getShares: (type?: string, name?: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/tokens`,
        method: "get",
        params: { type, name },
      });
    },
  };
}
