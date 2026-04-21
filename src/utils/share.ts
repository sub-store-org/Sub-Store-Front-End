import dayjs from 'dayjs';

import { semverGte } from '@/utils/semver';

export const isShareType = (value: unknown): value is 'sub' | 'col' | 'file' => {
  return value === 'sub' || value === 'col' || value === 'file';
};

export const SHARE_EDITOR_CREATE_ID = 'UNTITLED';
export const SHARE_EXPIRATION_DATETIME_BACKEND_VERSION = '2.22.6';

export type ShareExpirationMode = 'duration' | 'datetime';
export type ShareExpirationUnit = 'day' | 'month' | 'season' | 'year';

const DEFAULT_SHARE_EXPIRATION_MODE: ShareExpirationMode = 'duration';
const DEFAULT_SHARE_EXPIRATION_UNIT: ShareExpirationUnit = 'day';
const SHARE_DISPLAY_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm';
const SHARE_DURATION_MS_UNIT_MAP: Record<ShareExpirationUnit, number> = {
  day: 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  season: 90 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};
const SHARE_DURATION_MS_DAY = 24 * 60 * 60 * 1000;

const formatDurationValue = (value: number) => {
  return Number(value.toFixed(2));
};

const parseMillisecondsDuration = (
  durationMs: number,
): { value: number; unit: ShareExpirationUnit } | null => {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return null;
  }

  const exactUnits: ShareExpirationUnit[] = ['year', 'season', 'month', 'day'];
  for (const unit of exactUnits) {
    const unitMs = SHARE_DURATION_MS_UNIT_MAP[unit];
    if (Number.isInteger(durationMs / unitMs)) {
      return {
        value: formatDurationValue(durationMs / unitMs),
        unit,
      };
    }
  }

  return null;
};

export interface ShareExpirationFormState {
  mode: ShareExpirationMode;
  expiresValue: string;
  expiresUnit: ShareExpirationUnit;
  exactDatetime: number | null;
}

interface ShareIconSourceLike {
  icon?: string | null;
  isIconColor?: boolean | null;
}

export interface ShareDisplayIconState {
  icon: string;
  isIconColor: boolean;
}

export const isShareExpirationMode = (value: unknown): value is ShareExpirationMode => {
  return value === 'duration' || value === 'datetime';
};

