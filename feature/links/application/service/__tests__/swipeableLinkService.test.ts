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
        createMockLink({ link_id: "1", status: "add" }),
        createMockLink({ link_id: "2", status: "Skip" }),
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
        limit: 20, // limit * 2
        queryBuilder: expect.any(Function),
      });
      expect(result.length).toBe(2);
    });

    it("優先順位に従ってリンクを並べ替えること", async () => {
      // 準備
      const addLink = createMockLink({ link_id: "1", status: "add" });
      const todayLink = createMockLink({
        link_id: "2",
        status: "Today",
        scheduled_read_at: "2025-03-03T12:00:00.000Z", // 過去の日付
      });
      const inWeekendFutureLink = createMockLink({
        link_id: "3",
        status: "inWeekend",
        scheduled_read_at: "2025-03-05T12:00:00.000Z", // 未来の日付
      });
      const skipLink = createMockLink({ link_id: "4", status: "Skip" });

      // ランダムな順序で返す
      const mockLinks = [skipLink, inWeekendFutureLink, todayLink, addLink];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      expect(result.length).toBe(4);
      // 優先順位1のリンクが最初に来ること
      expect(result[0].status).toBe("add");
      // 優先順位2のリンクが2番目に来ること
      expect(result[1].status).toBe("Today");
      expect(result[1].scheduled_read_at).toBe("2025-03-03T12:00:00.000Z");
      // 優先順位3のリンクが最後に来ること（順序は保証されない）
      expect(result.slice(2).some((link) => link.status === "Skip")).toBe(true);
      expect(
        result
          .slice(2)
          .some(
            (link) =>
              link.status === "inWeekend" &&
              link.scheduled_read_at === "2025-03-05T12:00:00.000Z",
          ),
      ).toBe(true);
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

    it("除外リストに含まれるステータスのリンクが取得されないこと", async () => {
      // 準備
      // 取得されるべきリンク
      const addLink = createMockLink({ link_id: "1", status: "add" });

      // APIからの返却値をモック（実際のAPIは除外ステータスのリンクを返さないはず）
      const mockLinks = [addLink];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      expect(result.length).toBe(1);
      // 除外リストに含まれるステータスのリンクが含まれていないこと
      expect(result.some((link) => link.status === "Reading")).toBe(false);
      expect(result.some((link) => link.status === "Read")).toBe(false);
      expect(result.some((link) => link.status === "Bookmark")).toBe(false);

      // クエリビルダー関数を取得
      const queryBuilderFn =
        mockLinkApi.fetchUserLinksWithCustomQuery.mock.calls[0][0].queryBuilder;

      // モックのクエリオブジェクト
      const mockQuery = {
        in: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
      };

      // クエリビルダー関数を実行
      queryBuilderFn(mockQuery);

      // in関数が呼ばれたことを確認
      expect(mockQuery.in).toHaveBeenCalledWith("status", expect.any(Array));

      // not関数が呼ばれたことを確認
      expect(mockQuery.not).toHaveBeenCalledWith(
        "status",
        "in",
        expect.any(String),
      );
    });

    it("inWeekendステータスのリンクが読む予定日に応じて正しく分類されること", async () => {
      // 準備
      const inWeekendPastLink = createMockLink({
        link_id: "1",
        status: "inWeekend",
        scheduled_read_at: "2025-03-03T12:00:00.000Z", // 過去の日付
      });
      const inWeekendFutureLink = createMockLink({
        link_id: "2",
        status: "inWeekend",
        scheduled_read_at: "2025-03-05T12:00:00.000Z", // 未来の日付
      });

      // APIからの返却値をモック
      const mockLinks = [inWeekendFutureLink, inWeekendPastLink];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      expect(result.length).toBe(2);
      // 過去の日付のinWeekendリンクが優先順位2に分類されること
      expect(result[0].link_id).toBe("1");
      expect(result[0].scheduled_read_at).toBe("2025-03-03T12:00:00.000Z");
      // 未来の日付のinWeekendリンクが優先順位3に分類されること
      expect(result[1].link_id).toBe("2");
      expect(result[1].scheduled_read_at).toBe("2025-03-05T12:00:00.000Z");
    });
  });
});
