import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

export const butifyDate = (date: number): string => {
  const locale = localStorage.getItem('locale') || 'zh-CN';
  const diff = date - Date.now();

  if (diff >= 0 && diff <= 60 * 1000) {
    return locale.toLowerCase().startsWith('zh') ? '刚刚' : 'just now';
  }

  return dayjs(date).locale(locale).fromNow();
};
