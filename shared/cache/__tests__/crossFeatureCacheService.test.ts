import { actionLogCacheService } from "@/feature/dashboard/application/cache/actionLogCacheService";
import { crossFeatureCacheService } from "../crossFeatureCacheService";

// actionLogCacheServiceをモック化
jest.mock("@/feature/dashboard/application/cache/actionLogCacheService");

describe("crossFeatureCacheService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateDashboardCacheAfterLinkActionがactionLogCacheServiceを呼び出すこと", () => {
    // テスト実行
    const mockMutate = jest.fn();
    crossFeatureCacheService.updateDashboardCacheAfterLinkAction(
      "test-user",
      mockMutate,
    );

    // アサーション
    expect(actionLogCacheService.updateAfterActionLogAdd).toHaveBeenCalledWith(
      "test-user",
      mockMutate,
    );
  });
});
