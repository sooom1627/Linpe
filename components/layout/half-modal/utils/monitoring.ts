import { MAX_MODAL_COUNT } from "../constants";

/**
 * モーダル数を監視し、警告を出力する
 */
export const monitorModalCount = (
  currentSize: number,
  previousMax: number,
): number => {
  if (currentSize > previousMax) {
    if (currentSize > MAX_MODAL_COUNT) {
      console.warn(
        `Warning: Large number of modals registered (${currentSize}). Consider cleaning up unused modals.`,
      );
    }
    return currentSize;
  }
  return previousMax;
};
