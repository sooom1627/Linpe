import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  type HalfModalConfig,
  type HalfModalContextType,
  type HalfModalProviderProps,
} from "./types";

const HalfModalContext = createContext<HalfModalContextType | undefined>(
  undefined,
);

/**
 * HalfModalを使用するモーダル群のプロバイダー
 * 画面下部から表示されるモーダルの状態管理を一元化する
 */
export const HalfModalProvider = ({ children }: HalfModalProviderProps) => {
  const [modals, setModals] = useState<Map<string, HalfModalConfig>>(new Map());

  const registerModal = useCallback(
    (config: Omit<HalfModalConfig, "isOpen">) => {
      setModals((prev) => {
        const next = new Map(prev);
        next.set(config.id, { ...config, isOpen: false });
        return next;
      });
    },
    [],
  );

  const unregisterModal = useCallback((id: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const openModal = useCallback((id: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      const modal = next.get(id);
      if (modal) {
        next.set(id, { ...modal, isOpen: true });
      }
      return next;
    });
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      const modal = next.get(id);
      if (modal) {
        next.set(id, { ...modal, isOpen: false });
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      modals,
      registerModal,
      unregisterModal,
      openModal,
      closeModal,
    }),
    [modals, registerModal, unregisterModal, openModal, closeModal],
  );

  return (
    <HalfModalContext.Provider value={value}>
      {children}
    </HalfModalContext.Provider>
  );
};

/**
 * HalfModalの状態を管理するフック
 * HalfModalProviderの配下でのみ使用可能
 */
export const useHalfModal = () => {
  const context = useContext(HalfModalContext);
  if (!context) {
    throw new Error("useHalfModal must be used within a HalfModalProvider");
  }
  return context;
};
