export const getFlowsUrlList = (subs: Sub[]): string[][] => {
  const nameList = [];
  const urlList = [];

  subs.forEach(sub => {
    if (!urlList.includes(sub.url) && sub.source === 'remote') {
      urlList.push(sub.url);
      nameList.push([sub.url, sub.name]);
    }
  });
  return nameList;
};
