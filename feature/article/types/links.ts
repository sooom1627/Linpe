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
};

// フラットリストで表示する記事のプレビュー用の型定義
export type ArticlePreview = Pick<Article, "id" | "domain" | "full_url">;

// 記事のリスト表示用の型定義
export type ArticleListItem = ArticlePreview & {
  description?: string;
  tags?: string[];
};

// 記事の作成時に必要な型定義
export type CreateArticleInput = Omit<
  Article,
  "id" | "created_at" | "updated_at"
> & {
  domain: string;
  full_url: string;
};

// 記事の更新時に必要な型定義
export type UpdateArticleInput = Partial<Omit<Article, "id">>;
