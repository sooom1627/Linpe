import {
  ActivityStatusMapping,
  type ActivityStatus,
  type ActivityViewModel,
  type DailyActivity,
  type WeeklyActivityData,
} from "../../domain/models/activity";

export interface IWeeklyActivityRepository {
  fetchActivityLogs: (
    userId: string,
    startDate: Date,
    endDate: Date,
  ) => Promise<Array<{ changed_at: string; new_status: string }>>;
}

export class WeeklyActivityService {
  constructor(private repository: IWeeklyActivityRepository) {}

  async getWeeklyActivity(userId: string): Promise<WeeklyActivityData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // 今日を含む過去7日間

    const logs = await this.repository.fetchActivityLogs(
      userId,
      startDate,
      endDate,
    );

    // ドメインロジックの実行（データの集計）
    const dailyActivities = this.aggregateActivities(logs, startDate, endDate);

    return {
      activities: dailyActivities,
    };
  }

  // ビューモデルへの変換
  toViewModel(data: WeeklyActivityData): ActivityViewModel[] {
    return data.activities.map((daily) => ({
      day: daily.date.toLocaleDateString("en-US", { weekday: "short" }),
      ...daily.activities,
    }));
  }

  private aggregateActivities(
    logs: Array<{ changed_at: string; new_status: string }>,
    startDate: Date,
    endDate: Date,
  ): DailyActivity[] {
    // 日付ごとのアクティビティを集計
    const dailyMap = new Map<string, DailyActivity>();

    // 日付の初期化
    for (let i = 0; i <= 6; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyMap.set(dateStr, {
        date: new Date(date),
        activities: { add: 0, swipe: 0, read: 0 },
      });
    }

    // アクションの集計
    logs.forEach((log) => {
      const dateStr = new Date(log.changed_at).toISOString().split("T")[0];
      const daily = dailyMap.get(dateStr);

      if (daily) {
        // ステータスに応じてカウントを増やす
        Object.entries(ActivityStatusMapping).forEach(([key, statuses]) => {
          if (statuses.includes(log.new_status)) {
            daily.activities[key as ActivityStatus]++;
          }
        });
      }
    });

    // 日付順にソートして返す
    return Array.from(dailyMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }
}
