/**
 * dateUtils.tsのモック実装
 * テスト環境で使用するためのタイムゾーン無依存の実装
 */

export const dateUtils = {
  getUserTimezone(): string {
    return "UTC";
  },

  getLocalDate(): Date {
    // テスト環境では常にUTC日付を返す
    const mockedDate = new Date();
    // モック環境では日時を操作できるようにクリーンな値を返す
    return mockedDate;
  },

  localDateToUTCString(date: Date, startOfDay: boolean = true): string {
    // モックでは単純化するためにテスト用のフォーマットを使用
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (startOfDay) {
      return `${year}-${month}-${day}T00:00:00.000Z`;
    } else {
      return `${year}-${month}-${day}T23:59:59.999Z`;
    }
  },

  getUTCDateRange(
    startDate: Date,
    endDate: Date,
  ): { startUTC: string; endUTC: string } {
    return {
      startUTC: this.localDateToUTCString(startDate, true),
      endUTC: this.localDateToUTCString(endDate, false),
    };
  },

  getTodayUTCRange(): { startUTC: string; endUTC: string } {
    const today = this.getLocalDate();
    return {
      startUTC: this.localDateToUTCString(today, true),
      endUTC: this.localDateToUTCString(today, false),
    };
  },

  getWeeklyUTCRange(): { startUTC: string; endUTC: string } {
    const today = this.getLocalDate();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    return this.getUTCDateRange(sevenDaysAgo, today);
  },

  utcToLocalDate(utcString: string): Date {
    return new Date(utcString);
  },

  utcToLocalDateString(utcString: string): string {
    const date = this.utcToLocalDate(utcString);
    return date.toISOString().split("T")[0];
  },
};
