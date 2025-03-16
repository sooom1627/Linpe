// アクティビティの種類を定義
export type ActivityStatus = "add" | "swipe" | "read";

// 1日分のアクティビティデータ
export interface DailyActivity {
  date: Date;
  activities: Record<ActivityStatus, number>;
}

// 週間アクティビティデータ
export interface WeeklyActivityData {
  activities: DailyActivity[];
}

// 表示用のデータ型（View Model）
export interface ActivityViewModel {
  day: string;
  add: number;
  swipe: number;
  read: number;
}

// アクティビティのステータスマッピング
export const ActivityStatusMapping: Record<ActivityStatus, string[]> = {
  add: ["add"],
  swipe: ["Today", "inWeekend", "Skip"],
  read: ["Read", "Reading", "Re-Read", "Bookmark"],
};
