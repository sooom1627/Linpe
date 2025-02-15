import { FlatList as RNFlatList, View } from "react-native";

import { type ArticleListItem, type OGData } from "@/feature/links/types/links";
import { HorizontalCard } from "../cards/HorizontalCard";

type Props = {
  links: Pick<ArticleListItem, "id" | "full_url">[];
  ogDataMap: { [key: string]: OGData | null };
};

export const LinksFlatList = ({ links, ogDataMap }: Props) => {
  return (
    <RNFlatList
      data={links}
      renderItem={({ item }) => (
        <HorizontalCard
          full_url={item.full_url}
          ogData={ogDataMap[item.full_url]}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
    />
  );
};
