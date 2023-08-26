import { defineStore } from 'pinia';
import { useEnvApi } from '@/api/env';

const envApi = useEnvApi();

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalStoreState => {
    return {
      isLoading: true,
      isFlowFetching: true,
      fetchResult: false,
      bottomSafeArea: 0,
      isDarkMode: false,
      env: {},
      isSimpleMode: localStorage.getItem('isSimpleMode') === '1',
      isLeftRight: localStorage.getItem('isLr') === '1',
      isIconColor: localStorage.getItem('iconColor') === '1',
      isEditorCommon: localStorage.getItem('iseditorCommon') !== '1',
      isSimpleReicon: localStorage.getItem('isSimpleReicon') === '1',
      istabBar: localStorage.getItem('istabBar') === '1',
      ishostApi: localStorage.getItem('hostApi'),
    };
  },
  getters: {},
  actions: {
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
    settabBar(istabBar: boolean) {
      if (istabBar) {
        localStorage.setItem('istabBar', '1');
      } else {
        localStorage.removeItem('istabBar');
      }
      this.istabBar = istabBar;
    },
    sethostApi(hostApi: string) {
      localStorage.setItem('hostApi', hostApi);
      this.ishostApi = hostApi;
    },
    async setEnv() {
      const res = await envApi.getEnv();
      if (res.data.status === 'success') {
        this.env = res.data.data;
      }
    },
  },
});
