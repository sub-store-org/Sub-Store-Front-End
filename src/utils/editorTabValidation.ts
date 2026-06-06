type ValidationErrorLike = {
  prop?: unknown;
  field?: unknown;
};

const getValidationErrorKey = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const { prop, field } = error as ValidationErrorLike;
  if (typeof prop === "string" && prop) {
    return prop;
  }
  if (typeof field === "string" && field) {
    return field;
  }

  return undefined;
};

export const getEditorTabForValidationErrors = <T extends string>(
  errors: unknown,
  propToTabMap: Partial<Record<string, T>>,
) => {
  if (!Array.isArray(errors)) {
    return undefined;
  }

  for (const error of errors) {
    const key = getValidationErrorKey(error);
    if (!key) {
      continue;
    }

    const tab = propToTabMap[key];
    if (tab) {
      return tab;
    }
  }

  return undefined;
};
