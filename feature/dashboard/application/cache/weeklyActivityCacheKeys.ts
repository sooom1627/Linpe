/**
 * 週間アクティビティに関連するキャッシュキーを一元管理するための定数
 */
export const WEEKLY_ACTIVITY_CACHE_KEYS = {
  /**
   * ユーザーの週間アクティビティ用キャッシュキー
   * @param userId ユーザーID
   * @returns キャッシュキー
   */
  WEEKLY_ACTIVITY: (userId: string) => ["weeklyActivity", userId],
};

/**
 * 週間アクティビティ関連のキャッシュかどうかを判定する関数
 * @param key キャッシュキー
 * @returns 週間アクティビティ関連のキャッシュかどうか
 */
export const isWeeklyActivityCache = (key: unknown): boolean => {
  if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
    return key[0] === "weeklyActivity";
  }
  return false;
};
