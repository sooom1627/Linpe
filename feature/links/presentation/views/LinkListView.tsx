import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import {
  useLinksFiltering,
  useOGDataBatch,
  useUserAllLinks,
} from "@/feature/links/application/hooks";
import { cardService } from "@/feature/links/application/service/cardService";
import { type LinkTabGroup } from "@/feature/links/domain/models/types";
import { LoadingCard } from "@/feature/links/presentation/components/display";
import { LinksFlatList } from "@/feature/links/presentation/components/display/lists/LinksFlatList";
import { TodaysLinksNoStatus } from "@/feature/links/presentation/components/display/status/TodaysLinks";
import { LinkFilterTabs } from "@/feature/links/presentation/components/filters/LinkFilterTabs";
import { StatusFilter } from "@/feature/links/presentation/components/filters/StatusFilter";

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

  const { filteredLinks, availableStatuses } = useLinksFiltering(
    links,
    selectedTab,
    statusFilter,
  );

  const handleTabChange = useCallback((tab: LinkTabGroup) => {
    setSelectedTab(tab);
    setStatusFilter(null);
  }, []);

  // カードデータの生成
  const cards = cardService.createCards(filteredLinks, dataMap);

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
    <View className="flex flex-col">
      <LinkFilterTabs selectedTab={selectedTab} onTabChange={handleTabChange}>
        <ScrollView
          className="mb-8 flex flex-col gap-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <StatusFilter
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
            availableStatuses={availableStatuses}
          />
          {cards.length === 0 ? (
            <View className="w-full items-center py-4">
              <ThemedText
                text="No links found"
                variant="body"
                weight="medium"
              />
            </View>
          ) : (
            <LinksFlatList links={filteredLinks} ogDataMap={dataMap} />
          )}
        </ScrollView>
      </LinkFilterTabs>
    </View>
  );
};
