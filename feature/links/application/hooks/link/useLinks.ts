import { type Session } from "@supabase/supabase-js";
import useSWR from "swr";

import { linkService } from "@/feature/links/application/service/linkServices";
import { type UserLink } from "@/feature/links/domain/models/types";

export const useTopViewLinks = (
  userId: string | null,
  limit: number = 10,
): {
  links: UserLink[];
  isError: Error | null;
  isLoading: boolean;
  isEmpty: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    userId ? ["today-links", userId] : null,
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
        const result = await linkService.fetchSwipeableLinks(userId!, limit);
        return result;
      } catch (err) {
        console.error("Error in useSwipeScreenLinks:", err);
        throw err;
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
