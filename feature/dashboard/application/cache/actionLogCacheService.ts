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
    // アクションログ追加後は全てのアクションログ関連キャッシュを更新
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
