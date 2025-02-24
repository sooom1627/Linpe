import { useMemo } from "react";
import { View } from "react-native";

import { useLinksModals } from "@/feature/links/application/hooks/link/useLinksModals";
import { cardService } from "@/feature/links/application/service/cardService";
import {
  type OGData,
  type UserLink,
} from "@/feature/links/domain/models/types";
import { LinkActionView } from "@/feature/links/presentation/views/LinkActionView";
import { FeaturedLinksCard } from "../cards";

type Props = {
  links: UserLink[];
  ogDataMap: { [key: string]: OGData | null };
};

export const FeaturedLinksList = ({ links, ogDataMap }: Props) => {
  const { openLinkAction } = useLinksModals({
    LinkActionView,
  });

  const cards = useMemo(() => {
    return cardService.createCards(links, ogDataMap);
  }, [links, ogDataMap]);

  return (
    <View className="flex flex-row flex-wrap items-stretch justify-between gap-y-4">
      {cards.map((card) => (
        <View key={card.id} className="w-[48%]">
          <FeaturedLinksCard {...card} onAction={openLinkAction} />
        </View>
      ))}
    </View>
  );
};
