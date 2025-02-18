import { Image, View } from "react-native";

import { PressableCard } from "@/components/pressable/PressableCard";
import { ThemedText } from "@/components/text/ThemedText";
import { useOpenBrowser } from "@/feature/links/application/hooks";
import { type Card } from "@/feature/links/domain/models/types";
import { ErrorCard } from "./ErrorCard";

export const HorizontalCard = ({ full_url, imageUrl, domain, title }: Card) => {
  const handleOpenBrowser = useOpenBrowser();

  const handlePress = async () => {
    await handleOpenBrowser({
      url: full_url,
      domain: domain,
    });
  };

  if (!title && !imageUrl) {
    return <ErrorCard variant="horizontal" />;
  }

  return (
    <PressableCard onPress={handlePress}>
      <View className="flex-row items-center justify-start gap-3">
        <View className="aspect-[1.91/1] h-20">
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
        </View>
        <View className="flex-1 flex-col items-start justify-start gap-2">
          <ThemedText
            text={title ?? "No title"}
            variant="body"
            weight="medium"
            color="default"
            numberOfLines={2}
          />
          <ThemedText
            text={domain ?? "No domain"}
            variant="body"
            weight="normal"
            color="muted"
          />
        </View>
      </View>
    </PressableCard>
  );
};
