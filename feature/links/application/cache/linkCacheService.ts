import { type KeyedMutator, type ScopedMutator } from "swr";

import { isLinksStartsWithCache, LINK_CACHE_KEYS } from "./linkCacheKeys";

/**
 * リンク関連のキャッシュを管理するサービス
 */
export const linkCacheService = {
  /**
   * リンクアクション（更新・削除）後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterLinkAction: (userId: string, mutate: ScopedMutator): void => {
    // SWIPEABLE_LINKSのキャッシュは更新しない（SwipeScreen操作時に不要なため）
    mutate(LINK_CACHE_KEYS.USER_LINKS(userId, 10));
    mutate(LINK_CACHE_KEYS.STATUS_LINKS(userId, "Today"));
    mutate(LINK_CACHE_KEYS.STATUS_LINKS(userId, "inWeekend"));
  },

  /**
   * リンク追加後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterLinkAdd: (userId: string, mutate: ScopedMutator): void => {
    // リンク追加後は全てのリンク関連キャッシュを更新
    mutate(isLinksStartsWithCache);
    // 明示的にSwipeScreenのリンクキャッシュを更新
    mutate(["swipeable-links", userId]);
  },

  /**
   * OGデータのキャッシュ更新
   * @template T データの型
   * @param urlsKey URLのキー
   * @param mutate SWRのmutate関数
   */
  updateOGData: function <T>(urlsKey: string, mutate: KeyedMutator<T>): void {
    mutate();
  },
};
