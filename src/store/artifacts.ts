import { useArtifactsApi } from '@/api/artifacts';
import i18n from '@/locales';
import { useAppNotifyStore } from '@/store/appNotify';
import { defineStore } from 'pinia';

const { t } = i18n.global;
const artifactsApi = useArtifactsApi();

export const useArtifactsStore = defineStore('artifactsStore', {
  state: (): ArtifactsStoreState => {
    return {
      artifacts: [],
    };
  },
  getters: {},
  actions: {
    async fetchArtifactsData() {
      const { data } = await artifactsApi.getArtifacts();
      if (data.status === 'success') {
        this.artifacts = data.data;
      }
    },
    async createArtifact(data: Artifact) {
      const { showNotify } = useAppNotifyStore();
      const res = await artifactsApi.createArtifact(data);
      if (res?.data?.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          title: t('syncPage.addArtForm.succeedNotify'),
          type: 'success',
        });
        return true;
      }
      return false;
    },
    async editArtifact(name: string, data: Artifact) {
      const { showNotify } = useAppNotifyStore();

      const res = await artifactsApi.editArtifact(name, data);
      if (res?.data?.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          title: t('syncPage.editArtForm.succeedNotify'),
          type: 'success',
        });
        return true;
      }
      return false;
    },
    async deleteArtifact(
      name: string,
      mode?: DeleteMode,
      isShowNotify: boolean = true,
    ) {
      const { showNotify } = useAppNotifyStore();

      const { data } = await artifactsApi.deleteArtifact(name, mode);
      if (data.status === 'success') {
        await this.fetchArtifactsData();
        isShowNotify && showNotify({
          title:
            mode === 'archive'
              ? t('archivePage.liveDelete.succeedNotify')
              : t('syncPage.deleteArt.succeedNotify'),
          type: mode === 'archive' ? 'success' : 'danger',
        });
        return true;
      }

      return false;
    },
    async restoreArtifacts() {
      const { showNotify } = useAppNotifyStore();

      const res = await artifactsApi.restoreArtifacts();
      if (res?.data?.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          type: "success",
          title: t(`myPage.notify.restore.succeed`),
          content: ``,
        });
      }
    },
    async syncAllArtifact() {
      const { showNotify } = useAppNotifyStore();

      const res = await artifactsApi.syncAllArtifact();
      if (res?.data?.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          title: t('syncPage.syncAllSucceed'),
          type: 'success',
        });
      } else {
        await this.fetchArtifactsData();
      }
    },
    async syncOneArtifact(name: string) {
      const { showNotify } = useAppNotifyStore();

      const res = await artifactsApi.syncOneArtifact(name);
      if (res?.data?.status === 'success') {
        const index = this.artifacts.findIndex(item => item.name === name);
        this.artifacts[index] = res.data.data;
        showNotify({
          title: t('syncPage.syncAllSucceed'),
          type: 'success',
        });
      }
    },
  },
});
