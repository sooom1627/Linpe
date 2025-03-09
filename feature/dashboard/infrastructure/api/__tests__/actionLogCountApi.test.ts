import { actionLogCountApi } from "../actionLogCountApi";

// コールバック関数の型定義
type QueryCallback = (result: {
  count: number | null;
  error: Error | null;
}) => unknown;

// Supabaseのモックを設定
jest.mock("@/lib/supabase", () => {
  const mockChainable = {
    from: jest.fn().mockImplementation(() => mockChainable),
    select: jest.fn().mockImplementation(() => mockChainable),
    eq: jest.fn().mockImplementation(() => mockChainable),
    gte: jest.fn().mockImplementation(() => mockChainable),
    lte: jest.fn().mockImplementation(() => mockChainable),
    then: jest.fn(),
  };
  return mockChainable;
});

// モックされたsupabaseモジュールを取得
const mockSupabase = jest.requireMock("@/lib/supabase");

describe("actionLogCountApi", () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();

    // デフォルトのモック実装 - カウント0を返す
    mockSupabase.then.mockImplementation((callback: QueryCallback) =>
      Promise.resolve(callback({ count: 0, error: null })),
    );
  });

  describe("fetchActionLogCount", () => {
    // 基本的なケース: 正常にカウントを取得できる場合
    it("正常にカウントを取得できること", async () => {
      // モックの実装を上書き - カウント5を返す
      mockSupabase.then.mockImplementationOnce((callback: QueryCallback) =>
        Promise.resolve(callback({ count: 5, error: null })),
      );

      // テスト実行
      const result = await actionLogCountApi.fetchActionLogCount({
        userId: "test-user",
        status: "Reading",
      });

      // アサーション
      expect(mockSupabase.from).toHaveBeenCalledWith("user_links_with_actions");
      expect(mockSupabase.select).toHaveBeenCalledWith("*", {
        count: "exact",
        head: true,
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith("user_id", "test-user");
      expect(mockSupabase.eq).toHaveBeenCalledWith("status", "Reading");
      expect(result).toEqual(5);
    });

    // エラーケース: Supabaseからエラーが返される場合
    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // モックの実装を上書き - エラーを返す
      const testError = new Error("Database error");
      mockSupabase.then.mockImplementationOnce((callback: QueryCallback) =>
        Promise.resolve(callback({ count: null, error: testError })),
      );

      // テスト実行とアサーション
      await expect(
        actionLogCountApi.fetchActionLogCount({
          userId: "test-user",
          status: "Reading",
        }),
      ).rejects.toThrow("Database error");
    });

    // 日付範囲のテスト: startDateが指定される場合
    it("startDateが指定される場合、正しいクエリが構築されること", async () => {
      // テスト実行
      await actionLogCountApi.fetchActionLogCount({
        userId: "test-user",
        status: "Reading",
        startDate: "2023-01-01",
      });

      // アサーション
      expect(mockSupabase.gte).toHaveBeenCalledWith("created_at", "2023-01-01");
    });

    // 日付範囲のテスト: endDateが指定される場合
    it("endDateが指定される場合、正しいクエリが構築されること", async () => {
      // テスト実行
      await actionLogCountApi.fetchActionLogCount({
        userId: "test-user",
        status: "Reading",
        endDate: "2023-01-31",
      });

      // アサーション
      expect(mockSupabase.lte).toHaveBeenCalledWith("created_at", "2023-01-31");
    });

    // 日付範囲のテスト: startDateとendDateの両方が指定される場合
    it("startDateとendDateの両方が指定される場合、正しいクエリが構築されること", async () => {
      // テスト実行
      await actionLogCountApi.fetchActionLogCount({
        userId: "test-user",
        status: "Reading",
        startDate: "2023-01-01",
        endDate: "2023-01-31",
      });

      // アサーション
      expect(mockSupabase.gte).toHaveBeenCalledWith("created_at", "2023-01-01");
      expect(mockSupabase.lte).toHaveBeenCalledWith("created_at", "2023-01-31");
    });

    // カウントが0の場合のテスト
    it("カウントが0の場合、0を返すこと", async () => {
      // モックの実装を上書き - カウント0を返す
      mockSupabase.then.mockImplementationOnce((callback: QueryCallback) =>
        Promise.resolve(callback({ count: 0, error: null })),
      );

      // テスト実行
      const result = await actionLogCountApi.fetchActionLogCount({
        userId: "test-user",
        status: "Reading",
      });

      // アサーション
      expect(result).toEqual(0);
    });
  });
});
