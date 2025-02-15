import { FlatList as RNFlatList, View } from "react-native";

import { type ArticleListItem } from "@/feature/links/types/links";
import { useOGDataBatch } from "../../hooks/useOGDataBatch";
import { HorizontalCard } from "../cards/HorizontalCard";
import { LoadingCard } from "../cards/LoadingCard";

type Props = {
  links: Pick<ArticleListItem, "id" | "full_url">[];
};

export const LinksFlatList = ({ links }: Props) => {
  const { dataMap, loading } = useOGDataBatch(
    links.map((link) => link.full_url),
  );

  if (loading) {
    return (
      <View className="flex flex-col gap-3">
        {Array.from({ length: links.length }).map((_, index) => (
          <LoadingCard key={index} variant="horizontal" />
        ))}
      </View>
    );
  }

  return (
    <RNFlatList
      data={links}
      renderItem={({ item }) => (
        <HorizontalCard
          full_url={item.full_url}
          ogData={dataMap[item.full_url]}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
    />
  );
};
