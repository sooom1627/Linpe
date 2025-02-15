import { Image, View } from "react-native";

import { PressableCard } from "@/components/pressable/PressableCard";
import { ThemedText } from "@/components/text/ThemedText";
import { useOpenBrowser } from "@/feature/links/hooks/useOpenBrowser";
import { type OGData } from "@/feature/links/types/links";
import { ErrorCard } from "./ErrorCard";

type FeaturedArticleCardProps = {
  full_url: string;
  ogData: OGData | null;
};

export const FeaturedLinksCard = ({
  full_url,
  ogData,
}: FeaturedArticleCardProps) => {
  const handleOpenBrowser = useOpenBrowser();

  const handlePress = async () => {
    await handleOpenBrowser({
      url: full_url,
      domain: ogData?.domain,
    });
  };

  if (!ogData) {
    return <ErrorCard variant="featured" />;
  }

  return (
    <PressableCard onPress={handlePress} className="flex-1">
      <View className="flex-1 p-1">
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
    </PressableCard>
  );
};
