import { memo, useState } from "react";
import { Image, Text, View } from "react-native";

interface SwipeCardImageProps {
  uri: string;
  title: string;
}

export const SwipeCardImage = memo(function SwipeCardImage({
  uri,
  title,
}: SwipeCardImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <View className="h-fit w-full">
      {!hasError ? (
        <Image
          source={{
            uri,
            cache: "force-cache",
            headers: {
              Accept: "image/webp,image/jpeg,image/png,image/*",
            },
            scale: 1.0,
          }}
          accessible={true}
          accessibilityLabel={`${title} image`}
          accessibilityRole="image"
          className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-50"
          resizeMode="cover"
          blurRadius={0}
          progressiveRenderingEnabled={true}
          onError={(e) => {
            setHasError(true);
            console.error("Image loading error:", e.nativeEvent.error);
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
