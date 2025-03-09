import { type PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { type UserLink } from "@/feature/links/domain/models/types";
import { linkApi } from "@/feature/links/infrastructure/api";
import { getDateRanges } from "@/feature/links/infrastructure/utils/dateUtils";

/**
 * スワイプ可能なリンクのステータス定義
 */
const SWIPEABLE_LINK_STATUSES = {
  // 最優先で表示するステータス
  PRIORITY_1: ["add"],

  // 3番目に表示するステータス（ランダム順）
  PRIORITY_3: ["inWeekend", "inMonth", "Re-Read"],

  // 表示しないステータス
  EXCLUDED: ["Today", "Read", "Reading", "Bookmark"],
};

/**
 * スワイプ可能なリンクを取得するサービス
 */
export const swipeableLinkService = {
  /**
   * 優先順位付けされたスワイプ可能なリンクを取得する
   *
   * 優先順位:
   * 1. ステータスが 'add' のリンク
   * 2. 読む予定日が現在時刻より前で、かつ今日の日付ではないリンク
   * 3. ステータスが 'inWeekend', 'inMonth', 'Re-Read' のリンク（ランダム順）
   *
   * @param userId ユーザーID
   * @param limit 取得する最大件数
   * @returns 優先順位付けされたリンクのリスト
   */
  fetchSwipeableLinks: async (
    userId: string,
    limit: number = 20,
  ): Promise<UserLink[]> => {
    try {
      // 日付関連の情報を取得
      const { now, startOfDay, endOfDay } = getDateRanges();

      // 取得するステータスリスト
      const includedStatuses = [
        ...SWIPEABLE_LINK_STATUSES.PRIORITY_1,
        ...SWIPEABLE_LINK_STATUSES.PRIORITY_3,
      ];

      // クエリビルダー関数を定義
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryBuilder = (query: PostgrestFilterBuilder<any, any, any>) => {
        // 1. 含まれるステータスでフィルタリング
        // 2. または、読む予定日の条件を満たすもの
        return query.or(
          `status.in.(${includedStatuses.map((s) => `"${s}"`).join(",")}),and(scheduled_read_at.lt.${now},not.and(scheduled_read_at.gte.${startOfDay},scheduled_read_at.lt.${endOfDay}))`,
        );
      };

      // APIを呼び出して候補リンクを取得（多めに取得）
      const candidateLinks = await linkApi.fetchUserLinksWithCustomQuery({
        userId,
        limit: limit * 3, // 十分な候補を確保するため多めに取得
        queryBuilder,
      });

      if (!candidateLinks || candidateLinks.length === 0) {
        return [];
      }

      // 1. 優先順位1: ステータスが 'add' のリンク
      const priority1Links = candidateLinks.filter((link) =>
        SWIPEABLE_LINK_STATUSES.PRIORITY_1.includes(link.status),
      );

      // 2. 優先順位2: 読む予定日の条件を満たすリンク（ステータスが優先順位1以外かつ優先順位3以外）
      const priority2Links = candidateLinks.filter(
        (link) =>
          !SWIPEABLE_LINK_STATUSES.PRIORITY_1.includes(link.status) &&
          !SWIPEABLE_LINK_STATUSES.PRIORITY_3.includes(link.status) &&
          link.scheduled_read_at &&
          new Date(link.scheduled_read_at) < new Date(now),
      );

      // 3. 優先順位3: ステータスが優先順位3のリンク
      const priority3Links = candidateLinks.filter((link) =>
        SWIPEABLE_LINK_STATUSES.PRIORITY_3.includes(link.status),
      );

      // 優先順位3のリンクをランダムソート
      const randomizedPriority3Links = shuffleArray(priority3Links);

      // 結果を結合して指定された数に制限
      const result = [
        ...priority1Links,
        ...priority2Links,
        ...randomizedPriority3Links,
      ].slice(0, limit);

      return result;
    } catch (error) {
      console.error("Error fetching swipeable links:", error);
      throw error;
    }
  },
};

/**
 * 配列をランダムにシャッフルする（Fisher-Yates アルゴリズム）
 * @param array シャッフルする配列
 * @returns シャッフルされた新しい配列
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
