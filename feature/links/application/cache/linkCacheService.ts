import { type KeyedMutator, type ScopedMutator } from "swr";

import {
  isLinkCache,
  isLinksStartsWithCache,
  LINK_CACHE_KEYS,
} from "./linkCacheKeys";

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
    // 具体的なキャッシュキーを更新
    mutate(LINK_CACHE_KEYS.TODAY_LINKS(userId));
    mutate(LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId));
    mutate(LINK_CACHE_KEYS.USER_LINKS(userId, 10));

    // 汎用的なキャッシュもクリア
    mutate(isLinkCache);
  },

  /**
   * リンク追加後のキャッシュ更新
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateAfterLinkAdd: (userId: string, mutate: ScopedMutator): void => {
    // リンク追加後は全てのリンク関連キャッシュを更新
    mutate(isLinksStartsWithCache);
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
