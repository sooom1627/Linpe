import { View } from "react-native";

import { Title } from "@/components/text/Title";
import { type ArticleListItem } from "../types/article";
import { ArticleFlatList } from "./lists/ArticleFlatList";
import { FeaturedArticleList } from "./lists/FeaturedList";

const dummyArticles: ArticleListItem[] = [
  {
    id: "1",
    title: "AIが変える2024年のソフトウェア開発トレンド",
    domain: "TechCrunch Japan",
    full_url: "https://reactiive.io/articles/checkbox-interactions",
  },
  {
    id: "2",
    title: "次世代のクラウドアーキテクチャ：マイクロサービスの進化",
    domain: "InfoQ",
    full_url:
      "https://speakerdeck.com/yuhattor/developer-summit-2025-14-d-1-yuki-hattori",
  },
  {
    id: "3",
    title:
      "ドメイン駆動設計の実践により事業の成長スピードと保守性を両立するショッピングクーポン",
    domain: "speaer.com",
    full_url: "https://www.youtube.com/live/dT7hlszpO04?si=7SfFdywPVwzaDHY7",
  },
  {
    id: "4",
    title: "マイクロサービスアーキテクチャにおける効率的なデータ同期手法",
    domain: "tech-blog.jp",
    full_url:
      "https://techcrunch.com/2025/02/03/tana-snaps-up-25m-with-its-ai-powered-knowledge-graph-for-work-racking-up-a-160k-waitlist/",
  },
  {
    id: "5",
    title: "ReactNativeとExpoを使った効率的なクロスプラットフォーム開発",
    domain: "mobile-dev.com",
    full_url: "https://note.jp/n/n19559633b13e?gs=ece1f6ba2c4a",
  },
];

export const LinksTopView = () => {
  const featuredArticles = dummyArticles.slice(0, 2);
  const regularArticles = dummyArticles.slice(2);

  return (
    <View className="flex flex-col gap-4">
      <Title title="Recommend for you." />
      <FeaturedArticleList articles={featuredArticles} />
      <ArticleFlatList articles={regularArticles} />
    </View>
  );
};
