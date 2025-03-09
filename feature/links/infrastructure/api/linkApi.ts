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
  user_id
`;

// クエリビルダーの型定義
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryBuilder = PostgrestFilterBuilder<any, any, any>;

export const linkApi = {
  fetchUserLinks: async (params: {
    userId: string;
    limit: number;
    status?: string;
    orderBy?: string;
    ascending?: boolean;
    includeReadyToRead?: boolean;
  }) => {
    try {
      let query = supabase
        .from("user_links_with_actions")
        .select(USER_LINKS_SELECT)
        .eq("user_id", params.userId);

      if (params.includeReadyToRead) {
        const { now, startOfDay, endOfDay } = getDateRanges();

        query = query.or(
          `scheduled_read_at.is.null,and(scheduled_read_at.lt.${now},not.and(scheduled_read_at.gte.${startOfDay},scheduled_read_at.lt.${endOfDay}))`,
        );
      }

      if (params.status) {
        query = query.eq("status", params.status);
      }

      if (params.orderBy) {
        query = query.order(params.orderBy, { ascending: params.ascending });
      }

      const { data, error } = await query.limit(params.limit);

      if (error) {
        throw error;
      }

      return data as UserLink[];
    } catch (error) {
      console.error("Error fetching user links:", error);
      throw error;
    }
  },

  fetchUserLinksByStatus: async (params: {
    userId: string;
    status: string;
    limit: number;
    orderBy?: string;
    ascending?: boolean;
  }) => {
    try {
      let query = supabase
        .from("user_links_with_actions")
        .select(USER_LINKS_SELECT)
        .eq("user_id", params.userId)
        .eq("status", params.status);

      if (params.orderBy) {
        query = query.order(params.orderBy, { ascending: params.ascending });
      }

      const { data, error } = await query.limit(params.limit);

      if (error) {
        throw error;
      }

      return data as UserLink[];
    } catch (error) {
      console.error("Error fetching user links by status:", error);
      throw error;
    }
  },

  fetchUserLinksWithCustomQuery: async (params: {
    userId: string;
    limit: number;
    queryBuilder: (query: QueryBuilder) => QueryBuilder;
    orderBy?: string;
    ascending?: boolean;
  }) => {
    try {
      let query = supabase
        .from("user_links_with_actions")
        .select(USER_LINKS_SELECT)
        .eq("user_id", params.userId);

      // カスタムクエリビルダーを適用
      query = params.queryBuilder(query);

      if (params.orderBy) {
        query = query.order(params.orderBy, { ascending: params.ascending });
      }

      const { data, error } = await query.limit(params.limit);

      if (error) {
        throw error;
      }

      return data as UserLink[];
    } catch (error) {
      console.error("Error fetching user links with custom query:", error);
      throw error;
    }
  },

  fetchLinks: async (limit: number) => {
    const { data, error } = await supabase
      .from("links")
      .select("id, full_url")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  createLinkAndUser: async (params: {
    domain: string;
    parameter: string;
    full_url: string;
    userId: string;
    status?: "add" | "inMonth" | "inWeekend" | "Today" | "Read";
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
};
