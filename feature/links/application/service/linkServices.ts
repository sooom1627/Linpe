import { type Session } from "@supabase/supabase-js";

import {
  type LinkPreview,
  type UserLink,
} from "@/feature/links/domain/models/types";
import { linkApi } from "@/feature/links/infrastructure/api";
import { parseUrl } from "@/feature/links/infrastructure/utils";

export type UserLinkPreview = {
  id: string;
  full_url: string;
  domain: string;
  parameter: string;
  created_at: string;
  user_link_actions: [
    {
      status: string;
      added_at: string;
      scheduled_read_at: string | null;
      read_at: string | null;
      read_count: number;
      swipe_count: number;
    },
  ];
};

export const getLinksPreview = async (
  limit: number = 5,
): Promise<LinkPreview[]> => {
  try {
    const data = await linkApi.fetchLinks(limit);

    if (!data) {
      console.warn(
        "リンクのデータが取得できませんでした。空の配列を返します。",
      );
      return [];
    }

    return data;
  } catch (error) {
    console.error("リンクの取得エラー:", error);
    throw error;
  }
};

export const linkService = {
  // TopView用のサービス - Today状態のリンクを取得
  fetchTodayLinks: async (
    userId: string,
    limit: number = 10,
  ): Promise<UserLink[]> => {
    try {
      return await linkApi.fetchUserLinks({
        userId,
        limit,
        status: "Today",
        orderBy: "link_updated_at",
        ascending: false,
      });
    } catch (error) {
      console.error("Error fetching today links:", error);
      throw error;
    }
  },

  // SwipeScreen用のサービス - スケジュールされていないリンクを取得
  fetchSwipeableLinks: async (
    userId: string,
    limit: number = 20,
  ): Promise<UserLink[]> => {
    try {
      return await linkApi.fetchUserLinks({
        userId,
        limit,
        orderBy: "added_at",
        ascending: true,
        scheduled: "only_empty", // DB側でフィルタリング
      });
    } catch (error) {
      console.error("Error fetching swipeable links:", error);
      throw error;
    }
  },

  // 既存の機能は維持
  addLinkAndUser: async (
    url: string,
    userId: Session["user"]["id"],
    status?: "add" | "inMonth" | "inWeekend" | "Today" | "Read",
  ): Promise<{ status: "registered" | "already_registered" }> => {
    if (!url) {
      throw new Error("URL is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const { domain, parameter, cleanUrl } = parseUrl(url);

    try {
      return await linkApi.createLinkAndUser({
        domain,
        full_url: cleanUrl,
        parameter: parameter ?? "",
        userId: userId as string,
        status: status ?? "add",
      });
    } catch (error) {
      console.error("リンクの追加エラー:", error);
      throw error;
    }
  },

  // 汎用的なリンク取得 - より柔軟なオプションをサポート
  fetchUserLinks: async (
    userId: Session["user"]["id"] | null,
    limit: number = 10,
    options: {
      status?: string;
      orderBy?: string;
      ascending?: boolean;
      scheduled?: "only_empty" | "only_scheduled" | null;
    } = {},
  ): Promise<UserLink[]> => {
    if (!userId) {
      return [];
    }

    try {
      const data = await linkApi.fetchUserLinks({
        userId,
        limit,
        ...options,
      });

      if (!data) {
        console.warn(
          "ユーザーのリンクデータが取得できませんでした。空の配列を返します。",
        );
        return [];
      }

      return data;
    } catch (error) {
      console.error("ユーザーリンクの取得エラー:", error);
      throw error;
    }
  },
};
