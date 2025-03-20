import { useMemo } from "react";

import { linkFilterService } from "@/feature/links/application/service/linkFilterService";
import {
  type LinkTabGroup,
  type UserLink,
} from "@/feature/links/domain/models/types";

interface UseLinksFilteringResult {
  filteredLinks: UserLink[];
  availableStatuses: string[];
}

/**
 * リンクのフィルタリングを担当するカスタムフック
 * タブとステータスに基づくフィルタリングを提供する
 */
export const useLinksFiltering = (
  links: UserLink[],
  selectedTab: LinkTabGroup,
  statusFilter: string | null,
): UseLinksFilteringResult => {
  const availableStatuses = useMemo(() => {
    return linkFilterService.getAvailableStatuses(selectedTab);
  }, [selectedTab]);

  const filteredLinks = useMemo(() => {
    return linkFilterService.filterLinks(links, selectedTab, statusFilter);
  }, [links, selectedTab, statusFilter]);

  return {
    filteredLinks,
    availableStatuses,
  };
};
