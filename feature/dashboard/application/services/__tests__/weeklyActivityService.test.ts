import {
  weeklyActivityService,
  type IWeeklyActivityRepository,
} from "../weeklyActivityService";

describe("weeklyActivityService", () => {
  const mockRepository: jest.Mocked<IWeeklyActivityRepository> = {
    fetchActivityLogs: jest.fn(),
  };

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
      const mockLogs = [
        { changed_at: "2024-01-05", new_status: "read" },
        { changed_at: "2024-01-06", new_status: "swipe" },
        { changed_at: "2024-01-07", new_status: "add" },
      ];

      mockRepository.fetchActivityLogs.mockResolvedValueOnce(mockLogs);

      const result = await weeklyActivityService.getWeeklyActivity(
        mockRepository,
        "test-user",
      );

      expect(result.activities).toHaveLength(7); // 7日分のデータ
      expect(mockRepository.fetchActivityLogs).toHaveBeenCalledWith(
        "test-user",
        expect.any(Date), // startDate
        expect.any(Date), // endDate
      );
    });

    it("異常系: リポジトリでエラーが発生した場合、エラーを伝播する", async () => {
      const mockError = new Error("Repository error");
      mockRepository.fetchActivityLogs.mockRejectedValueOnce(mockError);

      await expect(
        weeklyActivityService.getWeeklyActivity(mockRepository, "test-user"),
      ).rejects.toThrow(mockError);
    });
  });

  describe("toViewModel", () => {
    it("正常系: WeeklyActivityDataをViewModelに変換できる", () => {
      const mockData = {
        activities: [
          {
            date: new Date("2024-01-01"),
            activities: { add: 1, swipe: 2, read: 3 },
          },
          {
            date: new Date("2024-01-02"),
            activities: { add: 4, swipe: 5, read: 6 },
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
