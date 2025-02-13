import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

type FeaturedArticleCardProps = {
  title: string;
  source: string;
  imageUrl?: string;
};

export const FeaturedArticleCard = ({
  title,
  source,
  imageUrl = "https://picsum.photos/id/237/200/300",
}: FeaturedArticleCardProps) => {
  return (
    <View className="flex-1">
      <View className="flex-1">
        <Image
          source={{ uri: imageUrl }}
          className="aspect-[1.91/1] w-full rounded-lg"
          resizeMode="cover"
        />
        <View className="mt-2 flex-1 flex-col items-start justify-start gap-1">
          <ThemedText
            variant="body"
            weight="medium"
            color="default"
            numberOfLines={2}
            className="text-sm"
          >
            {title}
          </ThemedText>
          <ThemedText variant="caption" weight="normal" color="muted">
            {source}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
