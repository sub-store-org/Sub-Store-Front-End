import { useAgeApi } from "@/api/age";

export const AGE_PUBLIC_KEY = "age-public-key";
export const AGE_SECRET_KEY = "age-secret-key";

export const AGE_KEY_TYPES = {
  X25519: "x25519",
  HYBRID: "mlkem768-x25519",
} as const;

export type AgeKeyType = typeof AGE_KEY_TYPES[keyof typeof AGE_KEY_TYPES];

export interface AgeKeyPair {
  type: AgeKeyType;
  [AGE_PUBLIC_KEY]: string;
  [AGE_SECRET_KEY]: string;
}

const ageApi = useAgeApi();

function unwrapAgeData<T>(payload: MyAxiosRes) {
  if (payload.status !== "success") {
    throw new Error(payload.error?.message || "age key 操作失败");
  }
  return payload.data as T;
}

export async function generateKeyPair(type: AgeKeyType = AGE_KEY_TYPES.X25519) {
  const response = await ageApi.generateKeyPair(type);
  return unwrapAgeData<AgeKeyPair>(response.data);
}

export async function derivePublicKey(identity: string) {
  const response = await ageApi.derivePublicKey(identity);
  return unwrapAgeData<{ [AGE_PUBLIC_KEY]: string }>(response.data)[AGE_PUBLIC_KEY];
}
