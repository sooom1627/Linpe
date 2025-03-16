/**
 * 日別アクティビティデータの型定義
 * 1日あたりのリンクアクション数を記録します
 */
export interface DailyActivityData {
  day: string; // 曜日（Mon, Tue, Wed, ...）
  date?: string; // ISO形式の日付（YYYY-MM-DD）
  add: number; // 追加アクション数
  swipe: number; // スワイプアクション数
  read: number; // 読書アクション数
  [key: string]: string | number | undefined; // 拡張性のための追加フィールド
}

/**
 * 週間アクティビティデータの型定義
 * 1週間分の日別アクティビティデータを含みます
 */
export interface WeeklyActivityData {
  startDate: string; // 週の開始日（YYYY-MM-DD）
  endDate: string; // 週の終了日（YYYY-MM-DD）
  data: DailyActivityData[]; // 日別データの配列
}
