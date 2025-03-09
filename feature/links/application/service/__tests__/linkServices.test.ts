import type { UserLink } from "@/feature/links/domain/models/types/links";
import { linkApi } from "@/feature/links/infrastructure/api";
import { linkService } from "../linkServices";

// モックの型定義
type MockLinkApi = {
  fetchUserLinks: jest.Mock;
  fetchUserLinksByStatus: jest.Mock;
  createLinkAndUser: jest.Mock;
};

// linkApiのモック
jest.mock("@/feature/links/infrastructure/api", () => ({
  linkApi: {
    fetchUserLinks: jest.fn(),
    fetchUserLinksByStatus: jest.fn(),
    createLinkAndUser: jest.fn(),
  },
}));

describe("linkService", () => {
  // モックされたlinkApiへの参照
  let mockLinkApi: MockLinkApi;

  // テスト用のモックデータ
  const createMockLink = (overrides = {}): UserLink => ({
    link_id: "1",
    full_url: "https://example.com",
    domain: "example.com",
    parameter: "",
    link_created_at: "2023-01-01T00:00:00.000Z",
    status: "add",
    added_at: "2023-01-01T00:00:00.000Z",
    scheduled_read_at: null,
    read_at: null,
    read_count: 0,
    swipe_count: 0,
    user_id: "test-user",
    ...overrides,
  });

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
    mockLinkApi = linkApi as unknown as MockLinkApi;
  });

  describe("fetchTodayLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksByStatusを呼び出すこと", async () => {
      // 準備
      const mockLinks = [createMockLink({ status: "Today" })];
      mockLinkApi.fetchUserLinksByStatus.mockResolvedValue(mockLinks);

      // 実行
      const result = await linkService.fetchTodayLinks("test-user", 10);

      // 検証
      expect(mockLinkApi.fetchUserLinksByStatus).toHaveBeenCalledWith({
        userId: "test-user",
        status: "Today",
        limit: 10,
        orderBy: "link_updated_at",
        ascending: false,
      });
      expect(result).toEqual(mockLinks);
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // 準備
      const mockError = new Error("API error");
      mockLinkApi.fetchUserLinksByStatus.mockRejectedValue(mockError);

      // 実行と検証
      await expect(
        linkService.fetchTodayLinks("test-user", 10),
      ).rejects.toThrow("API error");
    });
  });

  describe("addLinkAndUser", () => {
    it("正しいパラメータでlinkApi.createLinkAndUserを呼び出すこと", async () => {
      // 準備
      const mockResponse = { status: "registered" as const };
      mockLinkApi.createLinkAndUser.mockResolvedValue(mockResponse);

      // 実行
      const result = await linkService.addLinkAndUser(
        "https://example.com?param=value",
        "test-user",
        "Today",
      );

      // 検証
      expect(mockLinkApi.createLinkAndUser).toHaveBeenCalledWith({
        domain: "example.com",
        full_url: "https://example.com/",
        parameter: "?param=value",
        userId: "test-user",
        status: "Today",
      });
      expect(result).toEqual(mockResponse);
    });

    it("URLが空の場合、エラーをスローすること", async () => {
      // 実行と検証
      await expect(linkService.addLinkAndUser("", "test-user")).rejects.toThrow(
        "URL is required",
      );
    });

    it("userIdが空の場合、エラーをスローすること", async () => {
      // 実行と検証
      await expect(
        // @ts-expect-error: テスト用に意図的にnullを渡す
        linkService.addLinkAndUser("https://example.com", null),
      ).rejects.toThrow("User ID is required");
    });
  });

  describe("fetchUserLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksを呼び出すこと", async () => {
      // 準備
      const mockLinks = [createMockLink()];
      mockLinkApi.fetchUserLinks.mockResolvedValue(mockLinks);

      // 実行
      const result = await linkService.fetchUserLinks("test-user", 10);

      // 検証
      expect(mockLinkApi.fetchUserLinks).toHaveBeenCalledWith({
        userId: "test-user",
        limit: 10,
      });
      expect(result).toEqual(mockLinks);
    });

    it("userIdがnullの場合、空の配列を返すこと", async () => {
      // 実行
      const result = await linkService.fetchUserLinks(null, 10);

      // 検証
      expect(mockLinkApi.fetchUserLinks).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("データが取得できない場合、空の配列を返すこと", async () => {
      // 準備
      mockLinkApi.fetchUserLinks.mockResolvedValue(null);

      // 実行
      const result = await linkService.fetchUserLinks("test-user", 10);

      // 検証
      expect(result).toEqual([]);
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // 準備
      const mockError = new Error("API error");
      mockLinkApi.fetchUserLinks.mockRejectedValue(mockError);

      // 実行と検証
      await expect(linkService.fetchUserLinks("test-user", 10)).rejects.toThrow(
        "API error",
      );
    });
  });
});
