import { View } from "react-native";

import { HalfModal } from "@/components/layout/HalfModal";
import { ThemedText } from "@/components/text/ThemedText";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";
import { LinkInputForm } from "../forms/linkInputForm";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();

  return (
    <HalfModal isOpen={isOpen} onClose={closeModal}>
      <View className="flex-1 gap-4">
        <ThemedText variant="body" weight="semibold" color="default">
          {["Link Input"]}
        </ThemedText>
        <LinkInputForm />
      </View>
    </HalfModal>
  );
};
