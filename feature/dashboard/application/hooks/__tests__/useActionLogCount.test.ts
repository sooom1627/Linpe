// SWRのモック
import useSWR from "swr";

import { SWR_DEFAULT_CONFIG } from "../../cache/swrConfig";
import {
  useActionLogCount,
  usePeriodActionLogCount,
} from "../useActionLogCount";

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// actionLogCountServiceのモック
jest.mock("../../services/actionLogCountService", () => ({
  actionLogCountService: {
    getTodayActionLogCount: jest.fn().mockResolvedValue({
      add: 10,
      swipe: 20,
      read: 30,
    }),
  },
}));

// actionLogCountRepositoryのモック
jest.mock("../../../infrastructure/api/actionLogCountApi", () => ({
  actionLogCountRepository: {
    getActionLogCount: jest.fn().mockResolvedValue(10),
  },
}));

// キャッシュキーのモック
jest.mock("../../cache/actionLogCacheKeys", () => ({
  ACTION_LOG_CACHE_KEYS: {
    TODAY_ACTION_LOG_COUNT: (userId: string) =>
      userId ? ["today-action-log-count", userId] : null,
    PERIOD_ACTION_LOG_COUNT: (
      userId: string,
      startDate: string,
      endDate: string,
    ) =>
      userId ? ["period-action-log-count", userId, startDate, endDate] : null,
  },
}));

// SWR設定のモック
jest.mock("../../cache/swrConfig", () => ({
  SWR_DEFAULT_CONFIG: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
    errorRetryCount: 3,
  },
}));

describe("ActionLogCount hooks", () => {
  const mockData = { add: 10, swipe: 20, read: 30 };
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

  describe("useActionLogCount", () => {
    it("正しいキャッシュキーでSWRを呼び出すこと", () => {
      // フックを呼び出す
      useActionLogCount("test-user");

      // アサーション
      expect(useSWR).toHaveBeenCalledWith(
        ["today-action-log-count", "test-user"],
        expect.any(Function),
        SWR_DEFAULT_CONFIG,
      );
    });

    it("ユーザーIDがない場合、nullキャッシュキーでSWRを呼び出すこと", () => {
      // フックを呼び出す
      useActionLogCount("");

      // アサーション
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        SWR_DEFAULT_CONFIG,
      );
    });

    it("正しいデータを返すこと", () => {
      // フックを呼び出す
      const result = useActionLogCount("test-user");

      // アサーション
      expect(result.data).toEqual(mockData);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it("エラーが発生した場合、エラーを返すこと", () => {
      // SWRのモック実装を上書き
      (useSWR as jest.Mock).mockReturnValue({
        data: null,
        error: mockError,
        isLoading: false,
        mutate: mockMutate,
      });

      // フックを呼び出す
      const result = useActionLogCount("test-user");

      // アサーション
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("usePeriodActionLogCount", () => {
    it("正しいキャッシュキーでSWRを呼び出すこと", () => {
      // フックを呼び出す
      usePeriodActionLogCount("test-user", "2023-01-01", "2023-01-31");

      // アサーション
      expect(useSWR).toHaveBeenCalledWith(
        ["period-action-log-count", "test-user", "2023-01-01", "2023-01-31"],
        expect.any(Function),
        SWR_DEFAULT_CONFIG,
      );
    });

    it("ユーザーIDがない場合、nullキャッシュキーでSWRを呼び出すこと", () => {
      // フックを呼び出す
      usePeriodActionLogCount("", "2023-01-01", "2023-01-31");

      // アサーション
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        SWR_DEFAULT_CONFIG,
      );
    });

    it("正しいデータを返すこと", () => {
      // SWRのモック実装を上書き
      (useSWR as jest.Mock).mockReturnValue({
        data: mockData,
        error: null,
        isLoading: false,
        mutate: mockMutate,
      });

      // フックを呼び出す
      const result = usePeriodActionLogCount(
        "test-user",
        "2023-01-01",
        "2023-01-31",
      );

      // アサーション
      expect(result.data).toEqual(mockData);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it("エラーが発生した場合、エラーを返すこと", () => {
      // SWRのモック実装を上書き
      (useSWR as jest.Mock).mockReturnValue({
        data: null,
        error: mockError,
        isLoading: false,
        mutate: mockMutate,
      });

      // フックを呼び出す
      const result = usePeriodActionLogCount(
        "test-user",
        "2023-01-01",
        "2023-01-31",
      );

      // アサーション
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });
});
