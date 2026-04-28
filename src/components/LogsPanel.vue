<template>
  <div
    class="logs-page-wrapper"
    :class="{ 'is-overlay': isOverlayMode }"
  >
    <Teleport to="body">
      <div
        class="logs-nav-action-layer"
        :class="{ 'is-overlay': isOverlayMode }"
      >
        <button
          v-if="canUseLogs"
          type="button"
          class="logs-nav-action-button logs-refresh-toggle"
          :class="{ loading: isLoading }"
          :style="{ top: navActionOffset }"
          :aria-label="$t('logsPage.refresh')"
          :title="$t('logsPage.refresh')"
          :disabled="isLoading"
          @click="loadLogs()"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
        </button>
        <button
          v-if="logs.length > 0"
          type="button"
          class="logs-nav-action-button logs-selection-toggle"
          :style="{ top: navActionOffset }"
          :aria-label="isSelectionMode ? $t('logsPage.selectMode.cancel') : $t('logsPage.selectMode.enter')"
          :title="isSelectionMode ? $t('logsPage.selectMode.cancel') : $t('logsPage.selectMode.enter')"
          @click="toggleSelectionMode"
        >
          <font-awesome-icon
            :icon="isSelectionMode ? 'fa-solid fa-xmark' : 'fa-solid fa-list-check'"
          />
        </button>
        <button
          v-if="logs.length > 0"
          type="button"
          class="logs-nav-action-button logs-clear-toggle"
          :style="{ top: navActionOffset, right: logsClearButtonRight }"
          :aria-label="$t('logsPage.clear')"
          :title="$t('logsPage.clear')"
          @click="confirmClearLogs"
        >
          <font-awesome-icon icon="fa-solid fa-eraser" />
        </button>
      </div>
    </Teleport>

    <section v-if="canUseLogs" class="logs-controls">
      <div class="logs-search-row">
        <nut-input
          v-model="keywordInput"
          class="logs-input logs-keyword-input"
          :placeholder="$t('logsPage.placeholder.keyword')"
          type="text"
          input-align="left"
          :right-icon="keywordInput ? 'mask-close' : ''"
          right-icon-size="14"
          @click-right-icon="clearKeywordInput"
          @keyup.enter="submitSearch"
        />
        <div class="logs-search-options">
          <nut-checkbox v-model="ignoreCaseSearch">
            {{ $t('logsPage.search.ignoreCase') }}
          </nut-checkbox>
          <nut-checkbox v-model="regexSearch">
            {{ $t('logsPage.search.regex') }}
          </nut-checkbox>
        </div>
      </div>
      <div
        class="logs-refresh-row"
        :class="{ 'has-interval': autoRefresh }"
      >
        <div
          class="logs-input-field"
          :title="limitPlaceholder"
        >
          <span class="logs-input-prefix">
            <font-awesome-icon icon="fa-solid fa-list" />
          </span>
          <nut-input
            v-model="limitInput"
            class="logs-input logs-input-with-prefix"
            :placeholder="limitPlaceholder"
            type="number"
            input-align="left"
            :right-icon="limitInput ? 'mask-close' : ''"
            right-icon-size="14"
            @click-right-icon="clearLimitInput"
            @keyup.enter="submitSearch"
          />
        </div>
        <div
          v-if="autoRefresh"
          class="logs-input-field logs-refresh-interval-field"
          :title="refreshIntervalPlaceholder"
        >
          <span class="logs-input-prefix">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
          </span>
          <nut-input
            v-model="refreshIntervalInput"
            class="logs-input logs-input-with-prefix"
            :placeholder="refreshIntervalPlaceholder"
            type="number"
            input-align="left"
            :right-icon="refreshIntervalInput ? 'mask-close' : ''"
            right-icon-size="14"
            @click-right-icon="clearRefreshIntervalInput"
          />
        </div>
        <label class="logs-auto-refresh">
          <nut-checkbox v-model="autoRefresh">
            {{ $t('logsPage.autoRefresh') }}
          </nut-checkbox>
        </label>
      </div>
    </section>

    <section class="logs-content">
      <div
        v-if="hasLoadedLogs && !isLoading && isBackendVersionUnsupported"
        class="logs-disabled-state"
      >
        <p>
          {{
            $t('logsPage.backendRequired.desc', {
              currentVersion: backendVersion || $t('specificWord.unknown'),
              minVersion: LOGS_BACKEND_MIN_VERSION,
            })
          }}
        </p>
      </div>
      <div
        v-else-if="hasLoadedLogs && !isLoading && isLogsCacheDisabled"
        class="logs-disabled-state"
      >
        <p>{{ $t('logsPage.disabled.desc') }}</p>
        <div class="logs-disabled-alternatives">
          <button
            type="button"
            class="logs-disabled-alternatives-toggle"
            :aria-expanded="showLogAlternatives ? 'true' : 'false'"
            @click="showLogAlternatives = !showLogAlternatives"
          >
            <span class="logs-disabled-alternatives-marker">
              {{ showLogAlternatives ? '▼' : '▶' }}
            </span>
            {{ $t('logsPage.disabled.alternatives.title') }}
          </button>
          <ul v-if="showLogAlternatives">
            <li>{{ $t('logsPage.disabled.alternatives.proxyApp') }}</li>
            <li>{{ $t('logsPage.disabled.alternatives.docker') }}</li>
            <li>{{ $t('logsPage.disabled.alternatives.android') }}</li>
            <li>{{ $t('logsPage.disabled.alternatives.other') }}</li>
          </ul>
        </div>
      </div>
      <nut-empty
        v-else-if="hasLoadedLogs && !isLoading && logs.length === 0"
        image="empty"
        :description="$t('logsPage.empty')"
      />
      <div
        v-else-if="logs.length > 0"
        class="logs-list"
        :class="{ 'is-selection-mode': isSelectionMode }"
        :style="isSelectionMode ? { paddingBottom: `${bottomSafeArea + 108}px` } : undefined"
      >
        <article
          v-for="{ log, display } in displayLogs"
          :key="log.id"
          class="log-item"
          :class="[
            levelClass(log.level),
            {
              selected: isLogSelected(log),
              'is-selection-mode': isSelectionMode,
            },
          ]"
          @click="isSelectionMode && toggleLogSelection(log)"
        >
          <nut-checkbox
            v-if="isSelectionMode"
            :model-value="isLogSelected(log)"
            class="log-select-checkbox"
            @click.stop="toggleLogSelection(log)"
          />
          <div class="log-body">
            <div class="log-header">
              <div class="log-title">
                <time>{{ formatTime(log.time) }}</time>
                <div
                  v-if="display.tags.length > 0"
                  class="log-tags"
                >
                  <button
                    v-for="tag in display.tags"
                    :key="`${tag.type}-${tag.label}`"
                    type="button"
                    class="log-prefix-tag"
                    :class="[
                      `is-${tag.type}`,
                      tag.level ? `is-level-${tag.level}` : '',
                    ]"
                    @click.stop="applyTagFilter(tag)"
                  >
                    {{ tag.label }}
                  </button>
                </div>
              </div>
              <button
                v-if="!isSelectionMode"
                type="button"
                class="log-copy-button"
                :aria-label="$t('logsPage.copy')"
                :title="$t('logsPage.copy')"
                @click.stop="copyLog(log)"
              >
                <font-awesome-icon icon="fa-solid fa-clone" />
              </button>
            </div>
            <pre>{{ display.message }}</pre>
          </div>
        </article>
      </div>
    </section>

    <div
      v-if="isSelectionMode"
      class="logs-selection-actions"
      :style="{ bottom: `${bottomSafeArea + 12}px` }"
    >
      <div class="logs-selection-summary">
        {{ $t('logsPage.selectMode.selectedCount', { count: selectedLogCount }) }}
      </div>
      <nut-button plain size="small" type="primary" @click="toggleSelectAllLogs">
        {{
          isAllLogsSelected
            ? $t('logsPage.selectMode.clearAll')
            : $t('logsPage.selectMode.selectAll')
        }}
      </nut-button>
      <nut-button
        size="small"
        type="primary"
        :disabled="selectedLogCount === 0"
        @click="copySelectedLogs"
      >
        {{ $t('logsPage.selectMode.copy') }}
      </nut-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLogsApi } from "@/api/logs";
