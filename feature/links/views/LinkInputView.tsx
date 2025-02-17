import { useEffect, useRef } from "react";
import { View, type TextInput } from "react-native";

import { LinkIcon } from "@/components/icons/LinkIcon";
import { HalfModal } from "@/components/layout/HalfModal";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";
import { LinkInputActions } from "../components/actions/LinkInputActions";
import { LinkInputForm } from "../components/forms/linkInputForm";
import { LinkPreview } from "../components/preview/LinkPreview";
import { useLinkInput } from "../hooks/useLinkInput";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();
  const { session } = useSessionContext();
  const inputRef = useRef<TextInput>(null);
  const {
    url,
    setUrl,
    isSubmitting,
    ogData,
    isLoading,
    isError,
    handleAddLink,
  } = useLinkInput(session?.user?.id);

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
        <View className="flex-row items-center justify-start gap-2">
          <LinkIcon size={16} color="#FA4714" />
          <Title title="Add a Link" />
        </View>
        <LinkInputForm onUrlChange={setUrl} />
        <LinkPreview
          url={url}
          ogData={ogData ?? null}
          isLoading={isLoading}
          isError={isError}
        />
        <LinkInputActions
          onCancel={closeModal}
          onAdd={handleAddLink}
          isLoading={isLoading}
          isError={isError}
          isSubmitting={isSubmitting}
          hasUrl={!!url}
        />
      </View>
    </HalfModal>
  );
};
