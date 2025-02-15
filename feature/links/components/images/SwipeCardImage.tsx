import { memo } from "react";
import { Image, View } from "react-native";

interface SwipeCardImageProps {
  uri: string;
  title: string;
}

export const SwipeCardImage = memo(function SwipeCardImage({
  uri,
  title,
}: SwipeCardImageProps) {
  return (
    <View className="h-fit w-full">
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
        // エラーハンドリングの追加
        onError={(e) =>
          console.error("Image loading error:", e.nativeEvent.error)
        }
      />
    </View>
  );
});
