/**
 * アクションログに関連するキャッシュキーを一元管理するための定数
 */
export const ACTION_LOG_CACHE_KEYS = {
  /**
   * 今日のアクションログカウント用キャッシュキー
   * @param userId ユーザーID
   * @returns キャッシュキー
   */
  TODAY_ACTION_LOG_COUNT: (userId: string) => [
    "today-action-log-count",
    userId,
  ],

  /**
   * 期間指定のアクションログカウント用キャッシュキー
   * @param userId ユーザーID
   * @param startDate 開始日
   * @param endDate 終了日
   * @returns キャッシュキー
   */
  PERIOD_ACTION_LOG_COUNT: (
    userId: string,
    startDate: string,
    endDate: string,
  ) => ["period-action-log-count", userId, startDate, endDate],

  /**
   * 特定のアクションタイプのカウント用キャッシュキー
   * @param userId ユーザーID
   * @param actionType アクションタイプ
   * @param startDate 開始日
   * @param endDate 終了日
   * @returns キャッシュキー
   */
  ACTION_TYPE_COUNT: (
    userId: string,
    actionType: string,
    startDate?: string,
    endDate?: string,
  ) => ["action-type-count", userId, actionType, startDate, endDate],
};

/**
 * アクションログ関連のキャッシュかどうかを判定する関数（パターンマッチング）
 * @param key キャッシュキー
 * @returns アクションログ関連のキャッシュかどうか
 */
export const isActionLogCache = (key: unknown): boolean => {
  if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
    return key[0].includes("action-log");
  }
  return false;
};

/**
 * アクションタイプカウント関連のキャッシュかどうかを判定する関数
 * @param key キャッシュキー
 * @returns アクションタイプカウント関連のキャッシュかどうか
 */
export const isActionTypeCountCache = (key: unknown): boolean => {
  if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
    return key[0] === "action-type-count";
  }
  return false;
};
