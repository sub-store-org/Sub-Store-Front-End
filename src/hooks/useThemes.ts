import { useSettingsStore } from '@/store/settings';
import { useEventListener } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref, watchEffect } from 'vue';

const mql = window.matchMedia('(prefers-color-scheme: dark)');

// 通用变量
const commonVariables = {
  'safe-area-side': '16px',
  'item-card-radios': '12px',
};

// 获取主题文件夹内的主题
const getThemeModules = () => {
  const allThemes = {};
  // 读取主题文件内容
  const modulesFiles = import.meta.globEager('@/themes/*.ts');
  const keys = Object.keys(modulesFiles);

  // 初始化为主题表，继承合并
  keys.forEach(path => {
    const paths = path.split('/');
    const modulesName = paths[paths.length - 1].replace('.ts', '');
    allThemes[modulesName] = modulesFiles[path]?.default;
  });

  // 初始化 theme 表后开始处理继承关系
  for (const key in allThemes) {
    const current = allThemes[key];
    const extend = current.meta.extend;
    if (extend) {
      const extendModule = allThemes[extend];
      if (extendModule) {
        // 拷贝一份原有继承和目标主题的 color 对象，解构复制覆盖目标主题颜色, 将通用变量覆盖进去
        current.colors = {
          ...{ ...extendModule.colors },
          ...{ ...current.colors },
        };
      } else {
        console.error(`${extend} 主题不存在`);
      }
    }
  }
  return allThemes;
};
const modules = getThemeModules();

// 定义修改 root 变量方法
const changeVariables = (newMode: CustomTheme) => {
  const map = { ...{ ...modules[newMode].colors }, ...commonVariables };
  if (map) {
    Object.keys(map).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, map[key]);
    });
  }

  // 切换浏览器窗口 / 状态栏颜色
  const themeColorMeta = document.getElementById('theme__color');
  themeColorMeta.setAttribute(
    'content',
    modules[newMode].colors['status-bar-background-color']
  );
};

export const useThemes = () => {
  // 读取 store 中的主题配置
  const settingsStore = useSettingsStore();
  const { theme } = storeToRefs(settingsStore);

  // 定义主题 picker list 选项
  const pickerList = ref([]);
  const pickerDarkList = ref([]);
  const pickerLightList = ref([]);

  for (const key in modules) {
    if (modules[key].meta.label === 'dark') {
      pickerDarkList.value.push({
        text: modules[key].meta.name + ' - ' + modules[key].meta.author,
        value: key,
      });
    } else if (modules[key].meta.label === 'light') {
      pickerLightList.value.push({
        text: modules[key].meta.name + ' - ' + modules[key].meta.author,
        value: key,
      });
    }

    pickerList.value.push({
      text: modules[key].meta.name + ' - ' + modules[key].meta.author,
      value: key,
    });
  }

  // 定义自动根据系统设置切换主题方法
  const autoTheme = el => {
    el.matches
      ? changeVariables(theme.value.dark)
      : changeVariables(theme.value.light);
  };

  // 监听 theme 设置变化，切换 theme
  watchEffect(async () => {
    if (theme.value.auto) {
      if (theme.value.dark && theme.value.light) {
        autoTheme(mql);
        useEventListener(mql, 'change', autoTheme);
      }
    } else {
      mql.removeEventListener('change', autoTheme);
      changeVariables(theme.value.name);
    }
  });

  return {
    currentMode: () => theme.value.name,
    pickerList,
    pickerDarkList,
    pickerLightList,
    isAuto: () => theme.value.auto,
  };
};
