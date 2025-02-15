import { FlatList as RNFlatList, View } from "react-native";

import { type ArticleListItem } from "@/feature/links/types/links";
import { HorizontalCard } from "../cards/HorizontalCard";

type Props = {
  links: Pick<ArticleListItem, "id" | "full_url">[];
};

export const LinksFlatList = ({ links }: Props) => {
  return (
    <RNFlatList
      data={links}
      renderItem={({ item }) => <HorizontalCard full_url={item.full_url} />}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
    />
  );
};
