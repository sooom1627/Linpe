import supabase from "@/lib/supabase";

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
        .from("user_links_with_actions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", params.userId)
        .eq("status", params.status);

      // 日付範囲が指定されている場合、フィルタを追加
      if (params.startDate) {
        query = query.gte("created_at", params.startDate);
      }

      if (params.endDate) {
        query = query.lte("created_at", params.endDate);
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
};
