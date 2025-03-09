import { type Database } from "@/database.types";

// データベースのテーブル型を継承
export type UserLinkActionLogRow =
  Database["public"]["Tables"]["user_link_actions_log"]["Row"];

// 基本型定義（データベースの型を継承）
export type BaseUserLinkActionLog = UserLinkActionLogRow;

/**
 * リンクアクションログの型定義
 * ユーザーのリンクに対するアクションの履歴を記録します
 */
export type UserLinkActionLog = BaseUserLinkActionLog;

/**
 * リンクアクションログの詳細情報
 * 関連するリンクやユーザー情報を含む拡張型
 */
export type UserLinkActionLogDetail = UserLinkActionLog & {
  // 必要に応じて拡張フィールドを追加できます
};

/**
 * リンクステータス変更履歴の概要情報
 * UI表示用に最適化された型
 */
export type LinkStatusChangeHistory = Pick<
  UserLinkActionLog,
  "id" | "changed_at" | "previous_status" | "new_status" | "link_id" | "user_id"
>;
