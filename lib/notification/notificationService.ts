import Toast from "react-native-toast-message";

import { type NotificationOptions } from "./types";

/**
 * アプリケーション全体で使用する通知サービス
 * Toastを使用した通知の表示を一元管理する
 */
class NotificationService {
  // デフォルト値を定数として定義
  private static readonly DEFAULT_DURATION = 3000;
  private static readonly DEFAULT_POSITION = "top";
  private static readonly DEFAULT_OFFSET = 70;
  private static readonly DEFAULT_TYPE = "info";

  /**
   * 共通の通知生成ロジック
   * @param type 通知タイプ
   * @param title 通知のタイトル
   * @param message 通知の詳細メッセージ（オプション）
   * @param options その他のオプション
   */
  private createNotification(
    type: NotificationOptions["type"],
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.show({
      title,
      message,
      type,
      ...options,
    });
  }

  /**
   * 成功通知を表示
   * @param title 通知のタイトル
   * @param message 通知の詳細メッセージ（オプション）
   * @param options その他のオプション
   */
  success(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.createNotification("success", title, message, options);
  }

  /**
   * エラー通知を表示
   * @param title 通知のタイトル
   * @param message 通知の詳細メッセージ（オプション）
   * @param options その他のオプション
   */
  error(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.createNotification("error", title, message, options);
  }

  /**
   * 情報通知を表示
   * @param title 通知のタイトル
   * @param message 通知の詳細メッセージ（オプション）
   * @param options その他のオプション
   */
  info(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.createNotification("info", title, message, options);
  }

  /**
   * 警告通知を表示
   * @param title 通知のタイトル
   * @param message 通知の詳細メッセージ（オプション）
   * @param options その他のオプション
   */
  warning(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.createNotification("warning", title, message, options);
  }

  /**
   * 基本的な通知表示メソッド
   * @param options 通知オプション
   */
  show(options: NotificationOptions) {
    const {
      title,
      message,
      type = NotificationService.DEFAULT_TYPE,
      duration = NotificationService.DEFAULT_DURATION,
      position = NotificationService.DEFAULT_POSITION,
      offset = NotificationService.DEFAULT_OFFSET,
    } = options;

    Toast.show({
      text1: title,
      text2: message,
      type: type as string, // Toastの型定義に合わせる
      position,
      topOffset: position === "top" ? offset : undefined,
      bottomOffset: position === "bottom" ? offset : undefined,
      visibilityTime: duration,
    });
  }

  /**
   * エラーオブジェクトから適切なエラーメッセージを抽出
   * @param error エラーオブジェクト
   * @returns エラーメッセージ
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return "不明なエラーが発生しました";
  }
}

export const notificationService = new NotificationService();
