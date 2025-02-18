import { Image, View } from "react-native";

import { PressableCard } from "@/components/pressable/PressableCard";
import { ThemedText } from "@/components/text/ThemedText";
import { useOpenBrowser } from "@/feature/links/application/hooks";
import { type Card } from "@/feature/links/domain/models/types";
import { ErrorCard } from "./ErrorCard";

export const FeaturedLinksCard = ({
  title,
  imageUrl,
  domain,
  full_url,
}: Card) => {
  const handleOpenBrowser = useOpenBrowser();

  const handlePress = async () => {
    await handleOpenBrowser({
      url: full_url,
      domain: domain,
    });
  };

  if (!title && !imageUrl) {
    return <ErrorCard variant="featured" />;
  }

  return (
    <PressableCard onPress={handlePress} className="flex-1">
      <View className="flex-1 p-1">
        {imageUrl ? (
          <Image
            source={{
              uri: imageUrl,
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
            accessibilityLabel={`Article image for ${title}`}
            progressiveRenderingEnabled={true}
            onError={(e) =>
              console.error("Image loading error:", e.nativeEvent.error)
            }
          />
        ) : (
          <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-gray-100">
            <ThemedText
              text="No image"
              variant="body"
              weight="medium"
              color="muted"
            />
          </View>
        )}
        <View className="mt-2 flex-1 flex-col items-start justify-start gap-1">
          <ThemedText
            text={title ?? "No title"}
            variant="body"
            weight="medium"
            color="default"
            numberOfLines={2}
            className="text-sm"
          />
          <ThemedText
            text={domain ?? "No domain"}
            variant="caption"
            weight="normal"
            color="muted"
          />
        </View>
      </View>
    </PressableCard>
  );
};
