import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

type FeaturedArticleCardProps = {
  title: string;
  domain: string;
  full_url: string;
};

export const FeaturedArticleCard = ({
  title,
  domain,
  full_url,
}: FeaturedArticleCardProps) => {
  return (
    <View className="flex-1">
      <View className="flex-1">
        <Image
          source={{ uri: full_url }}
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
            {domain}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
