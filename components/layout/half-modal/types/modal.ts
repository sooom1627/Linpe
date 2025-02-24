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
