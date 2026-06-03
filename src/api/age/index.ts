import type { AxiosPromise } from "axios";

import request from "@/api";

export function useAgeApi() {
  return {
    generateKeyPair: (type: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: "/api/utils/age/key-pair",
        method: "post",
        data: { type },
      });
    },
    derivePublicKey: (secretKey: string): AxiosPromise<MyAxiosRes> => {
      return request({
        url: "/api/utils/age/public-key",
        method: "post",
        data: { "age-secret-key": secretKey },
      });
    },
  };
}
