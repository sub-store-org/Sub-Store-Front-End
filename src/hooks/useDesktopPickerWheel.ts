import { hasFinePointer } from '@/utils/isMobile';
import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue';

const PICKER_COLUMN_SELECTOR = '.nut-picker__column';
const WHEEL_STEP_THRESHOLD = 40;
const WHEEL_GESTURE_IDLE_MS = 160;
const WHEEL_MOVE_DURATION = 200;

type PickerOption = {
  value: string | number;
  text?: string;
};

type PickerColumnProxy = {
  $el?: Element | null;
  column?: PickerOption[];
  currIndex?: number;
  lineSpacing?: number;
  transformY?: number;
  setMove?: (move: number, type?: string, time?: number) => void;
};

type PickerProxy = {
  show?: boolean;
  pickerColumn?: PickerColumnProxy[];
};

type VisibleColumn = {
  element: HTMLElement;
  proxy: PickerColumnProxy;
};

const isVisible = (element: HTMLElement) => {
  if (!element.isConnected) {
    return false;
  }

  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    rect.width > 0 &&
    rect.height > 0
  );
};

const getVisibleColumns = (picker: PickerProxy | null | undefined) => {
  const columns = Array.isArray(picker?.pickerColumn) ? picker.pickerColumn : [];
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(PICKER_COLUMN_SELECTOR)
  ).filter(isVisible);

  return elements
    .map((element, index) => {
      const proxy = columns[index];
      if (!proxy) {
        return null;
      }

      return {
        element,
        proxy,
      };
    })
    .filter((column): column is VisibleColumn => column !== null);
};

const findColumnAtPoint = (
  picker: PickerProxy | null | undefined,
  clientX: number,
  clientY: number
) => {
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(clientY) ||
    (clientX === 0 && clientY === 0)
  ) {
    return null;
  }

  return getVisibleColumns(picker).find(column => {
    const rect = column.element.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  })?.proxy ?? null;
};

const movePickerSelection = (column: PickerColumnProxy, direction: 1 | -1) => {
  const optionCount = Array.isArray(column.column) ? column.column.length : 0;
  const currentIndex = Number(column.currIndex);
  const lineSpacing = Number(column.lineSpacing);
  const transformY = Number(column.transformY);

  if (!optionCount || !currentIndex || !lineSpacing || Number.isNaN(transformY)) {
    return false;
  }

  const nextIndex = Math.min(optionCount, Math.max(1, currentIndex + direction));
  if (nextIndex === currentIndex || typeof column.setMove !== 'function') {
    return false;
  }

  const targetMove = -(nextIndex - 1) * lineSpacing;
  const relativeMove = targetMove - transformY;
  column.setMove(relativeMove, 'end', WHEEL_MOVE_DURATION);

  return true;
};

export const useDesktopPickerWheel = (pickerRef: Ref<PickerProxy | null | undefined>) => {
  const wheelDeltaByColumn = new Map<PickerColumnProxy, number>();
  const wheelResetTimerByColumn = new Map<PickerColumnProxy, ReturnType<typeof setTimeout>>();

  const clearWheelResetTimer = (column: PickerColumnProxy) => {
    const timer = wheelResetTimerByColumn.get(column);
    if (timer) {
      clearTimeout(timer);
      wheelResetTimerByColumn.delete(column);
    }
  };

  const resetWheelDelta = (column: PickerColumnProxy) => {
    clearWheelResetTimer(column);
    wheelDeltaByColumn.delete(column);
  };

  const scheduleWheelDeltaReset = (column: PickerColumnProxy) => {
    clearWheelResetTimer(column);
    const timer = setTimeout(() => {
      wheelResetTimerByColumn.delete(column);
      wheelDeltaByColumn.delete(column);
    }, WHEEL_GESTURE_IDLE_MS);

    wheelResetTimerByColumn.set(column, timer);
  };

  const resetAllWheelState = () => {
    wheelResetTimerByColumn.forEach(timer => {
      clearTimeout(timer);
    });
    wheelResetTimerByColumn.clear();
    wheelDeltaByColumn.clear();
  };

  const getColumnFromTarget = (event: WheelEvent | MouseEvent) => {
    const picker = pickerRef.value;
    const { target } = event;
    const visibleColumns = getVisibleColumns(picker);

    if (target instanceof Element) {
      const targetColumn = visibleColumns.find(column => {
        return column.element.contains(target);
      });

      if (targetColumn) {
        return targetColumn.proxy;
      }
    }

    const pointColumn = findColumnAtPoint(picker, event.clientX, event.clientY);
    if (pointColumn) {
      return pointColumn;
    }

    return null;
  };

  const handleWheel = (event: WheelEvent) => {
    const picker = pickerRef.value;
    if (!picker?.show) {
      return;
    }

    const column = getColumnFromTarget(event);
    if (!column) {
      return;
    }

    const nextDelta = (wheelDeltaByColumn.get(column) ?? 0) + event.deltaY;
    wheelDeltaByColumn.set(column, nextDelta);
    scheduleWheelDeltaReset(column);

    event.preventDefault();

    if (Math.abs(nextDelta) < WHEEL_STEP_THRESHOLD) {
      return;
    }

    resetWheelDelta(column);

    const direction = nextDelta > 0 ? 1 : -1;
    movePickerSelection(column, direction);
  };

  onMounted(() => {
    if (!hasFinePointer() || typeof document === 'undefined') {
      return;
    }

    document.addEventListener('wheel', handleWheel, {
      capture: true,
      passive: false,
    });
  });

  onBeforeUnmount(() => {
    resetAllWheelState();

    if (typeof document === 'undefined') {
      return;
    }

    document.removeEventListener('wheel', handleWheel, true);
  });

  watch(
    () => pickerRef.value?.show,
    visible => {
      if (!visible) {
        resetAllWheelState();
      }
    }
  );
};
