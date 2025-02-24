import { useCallback, useEffect } from "react";

import { useHalfModal } from "@/components/layout/half-modal";
import { LinkActionView } from "../../presentation/views/LinkActionView";
import { LinkInputView } from "../../presentation/views/LinkInputView";

const MODAL_IDS = {
  LINK_INPUT: "link-input",
  LINK_ACTION: "link-action",
} as const;

/**
 * Links機能で使用するモーダルを管理するフック
 */
export const useLinksModals = () => {
  const { registerModal, unregisterModal, openModal, closeModal } =
    useHalfModal();

  useEffect(() => {
    registerModal({
      id: MODAL_IDS.LINK_INPUT,
      component: LinkInputView,
      onClose: () => closeModal(MODAL_IDS.LINK_INPUT),
    });

    registerModal({
      id: MODAL_IDS.LINK_ACTION,
      component: LinkActionView,
      onClose: () => closeModal(MODAL_IDS.LINK_ACTION),
    });

    return () => {
      unregisterModal(MODAL_IDS.LINK_INPUT);
      unregisterModal(MODAL_IDS.LINK_ACTION);
    };
  }, [registerModal, unregisterModal, closeModal]);

  return {
    openLinkInput: useCallback(
      () => openModal(MODAL_IDS.LINK_INPUT),
      [openModal],
    ),
    closeLinkInput: useCallback(
      () => closeModal(MODAL_IDS.LINK_INPUT),
      [closeModal],
    ),
    openLinkAction: useCallback(
      () => openModal(MODAL_IDS.LINK_ACTION),
      [openModal],
    ),
    closeLinkAction: useCallback(
      () => closeModal(MODAL_IDS.LINK_ACTION),
      [closeModal],
    ),
  };
};
