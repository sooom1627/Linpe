import { memo } from "react";
import { View } from "react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { type HalfModalProps } from "@/components/layout/half-modal/types";
import { ThemedText } from "@/components/text/ThemedText";

const LinkActionViewComponent = ({ onClose }: HalfModalProps) => {
  const handleMarkAsRead = () => {
    // TODO: 既読機能の実装
    onClose();
  };

  const handleDelete = () => {
    // TODO: 削除機能の実装
    onClose();
  };

  return (
    <View className="flex-col gap-4">
      <PrimaryButton onPress={handleMarkAsRead}>
        <ThemedText
          text="既読にする"
          variant="body"
          weight="medium"
          color="white"
        />
      </PrimaryButton>

      <AlertButton onPress={handleDelete}>
        <ThemedText text="削除" variant="body" weight="medium" color="white" />
      </AlertButton>
    </View>
  );
};

export const LinkActionView = memo(LinkActionViewComponent);
LinkActionView.displayName = "LinkActionView";
