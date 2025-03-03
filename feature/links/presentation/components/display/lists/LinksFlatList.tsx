import { useMemo } from "react";
import { FlatList as RNFlatList, View } from "react-native";
import { router } from "expo-router";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
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
  const { session } = useSessionContext();

  const cards = useMemo(() => {
    return cardService.createCards(links, ogDataMap);
  }, [links, ogDataMap]);

  const openBottomSheet = (cardId: number) => {
    const selectedCard = cards.find((card) => card.id === cardId);
    if (selectedCard && session?.user) {
      // URLパラメータとしてカード情報を渡す
      router.push({
        pathname: "/bottom-sheet/link-action",
        params: {
          linkId: selectedCard.link_id,
          userId: session.user.id,
        },
      });
    }
  };

  return (
    <RNFlatList
      data={cards}
      renderItem={({ item }) => (
        <HorizontalCard {...item} onAction={() => openBottomSheet(item.id)} />
      )}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListFooterComponent={() => <View className="h-4" />}
    />
  );
};
