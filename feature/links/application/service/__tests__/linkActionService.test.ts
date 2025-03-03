import type { DeleteLinkActionResponse } from "@/feature/links/domain/models/types";
import { linkActionsApi } from "@/feature/links/infrastructure/api/linkActionsApi";
import { linkActionService } from "../linkActionService";

// linkActionsApiのモック
jest.mock("@/feature/links/infrastructure/api/linkActionsApi", () => ({
  linkActionsApi: {
    deleteLinkAction: jest.fn(),
    updateLinkAction: jest.fn(),
  },
}));

// console.errorのモック
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("linkActionService", () => {
  // モックされたlinkActionsApiへの参照
  let mockLinkActionsApi: jest.Mocked<typeof linkActionsApi>;

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
    mockLinkActionsApi = linkActionsApi as jest.Mocked<typeof linkActionsApi>;
  });

  describe("deleteLinkAction", () => {
    const userId = "test-user-id";
    const linkId = "test-link-id";

    it("正しいパラメータでlinkActionsApi.deleteLinkActionを呼び出すこと", async () => {
      // 準備
      const mockResponse: DeleteLinkActionResponse = {
        success: true,
        error: null,
      };
      mockLinkActionsApi.deleteLinkAction.mockResolvedValue(mockResponse);

      // 実行
      await linkActionService.deleteLinkAction(userId, linkId);

      // 検証
      expect(mockLinkActionsApi.deleteLinkAction).toHaveBeenCalledWith({
        userId,
        linkId,
      });
    });

    it("APIが成功した場合、成功レスポンスを返すこと", async () => {
      // 準備
      const mockResponse: DeleteLinkActionResponse = {
        success: true,
        error: null,
      };
      mockLinkActionsApi.deleteLinkAction.mockResolvedValue(mockResponse);

      // 実行
      const result = await linkActionService.deleteLinkAction(userId, linkId);

      // 検証
      expect(result).toEqual({
        success: true,
        error: null,
      });
    });

    it("APIがエラーを返した場合、エラーレスポンスを返すこと", async () => {
      // 準備
      const mockError = new Error("削除に失敗しました");
      const mockResponse: DeleteLinkActionResponse = {
        success: false,
        error: mockError,
      };
      mockLinkActionsApi.deleteLinkAction.mockResolvedValue(mockResponse);

      // 実行
      const result = await linkActionService.deleteLinkAction(userId, linkId);

      // 検証
      expect(result).toEqual({
        success: false,
        error: mockError,
      });
      // エラーログが出力されることを確認
      expect(console.error).toHaveBeenCalled();
    });

    it("例外が発生した場合、エラーレスポンスを返すこと", async () => {
      // 準備
      const mockError = new Error("予期しないエラー");
      mockLinkActionsApi.deleteLinkAction.mockRejectedValue(mockError);

      // 実行
      const result = await linkActionService.deleteLinkAction(userId, linkId);

      // 検証
      expect(result).toEqual({
        success: false,
        error: mockError,
      });
      // エラーログが出力されることを確認
      expect(console.error).toHaveBeenCalled();
    });

    it("非Errorオブジェクトの例外が発生した場合、Errorオブジェクトに変換して返すこと", async () => {
      // 準備
      mockLinkActionsApi.deleteLinkAction.mockRejectedValue("文字列エラー");

      // 実行
      const result = await linkActionService.deleteLinkAction(userId, linkId);

      // 検証
      expect(result).toEqual({
        success: false,
        error: new Error("Unknown error in service layer"),
      });
      // エラーログが出力されることを確認
      expect(console.error).toHaveBeenCalled();
    });
  });
});
