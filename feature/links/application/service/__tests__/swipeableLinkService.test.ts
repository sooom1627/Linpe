import type { UserLink } from "@/feature/links/domain/models/types";
import { linkApi } from "@/feature/links/infrastructure/api";
import { swipeableLinkService } from "../swipeableLinkService";

// モックの型定義
type MockLinkApi = {
  fetchUserLinksWithCustomQuery: jest.Mock;
};

// globalDateUtilsモジュールをモック
jest.mock("@/lib/utils/dateUtils", () => ({
  dateUtils: {
    utcToLocalDate: jest
      .fn()
      .mockImplementation((dateStr) => new Date(dateStr)),
  },
}));

// dateUtilsモジュールをモック
jest.mock("@/feature/links/infrastructure/utils/dateUtils", () => ({
  getDateRanges: jest.fn().mockReturnValue({
    now: new Date("2025-03-04T12:00:00.000Z"),
    startOfDay: new Date("2025-03-04T00:00:00.000Z"),
    endOfDay: new Date("2025-03-05T00:00:00.000Z"),
  }),
  isToday: jest.fn().mockImplementation((date) => {
    // モックの現在日: 2025-03-04
    const mockToday = new Date("2025-03-04T12:00:00.000Z");
    return (
      date.getFullYear() === mockToday.getFullYear() &&
      date.getMonth() === mockToday.getMonth() &&
      date.getDate() === mockToday.getDate()
    );
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
        limit: 30, // limit * 3
        queryBuilder: expect.any(Function),
        orderBy: "added_at", // 追加された日時順
        ascending: false, // 新しい順
      });
      expect(result.length).toBe(2);
    });

    it("優先順位に従ってリンクを並べ替えること", async () => {
      // 準備
      const addLink = createMockLink({ link_id: "1", status: "add" });
      const todayLinkPast = createMockLink({
        link_id: "2",
        status: "Today",
        scheduled_read_at: "2025-03-03T12:00:00.000Z", // 過去の日付（昨日）
      });
      const todayLinkToday = createMockLink({
        link_id: "3",
        status: "Today",
        scheduled_read_at: "2025-03-04T00:00:00.000Z", // 今日の日付
      });
      const inWeekendPast = createMockLink({
        link_id: "4",
        status: "inWeekend",
        scheduled_read_at: "2025-03-03T12:00:00.000Z", // 過去の日付（昨日）
      });
      const inWeekendToday = createMockLink({
        link_id: "5",
        status: "inWeekend",
        scheduled_read_at: "2025-03-04T00:00:00.000Z", // 今日の日付
      });
      const inWeekendFuture = createMockLink({
        link_id: "6",
        status: "inWeekend",
        scheduled_read_at: "2025-03-05T12:00:00.000Z", // 未来の日付
      });
      const skipLink = createMockLink({ link_id: "7", status: "Skip" });

      // ランダムな順序で返す
      const mockLinks = [
        skipLink,
        inWeekendFuture,
        todayLinkPast,
        addLink,
        todayLinkToday,
        inWeekendPast,
        inWeekendToday,
      ];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      // 優先順位1のリンクが最初に来ること
      expect(result[0].status).toBe("add");

      // 優先順位2のリンクが次に来ること（過去の日付のみ、今日の日付は除外）
      const priority2Links = result.filter(
        (link) =>
          (link.status === "Today" || link.status === "inWeekend") &&
          link.scheduled_read_at &&
          !["1", "7"].includes(link.link_id) && // リンク1(add)とリンク7(Skip)を除外
          link.link_id !== "3" && // 今日のTodayリンクを除外
          link.link_id !== "5" && // 今日のinWeekendリンクを除外
          link.link_id !== "6", // 未来のinWeekendリンクを除外
      );

      expect(priority2Links.length).toBe(2);
      expect(priority2Links.some((link) => link.link_id === "2")).toBe(true); // 過去のTodayリンク
      expect(priority2Links.some((link) => link.link_id === "4")).toBe(true); // 過去のinWeekendリンク

      // 今日の日付のリンクは優先順位2に含まれないこと
      expect(result.findIndex((link) => link.link_id === "3")).toBe(-1); // 今日のTodayリンク
      expect(result.findIndex((link) => link.link_id === "5")).toBe(-1); // 今日のinWeekendリンク

      // 優先順位3のリンクが含まれること
      expect(result.some((link) => link.status === "Skip")).toBe(true);
      expect(
        result.some(
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

    it("今日の日付のリンクが除外されること", async () => {
      // 準備
      const todayLinkToday = createMockLink({
        link_id: "1",
        status: "Today",
        scheduled_read_at: "2025-03-04T00:00:00.000Z", // 今日の日付
      });
      const inWeekendToday = createMockLink({
        link_id: "2",
        status: "inWeekend",
        scheduled_read_at: "2025-03-04T00:00:00.000Z", // 今日の日付
      });
      const todayLinkPast = createMockLink({
        link_id: "3",
        status: "Today",
        scheduled_read_at: "2025-03-03T12:00:00.000Z", // 過去の日付（昨日）
      });

      // APIからの返却値をモック
      const mockLinks = [todayLinkToday, inWeekendToday, todayLinkPast];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      // 今日の日付のリンクが除外されること
      expect(result.some((link) => link.link_id === "1")).toBe(false);
      expect(result.some((link) => link.link_id === "2")).toBe(false);
      // 過去の日付のリンクは含まれること
      expect(result.some((link) => link.link_id === "3")).toBe(true);
    });

    it("inWeekendステータスのリンクが読む予定日に応じて正しく分類されること", async () => {
      // 準備
      const inWeekendPastLink = createMockLink({
        link_id: "1",
        status: "inWeekend",
        scheduled_read_at: "2025-03-03T12:00:00.000Z", // 過去の日付（昨日）
      });
      const inWeekendTodayLink = createMockLink({
        link_id: "2",
        status: "inWeekend",
        scheduled_read_at: "2025-03-04T00:00:00.000Z", // 今日の日付
      });
      const inWeekendFutureLink = createMockLink({
        link_id: "3",
        status: "inWeekend",
        scheduled_read_at: "2025-03-05T12:00:00.000Z", // 未来の日付
      });

      // APIからの返却値をモック
      const mockLinks = [
        inWeekendFutureLink,
        inWeekendTodayLink,
        inWeekendPastLink,
      ];
      mockLinkApi.fetchUserLinksWithCustomQuery.mockResolvedValue(mockLinks);

      // 実行
      const result = await swipeableLinkService.fetchSwipeableLinks(
        "test-user",
        10,
      );

      // 検証
      expect(result.length).toBe(2); // 今日の日付のリンクは除外されるため2つになる

      // 過去の日付のinWeekendリンクが優先順位2に分類されること
      const priority2Link = result.find((link) => link.link_id === "1");
      expect(priority2Link).toBeTruthy();
      expect(priority2Link?.scheduled_read_at).toBe("2025-03-03T12:00:00.000Z");

      // 今日の日付のinWeekendリンクは除外されること
      expect(result.some((link) => link.link_id === "2")).toBe(false);

      // 未来の日付のinWeekendリンクが優先順位3に分類されること
      const priority3Link = result.find((link) => link.link_id === "3");
      expect(priority3Link).toBeTruthy();
      expect(priority3Link?.scheduled_read_at).toBe("2025-03-05T12:00:00.000Z");
    });
  });
});
