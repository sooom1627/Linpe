import { dateUtils } from "@/lib/utils/dateUtils";
import {
  ActivityStatusMapping,
  type Activity,
  type ActivityLog,
  type WeeklyActivityData,
} from "../../domain/models/activity";

// ViewModel型を追加
export interface ActivityViewModel {
  day: string;
  add: number;
  swipe: number;
  read: number;
}

export interface IWeeklyActivityRepository {
  fetchActivityLogs: (
    userId: string,
    startDate: Date,
    endDate: Date,
  ) => Promise<ActivityLog[]>;
}

export const weeklyActivityService = {
  getWeeklyActivity: async (
    repository: IWeeklyActivityRepository,
    userId: string,
  ): Promise<WeeklyActivityData> => {
    const endDate = dateUtils.getLocalDate();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    console.debug("[weeklyActivityService] Fetching logs for date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      timezone: dateUtils.getUserTimezone(),
    });

    try {
      const logs = await repository.fetchActivityLogs(
        userId,
        startDate,
        endDate,
      );

      console.debug("[weeklyActivityService] Fetched logs:", logs);

      const activities = processActivityData(logs, startDate, endDate);

      console.debug(
        "[weeklyActivityService] Processed activities:",
        activities,
      );

      return {
        activities,
      };
    } catch (error) {
      console.error("[weeklyActivityService] Error:", error);
      throw error;
    }
  },

  toViewModel: (data: WeeklyActivityData): ActivityViewModel[] => {
    return data.activities.map((activity) => ({
      day: activity.day,
      add: activity.add,
      swipe: activity.swipe,
      read: activity.read,
    }));
  },
};

const processActivityData = (
  logs: ActivityLog[],
  startDate: Date,
  endDate: Date,
): Activity[] => {
  console.debug("[processActivityData] Processing logs:", {
    logsCount: logs.length,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const activityMap = new Map<string, Activity>();

  // 過去7日分の空のActivityレコードを初期化
  for (let i = 0; i <= 6; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    activityMap.set(dateStr, {
      date: new Date(date),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      add: 0,
      swipe: 0,
      read: 0,
    });
  }

  // ログを集計（UTCからローカル時間に変換して集計）
  logs.forEach((log) => {
    // UTCの日付文字列をローカルの日付オブジェクトに変換
    const localDate = dateUtils.utcToLocalDate(log.changed_at);
    // ローカルの日付文字列（YYYY-MM-DD）を取得
    const dateStr = localDate.toISOString().split("T")[0];

    const activity = activityMap.get(dateStr);
    if (activity) {
      if (ActivityStatusMapping.add.includes(log.new_status)) {
        activity.add++;
      } else if (ActivityStatusMapping.swipe.includes(log.new_status)) {
        activity.swipe++;
      } else if (ActivityStatusMapping.read.includes(log.new_status)) {
        activity.read++;
      }
    }
  });

  const result = Array.from(activityMap.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  console.debug("[processActivityData] Processed result:", result);
  return result;
};
