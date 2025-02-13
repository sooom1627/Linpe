import { View } from "react-native";

import { type ArticleListItem } from "@/feature/article/types/article";
import { FeaturedArticleCard } from "../cards/FeaturedCard";

type Props = {
  articles: ArticleListItem[];
};

export const FeaturedArticleList = ({ articles }: Props) => {
  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {articles.map((article) => (
        <View key={article.id} className="w-[48%]">
          <FeaturedArticleCard {...article} />
        </View>
      ))}
    </View>
  );
};
