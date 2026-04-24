import type { Router } from "vue-router";

export const LOGS_PATH = "/logs";
export const FLOATING_LOGS_PREVIOUS_ROUTE_KEY = "floatingLogs.previousRoute";
export const FLOATING_LOGS_FALLBACK_PATH = "/my";

export const setFloatingLogsPreviousRoute = (route: string) => {
  sessionStorage.setItem(FLOATING_LOGS_PREVIOUS_ROUTE_KEY, route);
};

export const getFloatingLogsPreviousRoute = () => {
  return sessionStorage.getItem(FLOATING_LOGS_PREVIOUS_ROUTE_KEY);
};

export const clearFloatingLogsPreviousRoute = () => {
  sessionStorage.removeItem(FLOATING_LOGS_PREVIOUS_ROUTE_KEY);
};

export const closeFloatingLogs = async (router: Router) => {
  const previousRoute = getFloatingLogsPreviousRoute();
  const historyBack = router.options.history.state.back;

  if (previousRoute && !previousRoute.startsWith(LOGS_PATH)) {
    if (historyBack === previousRoute) {
      router.back();
      window.setTimeout(clearFloatingLogsPreviousRoute, 50);
      return;
    }

    await router.replace(previousRoute);
    clearFloatingLogsPreviousRoute();
    return;
  }

  if (historyBack) {
    router.back();
    window.setTimeout(clearFloatingLogsPreviousRoute, 50);
    return;
  }

  await router.push(FLOATING_LOGS_FALLBACK_PATH);
  clearFloatingLogsPreviousRoute();
};
