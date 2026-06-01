const DEFAULT_FRONTEND_REQUEST_CONCURRENCY = 3;
const DEFAULT_FRONTEND_REQUEST_WAIT_TIME = 0;

let activeRequestCount = 0;
let requestSequence = 0;
let pendingRequestSequence = 0;

type PendingRequestResolver = {
  order: number;
  priority: number;
  resolve: () => void;
};

const pendingRequestResolvers: PendingRequestResolver[] = [];

type FrontendRequestTask = {
  label: string;
  task: () => Promise<any>;
};

type FrontendRequestTasksOptions = {
  priority?: number;
  signal?: AbortSignal;
};

export const getFrontendRequestConcurrency = () => {
  const storedConcurrency = localStorage.getItem('concurrency')?.trim();
  const concurrency = storedConcurrency ? Number(storedConcurrency) : DEFAULT_FRONTEND_REQUEST_CONCURRENCY;

  return Number.isInteger(concurrency) && concurrency >= 1
    ? concurrency
    : DEFAULT_FRONTEND_REQUEST_CONCURRENCY;
};

export const getFrontendRequestWaitTime = () => {
  const storedWaitTime = localStorage.getItem('concurrencyWaitTime')?.trim();
  const waitTime = storedWaitTime ? Number(storedWaitTime) : DEFAULT_FRONTEND_REQUEST_WAIT_TIME;

  return Number.isInteger(waitTime) && waitTime >= 0
    ? waitTime
    : DEFAULT_FRONTEND_REQUEST_WAIT_TIME;
};

export const isAbortError = (error: unknown) => {
  const abortError = error as {
    __CANCEL__?: boolean;
    code?: string;
    message?: string;
    name?: string;
  };

  return abortError?.name === 'AbortError'
    || abortError?.name === 'CanceledError'
    || abortError?.code === 'ERR_CANCELED'
    || abortError?.message === 'canceled'
    || abortError?.__CANCEL__ === true;
};

const createAbortError = () => {
  const error = new Error('Frontend request task aborted');
  error.name = 'AbortError';
  return error;
};

const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw createAbortError();
  }
};

const wait = (ms: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  throwIfAborted(signal);

  const timeout = setTimeout(() => {
    signal?.removeEventListener('abort', onAbort);
    resolve();
  }, ms);

  const onAbort = () => {
    clearTimeout(timeout);
    reject(createAbortError());
  };

  signal?.addEventListener('abort', onAbort, { once: true });
});

const logRequestQueueState = (
  phase: string,
  id: number,
  label: string,
  extra: Record<string, string | number> = {},
) => {
  const extraText = Object.entries(extra)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');

  console.log(
    [
      '[frontend-request-concurrency]',
      new Date().toISOString(),
      phase,
      `#${id}`,
      label,
      `active=${activeRequestCount}/${getFrontendRequestConcurrency()}`,
      `pending=${pendingRequestResolvers.length}`,
      extraText,
    ].filter(Boolean).join(' '),
  );
};

const resolveNextPendingRequest = () => {
  if (pendingRequestResolvers.length === 0) return;

  let nextIndex = 0;
  for (let index = 1; index < pendingRequestResolvers.length; index++) {
    const candidate = pendingRequestResolvers[index];
    const current = pendingRequestResolvers[nextIndex];

    if (
      candidate.priority > current.priority
      || (candidate.priority === current.priority && candidate.order < current.order)
    ) {
      nextIndex = index;
    }
  }

  const [nextResolver] = pendingRequestResolvers.splice(nextIndex, 1);
  nextResolver.resolve();
};

const waitForRequestSlot = async (signal?: AbortSignal, priority = 0) => {
  throwIfAborted(signal);

  while (activeRequestCount >= getFrontendRequestConcurrency()) {
    await new Promise<void>((resolve) => {
      let pendingResolver: PendingRequestResolver;

      const onAbort = () => {
        const resolverIndex = pendingRequestResolvers.indexOf(pendingResolver);
        if (resolverIndex !== -1) {
          pendingRequestResolvers.splice(resolverIndex, 1);
        }
        resolve();
      };

      pendingResolver = {
        order: ++pendingRequestSequence,
        priority,
        resolve: () => {
          signal?.removeEventListener('abort', onAbort);
          resolve();
        },
      };

      pendingRequestResolvers.push(pendingResolver);
      signal?.addEventListener('abort', onAbort, { once: true });
    });

    throwIfAborted(signal);
  }

  activeRequestCount++;
};

const releaseRequestSlot = () => {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  resolveNextPendingRequest();
};

export const runFrontendRequestTask = async <T>(
  task: () => Promise<T>,
  label = 'request',
  options: FrontendRequestTasksOptions = {},
): Promise<T> => {
  const requestId = ++requestSequence;
  const queuedAt = Date.now();
  let hasRequestSlot = false;

  logRequestQueueState('queued', requestId, label, {
    priority: options.priority ?? 0,
  });

  try {
    await waitForRequestSlot(options.signal, options.priority ?? 0);
    hasRequestSlot = true;

    const startedAt = Date.now();
    const waitTime = getFrontendRequestWaitTime();
    logRequestQueueState('start', requestId, label, {
      waitMs: startedAt - queuedAt,
      waitTimeMs: waitTime,
    });

    if (waitTime > 0) {
      await wait(waitTime, options.signal);
    }
    const result = await task();
    logRequestQueueState('success', requestId, label, {
      durationMs: Date.now() - startedAt,
    });
    return result;
  } catch (error) {
    logRequestQueueState(isAbortError(error) ? 'abort' : 'error', requestId, label);
    throw error;
  } finally {
    if (hasRequestSlot) {
      releaseRequestSlot();
      logRequestQueueState('end', requestId, label);
    }
  }
};

export const runFrontendRequestTasks = (
  tasks: FrontendRequestTask[],
  options: FrontendRequestTasksOptions = {},
) => Promise.all(
  tasks.map(({ label, task }) => runFrontendRequestTask(task, label, options)),
);
