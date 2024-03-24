export const getFlowsUrlList = (subs: Sub[]): string[][] => {
  const nameList = [];
  const urlList = [];

  subs.forEach(sub => {
    const localOnly = sub.source === 'local' && !['localFirst', 'remoteFirst'].includes(sub.mergeSources)
    if (sub.url && !localOnly && !urlList.includes(sub.url)) {
      urlList.push(sub.url);
      nameList.push([sub.url, sub.name]);
    } else if (sub.subUserinfo && !urlList.includes(sub.name)) {
      urlList.push(sub.name);
      nameList.push([sub.name, sub.name]);
    }
  });
  return nameList.map(([raw, name]) => {
    let url = `${raw}`
      .split(/[\r\n]+/)
      .map((i) => i.trim())
      .filter((i) => i.length)?.[0]

    let $arguments = {} as any;
    const rawArgs = url.split('#');
    url = url.split('#')[0];
    if (rawArgs.length > 1) {
      try {
          // 支持 `#${encodeURIComponent(JSON.stringify({arg1: "1"}))}`
          $arguments = JSON.parse(decodeURIComponent(rawArgs[1]));
      } catch (e) {
          for (const pair of rawArgs[1].split('&')) {
              const key = pair.split('=')[0];
              const value = pair.split('=')[1];
              // 部分兼容之前的逻辑 const value = pair.split('=')[1] || true;
              $arguments[key] =
                  value == null || value === ''
                      ? true
                      : decodeURIComponent(value);
          }
      }
    }
    return [raw, name, $arguments?.noFlow, $arguments?.hideExpire, $arguments?.showRemaining];
  });
};
