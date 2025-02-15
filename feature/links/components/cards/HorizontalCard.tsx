import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useOGData } from "@/feature/links/hooks/useOGData";
import { ErrorCard } from "./ErrorCard";
import { LoadingCard } from "./LoadingCard";

type HorizontalCardProps = {
  full_url: string;
};

export const HorizontalCard = ({ full_url }: HorizontalCardProps) => {
  const { ogData, isLoading, isError } = useOGData(full_url);

  if (isLoading) {
    return <LoadingCard variant="horizontal" />;
  }

  if (isError) {
    return <ErrorCard variant="horizontal" />;
  }

  return (
    <View className="flex-row items-center justify-start gap-3">
      <View className="w-36">
        <Image
          source={{ uri: ogData?.image }}
          className="aspect-[1.91/1] w-full rounded-lg"
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={`Article image for ${ogData?.title}`}
          onError={(e) =>
            console.error("Image loading error:", e.nativeEvent.error)
          }
        />
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
  );
};