import { useGlobalStore } from "@/store/global";
import { useListViewMode } from "@/hooks/useListViewMode";
import { useSettingsStore } from "@/store/settings";
import { useSystemStore } from "@/store/system";
import { useWideScreenNarrowMode } from "@/hooks/useWideScreenNarrowMode";
import { semverGte } from "@/utils/semver";
import { Dialog, Toast } from "@nutui/nutui";
import { useClipboard } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import useV3Clipboard from "vue-clipboard3";

const props = withDefaults(
  defineProps<{
    mode?: "page" | "overlay";
  }>(),
  {
    mode: "page",
  },
);

const { t } = useI18n();
const logsApi = useLogsApi();
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const globalStore = useGlobalStore();
const systemStore = useSystemStore();
const settingsStore = useSettingsStore();
const { showListViewToggle } = useListViewMode();
const { showWideScreenNarrowModeToggle } = useWideScreenNarrowMode();
const { bottomSafeArea } = storeToRefs(globalStore);
const { navBartop, navBarHeight } = storeToRefs(systemStore);
const { logsMaxCount } = storeToRefs(settingsStore);

const DEFAULT_LOGS_MAX_COUNT = 0;
const MAX_LOGS_MAX_COUNT = 10000;
const LOGS_BACKEND_MIN_VERSION = "2.22.7";
const DEFAULT_REFRESH_INTERVAL_SECONDS = 1;
const MIN_REFRESH_LOADING_MS = 600;
const SEARCH_DEBOUNCE_MS = 400;
const LOGS_LIMIT_STORAGE_KEY = "logsPage.limit";
const LOGS_AUTO_REFRESH_STORAGE_KEY = "logsPage.autoRefresh";
const LOGS_REFRESH_INTERVAL_STORAGE_KEY = "logsPage.refreshInterval";
const LOG_MESSAGE_PREFIX_RE = /^\[([^\]]+)\]\s+([A-Z]+):\s*/i;

