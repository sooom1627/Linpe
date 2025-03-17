// アクティビティの種類を定義
export type ActivityStatus = "add" | "swipe" | "read";

// アクティビティデータ
export interface Activity {
  date: Date;
  day: string; // 曜日（例: "Mon", "Tue"など）
  add: number;
  swipe: number;
  read: number;
}

// 週間アクティビティデータ
export interface WeeklyActivityData {
  activities: Activity[];
}

// アクティビティのステータスマッピング
export const ActivityStatusMapping: Record<ActivityStatus, string[]> = {
  add: ["add"],
  swipe: ["Today", "inWeekend", "Skip"],
  read: ["Read", "Reading", "Re-Read", "Bookmark"],
};

// APIレスポンス型
export type ActivityLog = {
  changed_at: string;
  new_status: string;
};
