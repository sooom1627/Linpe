/**
 * Linksに関連するキャッシュキーを一元管理するための定数
 */
export const LINK_CACHE_KEYS = {
  /**
   * 特定ステータスのリンク用キャッシュキー
   * @param userId ユーザーID
   * @param status リンクのステータス
   * @returns キャッシュキー
   */
  STATUS_LINKS: (userId: string, status: string) => [
    "status-links",
    userId,
    status,
  ],

  /**
   * スワイプ可能なリンク用キャッシュキー
   * @param userId ユーザーID
   * @returns キャッシュキー
   */
  SWIPEABLE_LINKS: (userId: string) => ["swipeable-links", userId],

  /**
   * ユーザーリンク用キャッシュキー
   * @param userId ユーザーID
   * @param limit 取得件数
   * @returns キャッシュキー
   */
  USER_LINKS: (userId: string, limit: number = 10) => [
    `user-links-${userId}`,
    limit,
  ],

  /**
   * 汎用リンク用キャッシュキー
   * @param limit 取得件数
   * @returns キャッシュキー
   */
  LINKS: (limit: number) => ["links", limit],

  /**
   * OGデータ用キャッシュキー
   * @param urlsKey URLのキー
   * @returns キャッシュキー
   */
  OG_DATA: (urlsKey: string) => ["og-data", urlsKey],
};

/**
 * リンク関連のキャッシュかどうかを判定する関数（パターンマッチング）
 * @param key キャッシュキー
 * @returns リンク関連のキャッシュかどうか
 */
export const isLinkCache = (key: unknown): boolean => {
  if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
    return key[0].includes("links");
  }
  return false;
};

/**
 * リンク関連のキャッシュかどうかを判定する関数（links-で始まるパターン）
 * @param key キャッシュキー
 * @returns リンク関連のキャッシュかどうか
 */
export const isLinksStartsWithCache = (key: unknown): boolean => {
  if (typeof key === "string") {
    return key.startsWith("links-");
  }
  if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
    return key[0].startsWith("links-");
  }
  return false;
};
