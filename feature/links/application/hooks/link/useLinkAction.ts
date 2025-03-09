import { useState } from "react";
import { useSWRConfig } from "swr";

import { type LinkActionStatus } from "@/feature/links/domain/models/types";
import { notificationService } from "@/lib/notification";
import { linkActionService } from "../../service/linkActionService";

export const useLinkAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useSWRConfig();

  const updateLinkAction = async (
    userId: string,
    linkId: string,
    status: LinkActionStatus,
    swipeCount: number,
    read_at?: string | null,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await linkActionService.updateLinkAction(
        userId,
        linkId,
        status,
        swipeCount,
        read_at,
      );
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
        linkActionService.updateCacheAfterDelete(userId, mutate);

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
    updateLinkAction,
    deleteLinkAction,
    isLoading,
    error,
  };
};
