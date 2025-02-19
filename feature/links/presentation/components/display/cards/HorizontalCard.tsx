import { View } from "react-native";

import { PressableCard } from "@/components/pressable/PressableCard";
import { ThemedText } from "@/components/text/ThemedText";
import { useOpenBrowser } from "@/feature/links/application/hooks";
import { type Card } from "@/feature/links/domain/models/types";
import { CardImage } from "@/feature/links/presentation/components/display/images";
import { ErrorCard } from "@/feature/links/presentation/components/display/status/cards/ErrorCard";

type HorizontalCardProps = Pick<
  Card,
  "full_url" | "imageUrl" | "domain" | "title"
>;

export const HorizontalCard = ({
  full_url,
  imageUrl,
  domain,
  title,
}: HorizontalCardProps) => {
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
    <PressableCard
      onPress={handlePress}
      onLongPress={() => {
        console.log("long press");
      }}
    >
      <View className="flex-row items-center justify-start gap-3">
        <View className="aspect-[1.91/1] h-20">
          {imageUrl ? (
            <CardImage uri={imageUrl} title={title} />
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
