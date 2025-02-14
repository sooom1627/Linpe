import { useEffect, useState } from "react";
import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { fetchOGData } from "@/feature/article/service/ogService";

type HorizontalCardProps = {
  full_url: string;
};

export const HorizontalCard = ({ full_url }: HorizontalCardProps) => {
  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOGData = async () => {
      try {
        const ogData = await fetchOGData(full_url);
        setTitle(ogData.title);
        setImageUrl(ogData.image);
        setDomain(ogData.domain);
      } catch (error) {
        console.error("OG情報の読み込みに失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOGData();
  }, [full_url]);

  if (isLoading) {
    return (
      <View className="flex-row items-center justify-start gap-3 pb-3">
        <View className="w-36">
          <View className="aspect-[1.91/1] w-full rounded-lg bg-gray-200" />
        </View>
        <View className="flex-1 flex-col items-start justify-start gap-2">
          <View className="h-4 w-3/4 rounded bg-gray-200" />
          <View className="h-4 w-1/2 rounded bg-gray-200" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-start gap-3 pb-3">
      <View className="w-36">
        <Image
          source={{ uri: imageUrl }}
          className="aspect-[1.91/1] w-full rounded-lg"
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={`${title}の記事イメージ`}
          onError={(e) =>
            console.error("画像読み込みエラー:", e.nativeEvent.error)
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
          {title}
        </ThemedText>
        <ThemedText variant="body" weight="normal" color="muted">
          {domain}
        </ThemedText>
      </View>
    </View>
  );
};
