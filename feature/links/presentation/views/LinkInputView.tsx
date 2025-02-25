import { memo } from "react";
import { View } from "react-native";

import { LinkIcon } from "@/components/icons/LinkIcon";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { useLinkInput } from "@/feature/links/application/hooks";
import { LinkPreview } from "@/feature/links/presentation/components/display/preview";
import {
  LinkInputActions,
  LinkInputForm,
} from "@/feature/links/presentation/components/input";

export const LinkInputView = memo(function LinkInputView({
  onClose,
}: {
  onClose: () => void;
}) {
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
        onCancel={onClose}
        onAdd={handleAddLink}
        isLoading={isLoading}
        isError={isError}
        isSubmitting={isSubmitting}
        hasUrl={!!url}
      />
    </View>
  );
});
