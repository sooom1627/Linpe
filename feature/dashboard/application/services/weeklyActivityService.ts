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
    startDate.setDate(endDate.getDate() - 6); // Past 7 days including today

    try {
      const logs = await this.repository.fetchActivityLogs(
        userId,
        startDate,
        endDate,
      );

      // Execute domain logic (aggregate data)
      const dailyActivities = this.aggregateActivities(
        logs,
        startDate,
        endDate,
      );

      return {
        activities: dailyActivities,
      };
    } catch (error) {
      console.error("Failed to fetch weekly activity:", error);
      throw error;
    }
  }

  // Convert to view model
  toViewModel(data: WeeklyActivityData): ActivityViewModel[] {
    return data.activities.map((daily) => ({
      day: daily.date.toLocaleDateString("en-US", { weekday: "short" }),
      add: daily.activities.add,
      swipe: daily.activities.swipe,
      read: daily.activities.read,
    }));
  }

  private aggregateActivities(
    logs: Array<{ changed_at: string; new_status: string }>,
    startDate: Date,
    endDate: Date,
  ): DailyActivity[] {
    // Helper function to convert date to string
    const toDateString = (date: Date): string =>
      date.toISOString().split("T")[0];

    // Helper function to create empty activity record
    const createEmptyActivity = (date: Date): DailyActivity => ({
      date: new Date(date),
      activities: { add: 0, swipe: 0, read: 0 },
    });

    // Initialize daily map with empty records
    const dailyMap = new Map<string, DailyActivity>();
    for (let i = 0; i <= 6; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      dailyMap.set(toDateString(date), createEmptyActivity(date));
    }

    // Aggregate activity logs
    logs.forEach((log) => {
      const dateStr = toDateString(new Date(log.changed_at));
      const daily = dailyMap.get(dateStr);

      if (daily) {
        // Increment count based on status
        Object.entries(ActivityStatusMapping).forEach(([key, statuses]) => {
          if (statuses.includes(log.new_status)) {
            daily.activities[key as ActivityStatus]++;
          }
        });
      }
    });

    // Sort by date and return
    return Array.from(dailyMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }
}
