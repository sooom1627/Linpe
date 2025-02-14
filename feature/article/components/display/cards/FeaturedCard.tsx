import { useEffect, useState } from "react";
import { Image, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { fetchOGData } from "@/feature/article/service/ogService";

type FeaturedArticleCardProps = {
  full_url: string;
};

export const FeaturedArticleCard = ({ full_url }: FeaturedArticleCardProps) => {
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
      <View className="flex-1">
        <View className="aspect-[1.91/1] w-full rounded-lg bg-gray-200" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Image
          source={{ uri: imageUrl }}
          className="aspect-[1.91/1] w-full rounded-lg"
          resizeMode="cover"
        />
        <View className="mt-2 flex-1 flex-col items-start justify-start gap-1">
          <ThemedText
            variant="body"
            weight="medium"
            color="default"
            numberOfLines={2}
            className="text-sm"
          >
            {title}
          </ThemedText>
          <ThemedText variant="caption" weight="normal" color="muted">
            {domain}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
