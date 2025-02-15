import { Image, View } from "react-native";

import { PressableCard } from "@/components/pressable/PressableCard";
import { ThemedText } from "@/components/text/ThemedText";
import { useOGData } from "../../hooks/useOGData";
import { useOpenBrowser } from "../../hooks/useOpenBrowser";
import { ErrorCard } from "./ErrorCard";
import { LoadingCard } from "./LoadingCard";

type HorizontalCardProps = {
  full_url: string;
};

export const HorizontalCard = ({ full_url }: HorizontalCardProps) => {
  const { ogData, isLoading, isError } = useOGData(full_url);
  const handleOpenBrowser = useOpenBrowser();

  const handlePress = async () => {
    await handleOpenBrowser({
      url: full_url,
      domain: ogData?.domain,
    });
  };

  if (isLoading) {
    return <LoadingCard variant="horizontal" />;
  }

  if (isError) {
    return <ErrorCard variant="horizontal" />;
  }

  return (
    <PressableCard onPress={handlePress}>
      <View className="flex-row items-center justify-start gap-3 p-1">
        <View className="w-36">
          {ogData?.image ? (
            <Image
              source={{ uri: ogData.image }}
              className="aspect-[1.91/1] w-full rounded-lg"
              resizeMode="cover"
              accessibilityRole="image"
              accessibilityLabel={`Article image for ${ogData?.title}`}
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
        </View>
        <View className="flex-1 flex-col items-start justify-start gap-2">
          <ThemedText
            variant="body"
            weight="medium"
            color="default"
            numberOfLines={2}
          >
            {ogData?.title}
          </ThemedText>
          <ThemedText variant="body" weight="normal" color="muted">
            {ogData?.domain}
          </ThemedText>
        </View>
      </View>
    </PressableCard>
  );
};
