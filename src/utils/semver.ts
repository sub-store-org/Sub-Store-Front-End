import semverGt from 'semver/functions/gt';
import semverMajor from 'semver/functions/major';
import semverMinor from 'semver/functions/minor';

export const semverMajorMinorGt = (versionA, versionB): boolean => {
  return semverGt(
    `${semverMajor(versionA)}.${semverMinor(versionA)}.0`,
    `${semverMajor(versionB)}.${semverMinor(versionB)}.0`
  );
};
