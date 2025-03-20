import { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { Title } from "@/components/text/Title";
import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import {
  useOGDataBatch,
  useUserAllLinks,
} from "@/feature/links/application/hooks";
import { cardService } from "@/feature/links/application/service/cardService";
import { LoadingCard } from "@/feature/links/presentation/components/display";
import { LinksFlatList } from "@/feature/links/presentation/components/display/lists/LinksFlatList";
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
      if (selectedTab === "toRead") {
        // To Read: read_atがnullのリンク または ステータスがRe-Readのリンク
        result = links.filter(
          (link) => link.read_at === null || link.status === "Re-Read",
        );
      } else if (selectedTab === "read") {
        // Read: read_atに値があるリンク (Re-Readステータスも含む)
        result = links.filter((link) => link.read_at !== null);
      }
    }

    // 2. 次にステータスでフィルタリング（nullの場合はフィルタリングしない）
    if (statusFilter) {
      result = result.filter((link) => link.status === statusFilter);
    }

    return result;
  }, [links, selectedTab, statusFilter]);

  const cards = useMemo(() => {
    return cardService.createCards(filteredLinks, dataMap);
  }, [filteredLinks, dataMap]);

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
      {/* タブとコンテンツをLinkFilterTabsでラップ */}
      <LinkFilterTabs selectedTab={selectedTab} onTabChange={handleTabChange}>
        <ScrollView
          className="mb-8 flex flex-col gap-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* ステータスフィルター */}
          <StatusFilter
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
            availableStatuses={currentTabConfig.statuses}
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
