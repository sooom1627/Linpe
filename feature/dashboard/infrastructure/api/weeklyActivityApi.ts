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
    // ローカル時間のDateオブジェクトをUTC文字列に変換
    const dateRange = dateUtils.getDateRangeForFetch(startDate, endDate);

    const { data, error } = await supabase
      .from("user_link_actions_log")
      .select("changed_at, new_status")
      .eq("user_id", userId)
      .gte("changed_at", dateRange.startUTC)
      .lte("changed_at", dateRange.endUTC);

    if (error) {
      console.error("[weeklyActivityApi] Supabase error:", error);
      throw new Error("週間アクティビティの取得に失敗しました");
    }

    return data || [];
  },
};
