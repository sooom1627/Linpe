import { type Session } from "@supabase/supabase-js";
import useSWR from "swr";

import { linkService } from "@/feature/links/application/service/linkServices";
import { type UserLink } from "@/feature/links/domain/models/types";

// 共通のSWR設定
const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 5000, // 5秒間の重複リクエスト防止
  errorRetryCount: 3, // エラー時の再試行回数
} as const;

// フック戻り値の型定義
interface UseLinksResult {
  links: UserLink[];
  isError: Error | null;
  isLoading: boolean;
  isEmpty: boolean;
}

export const useTopViewLinks = (
  userId: string | null,
  limit: number = 10,
): UseLinksResult => {
  const cacheKey = userId ? ["links", "today", userId, limit] : null;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => {
      try {
        return await linkService.fetchTodayLinks(userId!, limit);
      } catch (error) {
        console.error("Error in useTopViewLinks:", error);
        throw error;
      }
    },
    SWR_CONFIG,
  );

  return {
    links: data || [],
    isError: error,
    isLoading,
    isEmpty: !data || data.length === 0,
  };
};

export const useSwipeScreenLinks = (
  userId: string | null,
  limit: number = 20,
): UseLinksResult => {
  const cacheKey = userId ? ["links", "swipe", userId, limit] : null;

  const { data, error, isLoading } = useSWR(
    cacheKey,
    async () => {
      try {
        return await linkService.fetchSwipeableLinks(userId!, limit);
      } catch (error) {
        console.error("Error in useSwipeScreenLinks:", error);
        throw error;
      }
    },
    SWR_CONFIG,
  );

  return {
    links: data || [],
    isError: error,
    isLoading,
    isEmpty: !data || data.length === 0,
  };
};

// 汎用的なリンク取得フック（既存の互換性のため）
export const useGetLinks = (
  limit: number = 5,
): Omit<UseLinksResult, "isEmpty"> => {
  const { data, error, isLoading } = useSWR(
    ["links", limit],
    async () => {
      try {
        return await linkService.fetchUserLinks(null, limit);
      } catch (error) {
        console.error("Error in useGetLinks:", error);
        throw error;
      }
    },
    SWR_CONFIG,
  );

  return {
    links: data || [],
    isError: error,
    isLoading,
  };
};

// 汎用的なユーザーリンク取得フック（既存の互換性のため）
export const useUserLinks = (
  userId: Session["user"]["id"] | null,
  limit: number = 10,
): {
  userLinks: UserLink[];
  isError: Error | null;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    userId ? [`user-links-${userId}`, limit] : null,
    async () => {
      try {
        return await linkService.fetchUserLinks(userId, limit);
      } catch (error) {
        console.error("Error in useUserLinks:", error);
        throw error;
      }
    },
    SWR_CONFIG,
  );

  return {
    userLinks: data || [],
    isError: error,
    isLoading,
  };
};