const logs = ref<DebugLogEntry[]>([]);
const keywordInput = ref("");
const regexSearch = ref(false);
const ignoreCaseSearch = ref(true);
const limitInput = ref("");
const refreshIntervalInput = ref("");
const autoRefresh = ref(false);
const isLoading = ref(false);
const hasLoadedLogs = ref(false);
const refreshTimer = ref<number | null>(null);
const searchDebounceTimer = ref<number | null>(null);
const isSelectionMode = ref(false);
const selectedLogIds = ref<string[]>([]);
const serverLogsMaxCount = ref<number | null>(null);
const showLogAlternatives = ref(false);
const backendVersion = ref<string | null>(null);
const isBackendVersionUnsupported = ref(false);
let latestLoadRequestId = 0;

type LoadLogsOptions = {
  silentInvalidRegex?: boolean;
};

type DisplayLogTag = {
  label: string;
  type: "source" | "level";
  level?: string;
  regex: string;
};

type DisplayLogContent = {
  tags: DisplayLogTag[];
  message: string;
};

type DisplayLogEntry = {
  log: DebugLogEntry;
  display: DisplayLogContent;
};

const normalizePositiveInteger = (value: unknown, fallback: number, max: number) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) return fallback;
  return Math.min(Math.floor(numberValue), max);
};

const normalizeNonNegativeInteger = (value: unknown, fallback: number, max: number) => {
  if (value === null || value === undefined || value === "") return fallback;

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) return fallback;
  return Math.min(Math.floor(numberValue), max);
};

const normalizePositiveInput = (value: string, max: number) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) return "";
  return String(Math.min(Math.floor(numberValue), max));
};

const normalizeRefreshIntervalInput = (value: string) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) return "";
  return String(Math.max(numberValue, 1));
};

const loadLocalPreferences = () => {
  if (typeof window === "undefined") return;

  limitInput.value = normalizePositiveInput(
    window.localStorage.getItem(LOGS_LIMIT_STORAGE_KEY) || "",
    MAX_LOGS_MAX_COUNT,
  );
  refreshIntervalInput.value = normalizeRefreshIntervalInput(
    window.localStorage.getItem(LOGS_REFRESH_INTERVAL_STORAGE_KEY) || "",
  );
  autoRefresh.value =
    window.localStorage.getItem(LOGS_AUTO_REFRESH_STORAGE_KEY) === "1";
};

