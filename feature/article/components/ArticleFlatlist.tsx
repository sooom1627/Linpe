import { FlatList as RNFlatList } from "react-native";

import { HorizontalCard } from "@/feature/article/components/HorizontalCard";
import { type ArticleListItem } from "@/feature/article/types/article";

type Props = {
  articles: ArticleListItem[];
};

export const ArticleFlatList = ({ articles }: Props) => {
  return (
    <RNFlatList
      data={articles}
      renderItem={({ item }) => <HorizontalCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      className="space-y-3"
    />
  );
};
