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
import {
  LINK_TABS,
  LinkFilterTabs,
  type LinkTabGroup,
} from "../components/filters/LinkFilterTabs";
import { StatusFilter } from "../components/filters/StatusFilter";

export const LinkListView = () => {
  const { session } = useSessionContext();
  const [selectedTab, setSelectedTab] = useState<LinkTabGroup>("all");
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

  // 現在選択されているタブの設定を取得
  const currentTabConfig = useMemo(() => {
    return LINK_TABS.find((tab) => tab.id === selectedTab) || LINK_TABS[0];
  }, [selectedTab]);

  // タブが変更されたときにステータスフィルターをリセット
  const handleTabChange = useCallback((tab: LinkTabGroup) => {
    setSelectedTab(tab);
    setStatusFilter(null);
  }, []);

  // タブとステータスの両方に基づいてフィルタリング
  const filteredLinks = useMemo(() => {
    // 1. まずタブでフィルタリング（"all"の場合はフィルタリングしない）
    let result = links;
    if (selectedTab !== "all") {
      result = links.filter((link) =>
        currentTabConfig.statuses.includes(link.status),
      );
    }

    // 2. 次にステータスでフィルタリング（nullの場合はフィルタリングしない）
    if (statusFilter) {
      result = result.filter((link) => link.status === statusFilter);
    }

    return result;
  }, [links, selectedTab, statusFilter, currentTabConfig]);

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

      {/* タブフィルター */}
      <LinkFilterTabs selectedTab={selectedTab} onTabChange={handleTabChange} />

      {/* ステータスフィルター */}
      <StatusFilter
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        availableStatuses={currentTabConfig.statuses}
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
