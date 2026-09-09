const errorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

// Restoring the UI must preserve the result of the copy operation.
const restore = (action: () => void) => {
  try {
    action();
  } catch {
    // The original element or selection may have disappeared during copying.
  }
};

const copyTextFallback = (text: string): void => {
  if (typeof document === "undefined" || !document.body) {
    throw new Error("Clipboard fallback requires a document body");
  }

  const activeElement = document.activeElement as HTMLElement | null;
  const selection = window.getSelection();
  const ranges: Range[] = [];
  for (let i = 0; selection && i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i).cloneRange());
  }
  const input = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement
    ? activeElement
    : null;
  const inputSelection = input && input.selectionStart !== null
    ? { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection }
    : null;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const scrollPositions: { element: HTMLElement; left: number; top: number }[] = [];
  for (let element = activeElement; element; element = element.parentElement) {
    scrollPositions.push({ element, left: element.scrollLeft, top: element.scrollTop });
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.tabIndex = -1;
  textarea.style.cssText = "position:fixed;top:0;left:-9999px;width:1px;height:1px;font-size:16px;opacity:0;";

  try {
    document.body.appendChild(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    if (!document.execCommand("copy")) {
      throw new Error("Clipboard fallback copy command failed");
    }
  } finally {
    restore(() => textarea.remove());
    restore(() => activeElement?.focus({ preventScroll: true }));
    if (selection) {
      restore(() => selection.removeAllRanges());
      for (const range of ranges) restore(() => selection.addRange(range));
    }
    if (input && inputSelection) {
      restore(() => input.setSelectionRange(inputSelection.start, inputSelection.end, inputSelection.direction));
    }
    for (const { element, left, top } of scrollPositions) {
      restore(() => {
        element.scrollLeft = left;
        element.scrollTop = top;
      });
    }
    restore(() => window.scrollTo(scrollX, scrollY));
  }
};

/** Copy text using the native API, then a checked legacy copy command. */
export async function copyText(text: string): Promise<void> {
  let nativeError: unknown = new Error("Clipboard API is unavailable");

  try {
    // if navigator.clipboard.writeText is supported
    if (typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (error) {
    nativeError = error;
    console.warn("navigator.clipboard.writeText failed; attempting fallback copy", error);
  }

  try {
    copyTextFallback(text);
  } catch (fallbackError) {
    throw Object.assign(
      new Error(`Clipboard write failed: ${errorMessage(nativeError)}; fallback: ${errorMessage(fallbackError)}`),
      { nativeError, fallbackError },
    );
  }
}
