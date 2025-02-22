import supabase from "@/lib/supabase";

export const linkActionsApi = {
  updateLinkAction: async (params: {
    userId: string;
    linkId: string;
    status: "add" | "inMonth" | "inWeekend" | "Today" | "Read";
    swipeCount: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from("link_actions")
        .update({
          status: params.status,
          updated_at: new Date(),
          scheduled_read_at: new Date(),
          swipe_count: params.swipeCount + 1,
        })
        .eq("id", params.linkId)
        .eq("user_id", params.userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
