import { type Session } from "@supabase/supabase-js";
import useSWR from "swr";

import { type LinkPreview } from "../../../domain/models/types";
import {
  fetchUserLinks,
  getLinksPreview,
  type UserLinkPreview,
} from "../../service/linkServices";

type Purpose = "top-view" | "swipe";

export const useGetLinks = (
  limit: number = 5,
  purpose: Purpose = "top-view",
): {
  links: LinkPreview[];
  isError: Error | null;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    [`links-${purpose}`, limit],
    async () => {
      try {
        return await getLinksPreview(limit);
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

export const useUserLinks = (
  userId: Session["user"]["id"] | null,
  limit: number = 10,
  purpose: Purpose = "top-view",
): {
  userLinks: UserLinkPreview[];
  isError: Error | null;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    userId ? [`user-links-${userId}-${purpose}`, limit] : null,
    async () => {
      try {
        return await fetchUserLinks(userId, limit);
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
