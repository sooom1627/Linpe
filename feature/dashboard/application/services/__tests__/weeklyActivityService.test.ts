import { type ActivityLog } from "../../../domain/models/activity";
import { weeklyActivityService } from "../weeklyActivityService";

// リポジトリのモック
jest.mock("../../../infrastructure/api/weeklyActivityApi", () => ({
  weeklyActivityRepository: {
    fetchActivityLogs: jest.fn(),
  },
}));

// dateUtilsのモック
jest.mock("@/lib/utils/dateUtils", () => ({
  dateUtils: {
    getLocalDate: jest.fn().mockImplementation(() => new Date("2024-01-07")),
    getDateRangeForFetch: jest.fn().mockImplementation(() => ({
      startUTC: "2024-01-01T00:00:00.000Z",
      endUTC: "2024-01-07T23:59:59.999Z",
      timezone: "mock",
    })),
    utcToLocalDate: jest
      .fn()
      .mockImplementation((dateStr) => new Date(dateStr)),
    getUserTimezone: jest.fn().mockReturnValue("mock"),
    formatLocalDateString: jest.fn().mockImplementation((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }),
  },
}));

// モックされたリポジトリをインポート
const { weeklyActivityRepository } = jest.requireMock(
  "../../../infrastructure/api/weeklyActivityApi",
);

describe("weeklyActivityService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 日付をモック化
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-07"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getWeeklyActivity", () => {
    it("正常系: 週間アクティビティデータを取得できる", async () => {
      const mockLogs: ActivityLog[] = [
        { changed_at: "2024-01-05", new_status: "read" },
        { changed_at: "2024-01-06", new_status: "swipe" },
        { changed_at: "2024-01-07", new_status: "add" },
      ];

      weeklyActivityRepository.fetchActivityLogs.mockResolvedValueOnce(
        mockLogs,
      );

      const result = await weeklyActivityService.getWeeklyActivity("test-user");

      expect(result.activities).toHaveLength(7); // 7日分のデータ
      expect(weeklyActivityRepository.fetchActivityLogs).toHaveBeenCalledWith(
        "test-user",
        expect.any(Date), // startDate
        expect.any(Date), // endDate
      );
    });

    it("異常系: リポジトリでエラーが発生した場合、一般化されたエラーをスローする", async () => {
      const mockError = new Error("Repository error");
      weeklyActivityRepository.fetchActivityLogs.mockRejectedValueOnce(
        mockError,
      );

      await expect(
        weeklyActivityService.getWeeklyActivity("test-user"),
      ).rejects.toThrow("週間アクティビティの取得に失敗しました");
    });
  });

  describe("toViewModel", () => {
    it("正常系: WeeklyActivityDataをViewModelに変換できる", () => {
      const mockData = {
        activities: [
          {
            date: new Date("2024-01-01"),
            day: "Mon",
            add: 1,
            swipe: 2,
            read: 3,
          },
          {
            date: new Date("2024-01-02"),
            day: "Tue",
            add: 4,
            swipe: 5,
            read: 6,
          },
        ],
      };

      const result = weeklyActivityService.toViewModel(mockData);

      expect(result).toEqual([
        {
          day: "Mon",
          add: 1,
          swipe: 2,
          read: 3,
        },
        {
          day: "Tue",
          add: 4,
          swipe: 5,
          read: 6,
        },
      ]);
    });
  });
});
