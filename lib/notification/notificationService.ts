import Toast from "react-native-toast-message";

import { type NotificationOptions } from "./types";

/**
 * アプリケーション全体で使用する通知サービス
 * Toastを使用した通知の表示を一元管理する
 */
class NotificationService {
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
    this.show({
      title,
      message,
      type: "success",
      ...options,
    });
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
    this.show({
      title,
      message,
      type: "error",
      ...options,
    });
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
    this.show({
      title,
      message,
      type: "info",
      ...options,
    });
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
    this.show({
      title,
      message,
      type: "warning",
      ...options,
    });
  }

  /**
   * 基本的な通知表示メソッド
   * @param options 通知オプション
   */
  show(options: NotificationOptions) {
    const {
      title,
      message,
      type = "info",
      duration = 3000,
      position = "top",
      offset = 70,
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
