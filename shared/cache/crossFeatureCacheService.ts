import { type ScopedMutator } from "swr";

import { actionLogCacheService } from "@/feature/dashboard/application/cache/actionLogCacheService";

/**
 * フィーチャー間のキャッシュ連携を管理するサービス
 * 各フィーチャー固有のキャッシュサービスを調整し、
 * クロスカッティングコンサーンを処理します
 */
export const crossFeatureCacheService = {
  /**
   * リンク関連アクション後のダッシュボードキャッシュ更新
   * 適切なドメイン固有のキャッシュサービスに更新処理を委譲します
   *
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateDashboardCacheAfterLinkAction: (
    userId: string,
    mutate: ScopedMutator,
  ): void => {
    // アクションログキャッシュの更新処理をactionLogCacheServiceに委譲
    // ここには複数のフィーチャーをまたぐキャッシュ更新のオーケストレーションロジックのみを配置する
    actionLogCacheService.updateAfterActionLogAdd(userId, mutate);

    // 将来的に、他のフィーチャー固有のキャッシュサービスを呼び出す場合はここに追加
    // 例: profileCacheService.updateAfterLinkAction(userId, mutate);
  },
};
