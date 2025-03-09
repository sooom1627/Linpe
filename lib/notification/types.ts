/**
 * 通知タイプの定義
 */
export type NotificationType = "success" | "error" | "info" | "warning";

/**
 * 通知位置の定義
 */
export type NotificationPosition = "top" | "bottom";

/**
 * 通知オプションのインターフェース
 */
export interface NotificationOptions {
  /**
   * 通知のタイトル
   */
  title: string;

  /**
   * 通知の詳細メッセージ（オプション）
   */
  message?: string;

  /**
   * 通知のタイプ
   * @default 'info'
   */
  type?: NotificationType;

  /**
   * 通知の表示時間（ミリ秒）
   * @default 3000
   */
  duration?: number;

  /**
   * 通知の表示位置
   * @default 'top'
   */
  position?: NotificationPosition;

  /**
   * 画面端からのオフセット（ピクセル）
   * @default 70
   */
  offset?: number;
}
