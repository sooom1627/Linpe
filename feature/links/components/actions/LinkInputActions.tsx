import { View } from "react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";

interface LinkInputActionsProps {
  onCancel: () => void;
  onAdd: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  isSubmitting: boolean;
  hasUrl: boolean;
}

export const LinkInputActions = ({
  onCancel,
  onAdd,
  isLoading,
  isError,
  isSubmitting,
  hasUrl,
}: LinkInputActionsProps) => {
  return (
    <View className="flex-row gap-2">
      <View className="flex-1">
        <AlertButton onPress={onCancel} testID="cancel-button">
          <ThemedText className="text-white" weight="medium">
            {["Cancel"]}
          </ThemedText>
        </AlertButton>
      </View>
      <View className="flex-1">
        <PrimaryButton
          onPress={onAdd}
          testID="add-link-button"
          loading={isLoading || !hasUrl || isError || isSubmitting}
        >
          <ThemedText className="text-white" weight="medium">
            {["Add Link"]}
          </ThemedText>
        </PrimaryButton>
      </View>
    </View>
  );
};
