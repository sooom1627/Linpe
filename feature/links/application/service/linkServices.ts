import { type Session } from "@supabase/supabase-js";

import { type UserLink } from "@/feature/links/domain/models/types";
import { linkApi } from "@/feature/links/infrastructure/api";
import { parseUrl } from "@/feature/links/infrastructure/utils";

export const linkService = {
  // TopView用のサービス
  fetchTodayLinks: async (
    userId: string,
    limit: number = 10,
  ): Promise<UserLink[]> => {
    try {
      // 新しいAPIメソッドを使用
      return await linkApi.fetchUserLinksByStatus({
        userId,
        status: "Today",
        limit,
        orderBy: "link_updated_at",
        ascending: false,
      });
    } catch (error) {
      console.error("Error fetching today links:", error);
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

  // 汎用的なリンク取得
  fetchUserLinks: async (
    userId: Session["user"]["id"] | null,
    limit: number = 10,
  ): Promise<UserLink[]> => {
    if (!userId) {
      return [];
    }

    try {
      // 後方互換性のため既存のAPIメソッドを使用
      const data = await linkApi.fetchUserLinks({
        userId,
        limit,
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
