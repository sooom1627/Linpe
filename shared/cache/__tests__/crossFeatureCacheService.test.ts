import { ACTION_LOG_CACHE_KEYS } from "@/feature/dashboard/application/cache/actionLogCacheKeys";
import { actionLogCacheService } from "@/feature/dashboard/application/cache/actionLogCacheService";
import { crossFeatureCacheService } from "../crossFeatureCacheService";

// actionLogCacheServiceをモック化
jest.mock("@/feature/dashboard/application/cache/actionLogCacheService");

describe("crossFeatureCacheService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateDashboardCacheAfterLinkActionが適切なキャッシュを更新すること", () => {
    // テスト実行
    const mockMutate = jest.fn();
    crossFeatureCacheService.updateDashboardCacheAfterLinkAction(
      "test-user",
      mockMutate,
    );

    // actionLogCacheServiceの呼び出しを検証
    expect(actionLogCacheService.updateAfterActionLogAdd).toHaveBeenCalledWith(
      "test-user",
      mockMutate,
    );

    // 明示的なキャッシュキー更新の検証
    expect(mockMutate).toHaveBeenCalledWith(
      ACTION_LOG_CACHE_KEYS.TODAY_ACTION_LOG_COUNT("test-user"),
    );
    expect(mockMutate).toHaveBeenCalledWith(
      ACTION_LOG_CACHE_KEYS.LINK_STATUS_COUNTS("test-user"),
    );
    expect(mockMutate).toHaveBeenCalledWith(
      ACTION_LOG_CACHE_KEYS.SWIPE_STATUS_COUNTS("test-user"),
    );
  });
});
