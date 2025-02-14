import { type Database } from "../../../database.types";

// データベースのテーブル型を継承
export type LinkRow = Database["public"]["Tables"]["links"]["Row"];
export type LinkInsert = Database["public"]["Tables"]["links"]["Insert"];
export type LinkUpdate = Database["public"]["Tables"]["links"]["Update"];

// 記事の全体的な型定義
export type Article = {
  id: string;
  title: string;
  domain: string;
  full_url: string;
  parameter: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// フラットリストで表示する記事のプレビュー用の型定義
export type ArticlePreview = Pick<
  Article,
  "id" | "title" | "domain" | "full_url"
>;

// 記事のリスト表示用の型定義
export type ArticleListItem = ArticlePreview;

// 記事の作成時に必要な型定義
export type CreateArticleInput = Omit<
  Article,
  "id" | "created_at" | "updated_at"
>;

// 記事の更新時に必要な型定義
export type UpdateArticleInput = Partial<Omit<Article, "id">>;

// データベースでの記事のデフォルト値
export const DEFAULT_ARTICLE_VALUES = {
  parameter: null,
} as const;
