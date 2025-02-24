import { useCallback, useEffect, useRef } from "react";

import { useHalfModal } from "@/components/layout/half-modal";
import { LinkActionView } from "../../../presentation/views/LinkActionView";
import { LinkInputView } from "../../../presentation/views/LinkInputView";

const MODAL_IDS = {
  LINK_INPUT: "link-input",
  LINK_ACTION: "link-action",
} as const;

type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS];

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
  const registeredModals = useRef<Set<ModalId>>(new Set());

  const registerModalIfNeeded = useCallback(
    (id: ModalId) => {
      if (registeredModals.current.has(id)) return;

      const component = MODAL_COMPONENTS[id];
      if (!component) {
        console.error(`Modal component not found for id: ${id}`);
        return;
      }

      try {
        registerModal({
          id,
          component,
          onClose: () => closeModal(id),
        });
        registeredModals.current.add(id);
      } catch (error) {
        console.error(`Failed to register modal: ${id}`, error);
      }
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
