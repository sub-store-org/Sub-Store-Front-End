import { useColorMode, BasicColorSchema, useEventListener } from '@vueuse/core';
import { watch } from 'vue';

const mql = window.matchMedia('(prefers-color-scheme: dark)');

// 通用变量
const commonVariables = {
  'safe-area-side': '16px',
  'item-card-radios': '12px',
};

// 读取主题文件内容
const modulesFiles = import.meta.globEager('@/themes/*.ts');
const keys = Object.keys(modulesFiles);
const modules = keys.reduce((modules: { [key: string]: any }, path: string) => {
  const moduleName = path.split('/').at(-1).replace('.ts', '');
  modules[moduleName] = modulesFiles[path]?.default;
  return modules;
}, {});

// 修改 root 变量
const changeVariables = (newMode: Theme) => {
  const map = modules[newMode];
  if (map) {
    Object.keys(map).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, map[key]);
    });
  }
};

// 自动根据系统设置切换主题
const autoTheme = e => {
  e.matches ? changeVariables('dark') : changeVariables('light');
};

// 初始化主题
const initTheme = mode => {
  Object.keys(commonVariables).forEach(key => {
    document.documentElement.style.setProperty(
      `--${key}`,
      commonVariables[key]
    );
  });

  if (mode.value === 'auto') {
    autoTheme(mql);
    useEventListener(mql, 'change', autoTheme);
  } else {
    changeVariables(mode.value);
  }
};

// 定义主题类型
type CustomTheme = 'light' | 'dark' | 'auto';
type Theme = BasicColorSchema & CustomTheme;

export const useThemes = () => {
  const themeList = ['auto', ...Object.keys(modules)];
  const modes = {};
  themeList.forEach(theme => {
    modes[theme] = theme;
  });
  // 自动 mode 并初始化主题变量
  const mode = useColorMode({
    emitAuto: true,
    modes,
  });

  initTheme(mode);

  // 提供手动设置主题方法
  const setTheme = (newMode: Theme) => {
    mode.value = newMode;
  };

  // 监听 mode 变化切换 root 变量值
  watch(mode, newMode => {
    if (newMode === 'auto') {
      autoTheme(mql);
      useEventListener(mql, 'change', autoTheme);
    } else {
      mql.removeEventListener('change', autoTheme);
      changeVariables(newMode);
    }
  });

  return {
    mode,
    themeList,
    setTheme,
  };
};
