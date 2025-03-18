import { type Session } from "@supabase/supabase-js";
import useSWR from "swr";

import { linkService } from "@/feature/links/application/service/linkServices";

export const useUserAllLinks = (
  userId: Session["user"]["id"] | null,
  limit: number = 50, // 一度に多くのデータを取得して無限スクロールを回避
) => {
  const {
    data: links = [],
    error,
    isLoading,
    isValidating,
  } = useSWR(
    userId ? ["all-user-links", userId, limit] : null,
    async ([, userId, limit]) => {
      try {
        return await linkService.fetchUserLinks(userId as string, limit);
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

  const isEmpty = !isLoading && links.length === 0;

  return {
    links,
    isError: error,
    isLoading,
    isValidating,
    isEmpty,
  };
};
