import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useOGData } from "@/feature/article/hooks/useOGData";

type FeaturedArticleCardProps = {
  full_url: string;
};

export const FeaturedLinksCard = ({ full_url }: FeaturedArticleCardProps) => {
  const { ogData, isLoading } = useOGData(full_url);

  if (isLoading) {
    return (
      <View className="flex-1">
        <View className="flex-1">
          <View className="aspect-[1.91/1] w-full rounded-lg bg-gray-200" />
          <View className="mt-2 flex-1 flex-col items-start justify-start gap-1">
            <View className="h-4 w-3/4 rounded bg-gray-200" />
            <View className="h-3 w-1/2 rounded bg-gray-200" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Image
          source={{ uri: ogData?.image }}
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
            {ogData?.title}
          </ThemedText>
          <ThemedText variant="caption" weight="normal" color="muted">
            {ogData?.domain}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
