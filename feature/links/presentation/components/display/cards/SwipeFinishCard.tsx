import { View } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";

interface SwipeFinishCardProps {
  onReload: () => void;
}

export function SwipeFinishCard({ onReload }: SwipeFinishCardProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex flex-col items-center justify-center gap-2">
        <ThemedText
          text="You've seen all cards"
          variant="body"
          weight="normal"
          color="default"
        />
        <PrimaryButton onPress={onReload}>
          <ThemedText
            text="View Again"
            variant="body"
            weight="normal"
            color="white"
            className="px-2"
          />
        </PrimaryButton>
      </View>
    </View>
  );
}
