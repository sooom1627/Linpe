import { useMemo } from "react";
import { View } from "react-native";

import { cardService } from "@/feature/links/application/service/cardService";
import {
  type LinkPreview,
  type OGData,
} from "@/feature/links/domain/models/types";
import { FeaturedLinksCard } from "../cards";

type Props = {
  links: LinkPreview[];
  ogDataMap: { [key: string]: OGData | null };
};

export const FeaturedLinksList = ({ links, ogDataMap }: Props) => {
  const cards = useMemo(() => {
    return cardService.createCards(links, ogDataMap);
  }, [links, ogDataMap]);

  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {cards.map((card) => (
        <View key={card.id} className="w-[48%]">
          <FeaturedLinksCard {...card} />
        </View>
      ))}
    </View>
  );
};
