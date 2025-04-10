import { type Database } from "@/database.types";

// データベースのテーブル型を継承
export type LinkRow = Database["public"]["Tables"]["links"]["Row"];
export type LinkInsert = Database["public"]["Tables"]["links"]["Insert"];
export type LinkUpdate = Database["public"]["Tables"]["links"]["Update"];
export type UserLinkActionsRow =
  Database["public"]["Tables"]["user_link_actions"]["Row"];

// 記事の基本型定義（データベースの型を継承）
export type BaseLink = LinkRow;
export type BaseUserLinkActions = UserLinkActionsRow;

// UI表示用の拡張フィールドを含む記事の型定義
export type Link = Omit<BaseLink, "parameter"> & {
  parameter?: string | null;
};

export type UserLinkWithActionsView = {
  link_id: string;
  full_url: string;
  domain: string;
  parameter: string;
  link_created_at: string;
  status: string;
  added_at: string;
  /**
   * 記事を読む予定の日時
   * @format ISO 8601
   * @example "2024-02-20T00:00:00.000Z"
   */
  scheduled_read_at: string | null;
  read_at: string | null;
  read_count: number;
  swipe_count: number;
  user_id: string;
  /**
   * 再読フラグ
   * trueの場合、このリンクは再読用としてマークされている
   */
  re_read: boolean;
};

export type UserLink = UserLinkWithActionsView;

// フラットリストで表示する記事のプレビュー用の型定義
export type LinkPreview = Pick<Link, "id" | "full_url">;

export type OGData = {
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  url: string;
};

// リンクアクションのステータス型
export type LinkActionStatus =
  | "add"
  | "inWeekend"
  | "Today"
  | "Read"
  | "Re-Read"
  | "Bookmark"
  | "Skip";

// リンクアクション更新のパラメータ型
export type UpdateLinkActionParams = {
  userId: string;
  linkId: string;
  status: LinkActionStatus;
  swipeCount: number;
  /**
   * 記事を読む予定の日時
   * @format ISO 8601
   * @example "2024-02-20T00:00:00.000Z"
   */
  scheduled_read_at?: string | null;
  read_at?: string | null;
  /**
   * 読んだ回数をインクリメントするかどうか
   * trueの場合、read_countが1増加する
   */
  read_count_increment?: boolean;
  /**
   * 再読フラグ
   * Re-Readステータスからの遷移の場合はtrue、それ以外はfalse
   */
  re_read?: boolean;
};

// リンクアクション更新のレスポンス型
export type UpdateLinkActionResponse = {
  success: boolean;
  data: UserLinkActionsRow | null;
  error: Error | null;
};

// リンクアクション削除のパラメータ型
export type DeleteLinkActionParams = {
  userId: string;
  linkId: string;
};

// リンクアクション削除のレスポンス型
export type DeleteLinkActionResponse = {
  success: boolean;
  error: Error | null;
};
