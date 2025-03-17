import useSWR from "swr";

import { linkService } from "@/feature/links/application/service/linkServices";
import { ACTION_LOG_CACHE_KEYS } from "../cache/actionLogCacheKeys";
import { SWR_DISPLAY_CONFIG } from "../cache/swrConfig";

/**
 * リンクステータスカウントの型定義
 */
export interface LinkStatusCount {
  total: number;
  read: number;
  reread: number;
  bookmark: number;
}

/**
 * ユーザーのリンクステータスカウントを取得するカスタムフック
 * @param userId ユーザーID
 * @returns リンクステータスカウントの状態
 */
export const useLinkStatusCount = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ACTION_LOG_CACHE_KEYS.LINK_STATUS_COUNTS(userId) : null,
    async () => {
      if (!userId) {
        return null;
      }

      try {
        return await linkService.getUserLinkStatusCounts(userId);
      } catch (error) {
        console.error("[useLinkStatusCount] Error fetching data:", error);
        throw error;
      }
    },
    SWR_DISPLAY_CONFIG,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
