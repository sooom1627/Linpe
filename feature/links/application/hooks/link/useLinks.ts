import { type Session } from "@supabase/supabase-js";
import useSWR from "swr";

import { LINK_CACHE_KEYS } from "@/feature/links/application/cache/linkCacheKeys";
import { linkService } from "@/feature/links/application/service/linkServices";
import { swipeableLinkService } from "@/feature/links/application/service/swipeableLinkService";
import {
  type LinkActionStatus,
  type UserLink,
} from "@/feature/links/domain/models/types";

export const useStatusLinks = (
  userId: string | null,
  status: LinkActionStatus = "Today",
  limit: number = 10,
): {
  links: UserLink[];
  isError: Error | null;
  isLoading: boolean;
  isEmpty: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    userId ? LINK_CACHE_KEYS.STATUS_LINKS(userId, status) : null,
    () => linkService.fetchLinksByStatus(userId!, status, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    links: data || [],
    isError: error,
    isLoading,
    isEmpty: !data || data.length === 0,
  };
};

// 後方互換性のために残す
export const useTodaysLinks = (
  userId: string | null,
  limit: number = 10,
): {
  links: UserLink[];
  isError: Error | null;
  isLoading: boolean;
  isEmpty: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    userId ? LINK_CACHE_KEYS.TODAY_LINKS(userId) : null,
    () => linkService.fetchTodayLinks(userId!, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
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
): {
  links: UserLink[];
  isError: Error | null;
  isLoading: boolean;
  isEmpty: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    userId ? ["swipeable-links", userId] : null,
    async () => {
      try {
        const result = await swipeableLinkService.fetchSwipeableLinks(
          userId!,
          limit,
        );
        return result;
      } catch (err) {
        console.error("Error in useSwipeScreenLinks:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
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
): {
  links: UserLink[];
  isError: Error | null;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    ["links", limit],
    async () => {
      try {
        return await linkService.fetchUserLinks(null, limit);
      } catch (error) {
        console.error("リンクの取得エラー:", error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
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
        console.error("ユーザーリンクの取得エラー:", error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    userLinks: data || [],
    isError: error,
    isLoading,
  };
};