const saveLocalPreference = (key: string, value: string) => {
  if (typeof window === "undefined") return;

  if (value) {
    window.localStorage.setItem(key, value);
    return;
  }

  window.localStorage.removeItem(key);
};

const configuredLogsMaxCount = computed(() =>
  normalizeNonNegativeInteger(
    logsMaxCount.value,
    DEFAULT_LOGS_MAX_COUNT,
    MAX_LOGS_MAX_COUNT,
  ),
);

const effectiveLogsMaxCount = computed(() =>
  serverLogsMaxCount.value ?? configuredLogsMaxCount.value,
);

const isLogsCacheDisabled = computed(() => effectiveLogsMaxCount.value === 0);
const canUseLogs = computed(
  () => !isBackendVersionUnsupported.value && !isLogsCacheDisabled.value,
);
const isOverlayMode = computed(() => props.mode === "overlay");

const limitPlaceholder = computed(() =>
  t("logsPage.placeholder.limit", { count: effectiveLogsMaxCount.value }),
);

const refreshIntervalPlaceholder = computed(() =>
  t("logsPage.placeholder.refreshInterval", {
    seconds: DEFAULT_REFRESH_INTERVAL_SECONDS,
  }),
);

const normalizedLimit = computed(() => {
  const value = Number(limitInput.value);
  if (!Number.isFinite(value) || value <= 0) return effectiveLogsMaxCount.value;
  return Math.min(Math.floor(value), effectiveLogsMaxCount.value);
});

const normalizedRefreshIntervalMs = computed(() => {
  const value = Number(refreshIntervalInput.value);
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_REFRESH_INTERVAL_SECONDS * 1000;
  }
  return Math.max(Math.floor(value * 1000), 1000);
});

const navActionOffset = computed(() => {
  const navBarHeightNum = Number.parseFloat(navBarHeight.value || "56");
  const navBarTopNum = Number.parseFloat(navBartop.value || "0");
  return `${(navBarHeightNum + navBarTopNum) / 2}px`;
});
const LOG_PANEL_RIGHT_ICON_GAP = 34;
const LOG_PANEL_RIGHT_ICON_BASE_RIGHT = 15;
const logsClearButtonRight = computed(() => {
  if (props.mode === "overlay") {
    return "16px";
  }

  const navIconCount = 2
    + (showWideScreenNarrowModeToggle.value ? 1 : 0)
    + (showListViewToggle.value ? 1 : 0);

  const rightOffset = LOG_PANEL_RIGHT_ICON_BASE_RIGHT
    + navIconCount * LOG_PANEL_RIGHT_ICON_GAP;

  return `${rightOffset}px`;
});

const selectedLogIdSet = computed(() => new Set(selectedLogIds.value));
const selectedLogs = computed(() =>
  logs.value.filter((log) => selectedLogIdSet.value.has(log.id)),
);
const selectedLogCount = computed(() => selectedLogs.value.length);
const isAllLogsSelected = computed(() =>
  logs.value.length > 0 && selectedLogCount.value === logs.value.length,
);
const displayLogs = computed<DisplayLogEntry[]>(() =>
  logs.value.map((log) => ({
    log,
    display: formatLogMessageForDisplay(log.message),
  })),
);

const formatLogMessageForDisplay = (message: string): DisplayLogContent => {
  const rawMessage = `${message || ""}`;
  const match = rawMessage.match(LOG_MESSAGE_PREFIX_RE);
  if (!match) {
    return {
      tags: [],
      message: rawMessage,
    };
  }

  const rawLevel = match[2].trim();
  const level = rawLevel.toUpperCase();
  const source = match[1].trim();
  return {
    tags: [
      {
        label: formatLogPrefixTag(source),
        type: "source",
        regex: `(^|\\n)\\[${escapeRegExp(source)}\\]\\s+`,
      },
      {
        label: level,
        type: "level",
        level: normalizeLogLevelTag(level),
        regex: `(^|\\n)\\[[^\\]]+\\]\\s+${escapeRegExp(rawLevel)}:\\s*`,
      },
    ],
    message: rawMessage.slice(match[0].length),
  };
};

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const formatLogPrefixTag = (value: string) => {
  return value.trim().replace(/\s+/g, "-").toUpperCase();
};

