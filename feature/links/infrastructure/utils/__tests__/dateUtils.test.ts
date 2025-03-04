import { getDateRanges, isToday } from "../dateUtils";

describe("dateUtils", () => {
  describe("getDateRanges", () => {
    it("現在時刻と今日の日付範囲を返すこと", () => {
      // 日付をモック
      const mockDate = new Date("2025-03-04T12:00:00.000Z");
      const originalDate = global.Date;

      // グローバルのDateをモック
      global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
      global.Date.UTC = originalDate.UTC;
      global.Date.parse = originalDate.parse;
      global.Date.now = originalDate.now;

      // toISOStringをモック
      mockDate.toISOString = jest
        .fn()
        .mockReturnValue("2025-03-04T12:00:00.000Z");

      // テスト対象の関数を実行
      const result = getDateRanges();

      // 期待される結果
      expect(result.now).toBe("2025-03-04T12:00:00.000Z");
      expect(result).toHaveProperty("startOfDay");
      expect(result).toHaveProperty("endOfDay");

      // モックを元に戻す
      global.Date = originalDate;
    });
  });

  describe("isToday", () => {
    it("今日の日付の場合はtrueを返すこと", () => {
      // 現在の日付
      const today = new Date();

      // テスト対象の関数を実行
      const result = isToday(today);

      // 期待される結果
      expect(result).toBe(true);
    });

    it("今日ではない日付の場合はfalseを返すこと", () => {
      // 昨日の日付
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // 明日の日付
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // テスト対象の関数を実行
      const resultYesterday = isToday(yesterday);
      const resultTomorrow = isToday(tomorrow);

      // 期待される結果
      expect(resultYesterday).toBe(false);
      expect(resultTomorrow).toBe(false);
    });
  });
});
