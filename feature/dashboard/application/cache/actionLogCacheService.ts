import { type KeyedMutator, type ScopedMutator } from "swr";

import { ACTION_LOG_CACHE_KEYS, isActionLogCache } from "./actionLogCacheKeys";

/**
 * アクションログ関連のキャッシュを管理するサービス
 */
export const actionLogCacheService = {
  /**
   * アクションログカウント取得後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterActionLogCount: (userId: string, mutate: ScopedMutator): void => {
    // 今日のアクションログカウントのキャッシュを更新
    mutate(ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId));
  },

  /**
   * アクションログ追加後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterActionLogAdd: (userId: string, mutate: ScopedMutator): void => {
    // アクションログ追加後は全ての関連キャッシュを明示的に更新
    // 1. 今日のアクションログカウント
    mutate(ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId));
    // 2. リンクステータスカウント
    mutate(ACTION_LOG_CACHE_KEYS.LINK_STATUS_COUNTS(userId));
    // 3. スワイプステータスカウント
    mutate(ACTION_LOG_CACHE_KEYS.SWIPE_STATUS_COUNTS(userId));

    // 汎用的なキャッシュ更新（他にアクションログ関連のキャッシュがあれば更新）
    mutate(isActionLogCache);
  },

  /**
   * 特定のアクションタイプのカウントキャッシュ更新
   * @template T データの型
   * @param userId ユーザーID
   * @param actionType アクションタイプ
   * @param mutate SWRのmutate関数
   */
  updateActionTypeCount: function <T>(
    userId: string,
    actionType: string,
    mutate: KeyedMutator<T>,
  ): void {
    mutate();
  },
};
