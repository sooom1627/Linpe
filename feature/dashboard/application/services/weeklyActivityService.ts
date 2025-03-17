import {
  ActivityStatusMapping,
  type Activity,
  type ActivityLog,
  type WeeklyActivityData,
} from "../../domain/models/activity";

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
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    console.debug("[weeklyActivityService] Fetching logs for date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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

  // ログを集計
  logs.forEach((log) => {
    const dateStr = new Date(log.changed_at).toISOString().split("T")[0];
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
