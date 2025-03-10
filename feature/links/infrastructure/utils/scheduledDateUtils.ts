import { type LinkActionStatus } from "@/feature/links/domain/models/types";

/**
 * 次の日曜日の日付を計算する
 * 土曜日・日曜日の場合は必ず次の週の日曜日を返す
 */
const getNextSunday = (from: Date = new Date()): Date => {
  const date = new Date(from);
  const currentDay = date.getDay();

  // 土曜日は6、日曜日は0
  // 週末（土日）の場合は必ず次の週の日曜日を返す
  const daysUntilNextSunday =
    currentDay === 0 || currentDay === 6
      ? 7 + ((7 - currentDay) % 7)
      : 7 - currentDay;

  date.setDate(date.getDate() + daysUntilNextSunday);

  // 時間をリセット
  date.setHours(0, 0, 0, 0);

  return date;
};

/**
 * ステータスに基づいてスケジュール日を計算する
 */
export const calculateScheduledDate = (
  status: LinkActionStatus,
): Date | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (status) {
    case "inWeekend":
      return getNextSunday();

    case "Today":
      return today;

    case "Skip":
      // Skipの場合は現在の日付を返す（実際にはnullが使用される）
      return null;

    default:
      return today;
  }
};
