import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CLEANUP_INTERVAL } from "./constants";
import { type HalfModalContextType } from "./types/context";
import { type HalfModalConfig } from "./types/modal";
import { type HalfModalProviderProps } from "./types/props";
import { filterUnusedModals } from "./utils/cleanup";
import { monitorModalCount } from "./utils/monitoring";
import {
  closeModal as closeModalOperation,
  openModal as openModalOperation,
  registerModal as registerModalOperation,
  unregisterModal as unregisterModalOperation,
} from "./utils/operations";

const HalfModalContext = createContext<HalfModalContextType | undefined>(
  undefined,
);

/**
 * HalfModalを使用するモーダル群のプロバイダー
 * 画面下部から表示されるモーダルの状態管理を一元化する
 */
export const HalfModalProvider = ({ children }: HalfModalProviderProps) => {
  const [modals, setModals] = useState<Map<string, HalfModalConfig>>(new Map());
  const modalCount = useRef(0);

  // メモリ使用量の監視
  useEffect(() => {
    modalCount.current = monitorModalCount(modals.size, modalCount.current);
  }, [modals.size]);

  // 未使用モーダルのクリーンアップ
  const cleanupUnusedModals = useCallback(() => {
    setModals((prev) => {
      const next = filterUnusedModals(prev);
      return next.size !== prev.size ? next : prev;
    });
  }, []);

  // 定期的なクリーンアップ
  useEffect(() => {
    const interval = setInterval(cleanupUnusedModals, CLEANUP_INTERVAL);
    return () => clearInterval(interval);
  }, [cleanupUnusedModals]);

  const registerModal = useCallback(
    (config: Omit<HalfModalConfig, "isOpen" | "lastAccessedAt">) => {
      setModals((prev) => registerModalOperation(prev, config));
    },
    [],
  );

  const unregisterModal = useCallback((id: string) => {
    setModals((prev) => unregisterModalOperation(prev, id));
  }, []);

  const openModal = useCallback((id: string) => {
    setModals((prev) => openModalOperation(prev, id));
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => closeModalOperation(prev, id));
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
