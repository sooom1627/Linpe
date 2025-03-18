/**
 * 日付関連のユーティリティ関数
 */
import * as Localization from "expo-localization";
import { getCalendars } from "expo-localization";

export const dateUtils = {
  /**
   * ユーザーのローカルタイムゾーンを取得する
   * @returns ユーザーのタイムゾーン（例：'Asia/Tokyo'）
   */
  getUserTimezone(): string {
    try {
      // 最新のExpoでは getCalendars()[0].timeZone を使用するのが推奨される
      const calendars = getCalendars();
      if (calendars && calendars.length > 0 && calendars[0].timeZone) {
        return calendars[0].timeZone;
      }

      // 後方互換性のためのフォールバック
      if (Localization.timezone) {
        return Localization.timezone;
      }

      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error("タイムゾーンの取得に失敗しました:", error);
      return "UTC"; // フォールバックとしてUTCを返す
    }
  },

  /**
   * ユーザーのローカルタイムゾーンでの日付を取得する
   * @returns 現在の日付（ローカルタイムゾーン）
   */
  getLocalDate(): Date {
    return new Date();
  },

  /**
   * ローカル日付をUTC日付文字列に変換する
   * @param date ローカル日付
   * @param startOfDay その日の開始時刻にするかどうか
   * @returns UTC日付文字列（YYYY-MM-DDT00:00:00Z または YYYY-MM-DDT23:59:59Z）
   */
  localDateToUTCString(date: Date, startOfDay: boolean = true): string {
    // ローカルの年月日を取得
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // ローカルの日付の0時または23時59分59秒を表すDateオブジェクトを作成
    const localDate = new Date(year, month, day);
    if (!startOfDay) {
      localDate.setHours(23, 59, 59, 999);
    }

    // UTCに変換
    return localDate.toISOString();
  },

  /**
   * 日付範囲の開始日と終了日をUTC文字列で取得する
   * @param startDate 開始日（ローカル）
   * @param endDate 終了日（ローカル）
   * @returns UTCの日付範囲
   */
  getUTCDateRange(
    startDate: Date,
    endDate: Date,
  ): { startUTC: string; endUTC: string } {
    return {
      startUTC: this.localDateToUTCString(startDate, true),
      endUTC: this.localDateToUTCString(endDate, false),
    };
  },

  /**
   * 今日の日付範囲をUTC文字列で取得する
   * @returns 今日のUTC日付範囲
   */
  getTodayUTCRange(): { startUTC: string; endUTC: string } {
    const today = this.getLocalDate();
    return this.getUTCDateRange(today, today);
  },

  /**
   * 過去7日間の日付範囲をUTC文字列で取得する
   * @returns 過去7日間のUTC日付範囲
   */
  getWeeklyUTCRange(): { startUTC: string; endUTC: string } {
    const today = this.getLocalDate();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    return this.getUTCDateRange(sevenDaysAgo, today);
  },

  /**
   * UTCの日付文字列をローカルの日付オブジェクトに変換する
   * @param utcString UTC日付文字列
   * @returns ローカルのDateオブジェクト
   */
  utcToLocalDate(utcString: string): Date {
    // 単純にnew Date()だとタイムゾーンの扱いが正確でないため、
    // 日付文字列をパースして正しくローカルタイムゾーンを反映したDateオブジェクトを返す
    const date = new Date(utcString);
    // UTCの日時をローカルタイムゾーンのDateオブジェクトとして扱う
    return date;
  },

  /**
   * UTCの日付文字列からローカルの日付文字列（YYYY-MM-DD）を取得する
   * @param utcString UTC日付文字列
   * @returns ローカル日付文字列（YYYY-MM-DD）
   */
  utcToLocalDateString(utcString: string): string {
    const date = this.utcToLocalDate(utcString);
    // 新しいformatLocalDateString関数を使用
    return this.formatLocalDateString(date);
  },

  // フェッチ用の日付範囲取得をまとめる関数を追加（既存の関数を活用）
  getDateRangeForFetch(startLocal: Date, endLocal: Date) {
    const { startUTC, endUTC } = this.getUTCDateRange(startLocal, endLocal);

    return {
      startUTC,
      endUTC,
      timezone: this.getUserTimezone(),
    };
  },

  /**
   * ローカルタイムゾーンに基づいた日付文字列（YYYY-MM-DD）を取得する
   * @param date Dateオブジェクト
   * @returns ローカル日付文字列（YYYY-MM-DD）
   */
  formatLocalDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  },
};
