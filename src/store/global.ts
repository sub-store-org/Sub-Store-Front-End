import { defineStore } from 'pinia';
import { useEnvApi } from '@/api/env';
import { initStores } from '@/utils/initApp';
import service from '@/api';
import { getHostAPIUrl } from '@/hooks/useHostAPI';

const envApi = useEnvApi();

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalStoreState => {
    return {
      subProgressStyle: localStorage.getItem('subProgressStyle') || 'hidden',
      isLoading: true,
      isFlowFetching: true,
      fetchResult: false,
      bottomSafeArea: 0,
      isDefaultIcon: localStorage.getItem('isDefaultIcon') === '1',
      isDarkMode: false,
      env: {},
      isDockerDeployment: false,
      isSimpleMode: localStorage.getItem('isSimpleMode') === '1',
      isLeftRight: localStorage.getItem('isLr') === '1',
      isIconColor: localStorage.getItem('iconColor') === '1',
      isEditorCommon: localStorage.getItem('iseditorCommon') !== '1',
      isSimpleReicon: localStorage.getItem('isSimpleReicon') === '1',
      showFloatingRefreshButton: localStorage.getItem('showFloatingRefreshButton') === '1',
      istabBar: localStorage.getItem('istabBar') === '1',
      istabBar2: localStorage.getItem('istabBar2') === '1',
      ishostApi: getHostAPIUrl(),
      savedPositions: {},
      defaultIconCollection: localStorage.getItem('defaultIconCollection') || '',
      defaultIconCollections: [
        {
          text: "cc63/ICON",
          value: "https://raw.githubusercontent.com/cc63/ICON/main/icons.json",
        },
        {
          text: "Koolson/QureColor",
          value:
            "https://raw.githubusercontent.com/Koolson/Qure/master/Other/QureColor.json",
        },
        {
          text: "Koolson/QureColor-All",
          value:
            "https://raw.githubusercontent.com/Koolson/Qure/master/Other/QureColor-All.json",
        },
        {
          text: "Orz-3/mini",
          value: "https://raw.githubusercontent.com/Orz-3/mini/master/mini.json",
        },
        {
          text: "Orz-3/mini+",
          value: "https://raw.githubusercontent.com/Orz-3/mini/master/mini%2B.json",
        },
        {
          text: "Orz-3/miniColor",
          value: "https://raw.githubusercontent.com/Orz-3/mini/master/miniColor.json",
        },
        {
          text: "Orz-3/Color+",
          value: "https://raw.githubusercontent.com/Orz-3/mini/master/Color%2B.json",
        },
        {
          text: "Twoandz9/TheMagic-Icons",
          value:
            "https://raw.githubusercontent.com/Twoandz9/TheMagic-Icons/main/TheRaw.json",
        },
        {
          text: "lige47/QuanX-icon-rule",
          value:
            "https://raw.githubusercontent.com/lige47/QuanX-icon-rule/main/ligeicon.json",
        },
      ],
      customIconCollections: localStorage.getItem("customIconCollections")
        ? JSON.parse(localStorage.getItem("customIconCollections"))
        : [],
    };
  },
  getters: {},
  actions: {
    setSubProgressStyle(style: string) {
      if (style && style !== 'hidden') {
        localStorage.setItem('subProgressStyle', style);
      } else {
        localStorage.removeItem('subProgressStyle');
      }
      this.subProgressStyle = style;
    },
    setBottomSafeArea(height: number) {
      this.bottomSafeArea = height;
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
    setFlowFetching(isFlowFetching: boolean) {
      this.isFlowFetching = isFlowFetching;
    },
    setFetchResult(fetchResult: boolean) {
      this.fetchResult = fetchResult;
    },
    setDarkMode(isDarkMode: boolean) {
      this.isDarkMode = isDarkMode;
    },
    setSimpleMode(isSimpleMode: boolean) {
      if (isSimpleMode) {
        localStorage.setItem('isSimpleMode', '1');
      } else {
        localStorage.removeItem('isSimpleMode');
      }
      this.isSimpleMode = isSimpleMode;
    },
    setLeftRight(isLr: boolean) {
      if (isLr) {
        localStorage.setItem('isLr', '1');
      } else {
        localStorage.removeItem('isLr');
      }
      this.isLeftRight = isLr;
    },
    setIconColor(iconColor: boolean) {
      if (iconColor) {
        localStorage.setItem('iconColor', '1');
      } else {
        localStorage.removeItem('iconColor');
      }
      this.isIconColor = iconColor;
    },
    setIsDefaultIcon(isDefaultIcon: boolean) {
      if (isDefaultIcon) {
        localStorage.setItem('isDefaultIcon', '1');
      } else {
        localStorage.removeItem('isDefaultIcon');
      }
      this.isDefaultIcon = isDefaultIcon;
    },
    setEditorCommon(isEditorCommon: boolean) {
      if (!isEditorCommon) {
        localStorage.setItem('iseditorCommon', '1');
      } else {
        localStorage.removeItem('iseditorCommon');
      }
      this.isEditorCommon = isEditorCommon;
    },
    setSimpleReicon(isSimpleReicon: boolean) {
      if (isSimpleReicon) {
        localStorage.setItem('isSimpleReicon', '1');
      } else {
        localStorage.removeItem('isSimpleReicon');
      }
      this.isSimpleReicon = isSimpleReicon;
    },
    setShowFloatingRefreshButton(showFloatingRefreshButton: boolean) {
      if (showFloatingRefreshButton) {
        localStorage.setItem('showFloatingRefreshButton', '1');
      } else {
        localStorage.removeItem('showFloatingRefreshButton');
      }
      this.showFloatingRefreshButton = showFloatingRefreshButton;
    },
    settabBar(istabBar: boolean) {
      if (istabBar) {
        localStorage.setItem('istabBar', '1');
      } else {
        localStorage.removeItem('istabBar');
      }
      this.istabBar = istabBar;
    },
    settabBar2(istabBar2: boolean) {
      if (istabBar2) {
        localStorage.setItem('istabBar2', '1');
      } else {
        localStorage.removeItem('istabBar2');
      }
      this.istabBar2 = istabBar2;
    },
    async setHostAPI(hostApi: string) {
      this.ishostApi = hostApi;
      service.defaults.baseURL = hostApi;
      await initStores(true, true, true);
    },
    async setEnv() {
      const res = await envApi.getEnv();
      if (res?.data?.status === 'success') {
        this.env = res.data.data;

        // 检测是否是Docker部署
        if (this.env?.meta?.node?.env?.SUB_STORE_DOCKER === 'true') {
          this.isDockerDeployment = true;
        }
      }
    },
    setDockerDeployment(isDockerDeployment: boolean) {
      this.isDockerDeployment = isDockerDeployment;
    },
    setSavedPositions(key: string, value: any) {
      this.savedPositions[key] = value;
    },
    setDefaultIconCollection(defaultIconCollection: string) {
      if (defaultIconCollection) {
        localStorage.setItem('defaultIconCollection', defaultIconCollection);
      } else {
        localStorage.removeItem('defaultIconCollection');
      }
      this.defaultIconCollection = defaultIconCollection;
    },
    setCustomIconCollections(collections: any[]) {
      if (collections && collections.length > 0) {
        // 合并去重
        const list = Array.from(
          new Set([...this.customIconCollections, ...collections]),
        );
        localStorage.setItem('customIconCollections', JSON.stringify(list));
        this.customIconCollections = list;
      } else {
        localStorage.removeItem('customIconCollections');
        this.customIconCollections = [];
      }
    },
  },
});
