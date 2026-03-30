import { defineStore } from 'pinia';

import { useArchiveApi } from '@/api/archive';
import i18n from '@/locales';
import { useAppNotifyStore } from '@/store/appNotify';
import { useArtifactsStore } from '@/store/artifacts';
import { useSubsStore } from '@/store/subs';
import { normalizeArchiveEntry } from '@/utils/archive';

const archiveApi = useArchiveApi();
const { t } = i18n.global;

export const useArchiveStore = defineStore('archiveStore', {
  state: (): ArchiveStoreState => {
    return {
      entries: [],
    };
  },
  getters: {
    hasEntries: ({ entries }) => entries.length > 0,
  },
  actions: {
    async fetchEntries() {
      try {
        const res = await archiveApi.getEntries();
        if (res?.data?.status === 'success') {
          this.entries = (res.data.data || []).map(normalizeArchiveEntry);
          return true;
        }
      } catch (error) {
        console.log('fetchArchiveEntries error', error);
      }

      this.entries = [];
      return false;
    },
    async sortEntries(ids: string[]) {
      try {
        const res = await archiveApi.sortEntries(ids);
        if (res?.data?.status === 'success') {
          await this.fetchEntries();
          return true;
        }
      } catch (error) {
        console.log('sortArchiveEntries error', error);
      }

      return false;
    },
    async refreshRelatedData(types: ArchiveItemType[]) {
      const subsStore = useSubsStore();
      const artifactsStore = useArtifactsStore();
      const typeSet = new Set(types);

      const tasks: Promise<unknown>[] = [];

      if (typeSet.has('artifact')) {
        tasks.push(artifactsStore.fetchArtifactsData());
      }

      if (
        typeSet.has('sub')
        || typeSet.has('col')
        || typeSet.has('file')
        || typeSet.has('share')
      ) {
        tasks.push(subsStore.fetchSubsData());
      }

      await Promise.all(tasks);
    },
    async restoreEntry(
      entry: ArchiveEntry,
      options: {
        showNotify?: boolean;
        reloadEntries?: boolean;
        refreshRelatedData?: boolean;
      } = {},
    ) {
      const {
        showNotify = true,
        reloadEntries = true,
        refreshRelatedData = true,
      } = options;
      const { showNotify: notify } = useAppNotifyStore();

      try {
        const res = await archiveApi.restoreEntry(entry.id);
        if (res?.data?.status === 'success') {
          const tasks: Promise<unknown>[] = [];
          if (reloadEntries) {
            tasks.push(this.fetchEntries());
          }
          if (refreshRelatedData) {
            tasks.push(this.refreshRelatedData([entry.itemType]));
          }
          await Promise.all(tasks);

          if (showNotify) {
            notify({
              type: 'success',
              title: t('archivePage.restore.succeedNotify'),
            });
          }

          return true;
        }
      } catch (error) {
        console.log('restoreArchiveEntry error', error);
      }

      return false;
    },
    async deleteEntry(
      id: string,
      options: {
        showNotify?: boolean;
        reloadEntries?: boolean;
      } = {},
    ) {
      const {
        showNotify = true,
        reloadEntries = true,
      } = options;
      const { showNotify: notify } = useAppNotifyStore();

      try {
        const res = await archiveApi.deleteEntry(id);
        if (res?.data?.status === 'success') {
          if (reloadEntries) {
            await this.fetchEntries();
          }

          if (showNotify) {
            notify({
              type: 'danger',
              title: t('archivePage.delete.succeedNotify'),
            });
          }

          return true;
        }
      } catch (error) {
        console.log('deleteArchiveEntry error', error);
      }

      return false;
    },
  },
});
