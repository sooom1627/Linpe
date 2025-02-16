import { type Database } from "@/database.types";

// データベースのテーブル型を継承
export type LinkRow = Database["public"]["Tables"]["links"]["Row"];
export type LinkInsert = Database["public"]["Tables"]["links"]["Insert"];
export type LinkUpdate = Database["public"]["Tables"]["links"]["Update"];

// 記事の基本型定義（データベースの型を継承）
export type BaseLink = LinkRow;

// UI表示用の拡張フィールドを含む記事の型定義
export type Link = Omit<BaseLink, "parameter"> & {
  parameter?: string | null;
};

// フラットリストで表示する記事のプレビュー用の型定義
export type LinkPreview = Pick<Link, "id" | "full_url">;

// 記事のリスト表示用の型定義
export type LinkListItem = LinkPreview & {
  description?: string;
  tags?: string[];
};

// 記事の作成時に必要な型定義
export type CreateLinkInput = Omit<Link, "id" | "created_at" | "updated_at"> & {
  domain: string;
  full_url: string;
};

// 記事の更新時に必要な型定義
export type UpdateLinkInput = Partial<Omit<Link, "id">>;

export type OGData = {
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  url: string;
};
