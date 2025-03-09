import { act, renderHook } from "@testing-library/react-native";
import { useSWRConfig } from "swr";

import { type LinkActionStatus } from "@/feature/links/domain/models/types";
import { notificationService } from "@/lib/notification";
import { linkCacheService } from "../../../cache/linkCacheService";
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

jest.mock("../../../cache/linkCacheService", () => ({
  linkCacheService: {
    updateAfterLinkAction: jest.fn(),
    updateAfterLinkAdd: jest.fn(),
    updateOGData: jest.fn(),
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

      // パラメータ
      const userId = "test-user-id";
      const linkId = "test-link-id";
      const status = "Read" as LinkActionStatus;
      const swipeCount = 1;

      // 関数を実行
      await act(async () => {
        await result.current.updateLinkAction(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // キャッシュサービスが呼ばれたことを確認
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );

      // 通知が表示されたことを確認
      expect(notificationService.success).toHaveBeenCalledWith(
        "リンクが更新されました",
        `ステータス: ${status}`,
        expect.any(Object),
      );
    });

    it.each([
      ["inMonth", "inMonth"],
      ["inWeekend", "inWeekend"],
      ["Today", "Today"],
    ])("status が %s の場合は通知が表示されないこと", async (_, status) => {
      // 成功レスポンスのモック
      (linkActionService.updateLinkAction as jest.Mock).mockResolvedValue({
        success: true,
        data: { status },
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // パラメータ
      const userId = "test-user-id";
      const linkId = "test-link-id";
      const swipeCount = 0;

      // 関数を実行
      await act(async () => {
        await result.current.updateLinkAction(
          userId,
          linkId,
          status as LinkActionStatus,
          swipeCount,
        );
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.updateLinkAction).toHaveBeenCalledWith(
        userId,
        linkId,
        status,
        swipeCount,
        undefined,
      );

      // 成功通知が呼ばれないことを確認
      expect(notificationService.success).not.toHaveBeenCalled();

      // キャッシュサービスが呼ばれたことを確認
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );
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

      // パラメータ
      const userId = "test-user-id";
      const linkId = "test-link-id";

      // 関数を実行
      await act(async () => {
        await result.current.deleteLinkAction(userId, linkId);
      });

      // キャッシュサービスが呼ばれたことを確認
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );

      // 通知が表示されたことを確認
      expect(notificationService.success).toHaveBeenCalledWith(
        "リンクが削除されました",
        undefined,
        expect.any(Object),
      );
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
