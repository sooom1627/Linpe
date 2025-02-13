import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { type ArticlePreview } from "@/feature/article/types/article";

type HorizontalCardProps = ArticlePreview;

export const HorizontalCard = ({
  title,
  source,
  imageUrl,
}: HorizontalCardProps) => {
  return (
    <View className="flex-row items-center justify-start gap-3 pb-3">
      <View className="w-36">
        <Image
          source={{ uri: imageUrl }}
          className="aspect-[1.91/1] w-full rounded-lg"
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={`${title}の記事イメージ`}
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
          {title}
        </ThemedText>
        <ThemedText variant="body" weight="normal" color="muted">
          {source}
        </ThemedText>
      </View>
    </View>
  );
};
