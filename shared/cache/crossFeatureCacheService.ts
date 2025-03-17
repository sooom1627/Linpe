import { type ScopedMutator } from "swr";

import { ACTION_LOG_CACHE_KEYS } from "@/feature/dashboard/application/cache/actionLogCacheKeys";
import { actionLogCacheService } from "@/feature/dashboard/application/cache/actionLogCacheService";

/**
 * フィーチャー間のキャッシュ連携を管理する最小限のサービス
 */
export const crossFeatureCacheService = {
  /**
   * リンク関連アクション後のダッシュボードキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateDashboardCacheAfterLinkAction: (
    userId: string,
    mutate: ScopedMutator,
  ): void => {
    // アクションログキャッシュを更新
    actionLogCacheService.updateAfterActionLogAdd(userId, mutate);

    // DashboardScreenで使用する特定のキャッシュキーも明示的に更新
    // 1. 今日のアクションログカウント
    mutate(ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId));
    // 2. リンクステータスカウント
    mutate(ACTION_LOG_CACHE_KEYS.LINK_STATUS_COUNTS(userId));
    // 3. スワイプステータスカウント
    mutate(ACTION_LOG_CACHE_KEYS.SWIPE_STATUS_COUNTS(userId));
  },
};
