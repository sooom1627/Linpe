import { linkApi } from "@/feature/links/infrastructure/api";
import { linkService } from "../linkServices";

// linkApiのモック
jest.mock("@/feature/links/infrastructure/api", () => ({
  linkApi: {
    fetchUserLinks: jest.fn(),
    fetchLinks: jest.fn(),
    createLinkAndUser: jest.fn(),
  },
}));

describe("linkService", () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchTodayLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksを呼び出すこと", async () => {
      // モックデータ
      const mockLinks = [
        {
          link_id: "1",
          full_url: "https://example.com",
          domain: "example.com",
          parameter: "",
          link_created_at: "2023-01-01T00:00:00.000Z",
          status: "Today",
          added_at: "2023-01-01T00:00:00.000Z",
          scheduled_read_at: null,
          read_at: null,
          read_count: 0,
          swipe_count: 0,
          user_id: "test-user",
        },
      ];

      // モックの設定
      (linkApi.fetchUserLinks as jest.Mock).mockResolvedValue(mockLinks);

      // テスト実行
      const result = await linkService.fetchTodayLinks("test-user", 10);

      // アサーション
      expect(linkApi.fetchUserLinks).toHaveBeenCalledWith({
        userId: "test-user",
        limit: 10,
        status: "Today",
        orderBy: "link_updated_at",
        ascending: false,
      });
      expect(result).toEqual(mockLinks);
    });
  });

  describe("fetchSwipeableLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksを呼び出すこと", async () => {
      // モックデータ
      const mockLinks = [
        {
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
        },
      ];

      // モックの設定
      (linkApi.fetchUserLinks as jest.Mock).mockResolvedValue(mockLinks);

      // テスト実行
      const result = await linkService.fetchSwipeableLinks("test-user", 20);

      // アサーション
      expect(linkApi.fetchUserLinks).toHaveBeenCalledWith({
        userId: "test-user",
        limit: 20,
        includeReadyToRead: true,
        orderBy: "added_at",
        ascending: true,
      });
      expect(result).toEqual(mockLinks);
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // エラーをモック
      const mockError = new Error("API error");
      (linkApi.fetchUserLinks as jest.Mock).mockRejectedValue(mockError);

      // テスト実行とアサーション
      await expect(
        linkService.fetchSwipeableLinks("test-user", 20),
      ).rejects.toThrow("API error");
    });
  });

  describe("addLinkAndUser", () => {
    it("正しいパラメータでlinkApi.createLinkAndUserを呼び出すこと", async () => {
      // モックの設定
      (linkApi.createLinkAndUser as jest.Mock).mockResolvedValue({
        status: "registered",
      });

      // テスト実行
      const result = await linkService.addLinkAndUser(
        "https://example.com?param=value",
        "test-user",
        "Today",
      );

      // アサーション
      expect(linkApi.createLinkAndUser).toHaveBeenCalledWith({
        domain: "example.com",
        full_url: "https://example.com/",
        parameter: "?param=value",
        userId: "test-user",
        status: "Today",
      });
      expect(result).toEqual({ status: "registered" });
    });

    it("URLが空の場合、エラーをスローすること", async () => {
      // テスト実行とアサーション
      await expect(linkService.addLinkAndUser("", "test-user")).rejects.toThrow(
        "URL is required",
      );
    });

    it("userIdが空の場合、エラーをスローすること", async () => {
      // テスト実行とアサーション
      await expect(
        // @ts-expect-error: テスト用に意図的にnullを渡す
        linkService.addLinkAndUser("https://example.com", null),
      ).rejects.toThrow("User ID is required");
    });
  });

  describe("fetchUserLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksを呼び出すこと", async () => {
      // モックデータ
      const mockLinks = [
        {
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
        },
      ];

      // モックの設定
      (linkApi.fetchUserLinks as jest.Mock).mockResolvedValue(mockLinks);

      // テスト実行
      const result = await linkService.fetchUserLinks("test-user", 10);

      // アサーション
      expect(linkApi.fetchUserLinks).toHaveBeenCalledWith({
        userId: "test-user",
        limit: 10,
      });
      expect(result).toEqual(mockLinks);
    });

    it("userIdがnullの場合、空の配列を返すこと", async () => {
      // テスト実行
      const result = await linkService.fetchUserLinks(null, 10);

      // アサーション
      expect(linkApi.fetchUserLinks).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("データが取得できない場合、空の配列を返すこと", async () => {
      // モックの設定
      (linkApi.fetchUserLinks as jest.Mock).mockResolvedValue(null);

      // テスト実行
      const result = await linkService.fetchUserLinks("test-user", 10);

      // アサーション
      expect(result).toEqual([]);
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // エラーをモック
      const mockError = new Error("API error");
      (linkApi.fetchUserLinks as jest.Mock).mockRejectedValue(mockError);

      // テスト実行とアサーション
      await expect(linkService.fetchUserLinks("test-user", 10)).rejects.toThrow(
        "API error",
      );
    });
  });
});
