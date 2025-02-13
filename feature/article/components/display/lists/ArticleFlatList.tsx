import { FlatList as RNFlatList, View } from "react-native";

import { type ArticleListItem } from "@/feature/article/types/article";
import { HorizontalCard } from "../cards/HorizontalCard";

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
      ItemSeparatorComponent={() => <View className="h-3" />}
    />
  );
};
