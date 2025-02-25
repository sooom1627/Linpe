import { useMemo } from "react";
import { FlatList as RNFlatList, View } from "react-native";
import { router } from "expo-router";

import { cardService } from "@/feature/links/application/service/cardService";
import {
  type OGData,
  type UserLink,
} from "@/feature/links/domain/models/types";
import { HorizontalCard } from "../cards";

type Props = {
  links: UserLink[];
  ogDataMap: { [key: string]: OGData | null };
};

export const LinksFlatList = ({ links, ogDataMap }: Props) => {
  const cards = useMemo(() => {
    return cardService.createCards(links, ogDataMap);
  }, [links, ogDataMap]);

  const openBottomSheet = () => {
    router.push("/bottom-sheet/link-action");
  };

  return (
    <RNFlatList
      data={cards}
      renderItem={({ item }) => (
        <HorizontalCard {...item} onAction={openBottomSheet} />
      )}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListFooterComponent={() => <View className="h-4" />}
    />
  );
};
