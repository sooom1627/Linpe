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
      <Image source={{ uri: imageUrl }} className="h-20 w-32 rounded-lg" />
      <View className="flex-1 flex-col items-start justify-start gap-2">
        <ThemedText
          variant="caption"
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