const normalizeLogLevelTag = (value: string) => {
  const level = value.trim().toLowerCase();
  if (level === "warning") return "warn";
  if (["log", "info", "warn", "error", "debug"].includes(level)) {
    return level;
  }
  return "log";
};

const clearKeywordInput = () => {
  keywordInput.value = "";
};

const clearLimitInput = () => {
  limitInput.value = "";
};

const clearRefreshIntervalInput = () => {
  refreshIntervalInput.value = "";
};

const clearSearchDebounceTimer = () => {
  if (searchDebounceTimer.value !== null) {
    window.clearTimeout(searchDebounceTimer.value);
    searchDebounceTimer.value = null;
  }
};

const scheduleSearchLoad = () => {
  clearSearchDebounceTimer();
  searchDebounceTimer.value = window.setTimeout(() => {
    searchDebounceTimer.value = null;
    loadLogs({ silentInvalidRegex: true });
  }, SEARCH_DEBOUNCE_MS);
};

const submitSearch = () => {
  clearSearchDebounceTimer();
  loadLogs();
};

const applyTagFilter = (tag: DisplayLogTag) => {
  keywordInput.value = tag.regex;
  regexSearch.value = true;
  submitSearch();
};

const waitFor = (duration: number) => {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
};

const loadLogs = async (options: LoadLogsOptions = {}) => {
  if (isBackendVersionUnsupported.value) {
    logs.value = [];
    isLoading.value = false;
    hasLoadedLogs.value = true;
    return;
  }

  const requestId = ++latestLoadRequestId;
  const query = buildLogQuery(options);
  if (!query) {
    if (requestId === latestLoadRequestId) {
      isLoading.value = false;
      hasLoadedLogs.value = true;
    }
    return;
  }

  const loadingStartedAt = Date.now();
  isLoading.value = true;
  try {
    const res = await logsApi.getLogs(query);
    if (requestId === latestLoadRequestId && res?.data?.status === "success") {
      const data = (res.data.data || {}) as DebugLogsResponse;
      serverLogsMaxCount.value = normalizeNonNegativeInteger(
        data.maxCount,
        configuredLogsMaxCount.value,
        MAX_LOGS_MAX_COUNT,
      );
      logs.value = data.logs || [];
    }
  } catch (e) {
    Toast.fail(t("logsPage.notify.loadFailed"));
    console.error(e);
  } finally {
    const remainingLoadingTime =
      MIN_REFRESH_LOADING_MS - (Date.now() - loadingStartedAt);
    if (remainingLoadingTime > 0) {
      await waitFor(remainingLoadingTime);
    }
    if (requestId === latestLoadRequestId) {
      isLoading.value = false;
      hasLoadedLogs.value = true;
    }
  }
};

const buildLogQuery = (options: LoadLogsOptions = {}): DebugLogQuery | null => {
  const keyword = keywordInput.value.trim();
  if (keyword && regexSearch.value && !isValidRegex(keyword)) {
    if (!options.silentInvalidRegex) {
      Toast.warn(t("logsPage.notify.invalidRegex"));
    }
    return null;
  }

  return {
    limit: normalizedLimit.value,
    keyword,
    regex: regexSearch.value,
    ignoreCase: ignoreCaseSearch.value,
  };
};

const isValidRegex = (keyword: string) => {
  try {
    new RegExp(keyword, ignoreCaseSearch.value ? "i" : "");
    return true;
  } catch {
    return false;
  }
};

const confirmClearLogs = () => {
  Dialog({
    title: t("logsPage.clear"),
    content: t("logsPage.confirmClear"),
    popClass: "auto-dialog",
    okText: t("logsPage.clear"),
    cancelText: t("myPage.btn.cancel"),
    closeOnPopstate: true,
    lockScroll: false,
    onOk: clearLogs,
  });
};

