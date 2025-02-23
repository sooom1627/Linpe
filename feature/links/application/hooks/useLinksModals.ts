import { useCallback, useEffect, useRef } from "react";

import { useHalfModal } from "@/components/layout/half-modal";
import { type HalfModalProps } from "@/components/layout/half-modal/types";
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
  const isRegistered = useRef(false);
  const modalCallbacks = useRef({
    openLinkInput: () => openModal(MODAL_IDS.LINK_INPUT),
    closeLinkInput: () => closeModal(MODAL_IDS.LINK_INPUT),
    openLinkAction: () => openModal(MODAL_IDS.LINK_ACTION),
    closeLinkAction: () => closeModal(MODAL_IDS.LINK_ACTION),
  });

  useEffect(() => {
    if (isRegistered.current) return;

    // リンク入力モーダルの登録
    registerModal({
      id: MODAL_IDS.LINK_INPUT,
      component: LinkInputView,
      onClose: modalCallbacks.current.closeLinkInput,
    });

    // リンクアクションモーダルの登録
    registerModal({
      id: MODAL_IDS.LINK_ACTION,
      component: LinkActionView,
      onClose: modalCallbacks.current.closeLinkAction,
    });

    isRegistered.current = true;

    return () => {
      unregisterModal(MODAL_IDS.LINK_INPUT);
      unregisterModal(MODAL_IDS.LINK_ACTION);
      isRegistered.current = false;
    };
  }, [registerModal, unregisterModal]);

  return modalCallbacks.current;
};
