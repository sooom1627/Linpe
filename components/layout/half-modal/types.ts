import { type ReactNode } from "react";

/**
 * ハーフモーダルの基本プロパティを定義するインターフェース
 */
export interface HalfModalProps {
  onClose: () => void;
}

/**
 * ハーフモーダルのコンポーネントプロパティを定義するインターフェース
 */
export interface HalfModalComponentProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ハーフモーダルの設定を定義するインターフェース
 */
export interface HalfModalConfig {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  component: React.ComponentType<HalfModalProps>;
  lastAccessedAt?: number;
}

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

/**
 * ハーフモーダルプロバイダーのプロパティを定義するインターフェース
 */
export interface HalfModalProviderProps {
  children: ReactNode;
}
