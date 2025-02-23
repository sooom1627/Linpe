import { type UserLink } from "@/feature/links/domain/models/types";
import supabase from "@/lib/supabase";

export const linkApi = {
  fetchUserLinks: async (params: {
    userId: string;
    limit: number;
    status?: string;
    orderBy?: string;
    ascending?: boolean;
  }) => {
    try {
      let query = supabase
        .from("user_links_with_actions")
        .select(
          `
          link_id,
          full_url,
          domain,
          parameter,
          link_created_at,
          status,
          added_at,
          scheduled_read_at,
          read_at,
          read_count,
          swipe_count,
          user_id
        `,
        )
        .eq("user_id", params.userId);

      if (params.status) {
        query = query.eq("status", params.status);
      }

      if (params.orderBy) {
        query = query.order(params.orderBy, { ascending: params.ascending });
      }

      const { data, error } = await query.limit(params.limit);

      if (error) throw error;
      return data as UserLink[];
    } catch (error) {
      console.error("Error fetching user links:", error);
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
