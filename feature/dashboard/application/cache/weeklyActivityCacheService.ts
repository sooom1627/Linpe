import { type KeyedMutator, type ScopedMutator } from "swr";

import {
  isWeeklyActivityCache,
  WEEKLY_ACTIVITY_CACHE_KEYS,
} from "./weeklyActivityCacheKeys";

/**
 * 週間アクティビティ関連のキャッシュを管理するサービス
 */
export const weeklyActivityCacheService = {
  /**
   * 週間アクティビティデータ取得後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterWeeklyActivityFetch: (
    userId: string,
    mutate: ScopedMutator,
  ): void => {
    // 週間アクティビティのキャッシュを更新
    mutate(WEEKLY_ACTIVITY_CACHE_KEYS.WEEKLY_ACTIVITY(userId));
  },

  /**
   * アクションログ追加後の週間アクティビティキャッシュの更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterActionLogChange: (userId: string, mutate: ScopedMutator): void => {
    // アクションログ変更後は週間アクティビティのキャッシュを更新
    mutate(WEEKLY_ACTIVITY_CACHE_KEYS.WEEKLY_ACTIVITY(userId));

    // 汎用的なキャッシュ更新（他に週間アクティビティ関連のキャッシュがあれば更新）
    mutate(isWeeklyActivityCache);
  },

  /**
   * 特定の週間アクティビティキャッシュの更新
   * @template T データの型
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateWeeklyActivity: function <T>(
    userId: string,
    mutate: KeyedMutator<T>,
  ): void {
    mutate(undefined, { revalidate: true });
    // またはキャッシュキーを明示的に指定する場合
    // mutate(WEEKLY_ACTIVITY_CACHE_KEYS.WEEKLY_ACTIVITY(userId));
  },
};
