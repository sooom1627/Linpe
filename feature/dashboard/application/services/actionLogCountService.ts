import { dateUtils } from "@/lib/utils/dateUtils";
import {
  ActionType,
  type ActionLogCount,
} from "../../domain/models/ActionLogCount";
import { actionLogCountRepository } from "../../infrastructure/api/actionLogCountApi";

/**
 * アクションログカウントサービスのインターフェース
 */
export interface IActionLogCountService {
  /**
   * 今日のアクションログカウントを取得する
   * @param userId ユーザーID
   * @returns アクションログカウント
   */
  getTodayActionLogCount: (userId: string) => Promise<ActionLogCount>;
}

/**
 * アクションログカウントサービスの実装
 */
export const actionLogCountService: IActionLogCountService = {
  /**
   * 今日のアクションログカウントを取得する
   * @param userId ユーザーID
   * @returns アクションログカウント
   */
  getTodayActionLogCount: async (userId: string): Promise<ActionLogCount> => {
    try {
      // タイムゾーンを考慮した日付処理
      const today = dateUtils.getLocalDate();
      const dateRange = dateUtils.getDateRangeForFetch(today, today);

      // 並列処理で各アクションタイプごとのカウントを取得
      const actionTypes = [ActionType.ADD, ActionType.SWIPE, ActionType.READ];
      const counts = await Promise.all(
        actionTypes.map((actionType) =>
          actionLogCountRepository.getActionLogCount({
            userId,
            actionType,
            startDate: dateRange.startUTC,
            endDate: dateRange.endUTC,
          }),
        ),
      );

      const [addCount, swipeCount, readCount] = counts;

      const result = {
        add: addCount,
        swipe: swipeCount,
        read: readCount,
      };

      return result;
    } catch (error) {
      console.error("アクションログカウントの取得に失敗しました:", error);
      // 詳細なエラー情報をログに残しつつ、ユーザーに表示するエラーは一般化
      throw new Error("アクションログカウントの取得に失敗しました");
    }
  },
};
