import supabase from "@/lib/supabase";
import { type IActionLogCountRepository } from "../../application/services/actionLogCountService";
import {
  statusToTypeMap,
  type ActionType,
} from "../../domain/models/ActionLogCount";

/**
 * アクションログのカウント取得用API
 */
export const actionLogCountApi = {
  /**
   * 特定のステータスと日付範囲に基づいてアクションログのカウントを取得
   * @param params 検索パラメータ
   * @returns カウント結果
   */
  fetchActionLogCount: async (params: {
    userId: string;
    status: string;
    startDate?: string;
    endDate?: string;
  }): Promise<number> => {
    try {
      let query = supabase
        .from("user_link_actions_log")
        .select("*", { count: "exact", head: true })
        .eq("user_id", params.userId)
        .eq("new_status", params.status);

      // 日付範囲が指定されている場合、フィルタを追加
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
      console.error("Error fetching action log count:", error);
      throw error;
    }
  },

  /**
   * アクションタイプに基づいてアクションログのカウントを取得
   * @param params 検索パラメータ
   * @returns カウント結果
   */
  fetchActionLogCountByType: async (params: {
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

      // 日付範囲が指定されている場合、フィルタを追加
      if (params.startDate) {
        query = query.gte("changed_at", `${params.startDate}T00:00:00`);
      }

      if (params.endDate) {
        query = query.lte("changed_at", `${params.endDate}T23:59:59`);
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
};

/**
 * アクションログカウントリポジトリの実装
 */
export class ActionLogCountRepository implements IActionLogCountRepository {
  /**
   * アクションログのカウントを取得する
   * @param params 検索パラメータ
   * @returns カウント結果
   */
  async getActionLogCount(params: {
    userId: string;
    actionType: ActionType;
    startDate?: string;
    endDate?: string;
  }): Promise<number> {
    return actionLogCountApi.fetchActionLogCountByType(params);
  }
}
