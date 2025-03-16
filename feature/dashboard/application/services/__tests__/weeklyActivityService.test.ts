import type { WeeklyActivityData } from "../../../domain/models/activity";
import {
  WeeklyActivityService,
  type IWeeklyActivityRepository,
} from "../weeklyActivityService";

describe("WeeklyActivityService", () => {
  let service: WeeklyActivityService;
  let mockRepository: jest.Mocked<IWeeklyActivityRepository>;

  beforeEach(() => {
    // リポジトリのモック作成
    mockRepository = {
      fetchActivityLogs: jest.fn(),
    };

    // サービスのインスタンス作成
    service = new WeeklyActivityService(mockRepository);

    // 日付を固定
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-07")); // 日曜日に固定
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getWeeklyActivity", () => {
    it("正常系: 週間アクティビティを取得できること", async () => {
      // モックデータ
      const mockLogs = [
        { changed_at: "2024-01-05T10:00:00Z", new_status: "add" }, // add
        { changed_at: "2024-01-05T15:00:00Z", new_status: "Read" }, // read
        { changed_at: "2024-01-06T12:00:00Z", new_status: "Skip" }, // swipe
      ];

      // リポジトリのモック応答を設定
      mockRepository.fetchActivityLogs.mockResolvedValue(mockLogs);

      // テスト実行
      const result = await service.getWeeklyActivity("test-user");

      // アサーション
      expect(result.activities).toHaveLength(7); // 7日分のデータ
      expect(mockRepository.fetchActivityLogs).toHaveBeenCalledWith(
        "test-user",
        expect.any(Date), // 2024-01-01
        expect.any(Date), // 2024-01-07
      );

      // 日付範囲の検証
      const [, startDate, endDate] =
        mockRepository.fetchActivityLogs.mock.calls[0];
      expect(startDate.toISOString().split("T")[0]).toBe("2024-01-01");
      expect(endDate.toISOString().split("T")[0]).toBe("2024-01-07");
    });

    it("異常系: リポジトリがエラーをスローした場合、エラーが伝播すること", async () => {
      // リポジトリのエラーをモック
      const mockError = new Error("Repository error");
      mockRepository.fetchActivityLogs.mockRejectedValue(mockError);

      // テスト実行とアサーション
      await expect(service.getWeeklyActivity("test-user")).rejects.toThrow(
        "Repository error",
      );
    });
  });

  describe("toViewModel", () => {
    it("WeeklyActivityDataをビューモデルに正しく変換できること", () => {
      // テストデータ
      const mockData: WeeklyActivityData = {
        activities: [
          {
            date: new Date("2024-01-05"),
            activities: { add: 1, swipe: 2, read: 3 },
          },
          {
            date: new Date("2024-01-06"),
            activities: { add: 4, swipe: 5, read: 6 },
          },
        ],
      };

      // テスト実行
      const result = service.toViewModel(mockData);

      // アサーション
      expect(result).toEqual([
        {
          day: "Fri",
          add: 1,
          swipe: 2,
          read: 3,
        },
        {
          day: "Sat",
          add: 4,
          swipe: 5,
          read: 6,
        },
      ]);
    });
  });

  describe("アクティビティの集計", () => {
    it("ログデータが正しく集計されること", async () => {
      // モックデータ
      const mockLogs = [
        { changed_at: "2024-01-05T10:00:00Z", new_status: "add" }, // add
        { changed_at: "2024-01-05T15:00:00Z", new_status: "Read" }, // read
        { changed_at: "2024-01-05T12:00:00Z", new_status: "Skip" }, // swipe
      ];

      // リポジトリのモック応答を設定
      mockRepository.fetchActivityLogs.mockResolvedValue(mockLogs);

      // テスト実行
      const result = await service.getWeeklyActivity("test-user");

      // 特定の日付のアクティビティを検証
      const jan5Activity = result.activities.find(
        (a) => a.date.toISOString().split("T")[0] === "2024-01-05",
      );

      expect(jan5Activity).toBeDefined();
      expect(jan5Activity?.activities).toEqual({
        add: 1,
        swipe: 1,
        read: 1,
      });
    });

    it("存在しない日付のアクティビティが0で初期化されること", async () => {
      // 空のログデータ
      mockRepository.fetchActivityLogs.mockResolvedValue([]);

      // テスト実行
      const result = await service.getWeeklyActivity("test-user");

      // すべての日付で0が設定されていることを確認
      result.activities.forEach((daily) => {
        expect(daily.activities).toEqual({
          add: 0,
          swipe: 0,
          read: 0,
        });
      });
    });
  });
});
