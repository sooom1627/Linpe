import { Image, Pressable, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useOGData } from "@/feature/links/hooks/useOGData";
import { useOpenBrowser } from "@/feature/links/hooks/useOpenBrowser";
import { ErrorCard } from "./ErrorCard";
import { LoadingCard } from "./LoadingCard";

type FeaturedArticleCardProps = {
  full_url: string;
};

export const FeaturedLinksCard = ({ full_url }: FeaturedArticleCardProps) => {
  const { ogData, isLoading, isError } = useOGData(full_url);
  const handleOpenBrowser = useOpenBrowser();

  const handlePress = async () => {
    await handleOpenBrowser({
      url: full_url,
      domain: ogData?.domain,
    });
  };

  if (isLoading) {
    return <LoadingCard variant="featured" />;
  }

  if (isError) {
    return <ErrorCard variant="featured" />;
  }

  return (
    <Pressable onPress={handlePress} className="flex-1">
      <View className="flex-1">
        {ogData?.image ? (
          <Image
            source={{ uri: ogData.image }}
            className="aspect-[1.91/1] w-full rounded-lg"
            resizeMode="cover"
            accessibilityLabel={ogData?.title}
            onError={(error) => console.error("Image loading failed:", error)}
          />
        ) : (
          <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-gray-100">
            <ThemedText variant="body" weight="medium" color="muted">
              {["No image"]}
            </ThemedText>
          </View>
        )}
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
    </Pressable>
  );
};
