import { type PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { type UserLink } from "@/feature/links/domain/models/types";
import { getDateRanges } from "@/feature/links/infrastructure/utils/dateUtils";
import supabase from "@/lib/supabase";

// 共通のselect句を定数化
const USER_LINKS_SELECT = `
  link_id,
  full_url,
  domain,
  parameter,
  link_created_at,
  link_updated_at,
  status,
  added_at,
  scheduled_read_at,
  read_at,
  read_count,
  swipe_count,
  user_id,
  re_read
`;

// クエリビルダーの型定義
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryBuilder = PostgrestFilterBuilder<any, any, any>;

/**
 * 共通のクエリ実行関数
 * @param baseQuery 基本クエリ
 * @param params クエリパラメータ
 * @param errorMessage エラーメッセージ
 * @returns クエリ結果
 */
const executeQuery = async <T>(
  baseQuery: QueryBuilder,
  params: {
    orderBy?: string;
    ascending?: boolean;
    limit: number;
  },
  errorMessage: string,
): Promise<T[]> => {
  try {
    let query = baseQuery;

    if (params.orderBy) {
      query = query.order(params.orderBy, { ascending: params.ascending });
    }

    const { data, error } = await query.limit(params.limit);

    if (error) {
      throw error;
    }

    return data as T[];
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

export const linkApi = {
  fetchUserLinks: async (params: {
    userId: string;
    limit: number;
    status?: string;
    orderBy?: string;
    ascending?: boolean;
    includeReadyToRead?: boolean;
  }) => {
    let query = supabase
      .from("user_links_with_actions")
      .select(USER_LINKS_SELECT)
      .eq("user_id", params.userId);

    if (params.includeReadyToRead) {
      const { now, todayStart, tomorrowStart } = getDateRanges();

      query = query.or(
        `scheduled_read_at.is.null,and(scheduled_read_at.lt.${now},not.and(scheduled_read_at.gte.${todayStart},scheduled_read_at.lt.${tomorrowStart}))`,
      );
    }

    if (params.status) {
      query = query.eq("status", params.status);
    }

    return executeQuery<UserLink>(
      query,
      {
        orderBy: params.orderBy,
        ascending: params.ascending,
        limit: params.limit,
      },
      "Error fetching user links:",
    );
  },

  fetchUserLinksByStatus: async (params: {
    userId: string;
    status: string;
    limit: number;
    orderBy?: string;
    ascending?: boolean;
  }) => {
    const query = supabase
      .from("user_links_with_actions")
      .select(USER_LINKS_SELECT)
      .eq("user_id", params.userId)
      .eq("status", params.status);

    return executeQuery<UserLink>(
      query,
      {
        orderBy: params.orderBy,
        ascending: params.ascending,
        limit: params.limit,
      },
      "Error fetching user links by status:",
    );
  },

  fetchUserLinksWithCustomQuery: async (params: {
    userId: string;
    limit: number;
    queryBuilder: (query: QueryBuilder) => QueryBuilder;
    orderBy?: string;
    ascending?: boolean;
  }) => {
    let query = supabase
      .from("user_links_with_actions")
      .select(USER_LINKS_SELECT)
      .eq("user_id", params.userId);

    // カスタムクエリビルダーを適用
    query = params.queryBuilder(query);

    return executeQuery<UserLink>(
      query,
      {
        orderBy: params.orderBy,
        ascending: params.ascending,
        limit: params.limit,
      },
      "Error fetching user links with custom query:",
    );
  },

  createLinkAndUser: async (params: {
    domain: string;
    parameter: string;
    full_url: string;
    userId: string;
    status?: "add" | "inWeekend" | "Today" | "Read";
  }) => {
    const { data, error } = await supabase.rpc("add_link_and_user_action", {
      p_domain: params.domain,
      p_full_url: params.full_url,
      p_parameter: params.parameter,
      p_user_id: params.userId,
      p_status: params.status || "add",
    });

    if (error) throw error;

    return {
      status: data as "registered" | "already_registered",
    };
  },

  /**
   * ユーザーのリンクステータスごとのカウントを取得する
   * @param userId ユーザーID
   * @returns ステータスごとのカウント情報
   */
  getUserLinkStatusCounts: async (userId: string) => {
    try {
      // すべてのリンク数を取得
      const { count: totalCount, error: totalError } = await supabase
        .from("user_links_with_actions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (totalError) {
        throw totalError;
      }

      // Read, Bookmark ステータスのリンク数を取得
      // Re-Readは特別なクエリで取得
      const statusCounts = await Promise.all([
        supabase
          .from("user_links_with_actions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "Read"),
        supabase
          .from("user_links_with_actions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "Bookmark"),
        // Re-Readカウントの修正: re_read=true かつ有効なステータスのリンク数
        supabase
          .from("user_links_with_actions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("re_read", true)
          .in("status", ["Skip", "Today", "inMonth", "Read"]),
      ]);

      if (statusCounts.some((result) => result.error)) {
        const error = statusCounts.find((result) => result.error)?.error;
        throw error;
      }

      return {
        total: totalCount || 0,
        read: statusCounts[0].count || 0,
        bookmark: statusCounts[1].count || 0,
        reread: statusCounts[2].count || 0,
      };
    } catch (error) {
      console.error("Error fetching user link status counts:", error);
      throw error;
    }
  },
};
