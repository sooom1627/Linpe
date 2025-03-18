import { ACTION_LOG_CACHE_KEYS, isActionLogCache } from "../actionLogCacheKeys";
import { actionLogCacheService } from "../actionLogCacheService";

// SWRのmutate関数のモック
const mockMutate = jest.fn();

describe("actionLogCacheService", () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
  });

  describe("updateAfterActionLogCount", () => {
    it("正しいキャッシュキーでmutateを呼び出すこと", () => {
      // テスト実行
      actionLogCacheService.updateAfterActionLogCount("test-user", mockMutate);

      // アサーション
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith(
        ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT("test-user"),
      );
    });
  });

  describe("updateAfterActionLogAdd", () => {
    it("必要なキャッシュキーでmutateを呼び出すこと", () => {
      // テスト実行
      actionLogCacheService.updateAfterActionLogAdd("test-user", mockMutate);

      // アサーション
      expect(mockMutate).toHaveBeenCalledTimes(4);
      expect(mockMutate).toHaveBeenCalledWith(
        ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT("test-user"),
      );
      expect(mockMutate).toHaveBeenCalledWith(
        ACTION_LOG_CACHE_KEYS.LINK_STATUS_COUNTS("test-user"),
      );
      expect(mockMutate).toHaveBeenCalledWith(
        ACTION_LOG_CACHE_KEYS.SWIPE_STATUS_COUNTS("test-user"),
      );
      expect(mockMutate).toHaveBeenCalledWith(isActionLogCache);
    });
  });

  describe("updateActionTypeCount", () => {
    it("mutateを引数なしで呼び出すこと", () => {
      // テスト実行
      actionLogCacheService.updateActionTypeCount(
        "test-user",
        "add",
        mockMutate,
      );

      // アサーション
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith();
    });
  });
});
