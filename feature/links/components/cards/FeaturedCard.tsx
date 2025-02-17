import { Image, View } from "react-native";

import { PressableCard } from "@/components/pressable/PressableCard";
import { ThemedText } from "@/components/text/ThemedText";
import { useOpenBrowser } from "@/feature/links/application/hooks/queries/browser/useOpenBrowser";
import { type OGData } from "@/feature/links/domain/models/types/links";
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
            source={{
              uri: ogData.image,
              cache: "force-cache",
              headers: {
                Accept: "image/webp,image/jpeg,image/png,image/*",
              },
              scale: 1.0,
            }}
            className="aspect-[1.91/1] w-full rounded-lg"
            resizeMode="cover"
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Article image for ${ogData?.title}`}
            progressiveRenderingEnabled={true}
            onError={(e) =>
              console.error("Image loading error:", e.nativeEvent.error)
            }
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
            {ogData?.title ?? "No title"}
          </ThemedText>
          <ThemedText variant="caption" weight="normal" color="muted">
            {ogData?.domain ?? "No domain"}
          </ThemedText>
        </View>
      </View>
    </PressableCard>
  );
};
