import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

export const HorizontalCard = () => {
  return (
    <View className="flex-row items-center justify-start gap-3">
      <Image
        source={{ uri: "https://picsum.photos/200" }}
        className="h-20 w-32 rounded-lg"
      />
      <View className="flex-1 flex-col items-start justify-start gap-2">
        <ThemedText
          variant="caption"
          weight="medium"
          color="default"
          numberOfLines={2}
        >
          {[
            "ドメイン駆動設計の実践により事業の成長スピードと保守性を両立するショッピングクーポン",
          ]}
        </ThemedText>
        <ThemedText variant="body" weight="normal" color="muted">
          {["speaer.com"]}
        </ThemedText>
      </View>
    </View>
  );
};
