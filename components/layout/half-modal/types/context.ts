import { type HalfModalConfig } from "./modal";

/**
 * ハーフモーダルのコンテキストタイプを定義するインターフェース
 */
export interface HalfModalContextType {
  modals: Map<string, HalfModalConfig>;
  registerModal: (
    config: Omit<HalfModalConfig, "isOpen" | "lastAccessedAt">,
  ) => void;
  unregisterModal: (id: string) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
}
