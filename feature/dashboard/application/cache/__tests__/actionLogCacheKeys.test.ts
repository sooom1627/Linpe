import {
  ACTION_LOG_CACHE_KEYS,
  isActionLogCache,
  isActionTypeCountCache,
} from "../actionLogCacheKeys";

describe("actionLogCacheKeys", () => {
  describe("ACTION_LOG_CACHE_KEYS", () => {
    it("TODAY_ACTION_LOG_COUNTが正しいキャッシュキーを返すこと", () => {
      const userId = "test-user";
      const result = ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT(userId);
      expect(result).toEqual(["today-action-log-count", "test-user"]);
    });

    it("PERIOD_ACTION_LOG_COUNTが正しいキャッシュキーを返すこと", () => {
      const userId = "test-user";
      const startDate = "2023-01-01";
      const endDate = "2023-01-31";
      const result = ACTION_LOG_CACHE_KEYS.PERIOD_ACTION_LOG_COUNT(
        userId,
        startDate,
        endDate,
      );
      expect(result).toEqual([
        "period-action-log-count",
        "test-user",
        "2023-01-01",
        "2023-01-31",
      ]);
    });

    it("ACTION_TYPE_COUNTが正しいキャッシュキーを返すこと", () => {
      const userId = "test-user";
      const actionType = "add";
      const startDate = "2023-01-01";
      const endDate = "2023-01-31";
      const result = ACTION_LOG_CACHE_KEYS.ACTION_TYPE_COUNT(
        userId,
        actionType,
        startDate,
        endDate,
      );
      expect(result).toEqual([
        "action-type-count",
        "test-user",
        "add",
        "2023-01-01",
        "2023-01-31",
      ]);
    });

    it("ACTION_TYPE_COUNTが日付なしでも正しいキャッシュキーを返すこと", () => {
      const userId = "test-user";
      const actionType = "add";
      const result = ACTION_LOG_CACHE_KEYS.ACTION_TYPE_COUNT(
        userId,
        actionType,
      );
      expect(result).toEqual([
        "action-type-count",
        "test-user",
        "add",
        undefined,
        undefined,
      ]);
    });
  });

  describe("isActionLogCache", () => {
    it("アクションログ関連のキャッシュキーを正しく判定すること", () => {
      expect(isActionLogCache(["today-action-log-count", "test-user"])).toBe(
        true,
      );
      expect(isActionLogCache(["period-action-log-count", "test-user"])).toBe(
        true,
      );
      expect(isActionLogCache(["action-log-something", "test-user"])).toBe(
        true,
      );
    });

    it("アクションログ関連でないキャッシュキーを正しく判定すること", () => {
      expect(isActionLogCache(["links", "test-user"])).toBe(false);
      expect(isActionLogCache("action-log")).toBe(false);
      expect(isActionLogCache(null)).toBe(false);
      expect(isActionLogCache(undefined)).toBe(false);
      expect(isActionLogCache(123)).toBe(false);
    });
  });

  describe("isActionTypeCountCache", () => {
    it("アクションタイプカウント関連のキャッシュキーを正しく判定すること", () => {
      expect(isActionTypeCountCache(["action-type-count", "test-user"])).toBe(
        true,
      );
    });

    it("アクションタイプカウント関連でないキャッシュキーを正しく判定すること", () => {
      expect(
        isActionTypeCountCache(["today-action-log-count", "test-user"]),
      ).toBe(false);
      expect(
        isActionTypeCountCache(["period-action-log-count", "test-user"]),
      ).toBe(false);
      expect(isActionTypeCountCache("action-type-count")).toBe(false);
      expect(isActionTypeCountCache(null)).toBe(false);
      expect(isActionTypeCountCache(undefined)).toBe(false);
      expect(isActionTypeCountCache(123)).toBe(false);
    });
  });
});
