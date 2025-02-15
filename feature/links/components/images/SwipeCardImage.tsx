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
          // キャッシュの有効化
          cache: "force-cache",
          // 画質の最適化（WebPフォーマットを優先）
          headers: {
            Accept: "image/webp,image/jpeg,image/png,image/*",
          },
          // 画像の品質を最適化（0.0 〜 1.0）
          scale: 1.0,
        }}
        // アクセシビリティ対応
        accessible={true}
        accessibilityLabel={`${title}の画像`}
        accessibilityRole="image"
        // プレースホルダー背景色を設定
        className="aspect-[1.91/1] w-full items-center justify-center rounded-lg bg-slate-50"
        // 画像の品質を最適化
        resizeMode="cover"
        // メモリ使用量を最適化
        blurRadius={0}
        // 画像の読み込みパフォーマンスを向上
        progressiveRenderingEnabled={true}
        // エラーハンドリングの追加
        onError={(e) =>
          console.error("Image loading error:", e.nativeEvent.error)
        }
      />
    </View>
  );
});
