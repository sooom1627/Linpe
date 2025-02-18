import { useMemo } from "react";
import { FlatList as RNFlatList, View } from "react-native";

import { cardService } from "@/feature/links/application/service/cardService";
import {
  type LinkListItem,
  type OGData,
} from "@/feature/links/domain/models/types";
import { HorizontalCard } from "../cards";

type Props = {
  links: Pick<LinkListItem, "id" | "full_url">[];
  ogDataMap: { [key: string]: OGData | null };
};

export const LinksFlatList = ({ links, ogDataMap }: Props) => {
  const cards = useMemo(() => {
    return cardService.createCards(links, ogDataMap);
  }, [links, ogDataMap]);

  return (
    <RNFlatList
      data={cards}
      renderItem={({ item }) => <HorizontalCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListFooterComponent={() => <View className="h-4" />}
    />
  );
};
