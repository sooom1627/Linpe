import { act, renderHook } from "@testing-library/react-native";
import { useSWRConfig } from "swr";

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
    updateLinkActionBySwipe: jest.fn(),
    updateLinkActionByReadStatus: jest.fn(),
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

  describe("updateLinkActionBySwipe", () => {
    const userId = "test-user-id";
    const linkId = "test-link-id";
    const status = "Today";
    const swipeCount = 1;

    it("正しいパラメータでlinkActionService.updateLinkActionBySwipeを呼び出すこと", async () => {
      // 準備
      (
        linkActionService.updateLinkActionBySwipe as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: { id: "1" },
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionBySwipe(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(linkActionService.updateLinkActionBySwipe).toHaveBeenCalledWith(
        userId,
        linkId,
        status,
        swipeCount,
      );
    });

    it("成功時にキャッシュを更新すること", async () => {
      // 準備
      (
        linkActionService.updateLinkActionBySwipe as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: { id: "1" },
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionBySwipe(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );
    });

    it("スワイプ操作では通知を表示しないこと", async () => {
      // 準備
      (
        linkActionService.updateLinkActionBySwipe as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: { id: "1" },
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionBySwipe(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(notificationService.success).not.toHaveBeenCalled();
    });

    it("エラー時に通知を表示すること", async () => {
      // 準備
      const mockError = new Error("更新に失敗しました");
      (
        linkActionService.updateLinkActionBySwipe as jest.Mock
      ).mockResolvedValue({
        success: false,
        data: null,
        error: mockError,
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionBySwipe(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(notificationService.error).toHaveBeenCalled();
    });
  });

  describe("updateLinkActionByReadStatus", () => {
    const userId = "test-user-id";
    const linkId = "test-link-id";
    const status = "Read";
    const swipeCount = 1;

    it("正しいパラメータでlinkActionService.updateLinkActionByReadStatusを呼び出すこと", async () => {
      // 準備
      (
        linkActionService.updateLinkActionByReadStatus as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: { id: "1" },
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionByReadStatus(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(
        linkActionService.updateLinkActionByReadStatus,
      ).toHaveBeenCalledWith(userId, linkId, status, swipeCount);
    });

    it("成功時にキャッシュを更新すること", async () => {
      // 準備
      (
        linkActionService.updateLinkActionByReadStatus as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: { id: "1" },
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionByReadStatus(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );
    });

    it("成功時に通知を表示すること", async () => {
      // 準備
      (
        linkActionService.updateLinkActionByReadStatus as jest.Mock
      ).mockResolvedValue({
        success: true,
        data: { id: "1" },
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionByReadStatus(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(notificationService.success).toHaveBeenCalled();
    });

    it("エラー時に通知を表示すること", async () => {
      // 準備
      const mockError = new Error("更新に失敗しました");
      (
        linkActionService.updateLinkActionByReadStatus as jest.Mock
      ).mockResolvedValue({
        success: false,
        data: null,
        error: mockError,
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.updateLinkActionByReadStatus(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // 検証
      expect(notificationService.error).toHaveBeenCalled();
    });
  });

  describe("deleteLinkAction", () => {
    const userId = "test-user-id";
    const linkId = "test-link-id";

    it("成功時に通知とキャッシュ更新が行われること", async () => {
      // 準備
      (linkActionService.deleteLinkAction as jest.Mock).mockResolvedValue({
        success: true,
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.deleteLinkAction(userId, linkId);
      });

      // 検証
      expect(linkActionService.deleteLinkAction).toHaveBeenCalledWith(
        userId,
        linkId,
      );
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );
      expect(notificationService.success).toHaveBeenCalled();
    });

    it("失敗時にエラー通知が行われること", async () => {
      // 準備
      const mockError = new Error("削除に失敗しました");
      (linkActionService.deleteLinkAction as jest.Mock).mockResolvedValue({
        success: false,
        error: mockError,
      });

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        await result.current.deleteLinkAction(userId, linkId);
      });

      // 検証
      expect(notificationService.error).toHaveBeenCalled();
    });

    it("例外発生時にエラー通知が行われること", async () => {
      // 準備
      const mockError = new Error("ネットワークエラー");
      (linkActionService.deleteLinkAction as jest.Mock).mockRejectedValue(
        mockError,
      );

      // 実行
      const { result } = renderHook(() => useLinkAction());
      await act(async () => {
        try {
          await result.current.deleteLinkAction(userId, linkId);
        } catch {
          // エラーをキャッチして無視
        }
      });

      // 検証
      expect(notificationService.error).toHaveBeenCalled();
    });
  });
});
