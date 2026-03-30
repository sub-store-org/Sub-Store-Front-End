import logoIcon from "@/assets/icons/logo.png";
import logoRedIcon from "@/assets/icons/logo-red.png";
import singboxIcon from "@/assets/icons/sing-box.png";
import clashIcon from "@/assets/icons/clash.png";
import egernIcon from "@/assets/icons/egern.png";
import clashMetaIcon from "@/assets/icons/clashmeta.png";
import loonIcon from "@/assets/icons/loon.png";
import quanxIcon from "@/assets/icons/quanx.png";
import shadowRocketIcon from "@/assets/icons/shadowrocket.png";
import surfboardIcon from "@/assets/icons/surfboard.png";
import stashIcon from "@/assets/icons/stash.png";
import surgeIcon from "@/assets/icons/surge.png";
import surgeMacIcon from "@/assets/icons/surgeformac_text.png";
import v2rayIcon from "@/assets/icons/v2ray.png";
import singboxColorIcon from "@/assets/icons/sing-box_color.png";
import clashColorIcon from "@/assets/icons/clash_color.png";
import egernColorIcon from "@/assets/icons/egern_color.png";
import clashMetaColorIcon from "@/assets/icons/clashmeta_color.png";
import loonColorIcon from "@/assets/icons/loon_color.png";
import quanxColorIcon from "@/assets/icons/quanx_color.png";
import shadowRocketColorIcon from "@/assets/icons/shadowrocket_color.png";
import surfboardColorIcon from "@/assets/icons/surfboard_color.png";
import stashColorIcon from "@/assets/icons/stash_color.png";
import surgeColorIcon from "@/assets/icons/surge_color.png";
import surgeMacColorIcon from "@/assets/icons/surgeformac_text_color.png";
import v2rayColorIcon from "@/assets/icons/v2ray_color.png";

interface ArtifactIconLike {
  icon?: string | null;
  isIconColor?: boolean | null;
  type?: string | null;
  platform?: string | null;
}

interface ResolveArtifactIconOptions {
  artifact?: ArtifactIconLike | null;
  isDefaultIcon?: boolean;
  sourceIcon?: string | null;
}

export const resolveArtifactIcon = ({
  artifact,
  isDefaultIcon = false,
  sourceIcon,
}: ResolveArtifactIconOptions) => {
  const fallbackIcon = isDefaultIcon ? logoIcon : logoRedIcon;

  if (!artifact) {
    return fallbackIcon;
  }

  if (artifact.icon) {
    return artifact.icon;
  }

  const isIconColor = artifact.isIconColor !== false;
  let platform = String(artifact.platform ?? "");

  if (artifact.type === "file") {
    if (sourceIcon) {
      return sourceIcon;
    }
    platform = "";
  }

  switch (platform) {
    case "Surge":
      return isIconColor ? surgeColorIcon : surgeIcon;
    case "SurgeMac":
      return isIconColor ? surgeMacColorIcon : surgeMacIcon;
    case "QX":
      return isIconColor ? quanxColorIcon : quanxIcon;
    case "Loon":
      return isIconColor ? loonColorIcon : loonIcon;
    case "Egern":
      return isIconColor ? egernColorIcon : egernIcon;
    case "Clash":
      return isIconColor ? clashColorIcon : clashIcon;
    case "ClashMeta":
      return isIconColor ? clashMetaColorIcon : clashMetaIcon;
    case "Stash":
      return isIconColor ? stashColorIcon : stashIcon;
    case "ShadowRocket":
      return isIconColor ? shadowRocketColorIcon : shadowRocketIcon;
    case "V2Ray":
      return isIconColor ? v2rayColorIcon : v2rayIcon;
    case "sing-box":
      return isIconColor ? singboxColorIcon : singboxIcon;
    case "Surfboard":
      return isIconColor ? surfboardColorIcon : surfboardIcon;
    default:
      return fallbackIcon;
  }
};
