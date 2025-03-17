import useSWR from "swr";

import { dateUtils } from "@/lib/utils/dateUtils";
import {
  ActionType,
  type ActionLogCount,
} from "../../domain/models/ActionLogCount";
import { actionLogCountRepository } from "../../infrastructure/api/actionLogCountApi";
import { ACTION_LOG_CACHE_KEYS } from "../cache/actionLogCacheKeys";
import { SWR_DEFAULT_CONFIG } from "../cache/swrConfig";
import { actionLogCountService } from "../services/actionLogCountService";

/**
 * アクションログカウントを取得するためのカスタムフック
 * @param userId ユーザーID
 * @returns アクションログカウントの状態
 */
export const useActionLogCount = (userId: string) => {
  // SWRを使用してデータを取得
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId) : null,
    async () => {
      if (!userId) {
        return null;
      }
      return actionLogCountService.getTodayActionLogCount(userId);
    },
    SWR_DEFAULT_CONFIG,
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
 * 引数の日付は「ローカルタイムゾーン」の日付文字列（YYYY-MM-DD）として扱います
 * @param userId ユーザーID
 * @param startDate 開始日（ローカルタイムゾーンのYYYY-MM-DD）
 * @param endDate 終了日（ローカルタイムゾーンのYYYY-MM-DD）
 * @returns アクションログカウントの状態
 */
export const usePeriodActionLogCount = (
  userId: string,
  startDate: string,
  endDate: string,
) => {
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

      // ローカルの日付文字列をDateオブジェクトに変換
      const startLocalDate = new Date(startDate);
      const endLocalDate = new Date(endDate);

      // UTCの日付範囲を取得
      const dateRange = dateUtils.getDateRangeForFetch(
        startLocalDate,
        endLocalDate,
      );

      console.debug("[usePeriodActionLogCount] Using date range:", dateRange);

      // 並列処理で各アクションタイプごとのカウントを取得
      const [addCount, swipeCount, readCount] = await Promise.all([
        actionLogCountRepository.getActionLogCount({
          userId,
          actionType: ActionType.ADD,
          startDate: dateRange.startUTC,
          endDate: dateRange.endUTC,
        }),
        actionLogCountRepository.getActionLogCount({
          userId,
          actionType: ActionType.SWIPE,
          startDate: dateRange.startUTC,
          endDate: dateRange.endUTC,
        }),
        actionLogCountRepository.getActionLogCount({
          userId,
          actionType: ActionType.READ,
          startDate: dateRange.startUTC,
          endDate: dateRange.endUTC,
        }),
      ]);

      return {
        add: addCount,
        swipe: swipeCount,
        read: readCount,
      } as ActionLogCount;
    },
    SWR_DEFAULT_CONFIG,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
