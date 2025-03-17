/**
 * 日付関連のユーティリティ関数
 */

import { dateUtils as globalDateUtils } from "@/lib/utils/dateUtils";

/**
 * 現在時刻と今日の日付範囲（開始と終了）を取得する
 * @returns {Object} now: 現在時刻、startOfDay: 今日の開始時刻、endOfDay: 今日の終了時刻（明日の開始時刻）
 */
export function getDateRanges() {
  // グローバルのdateUtilsを使用して今日の日付を取得
  const now = globalDateUtils.getLocalDate();

  // 現在時刻
  const currentTime = now;

  // 今日の日付（0時0分0秒）
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // 明日の日付（0時0分0秒）
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  // 一週間後の日付
  const oneWeekLater = new Date(todayStart);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);

  return {
    now,
    currentTime,
    todayStart,
    tomorrowStart,
    oneWeekLater,
  };
}

/**
 * 指定された日付が今日かどうかを判定する
 * @param date 判定する日付
 * @returns {boolean} 今日ならtrue、そうでなければfalse
 */
export function isToday(date: Date): boolean {
  // 現在の日付を取得
  const today = globalDateUtils.getLocalDate();

  // 年、月、日が一致するかチェック
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 指定した日付が明日かどうかを判定
 * @param date 判定する日付
 * @returns {boolean} 明日ならtrue、そうでなければfalse
 */
export function isTomorrow(date: Date): boolean {
  // 現在の日付を取得して、明日の日付を計算
  const today = globalDateUtils.getLocalDate();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 年、月、日が明日の日付と一致するかチェック
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

/**
 * 指定した日付が週末（土曜または日曜）かどうかを判定
 * @param date 判定する日付
 * @returns {boolean} 週末ならtrue、そうでなければfalse
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0: 日曜日, 6: 土曜日
}

/**
 * 指定した日付が一週間以内かどうかを判定
 * @param date 判定する日付
 * @returns {boolean} 一週間以内ならtrue、そうでなければfalse
 */
export function isWithinOneWeek(date: Date): boolean {
  const { todayStart, oneWeekLater } = getDateRanges();
  return date >= todayStart && date < oneWeekLater;
}

/**
 * 現在時刻をISO形式で取得する
 * @returns {string} ISO形式の現在時刻
 */
export function getCurrentISOTime(): string {
  return new Date().toISOString();
}

/**
 * ISO日付文字列をローカルのフォーマットした日付文字列に変換
 * @param isoDateString ISO形式の日付文字列
 * @returns {string} ローカルのフォーマットした日付文字列
 */
export function formatISODateToLocalString(
  isoDateString: string | null,
): string {
  if (!isoDateString) return "";

  try {
    // UTCの日付文字列をローカルの日付オブジェクトに変換
    const date = globalDateUtils.utcToLocalDate(isoDateString);

    // ロケールに応じた日付フォーマット
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (e) {
    console.error("日付の変換に失敗しました:", e);
    return "";
  }
}
