import { marked } from 'marked';
import yaml from 'js-yaml';
import dayjs from 'dayjs';

type Meta = {
  date: Date;
};

export const useChangelogs = () => {
  const changelogsMap = import.meta.glob('@/changelogs/*.md', {
    eager: true,
    as: 'raw',
  });
  return Object.values(changelogsMap)
    .map(changelog => {
      const [meta, md] = changelog.split('---\n').slice(1);

      const { date, ...rest } = yaml.load(meta) as Meta;
      const dayjsDate = dayjs(date);

      const htmlContent = marked.parse(md);

      return {
        date: dayjsDate,
        meta: rest,
        htmlContent,
      };
    })
    .sort((a, b) => b.date.unix() - a.date.unix());
};
