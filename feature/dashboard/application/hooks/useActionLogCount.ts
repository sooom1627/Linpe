import useSWR from "swr";

import {
  ActionType,
  type ActionLogCount,
} from "../../domain/models/ActionLogCount";
import { ActionLogCountRepository } from "../../infrastructure/api/actionLogCountApi";
import { ACTION_LOG_CACHE_KEYS } from "../cache/actionLogCacheKeys";
import { ActionLogCountService } from "../services/actionLogCountService";

/**
 * アクションログカウントを取得するためのカスタムフック
 * @param userId ユーザーID
 * @returns アクションログカウントの状態
 */
export const useActionLogCount = (userId: string) => {
  // リポジトリとサービスのインスタンスを作成
  const repository = new ActionLogCountRepository();
  const service = new ActionLogCountService(repository);

  // SWRを使用してデータを取得
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId) : null,
    async () => {
      if (!userId) {
        return null;
      }
      return service.getTodayActionLogCount(userId);
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1分間は重複リクエストを防止
      errorRetryCount: 3,
    },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

/**
 * 特定の期間のアクションログカウントを取得するためのカスタムフック
 * @param userId ユーザーID
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns アクションログカウントの状態
 */
export const usePeriodActionLogCount = (
  userId: string,
  startDate: string,
  endDate: string,
) => {
  // リポジトリのインスタンスを作成
  const repository = new ActionLogCountRepository();

  // SWRを使用してデータを取得
  const { data, error, isLoading, mutate } = useSWR(
    userId
      ? ACTION_LOG_CACHE_KEYS.PERIOD_ACTION_LOG_COUNT(
          userId,
          startDate,
          endDate,
        )
      : null,
    async () => {
      if (!userId) {
        return null;
      }

      // 並列処理で各アクションタイプごとのカウントを取得
      const [addCount, swipeCount, readCount] = await Promise.all([
        repository.getActionLogCount({
          userId,
          actionType: ActionType.ADD,
          startDate,
          endDate,
        }),
        repository.getActionLogCount({
          userId,
          actionType: ActionType.SWIPE,
          startDate,
          endDate,
        }),
        repository.getActionLogCount({
          userId,
          actionType: ActionType.READ,
          startDate,
          endDate,
        }),
      ]);

      return {
        add: addCount,
        swipe: swipeCount,
        read: readCount,
      } as ActionLogCount;
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1分間は重複リクエストを防止
      errorRetryCount: 3,
    },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
