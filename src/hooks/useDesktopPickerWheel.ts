import { hasFinePointer } from '@/utils/isMobile';

const PICKER_COLUMN_SELECTOR = '.nut-picker__column';
const PICKER_LIST_SELECTOR = '.nut-picker__list';
const WHEEL_STEP_THRESHOLD = 40;
const WHEEL_GESTURE_IDLE_MS = 160;
const WHEEL_MOVE_DURATION = 200;

let isEnabled = false;

const wheelDeltaByColumn = new WeakMap<HTMLElement, number>();
const wheelResetTimerByColumn = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
let hoveredColumn: HTMLElement | null = null;

type PickerListElement = HTMLElement & {
  __vueParentComponent?: {
    ctx?: {
      column?: Array<{ value: string | number; text?: string }>;
      currIndex?: number;
      lineSpacing?: number;
      transformY?: number;
      setMove?: (move: number, type?: string, time?: number) => void;
    };
  };
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

const getVisibleColumns = () => {
  return Array.from(
    document.querySelectorAll<HTMLElement>(PICKER_COLUMN_SELECTOR)
  ).filter(isVisible);
};

const findColumnAtPoint = (clientX: number, clientY: number) => {
  if (
    !Number.isFinite(clientX) ||
    !Number.isFinite(clientY) ||
    (clientX === 0 && clientY === 0)
  ) {
    return null;
  }

  if (typeof document.elementsFromPoint === 'function') {
    const stack = document.elementsFromPoint(clientX, clientY);

    for (const element of stack) {
      if (!(element instanceof Element)) {
        continue;
      }

      const column = element.closest(PICKER_COLUMN_SELECTOR) as HTMLElement | null;
      if (column && isVisible(column)) {
        return column;
      }
    }
  }

  return getVisibleColumns().find(column => {
    const rect = column.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }) ?? null;
};

const getColumnFromTarget = (event: WheelEvent) => {
  const { target } = event;

  if (target instanceof Element) {
    const column = target.closest(PICKER_COLUMN_SELECTOR) as HTMLElement | null;
    if (column && isVisible(column)) {
      return column;
    }
  }

  const pointColumn = findColumnAtPoint(event.clientX, event.clientY);
  if (pointColumn) {
    return pointColumn;
  }

  if (hoveredColumn && isVisible(hoveredColumn)) {
    return hoveredColumn;
  }

  return null;
};

const movePickerSelection = (column: HTMLElement, direction: 1 | -1) => {
  const list = column.querySelector(PICKER_LIST_SELECTOR) as PickerListElement | null;
  const component = list?.__vueParentComponent?.ctx;

  if (!list || !component?.setMove) {
    return false;
  }

  const optionCount = Array.isArray(component.column) ? component.column.length : 0;
  const currentIndex = Number(component.currIndex);
  const lineSpacing = Number(component.lineSpacing);
  const transformY = Number(component.transformY);

  if (!optionCount || !currentIndex || !lineSpacing || Number.isNaN(transformY)) {
    return false;
  }

  const nextIndex = Math.min(optionCount, Math.max(1, currentIndex + direction));
  if (nextIndex === currentIndex) {
    return false;
  }

  const targetMove = -(nextIndex - 1) * lineSpacing;
  const relativeMove = targetMove - transformY;
  component.setMove(relativeMove, 'end', WHEEL_MOVE_DURATION);

  return true;
};

const updateHoveredColumn = (clientX: number, clientY: number) => {
  hoveredColumn = findColumnAtPoint(clientX, clientY);
};

const clearWheelResetTimer = (column: HTMLElement) => {
  const timer = wheelResetTimerByColumn.get(column);
  if (timer) {
    clearTimeout(timer);
    wheelResetTimerByColumn.delete(column);
  }
};

const resetWheelDelta = (column: HTMLElement) => {
  clearWheelResetTimer(column);
  wheelDeltaByColumn.delete(column);
};

const scheduleWheelDeltaReset = (column: HTMLElement) => {
  clearWheelResetTimer(column);
  const timer = setTimeout(() => {
    wheelResetTimerByColumn.delete(column);
    wheelDeltaByColumn.delete(column);
  }, WHEEL_GESTURE_IDLE_MS);
  wheelResetTimerByColumn.set(column, timer);
};

const handleWheel = (event: WheelEvent) => {
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

const handleMouseMove = (event: MouseEvent) => {
  updateHoveredColumn(event.clientX, event.clientY);
};

export const enableDesktopPickerWheel = () => {
  if (isEnabled || typeof document === 'undefined' || !hasFinePointer()) {
    return;
  }

  document.addEventListener('mousemove', handleMouseMove, {
    capture: true,
    passive: true,
  });
  document.addEventListener('wheel', handleWheel, {
    capture: true,
    passive: false,
  });

  isEnabled = true;
};
