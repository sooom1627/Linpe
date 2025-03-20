import supabase from "@/lib/supabase";
import {
  statusToTypeMap,
  type ActionType,
} from "../../domain/models/ActionLogCount";

/**
 * ステータスごとのカウント結果の型
 */
export interface StatusCount {
  status: string;
  count: number;
}

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

  getTotalActionCountByStatus: (params: {
    userId: string;
    statuses: string[];
  }) => Promise<StatusCount[]>;
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

      return count || 0;
    } catch (error) {
      console.error("Error fetching action log count by type:", error);
      throw error;
    }
  },

  /**
   * 指定したステータスごとのアクションカウントを取得する
   * @param params 検索パラメータ
   * @returns ステータスごとのカウント結果の配列
   */
  getTotalActionCountByStatus: async (params: {
    userId: string;
    statuses: string[];
  }): Promise<StatusCount[]> => {
    try {
      const result: StatusCount[] = [];

      // 各ステータスごとにカウントを取得
      for (const status of params.statuses) {
        const query = supabase
          .from("user_link_actions_log")
          .select("*", { count: "exact", head: true })
          .eq("user_id", params.userId)
          .eq("new_status", status);

        const { count, error } = await query;

        if (error) {
          throw error;
        }

        // 結果を配列に追加
        result.push({
          status,
          count: count || 0,
        });
      }

      return result;
    } catch (error) {
      console.error("Error fetching action log count by status:", error);
      throw error;
    }
  },
};
