import { type PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { type UserLink } from "@/feature/links/domain/models/types";
import { linkApi } from "@/feature/links/infrastructure/api";
import {
  getDateRanges,
  isToday,
} from "@/feature/links/infrastructure/utils/dateUtils";
import { dateUtils as globalDateUtils } from "@/lib/utils/dateUtils";

/**
 * スワイプ可能なリンクのステータス定義
 */
const SWIPEABLE_LINK_STATUSES = {
  // 最優先で表示するステータス
  PRIORITY_1: ["add"],

  // 2番目に表示するステータス（読む予定日が過去のもの）
  PRIORITY_2_STATUSES: ["Today", "inWeekend"],

  // 3番目に表示するステータス
  PRIORITY_3_STATUSES: ["Skip"],

  // 表示しないステータス
  EXCLUDED: ["Reading", "Bookmark"],
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
   * 2. ステータスが 'Today' または 'inWeekend' で、読む予定日が現在時刻より前のリンク、ただしステータスが 'Today', 'inWeekend' で読む予定日が今日の場合は除外
   * 3. ステータスが 'Skip' のリンク、またはre_readフラグがtrueのリンク（Readステータスを含む）
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
      const { now } = getDateRanges();

      // 全てのスワイプ可能なステータス（re_read=trueのReadは別途処理）
      const allSwipeableStatuses = [
        ...SWIPEABLE_LINK_STATUSES.PRIORITY_1,
        ...SWIPEABLE_LINK_STATUSES.PRIORITY_2_STATUSES,
        ...SWIPEABLE_LINK_STATUSES.PRIORITY_3_STATUSES,
      ];

      // クエリビルダー関数を定義
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryBuilder = (query: PostgrestFilterBuilder<any, any, any>) => {
        // 基本クエリ: スワイプ可能なステータスか、re_read=trueのリンク
        return query
          .or(
            `status.in.(${allSwipeableStatuses.map((s) => `"${s}"`).join(",")}),re_read.eq.true`,
          )
          .not(
            "status",
            "in",
            `(${SWIPEABLE_LINK_STATUSES.EXCLUDED.map((s) => `"${s}"`).join(",")})`,
          );
      };

      // APIを呼び出して候補リンクを取得（多めに取得）
      const candidateLinks = await linkApi.fetchUserLinksWithCustomQuery({
        userId,
        limit: limit * 3, // 十分な候補を確保するため多めに取得
        queryBuilder,
        orderBy: "added_at", // 追加された日時順に並べる
        ascending: false, // 新しい順に並べる
      });

      if (!candidateLinks || candidateLinks.length === 0) {
        return [];
      }

      // 現在時刻（ローカルタイムゾーンのDateオブジェクト）
      const currentTime = now;

      // 優先順位に基づいてリンクを分類

      // 1. 優先順位1: ステータスが 'add' のリンク（全て取得）
      const priority1Links = candidateLinks.filter((link) =>
        SWIPEABLE_LINK_STATUSES.PRIORITY_1.includes(link.status),
      );

      // addステータスのリンクが制限数以上あれば、それだけで十分
      if (priority1Links.length >= limit) {
        return priority1Links.slice(0, limit);
      }

      // 優先順位1のリンクIDを取得
      const priority1Ids = new Set(priority1Links.map((link) => link.link_id));

      // 2. 優先順位2: ステータスが 'Today' または 'inWeekend' で、読む予定日が現在時刻より前のリンク
      // ただし、ステータスが 'Today', 'inWeekend' で読む予定日が今日の場合は除外する
      const priority2Links = candidateLinks.filter(
        (link) =>
          !priority1Ids.has(link.link_id) && // 優先順位1でないこと
          SWIPEABLE_LINK_STATUSES.PRIORITY_2_STATUSES.includes(link.status) &&
          link.scheduled_read_at &&
          // UTC時間をローカルタイムゾーンに変換して比較
          globalDateUtils.utcToLocalDate(link.scheduled_read_at) <
            currentTime &&
          // isToday関数も改善されたglobalDateUtils.utcToLocalDateを利用
          !isToday(globalDateUtils.utcToLocalDate(link.scheduled_read_at)), // 今日の日付のリンクは除外
      );

      // 優先順位1と2で制限数以上あれば、それだけを返す
      if (priority1Links.length + priority2Links.length >= limit) {
        return [...priority1Links, ...priority2Links].slice(0, limit);
      }

      // 優先順位1と2のリンクIDを取得
      const priority1And2Ids = new Set([
        ...priority1Ids,
        ...priority2Links.map((link) => link.link_id),
      ]);

      // 3. 優先順位3:
      // - ステータスが 'Skip' のリンク、または
      // - re_readフラグがtrueのリンク（Readステータスを含む）
      const priority3Links = candidateLinks.filter(
        (link) =>
          !priority1And2Ids.has(link.link_id) && // 優先順位1と2でないこと
          (SWIPEABLE_LINK_STATUSES.PRIORITY_3_STATUSES.includes(link.status) ||
            link.re_read === true),
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
