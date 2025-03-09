import { type ScopedMutator } from "swr";

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
    // ダッシュボードのアクションログキャッシュを更新
    actionLogCacheService.updateAfterActionLogAdd(userId, mutate);
  },
};
