import supabase from "@/lib/supabase";

export const linkApi = {
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
