import useSWR from "swr";

import { linkService } from "@/feature/links/application/service/linkServices";
import { SWR_DISPLAY_CONFIG } from "../../cache/swrConfig";
import { useLinkStatusCount } from "../useLinkStatusCount";

// SWRのモック
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// linkServiceのモック
jest.mock("@/feature/links/application/service/linkServices", () => ({
  linkService: {
    getUserLinkStatusCounts: jest.fn(),
  },
}));

// キャッシュキーのモック
jest.mock("../../cache/actionLogCacheKeys", () => ({
  ACTION_LOG_CACHE_KEYS: {
    LINK_STATUS_COUNTS: (userId: string) =>
      userId ? ["link-status-counts", userId] : null,
  },
}));

// SWR設定のモック
jest.mock("../../cache/swrConfig", () => ({
  SWR_DISPLAY_CONFIG: {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    errorRetryCount: 3,
  },
}));

describe("useLinkStatusCount", () => {
  const mockData = {
    total: 100,
    read: 50,
    reread: 20,
    bookmark: 10,
  };
  const mockError = new Error("Test error");
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // SWRのモック実装
    (useSWR as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    });
  });

  it("正常系: 正しいキャッシュキーでSWRを呼び出すこと", () => {
    // フックを呼び出す
    useLinkStatusCount("test-user");

    // アサーション
    expect(useSWR).toHaveBeenCalledWith(
      ["link-status-counts", "test-user"],
      expect.any(Function),
      SWR_DISPLAY_CONFIG,
    );
  });

  it("正常系: ユーザーIDがない場合、nullキャッシュキーでSWRを呼び出すこと", () => {
    // フックを呼び出す
    useLinkStatusCount("");

    // アサーション
    expect(useSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      SWR_DISPLAY_CONFIG,
    );
  });

  it("正常系: 正しいデータを返すこと", () => {
    // フックを呼び出す
    const { data, error, isLoading, mutate } = useLinkStatusCount("test-user");

    // アサーション
    expect(data).toEqual(mockData);
    expect(error).toBeNull();
    expect(isLoading).toBe(false);
    expect(mutate).toBe(mockMutate);
  });

  it("異常系: エラーが発生した場合、エラーを返すこと", () => {
    // エラー状態をモック
    (useSWR as jest.Mock).mockReturnValueOnce({
      data: null,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
    });

    // フックを呼び出す
    const { data, error, isLoading, mutate } = useLinkStatusCount("test-user");

    // アサーション
    expect(data).toBeNull();
    expect(error).toBe(mockError);
    expect(isLoading).toBe(false);
    expect(mutate).toBe(mockMutate);
  });

  it("正常系: ローディング中の場合、isLoadingがtrueであること", () => {
    // ローディング状態をモック
    (useSWR as jest.Mock).mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: true,
      mutate: mockMutate,
    });

    // フックを呼び出す
    const { data, error, isLoading, mutate } = useLinkStatusCount("test-user");

    // アサーション
    expect(data).toBeNull();
    expect(error).toBeNull();
    expect(isLoading).toBe(true);
    expect(mutate).toBe(mockMutate);
  });

  it("正常系: fetcherが正しくlinkServiceを呼び出すこと", async () => {
    // linkServiceのモック
    const mockServiceData = { total: 100, read: 50, reread: 20, bookmark: 10 };
    (linkService.getUserLinkStatusCounts as jest.Mock).mockResolvedValue(
      mockServiceData,
    );

    // SWRのfetcher関数を取得
    (useSWR as jest.Mock).mockImplementation((key, fetcher) => {
      // 内部でfetcherを実行
      if (key) fetcher().catch(() => {});
      return {
        data: mockData,
        error: null,
        isLoading: false,
        mutate: mockMutate,
      };
    });

    // フックを呼び出す
    useLinkStatusCount("test-user");

    // アサーション
    expect(linkService.getUserLinkStatusCounts).toHaveBeenCalledWith(
      "test-user",
    );
  });
});
