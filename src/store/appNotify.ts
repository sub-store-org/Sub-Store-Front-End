import { defineStore } from 'pinia';

export const useAppNotifyStore = defineStore('appNotify', {
  state: (): AppNotifyStoreState => {
    return {
      isVisible: false,
      title: '',
      content: '',
      type: 'primary',
      duration: 2000,
    };
  },
  getters: {},
  actions: {
    showNotify(settings: NotifySettings) {
      const { title, content, type, duration } = settings;
      this.title = title;
      this.content = content || '';
      this.type = type || 'primary';
      this.duration = duration || 2000;
      this.isVisible = true;
    },
    setVisible(isVisible: boolean) {
      this.isVisible = isVisible;
    },
  },
});
