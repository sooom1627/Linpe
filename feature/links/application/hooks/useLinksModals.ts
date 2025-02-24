import { useCallback, useEffect, useRef } from "react";

import { useHalfModal } from "@/components/layout/half-modal";
import { LinkActionView } from "../../presentation/views/LinkActionView";
import { LinkInputView } from "../../presentation/views/LinkInputView";

const MODAL_IDS = {
  LINK_INPUT: "link-input",
  LINK_ACTION: "link-action",
} as const;

const MODAL_COMPONENTS = {
  [MODAL_IDS.LINK_INPUT]: LinkInputView,
  [MODAL_IDS.LINK_ACTION]: LinkActionView,
} as const;

/**
 * Links機能で使用するモーダルを管理するフック
 */
export const useLinksModals = () => {
  const { registerModal, unregisterModal, openModal, closeModal } =
    useHalfModal();
  const registeredModals = useRef<Set<string>>(new Set());

  const registerModalIfNeeded = useCallback(
    (id: string) => {
      if (registeredModals.current.has(id)) return;

      const component = MODAL_COMPONENTS[id as keyof typeof MODAL_COMPONENTS];
      registerModal({
        id,
        component,
        onClose: () => closeModal(id),
      });
      registeredModals.current.add(id);
    },
    [registerModal, closeModal],
  );

  const openLinkInput = useCallback(() => {
    registerModalIfNeeded(MODAL_IDS.LINK_INPUT);
    openModal(MODAL_IDS.LINK_INPUT);
  }, [registerModalIfNeeded, openModal]);

  const openLinkAction = useCallback(() => {
    registerModalIfNeeded(MODAL_IDS.LINK_ACTION);
    openModal(MODAL_IDS.LINK_ACTION);
  }, [registerModalIfNeeded, openModal]);

  useEffect(() => {
    const modalsRef = registeredModals.current;
    return () => {
      modalsRef.forEach((id) => unregisterModal(id));
      modalsRef.clear();
    };
  }, [unregisterModal]);

  return {
    openLinkInput,
    closeLinkInput: useCallback(
      () => closeModal(MODAL_IDS.LINK_INPUT),
      [closeModal],
    ),
    openLinkAction,
    closeLinkAction: useCallback(
      () => closeModal(MODAL_IDS.LINK_ACTION),
      [closeModal],
    ),
  };
};
