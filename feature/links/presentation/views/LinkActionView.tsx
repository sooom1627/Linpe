import { View } from "react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { HalfModal } from "@/components/layout/HalfModal";
import { ThemedText } from "@/components/text/ThemedText";
import { useLinkActionModal } from "@/feature/links/application/context/LinkActionModalContext";

export const LinkActionView = () => {
  const { isOpen, closeModal, onMarkAsRead, onDelete } = useLinkActionModal();

  return (
    <HalfModal isOpen={isOpen} onClose={closeModal}>
      <View className="flex-col gap-4">
        <PrimaryButton onPress={onMarkAsRead}>
          <ThemedText
            text="既読にする"
            variant="body"
            weight="medium"
            color="white"
          />
        </PrimaryButton>

        <AlertButton onPress={onDelete}>
          <ThemedText
            text="削除"
            variant="body"
            weight="medium"
            color="white"
          />
        </AlertButton>
      </View>
    </HalfModal>
  );
};