const getValidTimestamp = (value?: number | string | null) => {
  const timestamp = value == null ? Number.NaN : Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

export const formatShareTimestamp = (value?: number | string | null) => {
  const timestamp = getValidTimestamp(value);
  return timestamp == null
    ? ''
    : dayjs(timestamp).format(SHARE_DISPLAY_TIMESTAMP_FORMAT);
};

export const isValidShareExactDatetime = (value?: number | string | null) => {
  return getValidTimestamp(value) != null;
};

export const supportsShareExpirationDatetime = (backendVersion?: string | null) => {
  return semverGte(backendVersion, SHARE_EXPIRATION_DATETIME_BACKEND_VERSION);
};

const createDefaultShareExpirationFormState = (): ShareExpirationFormState => {
  return {
    mode: DEFAULT_SHARE_EXPIRATION_MODE,
    expiresValue: '',
    expiresUnit: DEFAULT_SHARE_EXPIRATION_UNIT,
    exactDatetime: null,
  };
};

const normalizeIconUrl = (value?: string | null) => {
  return typeof value === 'string' ? value.trim() : '';
};

export const resolveShareDisplayIconState = ({
  share,
  source,
  fallbackIcon,
}: {
  share?: ShareIconSourceLike | null;
  source?: ShareIconSourceLike | null;
  fallbackIcon: string;
}): ShareDisplayIconState => {
  const shareIcon = normalizeIconUrl(share?.icon);
  if (shareIcon) {
    return {
      icon: shareIcon,
      isIconColor: share?.isIconColor !== false,
    };
  }

  const sourceIcon = normalizeIconUrl(source?.icon);
  if (sourceIcon) {
    return {
      icon: sourceIcon,
      isIconColor: source?.isIconColor !== false,
    };
  }

  return {
    icon: fallbackIcon,
    isIconColor: true,
  };
};

const parseShareDuration = (input: string): { value: number; unit: ShareExpirationUnit } | null => {
  if (!input) {
    return null;
  }

  const match = input.match(/^([\d.]+)(ms|s|m|h|d|w|y)$/i);
  if (!match) {
    return null;
  }

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const suffix = match[2].toLowerCase();
  if (suffix === 'm') {
    return null;
  }
  if (suffix === 'h') {
    return null;
  }
  if (suffix === 'd') {
    if (value < SHARE_DURATION_MS_UNIT_MAP.month / SHARE_DURATION_MS_DAY) {
      return { value: formatDurationValue(value), unit: 'day' };
    }
    if (value < SHARE_DURATION_MS_UNIT_MAP.season / SHARE_DURATION_MS_DAY) {
      return {
        value: formatDurationValue(value / (SHARE_DURATION_MS_UNIT_MAP.month / SHARE_DURATION_MS_DAY)),
        unit: 'month',
      };
    }
    if (value < SHARE_DURATION_MS_UNIT_MAP.year / SHARE_DURATION_MS_DAY) {
      return {
        value: formatDurationValue(value / (SHARE_DURATION_MS_UNIT_MAP.season / SHARE_DURATION_MS_DAY)),
        unit: 'season',
      };
    }
    return {
      value: formatDurationValue(value / (SHARE_DURATION_MS_UNIT_MAP.year / SHARE_DURATION_MS_DAY)),
      unit: 'year',
    };
  }
  if (suffix === 'w') {
    return { value: formatDurationValue(value * 7), unit: 'day' };
  }
  if (suffix === 'y') {
    return { value: formatDurationValue(value), unit: 'year' };
  }

  const durationMs = suffix === 's'
    ? value * 1000
    : value;

  return parseMillisecondsDuration(durationMs);
};

const getDurationState = (expiresIn: string): ShareExpirationFormState => {
  const parsedDuration = parseShareDuration(expiresIn);
  if (parsedDuration) {
    return {
      mode: 'duration',
      expiresValue: String(parsedDuration.value),
      expiresUnit: parsedDuration.unit,
      exactDatetime: null,
    };
  }

  return createDefaultShareExpirationFormState();
};

const getDurationStateFromExactCutoff = (
  exactCutoff: number,
  now: number,
): ShareExpirationFormState => {
  if (!Number.isFinite(exactCutoff) || exactCutoff <= now) {
    return createDefaultShareExpirationFormState();
  }

  return getDurationState(getExactExpirationDuration(exactCutoff, now));
};

const getExactDatetimeState = (exactCutoff: number): ShareExpirationFormState => {
  return {
    mode: 'datetime',
    expiresValue: '',
    expiresUnit: DEFAULT_SHARE_EXPIRATION_UNIT,
    exactDatetime: getValidTimestamp(exactCutoff),
  };
};

export const getShareExpirationFormState = ({
  mode,
  expiresAt,
  expiresIn,
  exp,
}: {
  mode?: ShareExpirationMode | null;
  expiresAt?: number | null;
  expiresIn?: string | null;
  exp?: number | null;
}): ShareExpirationFormState => {
  const nextExpiresAt = expiresAt == null ? Number.NaN : Number(expiresAt);
  const nextExp = exp == null ? Number.NaN : Number(exp);
  const nextMode = isShareExpirationMode(mode) ? mode : null;
  const now = Date.now();

  if (nextMode === 'datetime') {
    if (Number.isFinite(nextExp)) {
      return getExactDatetimeState(nextExp);
    }

    if (Number.isFinite(nextExpiresAt)) {
      return getExactDatetimeState(nextExpiresAt);
    }

    return {
      ...createDefaultShareExpirationFormState(),
      mode: 'datetime',
    };
  }

  if (expiresIn) {
    return getDurationState(expiresIn);
  }

  // Legacy exact-datetime shares may only persist exp without a mode field.
  // Preserve that absolute cutoff instead of backfilling a relative duration.
  if (nextMode == null && Number.isFinite(nextExp)) {
    return getExactDatetimeState(nextExp);
  }

  if (Number.isFinite(nextExpiresAt)) {
    return getDurationStateFromExactCutoff(nextExpiresAt, now);
  }

  if (Number.isFinite(nextExp)) {
    return getDurationStateFromExactCutoff(nextExp, now);
  }

  return createDefaultShareExpirationFormState();
};

const getExactExpirationDuration = (
  expiresAt: number,
  now: number = Date.now(),
) => {
  return `${Math.max(1, Math.ceil(expiresAt - now))}ms`;
};

export interface ShareEditorRouteIdentity {
  mode: 'create' | 'edit';
  type: 'sub' | 'col' | 'file' | null;
  name: string;
  token: string;
}

const getQueryParam = (value: unknown) => {
  return Array.isArray(value) ? value[0] || '' : typeof value === 'string' ? value : '';
};

export const parseShareEditorRouteIdentity = ({
  name,
  queryType,
  queryToken,
}: {
  name: string;
  queryType?: unknown;
  queryToken?: unknown;
}): ShareEditorRouteIdentity => {
  const resolvedType = getQueryParam(queryType);
  const resolvedToken = getQueryParam(queryToken);
  const resolvedName = !resolvedToken && name === SHARE_EDITOR_CREATE_ID
    ? ''
    : name;
  const type = isShareType(resolvedType) ? resolvedType : null;

  if (!resolvedToken) {
    return {
      mode: 'create',
      type,
      name: resolvedName,
      token: '',
    };
  }

  return {
    mode: 'edit',
    type,
    name: resolvedName,
    token: resolvedToken,
  };
};

export const findShareByRouteIdentity = (
  shares: Share[],
  identity: ShareEditorRouteIdentity,
) => {
  if (identity.mode !== 'edit' || !identity.token || !identity.type || !identity.name) {
    return null;
  }

  return shares.find((share) => {
    return share.token === identity.token
      && share.type === identity.type
      && share.name === identity.name;
  }) || null;
};

export const getShareEditorPath = ({
  type,
  name,
  token,
}: {
  type?: 'sub' | 'col' | 'file';
  name?: string;
  token?: string | null;
}) => {
  const pathName = name ? encodeURIComponent(name) : SHARE_EDITOR_CREATE_ID;
  const query = new URLSearchParams();

  if (type) {
    query.set('type', type);
  }
  if (token) {
    query.set('token', token);
  }

  const queryString = query.toString();
  return queryString ? `/edit/shares/${pathName}?${queryString}` : `/edit/shares/${pathName}`;
};

export const getShareCreatePath = (
  sourceType?: 'sub' | 'col' | 'file',
  name?: string,
) => {
  return getShareEditorPath({
    type: sourceType,
    name,
  });
};

export const getShareEditPath = (
  shareType: 'sub' | 'col' | 'file',
  name: string,
  token: string,
) => {
  return getShareEditorPath({
    type: shareType,
    name,
    token,
  });
};

export const getSharePublicUrl = ({
  host,
  secretPath,
  type,
  name,
  token,
}: {
  host: string;
  secretPath: string;
  type: 'sub' | 'col' | 'file';
  name: string;
  token: string;
}) => {
  if (!secretPath.startsWith('/')) {
    throw new Error('INVALID_SECRET_PATH');
  }

  return `${host.replace(
    new RegExp(`${secretPath}$`),
    '',
  )}/share/${type}/${encodeURIComponent(name)}?token=${encodeURIComponent(token)}`;
};
