import semverCoerce from 'semver/functions/coerce';
import semverGteFn from 'semver/functions/gte';
import semverGt from 'semver/functions/gt';
import semverMajor from 'semver/functions/major';
import semverMinor from 'semver/functions/minor';

const normalizeVersion = (version?: string | null) => {
  return typeof version === 'string' ? semverCoerce(version)?.version || null : null;
};

export const semverMajorMinorGt = (versionA, versionB): boolean => {
  const normalizedVersionA = normalizeVersion(versionA);
  const normalizedVersionB = normalizeVersion(versionB);

  if (!normalizedVersionA || !normalizedVersionB) {
    return false;
  }

  return semverGt(
    `${semverMajor(normalizedVersionA)}.${semverMinor(normalizedVersionA)}.0`,
    `${semverMajor(normalizedVersionB)}.${semverMinor(normalizedVersionB)}.0`
  );
};

export const semverGte = (versionA?: string | null, versionB?: string | null): boolean => {
  const normalizedVersionA = normalizeVersion(versionA);
  const normalizedVersionB = normalizeVersion(versionB);

  if (!normalizedVersionA || !normalizedVersionB) {
    return false;
  }

  return semverGteFn(normalizedVersionA, normalizedVersionB);
};
