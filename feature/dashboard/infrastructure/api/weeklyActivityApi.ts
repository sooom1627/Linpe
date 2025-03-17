import supabase from "@/lib/supabase";
import { type IWeeklyActivityRepository } from "../../application/services/weeklyActivityService";
import { type ActivityLog } from "../../domain/models/activity";

export const weeklyActivityRepository: IWeeklyActivityRepository = {
  fetchActivityLogs: async (
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ActivityLog[]> => {
    console.debug("[weeklyActivityApi] Fetching logs with params:", {
      userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const { data, error } = await supabase
      .from("user_link_actions_log")
      .select("changed_at, new_status")
      .eq("user_id", userId)
      .gte("changed_at", startDate.toISOString())
      .lte("changed_at", endDate.toISOString());

    if (error) {
      console.error("[weeklyActivityApi] Supabase error:", error);
      throw new Error("週間アクティビティの取得に失敗しました");
    }

    console.debug("[weeklyActivityApi] Successfully fetched logs:", data);
    return data || [];
  },
};
