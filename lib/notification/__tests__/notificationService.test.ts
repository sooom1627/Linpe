import Toast from "react-native-toast-message";

import { notificationService } from "../notificationService";

// Toastのモック
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("NotificationService", () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  describe("success", () => {
    it("正しいパラメータでToast.showを呼び出すこと", () => {
      // 実行
      notificationService.success("成功しました", "詳細メッセージ");

      // 検証
      expect(Toast.show).toHaveBeenCalledWith({
        text1: "成功しました",
        text2: "詳細メッセージ",
        type: "success",
        position: "top",
        topOffset: 70,
        bottomOffset: undefined,
        visibilityTime: 3000,
      });
    });

    it("オプションを指定した場合、それらが反映されること", () => {
      // 実行
      notificationService.success("成功しました", "詳細メッセージ", {
        position: "bottom",
        offset: 50,
        duration: 5000,
      });

      // 検証
      expect(Toast.show).toHaveBeenCalledWith({
        text1: "成功しました",
        text2: "詳細メッセージ",
        type: "success",
        position: "bottom",
        topOffset: undefined,
        bottomOffset: 50,
        visibilityTime: 5000,
      });
    });
  });

  describe("error", () => {
    it("正しいパラメータでToast.showを呼び出すこと", () => {
      // 実行
      notificationService.error("エラーが発生しました", "エラーの詳細");

      // 検証
      expect(Toast.show).toHaveBeenCalledWith({
        text1: "エラーが発生しました",
        text2: "エラーの詳細",
        type: "error",
        position: "top",
        topOffset: 70,
        bottomOffset: undefined,
        visibilityTime: 3000,
      });
    });
  });

  describe("info", () => {
    it("正しいパラメータでToast.showを呼び出すこと", () => {
      // 実行
      notificationService.info("情報");

      // 検証
      expect(Toast.show).toHaveBeenCalledWith({
        text1: "情報",
        text2: undefined,
        type: "info",
        position: "top",
        topOffset: 70,
        bottomOffset: undefined,
        visibilityTime: 3000,
      });
    });
  });

  describe("warning", () => {
    it("正しいパラメータでToast.showを呼び出すこと", () => {
      // 実行
      notificationService.warning("警告");

      // 検証
      expect(Toast.show).toHaveBeenCalledWith({
        text1: "警告",
        text2: undefined,
        type: "warning",
        position: "top",
        topOffset: 70,
        bottomOffset: undefined,
        visibilityTime: 3000,
      });
    });
  });

  describe("getErrorMessage", () => {
    it("Errorオブジェクトからメッセージを抽出すること", () => {
      // 準備
      const error = new Error("テストエラー");

      // 実行
      const result = notificationService.getErrorMessage(error);

      // 検証
      expect(result).toBe("テストエラー");
    });

    it("Errorでないオブジェクトの場合、デフォルトメッセージを返すこと", () => {
      // 準備
      const error = { someProperty: "value" };

      // 実行
      const result = notificationService.getErrorMessage(error);

      // 検証
      expect(result).toBe("不明なエラーが発生しました");
    });

    it("nullやundefinedの場合、デフォルトメッセージを返すこと", () => {
      // 実行と検証
      expect(notificationService.getErrorMessage(null)).toBe(
        "不明なエラーが発生しました",
      );
      expect(notificationService.getErrorMessage(undefined)).toBe(
        "不明なエラーが発生しました",
      );
    });
  });
});
