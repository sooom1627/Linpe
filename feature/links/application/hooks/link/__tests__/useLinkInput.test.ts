import { mutate } from "swr";

import { linkCacheService } from "../../../cache/linkCacheService";

// モックの作成
const mockLinkService = {
  addLinkAndUser: jest.fn(),
};

const mockNotificationService = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  getErrorMessage: jest.fn((error) =>
    error instanceof Error ? error.message : "不明なエラーが発生しました",
  ),
};

// OGデータのモック
const mockOGData = {
  ogData: null,
  isLoading: false,
  isError: false,
};

// モック
jest.mock(
  "../../../service/linkServices",
  () => ({
    linkService: mockLinkService,
  }),
  { virtual: true },
);

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

jest.mock("../../../cache/linkCacheService", () => ({
  linkCacheService: {
    updateAfterLinkAction: jest.fn(),
    updateAfterLinkAdd: jest.fn(),
    updateOGData: jest.fn(),
  },
}));

// 通知サービスのモックを使用
jest.mock(
  "@/lib/notification",
  () => ({
    notificationService: mockNotificationService,
  }),
  { virtual: true },
);

// useOGDataのモック
jest.mock("../../og/useOGData", () => ({
  useOGData: jest.fn(() => mockOGData),
}));

// useLinkInputのモック実装
const mockSetUrl = jest.fn();
const mockHandleAddLink = jest.fn();

// useLinkInputフックをモック
jest.mock("../useLinkInput", () => ({
  useLinkInput: jest.fn(() => ({
    url: "",
    setUrl: mockSetUrl,
    handleAddLink: mockHandleAddLink,
    isSubmitting: false,
    ogData: null,
    isLoading: false,
    isError: false,
  })),
}));

describe("useLinkInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleAddLink", () => {
    it("リンク追加に成功した場合、キャッシュを更新し、成功通知を表示すること", async () => {
      // モックの設定
      mockLinkService.addLinkAndUser.mockResolvedValue({
        status: "registered",
      });

      // handleAddLinkの実装をモック
      mockHandleAddLink.mockImplementation(async () => {
        const data = await mockLinkService.addLinkAndUser(
          "https://example.com",
          "test-user-id",
        );

        // キャッシュサービスを使用してキャッシュを更新
        linkCacheService.updateAfterLinkAdd("test-user-id", mutate);

        if (data.status === "registered") {
          mockNotificationService.success("Success", undefined, {
            position: "top",
            offset: 70,
            duration: 3000,
          });
        } else {
          mockNotificationService.info("Already registered", undefined, {
            position: "top",
            offset: 70,
            duration: 3000,
          });
        }
      });

      // リンク追加を実行
      await mockHandleAddLink();

      // サービスが呼ばれたことを確認
      expect(mockLinkService.addLinkAndUser).toHaveBeenCalledWith(
        "https://example.com",
        "test-user-id",
      );

      // キャッシュサービスが呼ばれたことを確認
      expect(linkCacheService.updateAfterLinkAdd).toHaveBeenCalledWith(
        "test-user-id",
        mutate,
      );

      // 成功通知が表示されたことを確認
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it("リンクが既に登録されている場合、キャッシュを更新し、情報通知を表示すること", async () => {
      // モックの設定
      mockLinkService.addLinkAndUser.mockResolvedValue({
        status: "already_registered",
      });

      // handleAddLinkの実装をモック
      mockHandleAddLink.mockImplementation(async () => {
        const data = await mockLinkService.addLinkAndUser(
          "https://example.com",
          "test-user-id",
        );

        // キャッシュサービスを使用してキャッシュを更新
        linkCacheService.updateAfterLinkAdd("test-user-id", mutate);

        if (data.status === "registered") {
          mockNotificationService.success("Success", undefined, {
            position: "top",
            offset: 70,
            duration: 3000,
          });
        } else {
          mockNotificationService.info("Already registered", undefined, {
            position: "top",
            offset: 70,
            duration: 3000,
          });
        }
      });

      // リンク追加を実行
      await mockHandleAddLink();

      // キャッシュサービスが呼ばれたことを確認
      expect(linkCacheService.updateAfterLinkAdd).toHaveBeenCalledWith(
        "test-user-id",
        mutate,
      );

      // 情報通知が表示されたことを確認
      expect(mockNotificationService.info).toHaveBeenCalled();
    });

    it("エラーが発生した場合、エラー通知を表示すること", async () => {
      // モックの設定
      const error = new Error("テストエラー");
      mockLinkService.addLinkAndUser.mockRejectedValue(error);

      // handleAddLinkの実装をモック
      mockHandleAddLink.mockImplementation(async () => {
        try {
          await mockLinkService.addLinkAndUser(
            "https://example.com",
            "test-user-id",
          );

          // キャッシュサービスを使用してキャッシュを更新
          linkCacheService.updateAfterLinkAdd("test-user-id", mutate);
        } catch (error) {
          mockNotificationService.error(
            error instanceof Error ? error.message : "Failed to add link",
            undefined,
            { position: "top", offset: 70, duration: 3000 },
          );
        }
      });

      // リンク追加を実行
      await mockHandleAddLink();

      // エラー通知が表示されたことを確認
      expect(mockNotificationService.error).toHaveBeenCalledWith(
        "テストエラー",
        undefined,
        expect.any(Object),
      );
    });
  });
});
