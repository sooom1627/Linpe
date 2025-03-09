import type { UserLink } from "@/feature/links/domain/models/types";
import { linkApi } from "@/feature/links/infrastructure/api";
import { swipeableLinkService } from "../swipeableLinkService";

// モックの型定義
type MockLinkApi = {
  fetchUserLinksWithCustomQuery: jest.Mock;
};

// dateUtilsモジュールをモック
jest.mock("@/feature/links/infrastructure/utils/dateUtils", () => ({
  getDateRanges: jest.fn().mockReturnValue({
    now: "2025-03-04T12:00:00.000Z",
    startOfDay: "2025-03-04T00:00:00.000Z",
    endOfDay: "2025-03-05T00:00:00.000Z",
  }),
}));

// linkApiのモック
jest.mock("@/feature/links/infrastructure/api", () => ({
  linkApi: {
    fetchUserLinksWithCustomQuery: jest.fn(),
  },
}));

describe("swipeableLinkService", () => {
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

  describe("fetchSwipeableLinks", () => {
    it("正しいパラメータでlinkApi.fetchUserLinksWithCustomQueryを呼び出すこと", async () => {
      // 準備
      const mockLinks = [
        createMockLink({ status: "add" }),
        createMockLink({ status: "inMonth" }),
        createMockLink({
          status: "other",
          scheduled_read_at: "2025-03-03T12:00:00.000Z", // 昨日の日付
        }),
      ];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      expect(mockLinkApi.fetchUserLinksWithCustomQuery).toHaveBeenCalledWith({
        userId: "test-user",
        limit: 30, // limit * 3
        queryBuilder: expect.any(Function),
      });
      expect(result.length).toBe(3);
    });

    it("優先順位に従ってリンクを並べ替えること", async () => {
      // 準備
      const addLink = createMockLink({ status: "add" });
      const scheduledLink = createMockLink({
        status: "other",
        scheduled_read_at: "2025-03-03T12:00:00.000Z", // 昨日の日付
      });
      const inMonthLink = createMockLink({ status: "inMonth" });

      // ランダムな順序で返す
      const mockLinks = [inMonthLink, scheduledLink, addLink];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      expect(result.length).toBe(3);
      // 優先順位1のリンクが最初に来ること
      expect(result[0].status).toBe("add");
      // 優先順位2のリンクが2番目に来ること
      expect(result[1].status).toBe("other");
      expect(result[1].scheduled_read_at).toBe("2025-03-03T12:00:00.000Z");
      // 優先順位3のリンクが最後に来ること
      expect(result[2].status).toBe("inMonth");
    });

    it("データが取得できない場合、空の配列を返すこと", async () => {
      // 準備
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(null);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      expect(result).toEqual([]);
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // 準備
      const mockError = new Error("API error");
      mockLinkApi.fetchUserLinksWithCustomQuery.mockRejectedValue(mockError);

      // 実行と検証
      await expect(
        swipeableLinkService.fetchSwipeableLinks("test-user", 10),
      ).rejects.toThrow("API error");
    });
  });
});
