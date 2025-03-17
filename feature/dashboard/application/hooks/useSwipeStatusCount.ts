import useSWR from "swr";

import { ActionStatus } from "../../domain/models/ActionLogCount";
import {
  actionLogCountRepository,
  type StatusCount,
} from "../../infrastructure/api/actionLogCountApi";
import { ACTION_LOG_CACHE_KEYS } from "../cache/actionLogCacheKeys";
import { SWR_DISPLAY_CONFIG } from "../cache/swrConfig";

/**
 * スワイプステータスカウントの型定義
 */
export interface SwipeStatusCount {
  total: number;
  today: number;
  inWeekend: number;
  skip: number;
}

/**
 * ユーザーのスワイプステータスカウントを取得するカスタムフック
 * @param userId ユーザーID
 * @returns スワイプステータスカウントの状態
 */
export const useSwipeStatusCount = (userId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ACTION_LOG_CACHE_KEYS.SWIPE_STATUS_COUNTS(userId) : null,
    async () => {
      if (!userId) {
        return null;
      }

      try {
        // APIからデータを取得
        const swipeCount =
          await actionLogCountRepository.getTotalActionCountByStatus({
            userId,
            statuses: [
              ActionStatus.TODAY,
              ActionStatus.IN_WEEKEND,
              ActionStatus.SKIP,
            ],
          });

        // 各ステータスのカウントを計算
        const todayCount =
          swipeCount.find(
            (item: StatusCount) => item.status === ActionStatus.TODAY,
          )?.count || 0;

        const inWeekendCount =
          swipeCount.find(
            (item: StatusCount) => item.status === ActionStatus.IN_WEEKEND,
          )?.count || 0;

        const skipCount =
          swipeCount.find(
            (item: StatusCount) => item.status === ActionStatus.SKIP,
          )?.count || 0;

        // 合計を計算
        const total = todayCount + inWeekendCount + skipCount;

        return {
          total,
          today: todayCount,
          inWeekend: inWeekendCount,
          skip: skipCount,
        } as SwipeStatusCount;
      } catch (error) {
        console.error("[useSwipeStatusCount] Error fetching data:", error);
        throw error;
      }
    },
    SWR_DISPLAY_CONFIG,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
