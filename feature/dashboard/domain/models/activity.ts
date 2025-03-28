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

// ViewModel型を再エクスポート
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
  read: ["Read", "Bookmark"],
};

// APIレスポンス型
export type ActivityLog = {
  changed_at: string;
  new_status: string;
};
