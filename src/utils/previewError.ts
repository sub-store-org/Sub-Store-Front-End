type PreviewErrorResponse = {
  status?: number | string;
  statusText?: string;
  data?: unknown;
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const stringifyPreviewErrorData = (data: unknown) => {
  if (data == null) return "";

  if (typeof data === "string") {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }

  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

const getPreviewErrorResponse = (error: unknown): PreviewErrorResponse | undefined => {
  if (!isObject(error)) return undefined;

  if (isObject(error.response)) {
    return error.response as PreviewErrorResponse;
  }

  if ("data" in error) {
    return error as PreviewErrorResponse;
  }

  return undefined;
};

export const formatPreviewError = (error: unknown) => {
  const response = getPreviewErrorResponse(error);
  const data = stringifyPreviewErrorData(response?.data);

  if (response) {
    const status = [response.status, response.statusText].filter(Boolean).join(" ");
    return `Error: ${status || "请求失败"}${data ? `\n\n${data}` : ""}`;
  }

  const message = isObject(error) && typeof error.message === "string"
    ? error.message
    : String(error ?? "请求失败");

  return `Error: ${message}`;
};
