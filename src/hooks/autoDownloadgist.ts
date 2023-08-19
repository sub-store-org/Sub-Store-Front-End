// import { useSettingsApi } from '@/api/settings';
// import { initStores } from '@/utils/initApp';
// import { butifyDate } from '@/utils/butifyDate';

// export async function GistAutoDownload() {
// //   const settingsApi = useSettingsApi();
// //   const { data: res } = await settingsApi.getSettings();
// //   if (res.status === 'success' && res.data.autoDownloadGistSync) {
// //     // let syncTime = res.data.syncTime || 0;
// //     console.log('启动时自动下载 Gist Config');
// //     // console.log(butifyDate(syncTime))
// //     const syncRes = await settingsApi.syncSettings('download');
// //     if (syncRes?.data?.status === 'success') {
// //       console.log('自动下载 Gist Config 成功');
// //       // 刷新数据
// //       initStores(true, true, false);
// //       return res;
// //     } else {
// //         console.log('未配置 GitHub 令牌或其他错误：'+JSON.stringify(syncRes));
// //     }
// //   }
//   return null;
// }
export {};