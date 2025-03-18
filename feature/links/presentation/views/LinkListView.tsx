import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import {
  useOGDataBatch,
  useUserAllLinks,
} from "@/feature/links/application/hooks";
import { cardService } from "@/feature/links/application/service/cardService";
import { LoadingCard } from "@/feature/links/presentation/components/display";
import { HorizontalCard } from "@/feature/links/presentation/components/display/cards";
import { TodaysLinksNoStatus } from "@/feature/links/presentation/components/display/status/TodaysLinks";
import { StatusFilter } from "../components/filters/StatusFilter";

export const LinkListView = () => {
  const { session } = useSessionContext();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const {
    links,
    isError,
    isLoading: linksLoading,
    isEmpty,
  } = useUserAllLinks(session?.user?.id || null);

  const { dataMap, loading: ogLoading } = useOGDataBatch(
    links.map((link) => link.full_url),
  );

  const filteredLinks = useMemo(() => {
    if (!statusFilter) return links;
    return links.filter((link) => link.status === statusFilter);
  }, [links, statusFilter]);

  const cards = useMemo(() => {
    return cardService.createCards(filteredLinks, dataMap);
  }, [filteredLinks, dataMap]);

  const openBottomSheet = useCallback(
    (cardId: number) => {
      const selectedCard = cards.find((card) => card.id === cardId);
      if (selectedCard && session?.user) {
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
    },
    [cards, session],
  );

  if (linksLoading || ogLoading) {
    return (
      <View className="flex flex-col gap-4">
        <Title title="Your Links" />
        <View className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <LoadingCard key={index} variant="horizontal" />
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex items-center justify-center py-8">
        <ThemedText
          text="Error loading data"
          variant="body"
          weight="medium"
          color="error"
        />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className="flex flex-col gap-4">
        <Title title="Your Links" />
        <TodaysLinksNoStatus />
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-4">
      <Title title="Your Links" />

      <StatusFilter
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <View className="flex flex-col gap-3">
        {cards.length === 0 ? (
          <View className="w-full items-center py-4">
            <ThemedText text="No links found" variant="body" weight="medium" />
          </View>
        ) : (
          cards.map((card) => (
            <HorizontalCard
              key={card.id.toString()}
              {...card}
              onAction={() => openBottomSheet(card.id)}
            />
          ))
        )}
      </View>
    </View>
  );
};
