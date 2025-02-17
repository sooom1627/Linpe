import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  useLinkInput,
  useOGData,
} from "feature/links/application/hooks/queries";

import { LinkIcon } from "@/components/icons/LinkIcon";
import { HalfModal } from "@/components/layout/HalfModal";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useLinkInputModal } from "@/feature/links/contexts/LinkInputModalContext";
import { LinkInputActions } from "../components/actions/LinkInputActions";
import { LinkInputForm } from "../components/forms/linkInputForm";
import { LinkPreview } from "../components/preview/LinkPreview";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();
  const { session } = useSessionContext();
  const [url, setUrl] = useState("");
  const { isSubmitting, handleAddLink } = useLinkInput(session?.user?.id);
  const { ogData, isLoading, isError } = useOGData(url);

  const clearForm = () => {
    setUrl("");
  };

  const handleClose = () => {
    clearForm();
    closeModal();
  };

  useEffect(() => {
    if (isOpen) {
      clearForm();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const success = await handleAddLink(url);
    if (success) {
      setUrl("");
    }
  };

  return (
    <HalfModal isOpen={isOpen} onClose={handleClose}>
      <View className="flex-1 gap-4">
        <View className="flex-row items-center justify-start gap-2">
          <LinkIcon size={16} color="#FA4714" />
          <Title title="Add a Link" />
        </View>
        <LinkInputForm url={url} onUrlChange={setUrl} />
        <LinkPreview
          url={url}
          ogData={ogData ?? null}
          isLoading={isLoading}
          isError={isError}
        />
        <LinkInputActions
          onCancel={handleClose}
          onAdd={handleSubmit}
          isLoading={isLoading}
          isError={isError}
          isSubmitting={isSubmitting}
          hasUrl={!!url}
        />
      </View>
    </HalfModal>
  );
};
