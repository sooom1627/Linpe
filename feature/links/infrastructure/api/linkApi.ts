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
    cleanUrl: string;
    userId: string;
  }) => {
    const { data, error } = await supabase.rpc("add_link_and_user", {
      p_domain: params.domain,
      p_parameter: params.parameter,
      p_clean_url: params.cleanUrl,
      p_user_id: params.userId,
    });

    if (error) throw error;
    return data;
  },
};
