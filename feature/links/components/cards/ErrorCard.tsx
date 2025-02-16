import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

type ErrorCardProps = {
  variant: "featured" | "horizontal";
};

export const ErrorCard = ({ variant }: ErrorCardProps) => {
  if (variant === "featured") {
    return (
      <View className="flex-1">
        <View className="flex-1 flex-col items-start justify-start gap-2">
          <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-gray-100 p-2">
            <ThemedText variant="body" weight="medium" color="muted">
              {["Something went wrong", "Failed to load image"]}
            </ThemedText>
          </View>
          <ThemedText variant="body" weight="medium" color="muted">
            {["Something went wrong. ", "Failed to load data"]}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-start gap-3">
      <View className="w-36">
        <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-gray-100">
          <ThemedText variant="body" weight="medium" color="muted">
            {["エラーが発生しました", "画像の取得に失敗しました"]}
          </ThemedText>
        </View>
      </View>
      <View className="flex-1 flex-col items-start justify-start gap-2">
        <ThemedText variant="body" weight="medium" color="muted">
          {["エラーが発生しました", "画像の取得に失敗しました"]}
        </ThemedText>
      </View>
    </View>
  );
};
