import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5分
const MAX_MODAL_COUNT = 10;
const MODAL_TIMEOUT = 10 * 60 * 1000; // 10分

/**
 * HalfModalを使用するモーダル群のプロバイダー
 * 画面下部から表示されるモーダルの状態管理を一元化する
 */
export const HalfModalProvider = ({ children }: HalfModalProviderProps) => {
  const [modals, setModals] = useState<Map<string, HalfModalConfig>>(new Map());
  const modalCount = useRef(0);

  // メモリ使用量の監視
  useEffect(() => {
    if (modals.size > modalCount.current) {
      modalCount.current = modals.size;
      if (modals.size > MAX_MODAL_COUNT) {
        console.warn(
          `Warning: Large number of modals registered (${modals.size}). Consider cleaning up unused modals.`,
        );
      }
    }
  }, [modals.size]);

  // 未使用モーダルのクリーンアップ
  const cleanupUnusedModals = useCallback(() => {
    const now = Date.now();
    setModals((prev) => {
      const next = new Map();
      let hasCleanedUp = false;

      prev.forEach((modal, id) => {
        // 開いているモーダルは削除しない
        if (modal.isOpen) {
          next.set(id, modal);
          return;
        }

        // 最後のアクセスから一定時間経過していないモーダルは保持
        if (
          modal.lastAccessedAt &&
          now - modal.lastAccessedAt < MODAL_TIMEOUT
        ) {
          next.set(id, modal);
          return;
        }

        hasCleanedUp = true;
      });

      return hasCleanedUp ? next : prev;
    });
  }, []);

  // 定期的なクリーンアップ
  useEffect(() => {
    const interval = setInterval(cleanupUnusedModals, CLEANUP_INTERVAL);
    return () => clearInterval(interval);
  }, [cleanupUnusedModals]);

  const registerModal = useCallback(
    (config: Omit<HalfModalConfig, "isOpen" | "lastAccessedAt">) => {
      setModals((prev) =>
        new Map(prev).set(config.id, {
          ...config,
          isOpen: false,
          lastAccessedAt: Date.now(),
        }),
      );
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
      const modal = prev.get(id);
      if (!modal) return prev;
      return new Map(prev).set(id, {
        ...modal,
        isOpen: true,
        lastAccessedAt: Date.now(),
      });
    });
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.get(id);
      if (!modal) return prev;
      return new Map(prev).set(id, {
        ...modal,
        isOpen: false,
        lastAccessedAt: Date.now(),
      });
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
