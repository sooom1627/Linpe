import supabase from "@/lib/supabase";
import { dateUtils } from "@/lib/utils/dateUtils";
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

    // ローカル時間のDateオブジェクトをUTC文字列に変換
    const { startUTC, endUTC } = dateUtils.getUTCDateRange(startDate, endDate);

    console.debug("[weeklyActivityApi] Using UTC range:", {
      startUTC,
      endUTC,
      timezone: dateUtils.getUserTimezone(),
    });

    const { data, error } = await supabase
      .from("user_link_actions_log")
      .select("changed_at, new_status")
      .eq("user_id", userId)
      .gte("changed_at", startUTC)
      .lte("changed_at", endUTC);

    if (error) {
      console.error("[weeklyActivityApi] Supabase error:", error);
      throw new Error("週間アクティビティの取得に失敗しました");
    }

    console.debug("[weeklyActivityApi] Successfully fetched logs:", data);
    return data || [];
  },
};
