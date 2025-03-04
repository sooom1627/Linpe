/**
 * 日付関連のユーティリティ関数
 */

/**
 * 現在時刻と今日の日付範囲（開始と終了）を取得する
 * @returns {Object} now: 現在時刻、startOfDay: 今日の開始時刻、endOfDay: 今日の終了時刻（明日の開始時刻）
 */
export function getDateRanges() {
  const now = new Date().toISOString();
  const today = new Date();

  // 今日の開始時刻（00:00:00）
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).toISOString();

  // 今日の終了時刻（明日の00:00:00）
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  ).toISOString();

  return { now, startOfDay, endOfDay };
}

/**
 * 指定された日付が今日かどうかを判定する
 * @param date 判定する日付
 * @returns {boolean} 今日ならtrue、そうでなければfalse
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
