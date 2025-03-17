/**
 * SWRの共通設定
 */

// デフォルト設定
export const SWR_DEFAULT_CONFIG = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1分間は重複リクエストを防止
  errorRetryCount: 3,
};

// データ表示用の設定（バックグラウンド更新なし）
export const SWR_DISPLAY_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000,
  errorRetryCount: 3,
};

/**
 * キャッシュキー生成の統一ヘルパー
 * @param prefix キャッシュキーのプレフィックス
 * @param params キャッシュキーに含めるパラメータ
 * @returns 結合されたキャッシュキー
 */
export const createCacheKey = (prefix: string, ...params: string[]) =>
  [prefix, ...params].filter(Boolean).join(":");
