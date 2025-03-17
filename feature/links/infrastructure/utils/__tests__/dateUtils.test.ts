import { dateUtils as globalDateUtils } from "@/lib/utils/dateUtils";
import * as dateUtilsModule from "../dateUtils";
import {
  getDateRanges,
  isToday,
  isTomorrow,
  isWeekend,
  isWithinOneWeek,
} from "../dateUtils";

// mockの固定日時
const MOCK_DATE_STRING = "2025-03-04T12:00:00.000Z";

// globalDateUtilsのモック
jest.mock("@/lib/utils/dateUtils", () => ({
  dateUtils: {
    getLocalDate: jest.fn().mockImplementation(() => {
      const mockDate = new Date(MOCK_DATE_STRING);
      return mockDate;
    }),
    getUserTimezone: jest.fn().mockReturnValue("UTC"),
  },
}));

describe("dateUtils", () => {
  describe("getDateRanges", () => {
    it("現在時刻と今日の日付範囲を返すこと", () => {
      // テスト対象の関数を実行
      const result = getDateRanges();

      // 期待される結果
      expect(result.now).toEqual(new Date(MOCK_DATE_STRING));
      expect(result).toHaveProperty("currentTime");
      expect(result).toHaveProperty("todayStart");
      expect(result).toHaveProperty("tomorrowStart");
      expect(result).toHaveProperty("oneWeekLater");
    });
  });

  describe("isToday", () => {
    beforeEach(() => {
      // 各テスト前にモックをリセット
      jest.clearAllMocks();
    });

    it("今日の日付の場合はtrueを返すこと", () => {
      // 今日の日付を同じ日の別の時間にセット - 必ず同じ日付部分を持つようにする
      const mockNow = new Date(MOCK_DATE_STRING);
      const today = new Date(MOCK_DATE_STRING);
      today.setHours(15, 30, 0, 0); // 時間だけ変更

      // モックの設定
      (globalDateUtils.getLocalDate as jest.Mock).mockReturnValue(mockNow);

      // テスト対象の関数を実行
      const result = isToday(today);

      // 期待される結果
      expect(result).toBe(true);
    });

    it("今日ではない日付の場合はfalseを返すこと", () => {
      // モックの設定
      const mockNow = new Date(MOCK_DATE_STRING);
      (globalDateUtils.getLocalDate as jest.Mock).mockReturnValue(mockNow);

      // 昨日の日付
      const yesterday = new Date(mockNow);
      yesterday.setDate(mockNow.getDate() - 1);

      // 明日の日付
      const tomorrow = new Date(mockNow);
      tomorrow.setDate(mockNow.getDate() + 1);

      // テスト対象の関数を実行
      const resultYesterday = isToday(yesterday);
      const resultTomorrow = isToday(tomorrow);

      // 期待される結果
      expect(resultYesterday).toBe(false);
      expect(resultTomorrow).toBe(false);
    });
  });

  describe("isTomorrow", () => {
    beforeEach(() => {
      // 各テスト前にモックをリセット
      jest.clearAllMocks();
    });

    it("明日の日付の場合はtrueを返すこと", () => {
      // モックの設定
      const mockNow = new Date(MOCK_DATE_STRING);
      (globalDateUtils.getLocalDate as jest.Mock).mockReturnValue(mockNow);

      // 明日の日付を計算 - 確実に正しい日付を使用
      const tomorrow = new Date(mockNow);
      tomorrow.setDate(mockNow.getDate() + 1);
      tomorrow.setHours(15, 30, 0, 0); // 時間は変更

      // テスト実行
      const result = isTomorrow(tomorrow);

      // 期待値
      expect(result).toBe(true);
    });

    it("明日ではない日付の場合はfalseを返すこと", () => {
      // モックの設定
      const mockNow = new Date(MOCK_DATE_STRING);
      (globalDateUtils.getLocalDate as jest.Mock).mockReturnValue(mockNow);

      // 今日の日付
      const today = new Date(mockNow);

      // 明後日の日付
      const dayAfterTomorrow = new Date(mockNow);
      dayAfterTomorrow.setDate(mockNow.getDate() + 2);

      // テスト実行
      const resultToday = isTomorrow(today);
      const resultDayAfterTomorrow = isTomorrow(dayAfterTomorrow);

      // 期待値
      expect(resultToday).toBe(false);
      expect(resultDayAfterTomorrow).toBe(false);
    });
  });

  describe("isWeekend", () => {
    it("週末の日付の場合はtrueを返すこと", () => {
      // 土曜日（2025-03-08）
      const saturday = new Date("2025-03-08T12:00:00.000Z");
      // 日曜日（2025-03-09）
      const sunday = new Date("2025-03-09T12:00:00.000Z");

      // テスト実行
      const resultSaturday = isWeekend(saturday);
      const resultSunday = isWeekend(sunday);

      // 期待値
      expect(resultSaturday).toBe(true);
      expect(resultSunday).toBe(true);
    });

    it("平日の日付の場合はfalseを返すこと", () => {
      // 平日（2025-03-04 火曜日）
      const weekday = new Date("2025-03-04T12:00:00.000Z");

      // テスト実行
      const result = isWeekend(weekday);

      // 期待値
      expect(result).toBe(false);
    });
  });

  describe("isWithinOneWeek", () => {
    beforeEach(() => {
      // getDateRangesのモックを設定
      jest.spyOn(dateUtilsModule, "getDateRanges").mockReturnValue({
        now: new Date("2025-03-04T12:00:00.000Z"),
        currentTime: new Date("2025-03-04T12:00:00.000Z"),
        todayStart: new Date("2025-03-04T00:00:00.000Z"),
        tomorrowStart: new Date("2025-03-05T00:00:00.000Z"),
        oneWeekLater: new Date("2025-03-11T00:00:00.000Z"),
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("一週間以内の日付の場合はtrueを返すこと", () => {
      // 3日後
      const threeDaysLater = new Date("2025-03-07T12:00:00.000Z");

      // テスト実行
      const result = isWithinOneWeek(threeDaysLater);

      // 期待値
      expect(result).toBe(true);
    });

    it("一週間を超える日付の場合はfalseを返すこと", () => {
      // 8日後 - 一週間の範囲外（3月11日以降）
      const eightDaysLater = new Date("2025-03-12T00:00:00.000Z");

      // テスト実行
      const result = isWithinOneWeek(eightDaysLater);

      // 期待値
      expect(result).toBe(false);
    });
  });
});
