import { memo, useState } from "react";
import { View } from "react-native";
import { Check } from "lucide-react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import { type HalfModalProps } from "@/components/layout/half-modal/types/modal";
import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { LoadingCard } from "@/feature/links/presentation/components/display/status/cards/LoadingCard";
import {
  MarkActions,
  type MarkType,
} from "@/feature/links/presentation/components/input/actions";

export const LinkActionView = memo(function LinkActionView({
  onClose,
}: HalfModalProps) {
  const [selectedMark, setSelectedMark] = useState<MarkType | null>(null);

  const handleMarkAsRead = () => {
    if (selectedMark) {
      console.log("Selected mark type:", selectedMark);
      onClose();
    }
  };

  const handleDelete = () => {
    onClose();
  };

  return (
    <View className="flex-col gap-4">
      <View className="flex-row items-center justify-start gap-1">
        <Check size={16} color="#FA4714" />
        <Title title="Mark the link as" />
      </View>
      <LoadingCard variant="horizontal" />
      <MarkActions selectedMark={selectedMark} onSelect={setSelectedMark} />
      <View className="flex-row gap-2">
        <View className="flex-1">
          <AlertButton onPress={handleDelete}>
            <ThemedText
              text="Delete Link"
              variant="body"
              weight="medium"
              color="white"
            />
          </AlertButton>
        </View>
        <View className="flex-1">
          <PrimaryButton onPress={handleMarkAsRead} loading={false}>
            <ThemedText
              text={`Mark as ${selectedMark ?? ""}`}
              variant="body"
              weight="medium"
              color="white"
            />
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
});
