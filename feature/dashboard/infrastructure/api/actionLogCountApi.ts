import supabase from "@/lib/supabase";
import {
  statusToTypeMap,
  type ActionType,
} from "../../domain/models/ActionLogCount";

/**
 * アクションログカウントリポジトリのインターフェース
 */
export interface IActionLogCountRepository {
  getActionLogCount: (params: {
    userId: string;
    actionType: ActionType;
    startDate?: string;
    endDate?: string;
  }) => Promise<number>;
}

/**
 * アクションログカウントリポジトリの実装
 */
export const actionLogCountRepository: IActionLogCountRepository = {
  /**
   * アクションログのカウントを取得する
   * @param params 検索パラメータ
   * @returns カウント結果
   */
  getActionLogCount: async (params: {
    userId: string;
    actionType: ActionType;
    startDate?: string;
    endDate?: string;
  }): Promise<number> => {
    try {
      console.debug("[actionLogCountRepository] fetching with params:", {
        userId: params.userId,
        actionType: params.actionType,
        startDate: params.startDate,
        endDate: params.endDate,
      });

      // アクションタイプに対応するステータスのリストを取得
      const statuses = Object.entries(statusToTypeMap)
        .filter(([_, type]) => type === params.actionType)
        .map(([status, _]) => status);

      if (statuses.length === 0) {
        return 0;
      }

      let query = supabase
        .from("user_link_actions_log")
        .select("*", { count: "exact", head: true })
        .eq("user_id", params.userId)
        .in("new_status", statuses);

      // 日付範囲が指定されている場合、フィルタを追加（UTCとして処理）
      if (params.startDate) {
        query = query.gte("changed_at", params.startDate);
      }

      if (params.endDate) {
        query = query.lte("changed_at", params.endDate);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      console.debug("[actionLogCountRepository] result count:", count);
      return count || 0;
    } catch (error) {
      console.error("Error fetching action log count by type:", error);
      throw error;
    }
  },
};
