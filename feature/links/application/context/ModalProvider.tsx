import { type ReactNode } from "react";

import { LinkActionModalProvider } from "./LinkActionModalContext";
import { LinkInputModalProvider } from "./LinkInputModalContext";

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  return (
    <LinkInputModalProvider>
      <LinkActionModalProvider>{children}</LinkActionModalProvider>
    </LinkInputModalProvider>
  );
};
