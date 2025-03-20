import {
  LINK_TABS_CONFIG,
  type LinkTabGroup,
  type UserLink,
} from "@/feature/links/domain/models/types";

export const linkFilterService = {
  /**
   * タブIDに基づいてリンクをフィルタリングする
   */
  filterByTab: (links: UserLink[], tabId: LinkTabGroup): UserLink[] => {
    const tabConfig = LINK_TABS_CONFIG[tabId];
    return tabConfig ? tabConfig.filter(links) : links;
  },

  /**
   * ステータスに基づいてリンクをフィルタリングする
   */
  filterByStatus: (links: UserLink[], status: string | null): UserLink[] => {
    if (!status) return links;
    return links.filter((link) => link.status === status);
  },

  /**
   * タブIDに基づいて利用可能なステータスの一覧を取得する
   */
  getAvailableStatuses: (tabId: LinkTabGroup): string[] => {
    const tabConfig = LINK_TABS_CONFIG[tabId];
    return tabConfig ? tabConfig.statuses : [];
  },

  /**
   * タブとステータスの両方に基づいてリンクをフィルタリングする
   */
  filterLinks: (
    links: UserLink[],
    tabId: LinkTabGroup,
    statusFilter: string | null,
  ): UserLink[] => {
    // 1. まずタブでフィルタリング
    const tabFilteredLinks = linkFilterService.filterByTab(links, tabId);

    // 2. 次にステータスでフィルタリング
    return linkFilterService.filterByStatus(tabFilteredLinks, statusFilter);
  },
};
