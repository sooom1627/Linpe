import { memo } from "react";

import { HalfModal } from "./HalfModal";
import { useHalfModal } from "./HalfModalContext";

/**
 * 登録されたHalfModalをレンダリングするコンポーネント
 */
const HalfModalRendererComponent = () => {
  const { modals } = useHalfModal();

  return (
    <>
      {Array.from(modals.values()).map(
        ({ id, isOpen, onClose, component: Component }) => (
          <HalfModal key={id} isOpen={isOpen} onClose={onClose}>
            <Component onClose={onClose} />
          </HalfModal>
        ),
      )}
    </>
  );
};

HalfModalRendererComponent.displayName = "HalfModalRendererComponent";
export const HalfModalRenderer = memo(HalfModalRendererComponent);
