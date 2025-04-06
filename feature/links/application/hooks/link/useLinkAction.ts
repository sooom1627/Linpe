import { useState } from "react";
import { useSWRConfig } from "swr";

import { notificationService } from "@/lib/notification";
import { crossFeatureCacheService } from "@/shared/cache/crossFeatureCacheService";
import { linkCacheService } from "../../cache/linkCacheService";
import { linkActionService } from "../../service/linkActionService";

export const useLinkAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useSWRConfig();

  /**
   * スワイプ操作によるリンクアクションの更新
   * @param userId ユーザーID
   * @param linkId リンクID
   * @param status スワイプ後のステータス（Today, inWeekend, Skip）
   * @param swipeCount スワイプカウント
   * @returns 更新結果
   */
  const updateLinkActionBySwipe = async (
    userId: string,
    linkId: string,
    status: "Today" | "inWeekend" | "Skip",
    swipeCount: number,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await linkActionService.updateLinkActionBySwipe(
        userId,
        linkId,
        status,
        swipeCount,
      );

      if (result.success) {
        // キャッシュの更新
        linkCacheService.updateAfterLinkAction(userId, mutate);
        // ダッシュボードのキャッシュも更新
        crossFeatureCacheService.updateDashboardCacheAfterLinkAction(
          userId,
          mutate,
        );
        // スワイプ操作では通知を表示しない
      } else {
        // エラー通知
        notificationService.error(
          "リンクの更新に失敗しました",
          result.error?.message || "不明なエラーが発生しました",
          { position: "top", offset: 70, duration: 3000 },
        );
      }

      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred"),
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 読書状態によるリンクアクションの更新
   * @param userId ユーザーID
   * @param linkId リンクID
   * @param status 読書状態（Read, Reading, Re-Read, Bookmark）
   * @param swipeCount 現在のスワイプカウント
   * @returns 更新結果
   */
  const updateLinkActionByReadStatus = async (
    userId: string,
    linkId: string,
    status: "Read" | "Skip" | "Re-Read" | "Bookmark",
    swipeCount: number,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Re-Readの場合、ステータスをReadに変更し、re_readフラグをtrueに設定
      const actualStatus = status === "Re-Read" ? "Read" : status;
      const re_read = status === "Re-Read";

      const result = await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        actualStatus,
        swipeCount,
        re_read,
      );

      if (result.success) {
        // キャッシュの更新
        linkCacheService.updateAfterLinkAction(userId, mutate);
        // ダッシュボードのキャッシュも更新
        crossFeatureCacheService.updateDashboardCacheAfterLinkAction(
          userId,
          mutate,
        );

        // 成功通知
        notificationService.success(
          "リンクが更新されました",
          `ステータス: ${status}`,
          {
            position: "top",
            offset: 70,
            duration: 3000,
          },
        );
      } else {
        // エラー通知
        notificationService.error(
          "リンクの更新に失敗しました",
          result.error?.message || "不明なエラーが発生しました",
          { position: "top", offset: 70, duration: 3000 },
        );
      }

      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred"),
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLinkAction = async (userId: string, linkId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await linkActionService.deleteLinkAction(userId, linkId);

      if (result.success) {
        // キャッシュの更新
        linkCacheService.updateAfterLinkAction(userId, mutate);
        // ダッシュボードのキャッシュも更新
        crossFeatureCacheService.updateDashboardCacheAfterLinkAction(
          userId,
          mutate,
        );

        // 成功通知
        notificationService.success("リンクが削除されました", undefined, {
          position: "top",
          offset: 70,
          duration: 3000,
        });
      } else {
        // エラー通知
        notificationService.error(
          "リンクの削除に失敗しました",
          result.error?.message || "不明なエラーが発生しました",
          { position: "top", offset: 70, duration: 3000 },
        );
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "不明なエラーが発生しました";

      // エラー通知
      notificationService.error("リンクの削除に失敗しました", errorMessage, {
        position: "top",
        offset: 70,
        duration: 3000,
      });

      setError(
        err instanceof Error ? err : new Error("Unknown error occurred"),
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateLinkActionBySwipe,
    updateLinkActionByReadStatus,
    deleteLinkAction,
    isLoading,
    error,
  };
};
