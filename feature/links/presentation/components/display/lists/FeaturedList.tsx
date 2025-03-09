import { useMemo } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { cardService } from "@/feature/links/application/service/cardService";
import {
  type OGData,
  type UserLink,
} from "@/feature/links/domain/models/types";
import { FeaturedLinksCard } from "../cards";

type Props = {
  links: UserLink[];
  ogDataMap: { [key: string]: OGData | null };
};

export const FeaturedLinksList = ({ links, ogDataMap }: Props) => {
  const { session } = useSessionContext();

  const openBottomSheet = (cardId: number) => {
    const selectedCard = cards.find((card) => card.id === cardId);
    if (selectedCard && session?.user) {
      // URLパラメータとしてカード情報を渡す
      router.push({
        pathname: "/bottom-sheet/link-action",
        params: {
          linkId: selectedCard.link_id,
          userId: session.user.id,
          imageUrl: selectedCard.imageUrl,
          title: selectedCard.title,
          domain: selectedCard.domain,
          full_url: selectedCard.full_url,
          swipeCount: selectedCard.swipe_count,
        },
      });
    }
  };

  const cards = useMemo(() => {
    return cardService.createCards(links, ogDataMap);
  }, [links, ogDataMap]);

  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {cards.map((card) => (
        <View key={card.id} className="w-[48%]">
          <FeaturedLinksCard
            {...card}
            onAction={() => openBottomSheet(card.id)}
          />
        </View>
      ))}
    </View>
  );
};
