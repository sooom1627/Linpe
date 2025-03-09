import { act, renderHook } from "@testing-library/react-native";
import { useSWRConfig } from "swr";

import { notificationService } from "@/lib/notification";
import { linkActionService } from "../../../service/linkActionService";
import { useLinkAction } from "../useLinkAction";

// モック
jest.mock("swr", () => ({
  useSWRConfig: jest.fn(),
}));

jest.mock("../../../service/linkActionService", () => ({
  linkActionService: {
    deleteLinkAction: jest.fn(),
    updateLinkAction: jest.fn(),
  },
}));

jest.mock("@/lib/notification", () => ({
  notificationService: {
    success: jest.fn(),
    error: jest.fn(),
    getErrorMessage: jest.fn((error) =>
      error instanceof Error ? error.message : "不明なエラーが発生しました",
    ),
  },
}));

describe("useLinkAction", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSWRConfig as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  describe("updateLinkAction", () => {
    it("成功時に通知とキャッシュ更新が行われること", async () => {
      // 成功レスポンスのモック
      (linkActionService.updateLinkAction as jest.Mock).mockResolvedValue({
        success: true,
        data: { status: "Read" },
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // 関数を実行
      await act(async () => {
        await result.current.updateLinkAction(
          "test-user-id",
          "test-link-id",
          "Read",
          0,
        );
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.updateLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Read",
        0,
        undefined,
      );

      // 成功通知が呼ばれたことを確認
      expect(notificationService.success).toHaveBeenCalledWith(
        "リンクが更新されました",
        "ステータス: Read",
        expect.objectContaining({
          position: "top",
        }),
      );

      // キャッシュ更新のために mutate が呼ばれたことを確認
      expect(mockMutate).toHaveBeenCalledWith(["today-links", "test-user-id"]);
      expect(mockMutate).toHaveBeenCalledWith([
        "swipeable-links",
        "test-user-id",
      ]);
    });

    it("失敗時にエラー通知が行われること", async () => {
      // 失敗レスポンスのモック
      (linkActionService.updateLinkAction as jest.Mock).mockResolvedValue({
        success: false,
        error: new Error("更新に失敗しました"),
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // 関数を実行
      await act(async () => {
        await result.current.updateLinkAction(
          "test-user-id",
          "test-link-id",
          "Read",
          0,
        );
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.updateLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Read",
        0,
        undefined,
      );

      // エラー通知が呼ばれたことを確認
      expect(notificationService.error).toHaveBeenCalledWith(
        "リンクの更新に失敗しました",
        "更新に失敗しました",
        expect.objectContaining({
          position: "top",
        }),
      );
    });

    it("例外発生時にエラーがスローされること", async () => {
      // 例外をスローするモック
      (linkActionService.updateLinkAction as jest.Mock).mockRejectedValue(
        new Error("ネットワークエラー"),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // 関数を実行と例外のキャッチ
      await act(async () => {
        try {
          await result.current.updateLinkAction(
            "test-user-id",
            "test-link-id",
            "Read",
            0,
          );
          fail("例外が発生しませんでした");
        } catch (error) {
          // 例外は期待通り
          expect(error).toBeInstanceOf(Error);
        }
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.updateLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
        "Read",
        0,
        undefined,
      );
    });
  });

  describe("deleteLinkAction", () => {
    it("成功時に通知とキャッシュ更新が行われること", async () => {
      // 成功レスポンスのモック
      (linkActionService.deleteLinkAction as jest.Mock).mockResolvedValue({
        success: true,
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // 関数を実行
      await act(async () => {
        await result.current.deleteLinkAction("test-user-id", "test-link-id");
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.deleteLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
      );

      // 成功通知が呼ばれたことを確認
      expect(notificationService.success).toHaveBeenCalledWith(
        "リンクが削除されました",
        undefined,
        expect.objectContaining({
          position: "top",
        }),
      );

      // キャッシュ更新のために mutate が呼ばれたことを確認
      expect(mockMutate).toHaveBeenCalledWith(["today-links", "test-user-id"]);
      expect(mockMutate).toHaveBeenCalledWith([
        "swipeable-links",
        "test-user-id",
      ]);
    });

    it("失敗時にエラー通知が行われること", async () => {
      // 失敗レスポンスのモック
      (linkActionService.deleteLinkAction as jest.Mock).mockResolvedValue({
        success: false,
        error: new Error("削除に失敗しました"),
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // 関数を実行
      await act(async () => {
        await result.current.deleteLinkAction("test-user-id", "test-link-id");
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.deleteLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
      );

      // エラー通知が呼ばれたことを確認
      expect(notificationService.error).toHaveBeenCalledWith(
        "リンクの削除に失敗しました",
        "削除に失敗しました",
        expect.objectContaining({
          position: "top",
        }),
      );
    });

    it("例外発生時にエラー通知が行われること", async () => {
      // 例外をスローするモック
      (linkActionService.deleteLinkAction as jest.Mock).mockRejectedValue(
        new Error("ネットワークエラー"),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // 関数を実行と例外のキャッチ
      await act(async () => {
        try {
          await result.current.deleteLinkAction("test-user-id", "test-link-id");
        } catch {
          // 例外は期待通り
        }
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.deleteLinkAction).toHaveBeenCalledWith(
        "test-user-id",
        "test-link-id",
      );

      // エラー通知が呼ばれたことを確認
      expect(notificationService.error).toHaveBeenCalledWith(
        "リンクの削除に失敗しました",
        "ネットワークエラー",
        expect.objectContaining({
          position: "top",
        }),
      );
    });
  });
});
