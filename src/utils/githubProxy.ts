type MaybeUrl = string | null | undefined;

const HTTP_URL_RE = /^https?:\/\//i;

const identity = (url: MaybeUrl) => url;

const createGithubProxyMatcher = (pattern: string) => {
  try {
    return new RegExp(pattern, "i");
  } catch {
    return null;
  }
};

export const createGithubProxyUrlRewriter = (
  githubProxy?: string | null,
  githubProxyRegex?: string | null,
) => {
  const proxyBase = githubProxy?.trim().replace(/\/+$/, "");
  const regexPattern = githubProxyRegex?.trim();

  if (!proxyBase || !regexPattern || !HTTP_URL_RE.test(proxyBase)) {
    return identity;
  }

  const matcher = createGithubProxyMatcher(regexPattern);

  if (!matcher) {
    return identity;
  }

  const proxiedPrefix = `${proxyBase}/`;

  return (candidateUrl: MaybeUrl) => {
    if (!candidateUrl || !HTTP_URL_RE.test(candidateUrl)) {
      return candidateUrl;
    }

    if (candidateUrl === proxyBase || candidateUrl.startsWith(proxiedPrefix)) {
      return candidateUrl;
    }

    if (!matcher.test(candidateUrl)) {
      return candidateUrl;
    }

    return `${proxyBase}/${candidateUrl}`;
  };
};