const clearLogs = async () => {
  const res = await logsApi.clearLogs();
  if (res?.data?.status === "success") {
    logs.value = [];
    Toast.text(t("logsPage.notify.clearSucceed"));
  }
};

const formatLogForCopy = (log: DebugLogEntry) => {
  return `[${formatTime(log.time)}] [${(log.level || "log").toUpperCase()}] ${log.message}`;
};

const copyText = async (text: string) => {
  try {
    if (isSupported) {
      await copy(text);
    } else {
      await copyFallback(text);
    }
    Toast.text(t("logsPage.notify.copySucceed"));
  } catch (e) {
    Toast.fail(t("logsPage.notify.copyFailed", { e: formatError(e) }));
  }
};

const copyLog = async (log: DebugLogEntry) => {
  await copyText(formatLogForCopy(log));
};

const copySelectedLogs = async () => {
  if (selectedLogCount.value === 0) {
    Toast.warn(t("logsPage.selectMode.empty"));
    return;
  }
  await copyText(selectedLogs.value.map(formatLogForCopy).join("\n\n"));
};

const clearSelectedLogs = () => {
  selectedLogIds.value = [];
};

const exitSelectionMode = () => {
  clearSelectedLogs();
  isSelectionMode.value = false;
};

const toggleSelectionMode = () => {
  if (isSelectionMode.value) {
    exitSelectionMode();
    return;
  }
  isSelectionMode.value = true;
};

const isLogSelected = (log: DebugLogEntry) => {
  return selectedLogIdSet.value.has(log.id);
};

const toggleLogSelection = (log: DebugLogEntry) => {
  if (selectedLogIdSet.value.has(log.id)) {
    selectedLogIds.value = selectedLogIds.value.filter((id) => id !== log.id);
    return;
  }
  selectedLogIds.value = [...selectedLogIds.value, log.id];
};

const toggleSelectAllLogs = () => {
  if (isAllLogsSelected.value) {
    clearSelectedLogs();
    return;
  }
  selectedLogIds.value = logs.value.map((log) => log.id);
};

const clearRefreshTimer = () => {
  if (refreshTimer.value !== null) {
    window.clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
};

const restartTimer = () => {
  clearRefreshTimer();
  if (!autoRefresh.value || !canUseLogs.value) return;
  refreshTimer.value = window.setInterval(() => {
    if (!canUseLogs.value) {
      clearRefreshTimer();
      return;
    }

    if (!isLoading.value) {
      loadLogs();
    }
  }, normalizedRefreshIntervalMs.value);
};

const formatTime = (time: number) => {
  if (!time) return "";
  return new Date(time).toLocaleString();
};

const levelClass = (level: string) => {
  return `is-${level || "log"}`;
};

const formatError = (error: unknown) => {
  return error instanceof Error ? error.message : String(error);
};

const ensureLogsBackendVersion = async () => {
  let env = globalStore.env?.backend ? globalStore.env : null;

  try {
    env = await globalStore.setEnv({
      bypassCache: true,
      strict: true,
    });
  } catch (error) {
    console.error(error);
    if (!env?.backend) {
      Toast.fail(t("logsPage.notify.backendCheckFailed"));
      hasLoadedLogs.value = true;
      return false;
    }
  }

  backendVersion.value = env?.version || null;
  isBackendVersionUnsupported.value = !semverGte(
    backendVersion.value,
    LOGS_BACKEND_MIN_VERSION,
  );

  if (isBackendVersionUnsupported.value) {
    logs.value = [];
    clearRefreshTimer();
    hasLoadedLogs.value = true;
    return false;
  }

  return true;
};

watch([keywordInput, regexSearch, ignoreCaseSearch, limitInput], scheduleSearchLoad);
watch(limitInput, (value) => {
  saveLocalPreference(
    LOGS_LIMIT_STORAGE_KEY,
    normalizePositiveInput(value, MAX_LOGS_MAX_COUNT),
  );
});
watch(autoRefresh, (value) => {
  saveLocalPreference(LOGS_AUTO_REFRESH_STORAGE_KEY, value ? "1" : "");
});
watch(refreshIntervalInput, (value) => {
  saveLocalPreference(
    LOGS_REFRESH_INTERVAL_STORAGE_KEY,
    normalizeRefreshIntervalInput(value),
  );
});
watch([autoRefresh, refreshIntervalInput, canUseLogs], restartTimer);
watch(logs, (nextLogs) => {
  const visibleIds = new Set(nextLogs.map((log) => log.id));
  selectedLogIds.value = selectedLogIds.value.filter((id) =>
    visibleIds.has(id),
  );
  if (nextLogs.length === 0) {
    isSelectionMode.value = false;
  }
});

const prepareLogsPage = async () => {
  loadLocalPreferences();

  const canLoadLogs = await ensureLogsBackendVersion();
  if (!canLoadLogs) return;

  try {
    await settingsStore.fetchSettings();
  } catch (e) {
    console.error(e);
  }
  await loadLogs();
};

onMounted(prepareLogsPage);
onUnmounted(() => {
  clearRefreshTimer();
  clearSearchDebounceTimer();
});
</script>

<style lang="scss" scoped>
.logs-page-wrapper {
  min-height: 100%;
  padding: var(--safe-area-side);

  &.is-overlay {
    box-sizing: border-box;
    min-height: 0;
    height: 100%;
    overflow-y: auto;
    background: var(--background-color);
    -webkit-overflow-scrolling: touch;

    .logs-selection-actions {
      z-index: 1007;
    }
  }
}

.logs-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 10px;
}

