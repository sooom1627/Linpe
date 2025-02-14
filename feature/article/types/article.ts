import { type Database } from "../../../database.types";

// データベースのテーブル型を継承
export type LinkRow = Database["public"]["Tables"]["links"]["Row"];
export type LinkInsert = Database["public"]["Tables"]["links"]["Insert"];
export type LinkUpdate = Database["public"]["Tables"]["links"]["Update"];

// 記事の基本型定義（データベースの型を継承）
export type BaseArticle = LinkRow;

// UI表示用の拡張フィールドを含む記事の型定義
export type Article = Omit<BaseArticle, "parameter"> & {
  parameter?: string | null;
  title?: string;
  content?: string;
  image_url?: string;
  description?: string;
  author?: string;
  tags?: string[];
  likes_count?: number;
  views_count?: number;
};

// フラットリストで表示する記事のプレビュー用の型定義
export type ArticlePreview = Pick<
  Article,
  "id" | "domain" | "full_url" | "image_url"
>;

// 記事のリスト表示用の型定義
export type ArticleListItem = ArticlePreview & {
  description?: string;
  tags?: string[];
};

// 記事の作成時に必要な型定義
export type CreateArticleInput = Omit<
  Article,
  "id" | "created_at" | "updated_at" | "likes_count" | "views_count"
> & {
  domain: string;
  full_url: string;
};

// 記事の更新時に必要な型定義
export type UpdateArticleInput = Partial<Omit<Article, "id">>;

// データベースでの記事のデフォルト値
export const DEFAULT_ARTICLE_VALUES = {
  parameter: null,
  likes_count: 0,
  views_count: 0,
  tags: [],
} as const;
