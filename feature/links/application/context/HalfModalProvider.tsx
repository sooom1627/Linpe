import { type ReactNode } from "react";

import { LinkActionModalProvider } from "./LinkActionModalContext";
import { LinkInputModalProvider } from "./LinkInputModalContext";

interface HalfModalProviderProps {
  children: ReactNode;
}

/**
 * HalfModalを使用するモーダル群のプロバイダー
 * 画面下部から表示されるモーダルの状態管理を一元化する
 */
export const HalfModalProvider = ({ children }: HalfModalProviderProps) => {
  return (
    <LinkInputModalProvider>
      <LinkActionModalProvider>{children}</LinkActionModalProvider>
    </LinkInputModalProvider>
  );
};