.logs-nav-action-layer {
  @include centered-fixed-container;
  top: 0;
  z-index: 21;
  pointer-events: none;

  &.is-overlay {
    z-index: 1005;
  }
}

.logs-nav-action-button {
  position: absolute;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--icon-nav-bar-right);
  cursor: pointer;
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 14px !important;
    height: 14px !important;
    font-size: 14px !important;
  }

  &:focus {
    outline: none;
  }
}

.logs-selection-toggle {
  left: 67px;
}

.logs-refresh-toggle {
  left: 37px;

  &.loading svg {
    animation: logs-refresh-spin 0.8s linear infinite;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}

@keyframes logs-refresh-spin {
  to {
    transform: rotate(360deg);
  }
}

.logs-search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  align-items: center;
  gap: 8px;
}

.logs-keyword-input.nut-input {
  flex: 1;
  min-width: 0;
}

.logs-search-options {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
  height: 32px;
  min-height: 32px;
  padding: 0;
  white-space: nowrap;

  :deep(.nut-checkbox__label) {
    font-size: 14px;
  }
}

.logs-refresh-row {
  display: grid;
  grid-template-columns: minmax(72px, 1fr) auto;
  align-items: center;
  gap: 8px;

  &.has-interval {
    grid-template-columns: minmax(72px, 1fr) minmax(148px, 180px) auto;
  }
}

.logs-input.nut-input {
  box-sizing: border-box;
  height: 32px;
  min-height: 32px;
  padding: 0 10px !important;
  border-radius: var(--item-card-radios);
  background: var(--card-color);
  display: flex;
  align-items: center;

  :deep(.nut-input-inner) {
    flex: 1;
    width: 100%;
    min-width: 0;
    height: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    line-height: 32px;
    padding: 0 !important;
  }

  :deep(.nut-input__text),
  :deep(.input-text) {
    flex: 1;
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    height: 32px;
    min-height: 32px;
    line-height: 32px;
    padding: 0 !important;
    font-size: 14px;
  }

  :deep(.nut-input-value),
  :deep(.nut-input-box) {
    flex: 1;
    width: 100%;
    min-width: 0;
    height: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
  }

  :deep(input) {
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 !important;
    margin: 0;
  }

  :deep(.nut-input-clear-box),
  :deep(.nut-input-right-icon) {
    flex: 0 0 16px;
    width: 16px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
  }

  :deep(.nut-input-clear) {
    margin-left: 0;
  }

  :deep(.nut-input-right-icon .nut-icon) {
    color: #c8c9cc;
    cursor: pointer;
  }

  :deep(.nut-input__placeholder) {
    font-size: 14px;
  }
}

