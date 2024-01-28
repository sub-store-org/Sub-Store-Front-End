interface AppNotifyStoreState {
  isVisible: boolean;
  title: string;
  content?: string;
  type?: 'primary' | 'success' | 'danger' | 'warning';
  duration?: number;
  navBartop?: number;
}

type NotifySettings = {
  title: string;
  content?: string;
  type?: 'primary' | 'success' | 'danger' | 'warning';
  duration?: number;
  navBartop?: number;
};
