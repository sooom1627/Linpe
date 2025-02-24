import { type HalfModalConfig } from "../types/modal";

/**
 * モーダルを登録する
 */
export const registerModal = (
  prev: Map<string, HalfModalConfig>,
  config: Omit<HalfModalConfig, "isOpen" | "lastAccessedAt">,
): Map<string, HalfModalConfig> => {
  return new Map(prev).set(config.id, {
    ...config,
    isOpen: false,
    lastAccessedAt: Date.now(),
  });
};

/**
 * モーダルを登録解除する
 */
export const unregisterModal = (
  prev: Map<string, HalfModalConfig>,
  id: string,
): Map<string, HalfModalConfig> => {
  const next = new Map(prev);
  next.delete(id);
  return next;
};

/**
 * モーダルを開く
 */
export const openModal = (
  prev: Map<string, HalfModalConfig>,
  id: string,
): Map<string, HalfModalConfig> => {
  const modal = prev.get(id);
  if (!modal) return prev;
  return new Map(prev).set(id, {
    ...modal,
    isOpen: true,
    lastAccessedAt: Date.now(),
  });
};

/**
 * モーダルを閉じる
 */
export const closeModal = (
  prev: Map<string, HalfModalConfig>,
  id: string,
): Map<string, HalfModalConfig> => {
  const modal = prev.get(id);
  if (!modal) return prev;
  return new Map(prev).set(id, {
    ...modal,
    isOpen: false,
    lastAccessedAt: Date.now(),
  });
};
