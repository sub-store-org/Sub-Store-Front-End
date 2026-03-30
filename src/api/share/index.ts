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
    deleteShare: (
      token: string,
      type: string,
      name: string,
      mode?: DeleteMode,
    ): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/token/${encodeURIComponent(token)}`,
        method: "delete",
        params: mode ? { type, name, mode } : { type, name },
      });
    },
    getShares: (type?: string, name?: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/tokens`,
        method: "get",
        params: { type, name },
      });
    },
    sortShares: (data: string[]): AxiosPromise<MyAxiosRes> => {
      return request({
        url: `/api/sort/tokens`,
        method: "post",
        data,
      });
    },
  };
}
