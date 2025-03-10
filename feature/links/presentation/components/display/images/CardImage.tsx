import { memo, useState } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

interface CardImageProps {
  uri: string;
  title: string;
}

export const CardImage = memo(function CardImage({
  uri,
  title,
}: CardImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <View className="h-fit w-full">
      {!hasError ? (
        <Image
          source={{ uri }}
          cachePolicy="memory-disk"
          contentFit="cover"
          transition={200}
          accessible={true}
          accessibilityLabel={`${title} image`}
          accessibilityRole="image"
          className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-50"
          onError={(e) => {
            setHasError(true);
            console.error("Image loading error:", e);
          }}
        />
      ) : (
        <View className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-100">
          <Text>Failed to load image</Text>
        </View>
      )}
    </View>
  );
});
