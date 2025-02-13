// 記事の全体的な型定義
export type Article = {
  id: number;
  title: string;
  content: string;
  source: string;
  imageUrl: string;
  author?: string;
  publishedAt: Date;
  updatedAt: Date;
  tags?: string[];
  likes?: number;
  views?: number;
};

// フラットリストで表示する記事のプレビュー用の型定義
export type ArticlePreview = Pick<
  Article,
  "id" | "title" | "source" | "imageUrl"
>;

// 記事のリスト表示用の型定義
export type ArticleListItem = ArticlePreview;
