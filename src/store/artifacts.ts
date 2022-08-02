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
      if (res.data.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          title: t('syncPage.addArtForm.succeedNotify'),
          type: 'success',
        });
      }
    },
    async editArtifact(name: string, data: Artifact) {
      const { showNotify } = useAppNotifyStore();

      const res = await artifactsApi.editArtifact(name, data);
      if (res.data.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          title: t('syncPage.editArtForm.succeedNotify'),
          type: 'success',
        });
      }
    },
    async deleteArtifact(name: string) {
      const { showNotify } = useAppNotifyStore();

      const { data } = await artifactsApi.deleteArtifact(name);
      if (data.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          title: t('syncPage.deleteArt.succeedNotify'),
          type: 'success',
        });
      }
    },
    async syncAllArtifact() {
      const { showNotify } = useAppNotifyStore();

      const { data } = await artifactsApi.syncAllArtifact();
      if (data.status === 'success') {
        await this.fetchArtifactsData();
        showNotify({
          title: t('syncPage.syncAllSucceed'),
          type: 'success',
        });
      }
    },
    async syncOneArtifact(name: string) {
      const { showNotify } = useAppNotifyStore();

      const res = await artifactsApi.syncOneArtifact(name);
      if (res.data.status === 'success') {
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
