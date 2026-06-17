type NotifyType = "primary" | "success" | "danger" | "warning";

type Notify = (settings: {
  title: string;
  content?: string;
  type?: NotifyType;
  duration?: number;
}) => void;

type Translate = (key: string) => string;

const dynamicImportErrorPatterns = [
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Failed to load module script/i,
  /Loading chunk .+ failed/i,
  /ChunkLoadError/i,
];

const getErrorText = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.name}\n${error.message}\n${error.stack || ""}`;
  }

  return String(error || "");
};

export const isDynamicImportFailure = (error: unknown) => {
  const message = getErrorText(error);
  return dynamicImportErrorPatterns.some(pattern => pattern.test(message));
};

export const resetPwaCacheAndReload = async ({
  notify,
  t,
  reloadDelay = 1000,
}: {
  notify?: Notify;
  t?: Translate;
  reloadDelay?: number;
} = {}) => {
  const translate = t || ((key: string) => key);

  notify?.({
    title: translate("globalNotify.refresh.rePwaing"),
    type: "primary",
  });

  const unregisterServiceWorkers = async () => {
    if (!("serviceWorker" in navigator)) return;

    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.allSettled(registrations.map(registration => registration.unregister()));
  };

  const deleteCaches = async () => {
    if (!("caches" in window)) return;

    const cacheNames = await caches.keys();
    await Promise.allSettled(cacheNames.map(cacheName => caches.delete(cacheName)));
  };

  await Promise.allSettled([
    unregisterServiceWorkers(),
    deleteCaches(),
  ]);

  notify?.({
    title: translate("globalNotify.refresh.rePwa"),
    type: "primary",
  });

  setTimeout(() => {
    window.location.reload();
  }, reloadDelay);
};
