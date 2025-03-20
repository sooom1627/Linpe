import { type ScopedMutator } from "swr";

import { actionLogCacheService, weeklyActivityCacheService } from "../cache";

/**
 * アクションログ更新時のキャッシュ更新を統合的に管理するサービス
 */
export const actionLogCacheUpdateService = {
  /**
   * アクションログ追加時の全関連キャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAllRelatedCaches: (userId: string, mutate: ScopedMutator): void => {
    // アクションログ関連のキャッシュを更新
    actionLogCacheService.updateAfterActionLogAdd(userId, mutate);

    // 週間アクティビティのキャッシュも更新
    weeklyActivityCacheService.updateAfterActionLogChange(userId, mutate);
  },
};
