import { FlatList as RNFlatList, View } from "react-native";

import { type ArticleListItem } from "@/feature/article/types/article";
import { HorizontalCard } from "../cards/HorizontalCard";

type Props = {
  articles: Pick<ArticleListItem, "id" | "full_url">[];
};

export const ArticleFlatList = ({ articles }: Props) => {
  return (
    <RNFlatList
      data={articles}
      renderItem={({ item }) => <HorizontalCard full_url={item.full_url} />}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
    />
  );
};
