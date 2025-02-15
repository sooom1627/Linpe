import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useOGData } from "@/feature/links/hooks/useOGData";

type HorizontalCardProps = {
  full_url: string;
};

export const HorizontalCard = ({ full_url }: HorizontalCardProps) => {
  const { ogData, isLoading } = useOGData(full_url);

  if (isLoading) {
    return (
      <View className="flex-row items-center justify-start gap-3">
        <View className="w-36">
          <View className="aspect-[1.91/1] w-full rounded-lg bg-gray-200" />
        </View>
        <View className="flex-1 flex-col items-start justify-start gap-2">
          <View className="h-4 w-3/4 rounded bg-gray-200" />
          <View className="h-4 w-1/2 rounded bg-gray-200" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-start gap-3">
      <View className="w-36">
        <Image
          source={{ uri: ogData?.image }}
          className="aspect-[1.91/1] w-full rounded-lg"
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={`${ogData?.title}の記事イメージ`}
          onError={(e) =>
            console.error("画像読み込みエラー:", e.nativeEvent.error)
          }
        />
      </View>
      <View className="flex-1 flex-col items-start justify-start gap-2">
        <ThemedText
          variant="body"
          weight="medium"
          color="default"
          numberOfLines={2}
        >
          {ogData?.title}
        </ThemedText>
        <ThemedText variant="body" weight="normal" color="muted">
          {ogData?.domain}
        </ThemedText>
      </View>
    </View>
  );
};
