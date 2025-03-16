import { type ActivityViewModel } from "../../domain/models/activity";

export interface ActivityChartData {
  day: string;
  add: number;
  swipe: number;
  read: number;
  [key: string]: string | number;
}

export class ChartDataPresenter {
  static toChartData<T>(
    data: T[] | null,
    config: {
      dayKey: keyof T;
      valueKeys: (keyof T)[];
    },
  ): ActivityChartData[] {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item) => {
      const result: ActivityChartData = {
        day: String(item[config.dayKey]),
        add: 0,
        swipe: 0,
        read: 0,
      };

      config.valueKeys.forEach((key) => {
        const value = item[key];
        if (typeof value === "number") {
          result[String(key)] = value;
        }
      });

      return result;
    });
  }

  static toActivityChartData(
    activityData: ActivityViewModel[] | null,
  ): ActivityChartData[] {
    return this.toChartData(activityData, {
      dayKey: "day",
      valueKeys: ["add", "swipe", "read"],
    });
  }
}
