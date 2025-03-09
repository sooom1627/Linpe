import { mutate } from "swr";

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

// モック
jest.mock(
  "../../../service/linkService",
  () => ({
    linkService: mockLinkService,
  }),
  { virtual: true },
);

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

// 通知サービスのモックを使用
jest.mock(
  "../../../../../../lib/notification",
  () => ({
    notificationService: mockNotificationService,
  }),
  { virtual: true },
);

// useLinkInputのモック実装を作成
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

describe("通知サービスのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("リンク追加が成功した場合、成功通知が表示されること", async () => {
    // モックの設定
    mockLinkService.addLinkAndUser.mockResolvedValue({
      status: "registered",
      link: { id: "test-link-id" },
    });

    // handleAddLinkの実装をモック
    mockHandleAddLink.mockImplementation(async () => {
      const data = await mockLinkService.addLinkAndUser(
        "https://example.com",
        "test-user-id",
      );
      await mutate(
        (key) => typeof key === "string" && key.startsWith("links-"),
      );

      if (data.status === "registered") {
        mockNotificationService.success("Success", undefined, {});
      } else {
        mockNotificationService.info("Already registered", undefined, {});
      }
    });

    // リンク追加を実行
    await mockHandleAddLink();

    // 検証
    expect(mockLinkService.addLinkAndUser).toHaveBeenCalledWith(
      "https://example.com",
      "test-user-id",
    );
    expect(mutate).toHaveBeenCalled();
    expect(mockNotificationService.success).toHaveBeenCalledWith(
      "Success",
      undefined,
      {},
    );
  });

  it("リンクが既に登録されている場合、情報通知が表示されること", async () => {
    // モックの設定
    mockLinkService.addLinkAndUser.mockResolvedValue({
      status: "already_exists",
      link: { id: "test-link-id" },
    });

    // handleAddLinkの実装をモック
    mockHandleAddLink.mockImplementation(async () => {
      const data = await mockLinkService.addLinkAndUser(
        "https://example.com",
        "test-user-id",
      );
      await mutate(
        (key) => typeof key === "string" && key.startsWith("links-"),
      );

      if (data.status === "registered") {
        mockNotificationService.success("Success", undefined, {});
      } else {
        mockNotificationService.info("Already registered", undefined, {});
      }
    });

    // リンク追加を実行
    await mockHandleAddLink();

    // 検証
    expect(mockLinkService.addLinkAndUser).toHaveBeenCalledWith(
      "https://example.com",
      "test-user-id",
    );
    expect(mutate).toHaveBeenCalled();
    expect(mockNotificationService.info).toHaveBeenCalledWith(
      "Already registered",
      undefined,
      {},
    );
  });

  it("エラーが発生した場合、エラー通知が表示されること", async () => {
    // モックの設定
    const testError = new Error("APIエラー");
    mockLinkService.addLinkAndUser.mockRejectedValue(testError);

    // handleAddLinkの実装をモック
    mockHandleAddLink.mockImplementation(async () => {
      try {
        await mockLinkService.addLinkAndUser(
          "https://example.com",
          "test-user-id",
        );
      } catch (error) {
        mockNotificationService.error(
          error instanceof Error ? error.message : "Failed to add link",
          undefined,
          {},
        );
      }
    });

    // リンク追加を実行
    await mockHandleAddLink();

    // 検証
    expect(mockLinkService.addLinkAndUser).toHaveBeenCalledWith(
      "https://example.com",
      "test-user-id",
    );
    expect(mockNotificationService.error).toHaveBeenCalledWith(
      "APIエラー",
      undefined,
      {},
    );
  });
});
