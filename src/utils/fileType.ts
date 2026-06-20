export const MIHOMO_CONFIG_FILE_TYPE = "mihomoConfig";
export const LEGACY_MIHOMO_CONFIG_FILE_TYPE = "mihomoProfile";

export const isMihomoConfigFileType = (type?: string | null) => {
  return (
    type === MIHOMO_CONFIG_FILE_TYPE ||
    type === LEGACY_MIHOMO_CONFIG_FILE_TYPE
  );
};

export const normalizeFileType = (type?: string | null) => {
  return isMihomoConfigFileType(type) ? MIHOMO_CONFIG_FILE_TYPE : type;
};
