import { defineStore } from 'pinia';
import { useArtifactsApi } from '@/api/artifacts';
import { Notify } from '@nutui/nutui';
import i18n from '@/locales';

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
      const res = await artifactsApi.createArtifact(data);
      if (res.data.status === 'success') {
        await this.fetchArtifactsData();
        Notify.success(t('syncPage.addArtForm.succeedNotify'), {
          duration: 1500,
        });
      }
    },
    async editArtifact(name: string, data: Artifact) {
      const res = await artifactsApi.editArtifact(name, data);
      if (res.data.status === 'success') {
        await this.fetchArtifactsData();
        Notify.success(t('syncPage.editArtForm.succeedNotify'), {
          duration: 1500,
        });
      }
    },
    async deleteArtifact(name: string) {
      const { data } = await artifactsApi.deleteArtifact(name);
      if (data.status === 'success') {
        await this.fetchArtifactsData();
        Notify.success(t('syncPage.deleteArt.succeedNotify'), {
          duration: 1500,
        });
      }
    },
    async syncAllArtifact() {
      const { data } = await artifactsApi.syncAllArtifact();
      if (data.status === 'success') {
        await this.fetchArtifactsData();
        Notify.success(t('syncPage.syncAllSucceed'), {
          duration: 1500,
        });
      }
    },
    async syncOneArtifact(name: string) {
      const res = await artifactsApi.syncOneArtifact(name);
      if (res.data.status === 'success') {
        const index = this.artifacts.findIndex(item => item.name === name);
        this.artifacts[index] = res.data.data;
        Notify.success(t('syncPage.syncAllSucceed'), {
          duration: 1500,
        });
      }
    },
  },
});
