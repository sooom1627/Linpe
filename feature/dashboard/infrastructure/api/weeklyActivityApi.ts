import supabase from "@/lib/supabase";
import { type IWeeklyActivityRepository } from "../../application/services/weeklyActivityService";

export type DailyActivity = {
  date: string;
  add: number;
  swipe: number;
  read: number;
};

export class WeeklyActivityRepository implements IWeeklyActivityRepository {
  async fetchActivityLogs(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ changed_at: string; new_status: string }>> {
    const { data, error } = await supabase
      .from("user_link_actions_log")
      .select("changed_at, new_status")
      .eq("user_id", userId)
      .gte("changed_at", startDate.toISOString())
      .lte("changed_at", endDate.toISOString());

    if (error) {
      throw new Error("週間アクティビティの取得に失敗しました");
    }

    return data || [];
  }
}
