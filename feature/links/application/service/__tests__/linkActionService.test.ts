import type {
  DeleteLinkActionResponse,
  UpdateLinkActionResponse,
  UserLinkActionsRow,
} from "@/feature/links/domain/models/types";
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

// テスト用のモックデータ
const mockUserLinkActionsData: UserLinkActionsRow = {
  id: "1",
  user_id: "test-user-id",
  link_id: "test-link-id",
  status: "Today",
  added_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  read_at: null,
  scheduled_read_at: null,
  swipe_count: 1,
  read_count: 0,
};

describe("linkActionService", () => {
  // モックされたlinkActionsApiへの参照
  let mockLinkActionsApi: jest.Mocked<typeof linkActionsApi>;

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
    mockLinkActionsApi = linkActionsApi as jest.Mocked<typeof linkActionsApi>;
  });

  describe("updateLinkActionBySwipe", () => {
    const userId = "test-user-id";
    const linkId = "test-link-id";
    const status = "Today";
    const swipeCount = 1;

    it("正しいパラメータでlinkActionsApi.updateLinkActionを呼び出すこと", async () => {
      // 準備
      const mockResponse: UpdateLinkActionResponse = {
        success: true,
        data: mockUserLinkActionsData,
        error: null,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      await linkActionService.updateLinkActionBySwipe(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // 検証
      expect(mockLinkActionsApi.updateLinkAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          linkId,
          status,
          swipeCount,
          scheduled_read_at: expect.any(String),
          // read_atは指定されていないことを確認
        }),
      );
      // read_atが含まれていないことを確認
      const callArgs = mockLinkActionsApi.updateLinkAction.mock.calls[0][0];
      expect(callArgs).not.toHaveProperty("read_at");
    });

    it("APIが成功した場合、成功レスポンスを返すこと", async () => {
      // 準備
      const mockResponse: UpdateLinkActionResponse = {
        success: true,
        data: mockUserLinkActionsData,
        error: null,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      const result = await linkActionService.updateLinkActionBySwipe(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // 検証
      expect(result).toEqual(mockResponse);
    });

    it("APIがエラーを返した場合、エラーレスポンスを返すこと", async () => {
      // 準備
      const mockError = new Error("更新に失敗しました");
      const mockResponse: UpdateLinkActionResponse = {
        success: false,
        data: null,
        error: mockError,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      const result = await linkActionService.updateLinkActionBySwipe(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // 検証
      expect(result).toEqual(mockResponse);
      // エラーログが出力されることを確認
      expect(console.error).toHaveBeenCalled();
    });

    it("例外が発生した場合、エラーレスポンスを返すこと", async () => {
      // 準備
      const mockError = new Error("予期しないエラー");
      mockLinkActionsApi.updateLinkAction.mockRejectedValue(mockError);

      // 実行
      const result = await linkActionService.updateLinkActionBySwipe(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // 検証
      expect(result).toEqual({
        success: false,
        data: null,
        error: mockError,
      });
      // エラーログが出力されることを確認
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("updateLinkActionByReadStatus", () => {
    const userId = "test-user-id";
    const linkId = "test-link-id";
    const status = "Read";
    const swipeCount = 1;

    it("Readステータスでは、read_at, scheduled_read_at, read_count_incrementが正しく設定されること", async () => {
      // 準備
      const mockResponse: UpdateLinkActionResponse = {
        success: true,
        data: mockUserLinkActionsData,
        error: null,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        "Read",
        swipeCount,
      );

      // 検証
      expect(mockLinkActionsApi.updateLinkAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          linkId,
          status: "Read",
          swipeCount,
          read_at: expect.any(String),
          scheduled_read_at: null,
          read_count_increment: true,
        }),
      );
    });

    it("Re-Readステータスでは、read_at, scheduled_read_at, read_count_incrementが正しく設定されること", async () => {
      // 準備
      const mockResponse: UpdateLinkActionResponse = {
        success: true,
        data: mockUserLinkActionsData,
        error: null,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        "Re-Read",
        swipeCount,
      );

      // 検証
      expect(mockLinkActionsApi.updateLinkAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          linkId,
          status: "Re-Read",
          swipeCount,
          read_at: expect.any(String),
          scheduled_read_at: null,
          read_count_increment: true,
        }),
      );
    });

    it("Bookmarkステータスでは、read_at, scheduled_read_at, read_count_incrementが正しく設定されること", async () => {
      // 準備
      const mockResponse: UpdateLinkActionResponse = {
        success: true,
        data: mockUserLinkActionsData,
        error: null,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        "Bookmark",
        swipeCount,
      );

      // 検証
      expect(mockLinkActionsApi.updateLinkAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          linkId,
          status: "Bookmark",
          swipeCount,
          read_at: expect.any(String),
          scheduled_read_at: null,
          read_count_increment: true,
        }),
      );
    });

    it("Readingステータスの場合、read_atをnullに設定すること", async () => {
      // 準備
      const mockResponse: UpdateLinkActionResponse = {
        success: true,
        data: mockUserLinkActionsData,
        error: null,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        "Reading",
        swipeCount,
      );

      // 検証
      expect(mockLinkActionsApi.updateLinkAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          linkId,
          status: "Reading",
          swipeCount,
          read_at: null,
          // read_count_incrementは設定されないことを確認
        }),
      );
      // read_count_incrementが含まれていないことを確認
      const callArgs = mockLinkActionsApi.updateLinkAction.mock.calls[0][0];
      expect(callArgs).not.toHaveProperty("read_count_increment");
    });

    it("APIが成功した場合、成功レスポンスを返すこと", async () => {
      // 準備
      const mockResponse: UpdateLinkActionResponse = {
        success: true,
        data: mockUserLinkActionsData,
        error: null,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      const result = await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // 検証
      expect(result).toEqual(mockResponse);
    });

    it("APIがエラーを返した場合、エラーレスポンスを返すこと", async () => {
      // 準備
      const mockError = new Error("更新に失敗しました");
      const mockResponse: UpdateLinkActionResponse = {
        success: false,
        data: null,
        error: mockError,
      };
      mockLinkActionsApi.updateLinkAction.mockResolvedValue(mockResponse);

      // 実行
      const result = await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // 検証
      expect(result).toEqual(mockResponse);
      // エラーログが出力されることを確認
      expect(console.error).toHaveBeenCalled();
    });

    it("例外が発生した場合、エラーレスポンスを返すこと", async () => {
      // 準備
      const mockError = new Error("予期しないエラー");
      mockLinkActionsApi.updateLinkAction.mockRejectedValue(mockError);

      // 実行
      const result = await linkActionService.updateLinkActionByReadStatus(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // 検証
      expect(result).toEqual({
        success: false,
        data: null,
        error: mockError,
      });
      // エラーログが出力されることを確認
      expect(console.error).toHaveBeenCalled();
    });
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
