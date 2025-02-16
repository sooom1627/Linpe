import { HalfModal } from "@/components/layout/HalfModal";
import { ThemedText } from "@/components/text/ThemedText";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();

  return (
    <HalfModal isOpen={isOpen} onClose={closeModal}>
      <ThemedText variant="body" weight="semibold" color="default">
        {["Link Input"]}
      </ThemedText>
    </HalfModal>
  );
};
