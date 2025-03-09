import { type NotificationOptions } from "../types";

/**
 * テスト用のモック通知サービス
 */
class MockNotificationService {
  // 呼び出し履歴を記録するための配列
  public calls: {
    method: string;
    title: string;
    message?: string;
    options?: Partial<NotificationOptions>;
  }[] = [];

  // 各メソッドの呼び出し回数を記録
  public successCalls = 0;
  public errorCalls = 0;
  public infoCalls = 0;
  public warningCalls = 0;

  /**
   * 全ての記録をリセット
   */
  reset() {
    this.calls = [];
    this.successCalls = 0;
    this.errorCalls = 0;
    this.infoCalls = 0;
    this.warningCalls = 0;
  }

  /**
   * 成功通知
   */
  success(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.calls.push({ method: "success", title, message, options });
    this.successCalls++;
    return this;
  }

  /**
   * エラー通知
   */
  error(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.calls.push({ method: "error", title, message, options });
    this.errorCalls++;
    return this;
  }

  /**
   * 情報通知
   */
  info(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.calls.push({ method: "info", title, message, options });
    this.infoCalls++;
    return this;
  }

  /**
   * 警告通知
   */
  warning(
    title: string,
    message?: string,
    options?: Partial<Omit<NotificationOptions, "title" | "message" | "type">>,
  ) {
    this.calls.push({ method: "warning", title, message, options });
    this.warningCalls++;
    return this;
  }

  /**
   * 基本的な通知表示メソッド（実際には何も表示しない）
   */
  show(options: NotificationOptions) {
    this.calls.push({
      method: "show",
      title: options.title,
      message: options.message,
      options,
    });
    return this;
  }

  /**
   * エラーオブジェクトからメッセージを抽出
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return "不明なエラーが発生しました";
  }

  /**
   * 特定のメソッドが呼ばれたかどうかを確認
   */
  wasMethodCalled(
    method: "success" | "error" | "info" | "warning" | "show",
  ): boolean {
    return this.calls.some((call) => call.method === method);
  }

  /**
   * 特定のタイトルで通知が呼ばれたかどうかを確認
   */
  wasCalledWithTitle(title: string): boolean {
    return this.calls.some((call) => call.title === title);
  }
}

export const mockNotificationService = new MockNotificationService();
