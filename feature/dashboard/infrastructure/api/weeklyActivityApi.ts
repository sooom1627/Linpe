import supabase from "@/lib/supabase";
import { type IWeeklyActivityRepository } from "../../application/services/weeklyActivityService";
import { type DailyActivity } from "../../domain/models/activity";

// Data Transfer Object for API response
export type DailyActivityDTO = {
  date: string;
  add: number;
  swipe: number;
  read: number;
};

export const weeklyActivityRepository: IWeeklyActivityRepository = {
  fetchActivityLogs: async (
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ changed_at: string; new_status: string }>> => {
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
  },
};

// Helper function to convert DTO to domain model
export const toDomainModel = (dto: DailyActivityDTO): DailyActivity => {
  return {
    date: new Date(dto.date),
    activities: {
      add: dto.add,
      swipe: dto.swipe,
      read: dto.read,
    },
  };
};
