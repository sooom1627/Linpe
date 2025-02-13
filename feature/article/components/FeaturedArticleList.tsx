import { View } from "react-native";

import { FeaturedArticleCard } from "./FeaturedArticleCard";

const dummyFeaturedArticles = [
  {
    title: "AIが変える2024年のソフトウェア開発トレンド",
    source: "TechCrunch Japan",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
  },
  {
    title: "次世代のクラウドアーキテクチャ：マイクロサービスの進化",
    source: "InfoQ",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
  },
];

export const FeaturedArticleList = () => {
  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {dummyFeaturedArticles.map((article, index) => (
        <View key={index} className="w-[48%]">
          <FeaturedArticleCard {...article} />
        </View>
      ))}
    </View>
  );
};
