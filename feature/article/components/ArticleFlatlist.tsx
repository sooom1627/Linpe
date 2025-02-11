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
  {
    id: 4,
    title: "TypeScriptを活用したスケーラブルなアプリケーション設計",
    source: "typescript-daily.com",
    imageUrl: "https://picsum.photos/id/883/200",
  },
  {
    id: 5,
    title: "モダンなUIデザインとユーザビリティの両立手法",
    source: "design-patterns.net",
    imageUrl: "https://picsum.photos/id/534/200",
  },
  {
    id: 6,
    title: "Dockerを使用したマイクロサービスのデプロイメント戦略",
    source: "cloud-tech.io",
    imageUrl: "https://picsum.photos/id/342/200",
  },
  {
    id: 7,
    title: "GraphQLによるフロントエンドとバックエンドの効率的な連携",
    source: "api-design.com",
    imageUrl: "https://picsum.photos/id/447/200",
  },
  {
    id: 8,
    title: "AIを活用した自然言語処理システムの構築事例",
    source: "ai-solutions.net",
    imageUrl: "https://picsum.photos/id/654/200",
  },
  {
    id: 9,
    title: "セキュアなWebアプリケーション開発のベストプラクティス",
    source: "security-guide.org",
    imageUrl: "https://picsum.photos/id/776/200",
  },
  {
    id: 10,
    title: "効率的なCI/CDパイプラインの構築方法",
    source: "devops-daily.com",
    imageUrl: "https://picsum.photos/id/889/200",
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
