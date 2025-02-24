import { useCallback, useEffect, useRef } from "react";

import { useHalfModal } from "@/components/layout/half-modal";
import { type HalfModalProps } from "@/components/layout/half-modal/types/modal";

const MODAL_IDS = {
  LINK_INPUT: "link-input",
  LINK_ACTION: "link-action",
} as const;

type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS];

type ModalViews = Partial<{
  LinkInputView: React.ComponentType<HalfModalProps>;
  LinkActionView: React.ComponentType<HalfModalProps>;
}>;

const noop = () => {};

/**
 * Links機能で使用するモーダルを管理するフック
 */
export const useLinksModals = (views: ModalViews = {}) => {
  const { registerModal, unregisterModal, openModal, closeModal } =
    useHalfModal();
  const registeredModals = useRef<Set<ModalId>>(new Set());

  const registerModalIfNeeded = useCallback(
    (id: ModalId) => {
      if (registeredModals.current.has(id)) return;

      try {
        const component =
          id === MODAL_IDS.LINK_INPUT
            ? views.LinkInputView
            : views.LinkActionView;

        if (!component) {
          console.error(`Modal component not found for id: ${id}`);
          return;
        }

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
    [registerModal, closeModal, views],
  );

  const openLinkInput = useCallback(() => {
    if (!views.LinkInputView) return;
    registerModalIfNeeded(MODAL_IDS.LINK_INPUT);
    openModal(MODAL_IDS.LINK_INPUT);
  }, [registerModalIfNeeded, openModal, views.LinkInputView]);

  const openLinkAction = useCallback(() => {
    if (!views.LinkActionView) return;
    registerModalIfNeeded(MODAL_IDS.LINK_ACTION);
    openModal(MODAL_IDS.LINK_ACTION);
  }, [registerModalIfNeeded, openModal, views.LinkActionView]);

  useEffect(() => {
    const modalsRef = registeredModals.current;
    return () => {
      modalsRef.forEach((id) => unregisterModal(id));
      modalsRef.clear();
    };
  }, [unregisterModal]);

  return {
    openLinkInput: views.LinkInputView ? openLinkInput : noop,
    closeLinkInput: views.LinkInputView
      ? () => closeModal(MODAL_IDS.LINK_INPUT)
      : noop,
    openLinkAction: views.LinkActionView ? openLinkAction : noop,
    closeLinkAction: views.LinkActionView
      ? () => closeModal(MODAL_IDS.LINK_ACTION)
      : noop,
  };
};
