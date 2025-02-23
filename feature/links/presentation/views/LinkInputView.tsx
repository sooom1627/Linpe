import { View } from "react-native";

import { LinkIcon } from "@/components/icons/LinkIcon";
import { HalfModal } from "@/components/layout/HalfModal";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { useLinkInputModal } from "@/feature/links/application/context/LinkInputModalContext";
import { useLinkInput } from "@/feature/links/application/hooks";
import { LinkPreview } from "@/feature/links/presentation/components/display";
import {
  LinkInputActions,
  LinkInputForm,
} from "@/feature/links/presentation/components/input";

export const LinkInputView = () => {
  const { isOpen, closeModal } = useLinkInputModal();
  const { session } = useSessionContext();
  const {
    url,
    setUrl,
    isSubmitting,
    ogData,
    isLoading,
    isError,
    handleAddLink,
  } = useLinkInput(session?.user?.id);

  return (
    <HalfModal isOpen={isOpen} onClose={closeModal}>
      <View className="flex-1 gap-4">
        <View className="flex-row items-center justify-start gap-2">
          <LinkIcon size={16} color="#FA4714" />
          <Title title="Add a Link" />
        </View>
        <LinkInputForm onUrlChange={setUrl} />
        <LinkPreview
          full_url={url}
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
