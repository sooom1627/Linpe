// SWRのモック
import useSWR from "swr";

import { ActionLogCountRepository } from "../../../infrastructure/api/actionLogCountApi";
import { ActionLogCountService } from "../../services/actionLogCountService";
import {
  useActionLogCount,
  usePeriodActionLogCount,
} from "../useActionLogCount";

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// ActionLogCountServiceのモック
jest.mock("../../services/actionLogCountService", () => ({
  ActionLogCountService: jest.fn(),
}));

// ActionLogCountRepositoryのモック
jest.mock("../../../infrastructure/api/actionLogCountApi", () => ({
  ActionLogCountRepository: jest.fn(),
}));

describe("useActionLogCount", () => {
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

    // サービスのモック実装
    (ActionLogCountService as jest.Mock).mockImplementation(() => ({
      getTodayActionLogCount: jest.fn().mockResolvedValue(mockData),
    }));

    // リポジトリのモック実装
    (ActionLogCountRepository as jest.Mock).mockImplementation(() => ({
      getActionLogCount: jest.fn().mockResolvedValue(10),
    }));
  });

  describe("useActionLogCount", () => {
    it("正しいキャッシュキーでSWRを呼び出すこと", () => {
      // フックを呼び出す
      useActionLogCount("test-user");

      // アサーション
      expect(useSWR).toHaveBeenCalledWith(
        ["today-action-log-count", "test-user"],
        expect.any(Function),
        expect.objectContaining({
          revalidateOnFocus: true,
          revalidateOnReconnect: true,
          dedupingInterval: 60000,
          errorRetryCount: 3,
        }),
      );
    });

    it("ユーザーIDがない場合、nullキャッシュキーでSWRを呼び出すこと", () => {
      // フックを呼び出す
      useActionLogCount("");

      // アサーション
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object),
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
        expect.objectContaining({
          revalidateOnFocus: true,
          revalidateOnReconnect: true,
          dedupingInterval: 60000,
          errorRetryCount: 3,
        }),
      );
    });

    it("ユーザーIDがない場合、nullキャッシュキーでSWRを呼び出すこと", () => {
      // フックを呼び出す
      usePeriodActionLogCount("", "2023-01-01", "2023-01-31");

      // アサーション
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object),
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
  });
});