.logs-input-field {
  box-sizing: border-box;
  height: 32px;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border-radius: var(--item-card-radios);
  background: var(--card-color);
}

.logs-refresh-interval-field {
  width: 100%;
}

.logs-input-prefix {
  width: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--second-text-color);
  font-size: 12px;
}

.logs-input-with-prefix.nut-input {
  flex: 1;
  min-width: 0;
  padding: 0 !important;
  background: transparent;
}

.logs-auto-refresh {
  display: flex;
  align-items: center;
  color: var(--primary-text-color);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;

  :deep(.nut-checkbox__label) {
    font-size: 14px;
    font-weight: 600;
  }
}

.logs-content {
  padding-bottom: 18px;

  :deep(.nut-empty) {
    background: transparent;
  }

  :deep(.nut-empty-description) {
    color: var(--second-text-color) !important;
  }
}

.logs-disabled-state {
  padding: 18px 14px 8px;
  color: var(--second-text-color);
  font-size: 14px;
  line-height: 1.6;

  p {
    margin: 0;
    white-space: pre-line;
  }
}

.logs-disabled-alternatives {
  margin-top: 14px;
  color: var(--primary-text-color);

  ul {
    margin: 10px 0 0;
    padding-left: 18px;
    color: var(--second-text-color);
  }

  li + li {
    margin-top: 6px;
  }
}

.logs-disabled-alternatives-toggle {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  text-align: left;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
}

.logs-disabled-alternatives-marker {
  display: inline-block;
  width: 14px;
  margin-right: 2px;
  font-size: 10px;
  line-height: 1;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  border: 1px solid var(--divider-color);
  border-radius: var(--item-card-radios);
  background: var(--card-color);

  &.is-selection-mode {
    cursor: pointer;
  }

  &.selected {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
}

.log-select-checkbox {
  flex: 0 0 auto;
  margin: 12px 0 0 10px;
}

.log-body {
  min-width: 0;
  flex: 1;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 34px;
  padding: 4px 10px;
  border-bottom: 1px solid var(--divider-color);
  color: var(--second-text-color);
  font-size: 12px;
  line-height: 1.2;
}

.log-title {
  min-width: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.log-tags {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.log-prefix-tag {
  appearance: none;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: 18px;
  padding: 0 6px;
  border: 1px solid currentColor;
  border-radius: 4px;
  background: transparent;
  font-family: "JetBrains Mono NL", monospace;
  font-size: 10px;
  font-weight: 700;
  line-height: 18px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.82;
  }

  &.is-source {
    color: var(--second-text-color);
  }

  &.is-level-log {
    color: #8b949e;
  }

  &.is-level-info {
    color: #3b82f6;
  }

  &.is-level-warn {
    color: #f59e0b;
  }

  &.is-level-error {
    color: #ef4444;
  }

  &.is-level-debug {
    color: #a855f7;
  }
}

.log-copy-button {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--second-text-color);
  cursor: pointer;

  &:hover,
  &:focus {
    color: var(--primary-color);
    background: var(--divider-color);
  }

  :deep(svg) {
    width: 14px !important;
    height: 14px !important;
    font-size: 14px !important;
  }
}

.log-body pre {
  margin: 0;
  padding: 10px;
  color: var(--primary-text-color);
  font-family: "JetBrains Mono NL", monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  user-select: text;
}

.logs-selection-actions {
  @include centered-fixed-container;
  width: calc(100% - 1.5rem);
  max-width: calc(100% - 1.5rem);
  z-index: 1000;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: var(--popup-color);
  box-shadow: 0 8px 24px #0003;

  @media screen and (min-width: 600px) {
    max-width: calc(85% - 1.5rem);
  }

  @media screen and (min-width: 768px) {
    max-width: calc(#{$container-width-md} - 1.5rem);
  }

  @media screen and (min-width: 900px) {
    max-width: calc(#{$container-width-lg} - 1.5rem);
  }

  @media screen and (min-width: 1200px) {
    max-width: calc(#{$container-width-xl} - 1.5rem);
  }
}

.logs-selection-summary {
  flex: 1;
  min-width: 0;
  color: var(--primary-text-color);
  font-weight: bold;
}
</style>
