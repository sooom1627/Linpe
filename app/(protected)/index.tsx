import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import {
  ArticleFlatList,
  FeaturedArticleList,
} from "@/feature/article/components";
import { type ArticleListItem } from "@/feature/article/types/article";
import { TopView } from "@/feature/dashboad/components/TopView";

const dummyArticles: ArticleListItem[] = [
  {
    id: 1,
    title: "AIが変える2024年のソフトウェア開発トレンド",
    source: "TechCrunch Japan",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "次世代のクラウドアーキテクチャ：マイクロサービスの進化",
    source: "InfoQ",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title:
      "ドメイン駆動設計の実践により事業の成長スピードと保守性を両立するショッピングクーポン",
    source: "speaer.com",
    imageUrl: "https://picsum.photos/id/237/200",
  },
  {
    id: 4,
    title: "マイクロサービスアーキテクチャにおける効率的なデータ同期手法",
    source: "tech-blog.jp",
    imageUrl: "https://picsum.photos/id/433/200",
  },
  {
    id: 5,
    title: "ReactNativeとExpoを使った効率的なクロスプラットフォーム開発",
    source: "mobile-dev.com",
    imageUrl: "https://picsum.photos/id/1025/200",
  },
];

export default function Index() {
  const featuredArticles = dummyArticles.slice(0, 2);
  const regularArticles = dummyArticles.slice(2);

  return (
    <ScrollView className="flex-1">
      <View className="flex flex-col gap-4 p-4">
        <View className="items-left flex justify-start gap-2">
          <View className="flex items-start py-4">
            <View className="flex flex-row flex-wrap items-end">
              <ThemedText variant="h2" weight="medium" color="default">
                {["Start here,\ncapture your "]}
              </ThemedText>
              <ThemedText variant="h2" weight="medium" color="accent">
                {["insights"]}
              </ThemedText>
              <ThemedText variant="h2" weight="medium" color="default">
                {["."]}
              </ThemedText>
            </View>
          </View>
          <View className="mb-2 border-b border-zinc-400" />
          <TopView />
        </View>
        <View className="flex flex-col gap-4">
          <Title title="Recommend for you." />
          <FeaturedArticleList articles={featuredArticles} />
          <ArticleFlatList articles={regularArticles} />
        </View>
      </View>
    </ScrollView>
  );
}
