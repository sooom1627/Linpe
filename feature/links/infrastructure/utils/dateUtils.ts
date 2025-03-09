/**
 * 日付関連のユーティリティ関数
 */

/**
 * 現在時刻と今日の日付範囲（開始と終了）を取得する
 * @returns {Object} now: 現在時刻、startOfDay: 今日の開始時刻、endOfDay: 今日の終了時刻（明日の開始時刻）
 */
export function getDateRanges(): {
  now: string;
  startOfDay: string;
  endOfDay: string;
} {
  const today = new Date();
  const now = today.toISOString();

  // 今日の開始時刻（00:00:00）
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).toISOString();

  // 今日の終了時刻（明日の00:00:00）
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfDay = tomorrow.toISOString();

  return { now, startOfDay, endOfDay };
}

/**
 * 指定された日付が今日かどうかを判定する
 * @param date 判定する日付
 * @param referenceDate 比較する基準日（デフォルトは現在の日付）
 * @returns {boolean} 今日ならtrue、そうでなければfalse
 */
export function isToday(date: Date, referenceDate: Date = new Date()): boolean {
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
}

/**
 * 現在時刻をISO形式で取得する
 * @returns {string} ISO形式の現在時刻
 */
export function getCurrentISOTime(): string {
  return new Date().toISOString();
}
