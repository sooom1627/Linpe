import { useEffect, useRef } from "react";
import { View, type TextInput } from "react-native";

import { HalfModal } from "@/components/layout/HalfModal";
import { ThemedText } from "@/components/text/ThemedText";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";
import { LinkInputForm } from "../forms/linkInputForm";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <HalfModal isOpen={isOpen} onClose={closeModal}>
      <View className="flex-1 gap-4">
        <ThemedText variant="body" weight="semibold" color="default">
          {["Link Input"]}
        </ThemedText>
        <LinkInputForm ref={inputRef} />
      </View>
    </HalfModal>
  );
};
