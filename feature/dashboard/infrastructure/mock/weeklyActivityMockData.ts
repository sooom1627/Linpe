import { type WeeklyActivityData } from "../../domain/models/weeklyActivity";

/**
 * 週間アクティビティデータのモックデータ
 * 開発・テスト用のダミーデータ
 */
export const weeklyActivityMockData: WeeklyActivityData = {
  startDate: "2025-03-16",
  endDate: "2025-03-22",
  data: [
    { day: "Mon", date: "2025-03-16", add: 45, swipe: 32, read: 78 },
    { day: "Tue", date: "2025-03-17", add: 38, swipe: 29, read: 65 },
    { day: "Wed", date: "2025-03-18", add: 52, swipe: 41, read: 83 },
    { day: "Thu", date: "2025-03-19", add: 30, swipe: 25, read: 59 },
    { day: "Fri", date: "2025-03-20", add: 48, swipe: 37, read: 72 },
    { day: "Sat", date: "2025-03-21", add: 55, swipe: 42, read: 90 },
    { day: "Sun", date: "2025-03-22", add: 35, swipe: 28, read: 68 },
  ],
};

/**
 * 日付範囲をフォーマットする関数
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns フォーマットされた日付範囲文字列
 */
export function formatDateRange(startDate: string, endDate: string): string {
  // YYYY-MM-DD形式からYYYY/MM/DD形式に変換
  const formattedStart = startDate.replace(/-/g, "/");
  const formattedEnd = endDate.replace(/-/g, "/");
  return `${formattedStart}~${formattedEnd}`;
}
