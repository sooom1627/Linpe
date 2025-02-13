import { FlatList as RNFlatList } from "react-native";

import { HorizontalCard } from "@/feature/article/components/HorizontalCard";
import { type ArticleListItem } from "@/feature/article/types/article";

const dummyArticles: ArticleListItem[] = [
  {
    id: 1,
    title:
      "ドメイン駆動設計の実践により事業の成長スピードと保守性を両立するショッピングクーポン",
    source: "speaer.com",
    imageUrl: "https://picsum.photos/id/237/200",
  },
  {
    id: 2,
    title: "マイクロサービスアーキテクチャにおける効率的なデータ同期手法",
    source: "tech-blog.jp",
    imageUrl: "https://picsum.photos/id/433/200",
  },
  {
    id: 3,
    title: "ReactNativeとExpoを使った効率的なクロスプラットフォーム開発",
    source: "mobile-dev.com",
    imageUrl: "https://picsum.photos/id/1025/200",
  },
];

export const ArticleFlatList = () => {
  return (
    <RNFlatList
      data={dummyArticles}
      renderItem={({ item }) => <HorizontalCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      className="space-y-3"
    />
  );
};
