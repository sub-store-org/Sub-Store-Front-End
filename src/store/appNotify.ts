import { defineStore } from 'pinia';

export const useAppNotifyStore = defineStore('appNotify', {
  state: (): AppNotifyStoreState => {
    return {
      isVisible: false,
      title: '',
      content: '',
      type: 'primary',
      duration: 800,
    };
  },
  getters: {},
  actions: {
    showNotify(settings: NotifySettings) {
      const { title, content, type, duration } = settings;
      this.title = title;
      this.content = content || '';
      this.type = type || 'primary';
      this.duration = duration || 800;
      this.isVisible = true;
      setTimeout(() => {
        this.setVisible(false);
      }, 1000); // 防止重复通知 持续时间过长
    },
    setVisible(isVisible: boolean) {
      this.isVisible = isVisible;
    },
  },
});
