import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

export const butifyDate = (date: number): string => {
  const locale = localStorage.getItem('locale') || 'zh-CN';
  return dayjs(date).locale(locale).fromNow();
};
