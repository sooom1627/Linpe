import { MODAL_TIMEOUT } from "../constants";
import { type HalfModalConfig } from "../types/modal";

/**
 * モーダルをクリーンアップする必要があるかを判断する
 */
export const shouldCleanupModal = (
  modal: HalfModalConfig,
  now: number = Date.now(),
): boolean => {
  // 開いているモーダルは削除しない
  if (modal.isOpen) {
    return false;
  }

  // 最後のアクセスから一定時間経過していないモーダルは保持
  if (modal.lastAccessedAt && now - modal.lastAccessedAt < MODAL_TIMEOUT) {
    return false;
  }

  return true;
};

/**
 * 未使用モーダルをフィルタリングする
 */
export const filterUnusedModals = (
  modals: Map<string, HalfModalConfig>,
): Map<string, HalfModalConfig> => {
  const now = Date.now();
  const filtered = new Map<string, HalfModalConfig>();

  modals.forEach((modal, id) => {
    if (!shouldCleanupModal(modal, now)) {
      filtered.set(id, modal);
    }
  });

  return filtered;
};
