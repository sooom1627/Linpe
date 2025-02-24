import { type ReactNode } from "react";

export interface HalfModalProps {
  onClose: () => void;
}

export interface HalfModalComponentProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export interface HalfModalConfig {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  component: React.ComponentType<HalfModalProps>;
  lastAccessedAt?: number;
}

export interface HalfModalContextType {
  modals: Map<string, HalfModalConfig>;
  registerModal: (
    config: Omit<HalfModalConfig, "isOpen" | "lastAccessedAt">,
  ) => void;
  unregisterModal: (id: string) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
}

export interface HalfModalProviderProps {
  children: ReactNode;
}
