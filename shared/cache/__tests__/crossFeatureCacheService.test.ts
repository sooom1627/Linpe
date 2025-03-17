import { actionLogCacheService } from "@/feature/dashboard/application/cache/actionLogCacheService";
import { crossFeatureCacheService } from "../crossFeatureCacheService";

// actionLogCacheServiceをモック化
jest.mock("@/feature/dashboard/application/cache/actionLogCacheService");

describe("crossFeatureCacheService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateDashboardCacheAfterLinkActionがactionLogCacheServiceに正しく委譲すること", () => {
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

    // 他のフィーチャーキャッシュサービスを追加した場合、ここでそれらの呼び出しを検証
  });
});
