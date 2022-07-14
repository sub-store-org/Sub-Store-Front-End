import { onMounted, toRaw, ref, watch } from 'vue';
import { useEventListener } from '@vueuse/core';

export const useHackPicker = (columns, pickerVisible) => {
  // 检测是否有 touch event
  const hasTouchEvent = () => {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  };

  // 电脑操作时需要使用的变量
  const clickValue = ref(null);

  onMounted(() => {
    if (!hasTouchEvent()) {
      // 设置默认值为第一个
      clickValue.value = [toRaw(columns.value[0])];

      // 监听点击事件
      const body = document.querySelector('body');
      useEventListener(body, 'click', e => {
        const el = e.target as HTMLElement;
        if (el.className === 'nut-picker-roller-item') {
          const container = el.parentElement;
          const target = columns.value.find(item => item.text === el.innerText);
          clickValue.value = [toRaw(target)];

          // 移除hidden样式
          (container.children as unknown as HTMLElement[]).forEach(item => {
            item.classList.remove('nut-picker-roller-item-hidden');
          });

          // 转动选择器位置
          const result = el.style.transform.match(/rotate3d\((.*?)\)/);
          const temp = result[1].split(',');
          const deg = Number(temp[temp.length - 1].replace('deg', ''));
          container.style.transform = `rotate3d(1, 0, 0, ${-deg}deg)`;
        }
      });
    }
  });

  watch(pickerVisible, visible => {
    if (visible && !hasTouchEvent()) {
      // 重置 value
      clickValue.value = [toRaw(columns.value[0])];

      const mask: HTMLElement = document.querySelector(
        '.nut-picker-roller-mask'
      );
      const item = document.querySelectorAll('.nut-picker-roller-item');
      mask.style.pointerEvents = 'none';
      item.forEach((item: HTMLElement) => {
        item.style.cursor = 'pointer';
      });
    }
  });

  return {
    clickValue,
  };
};
