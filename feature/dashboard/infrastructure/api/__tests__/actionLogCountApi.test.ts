import { ActionType } from "../../../domain/models/ActionLogCount";
import {
  actionLogCountApi,
  ActionLogCountRepository,
} from "../actionLogCountApi";

// モックレスポンスの型定義
interface MockResponse {
  data: unknown | null;
  count: number | null;
  error: Error | null;
}

// モックSupabaseの型定義
interface MockSupabase {
  from: jest.Mock;
  select: jest.Mock;
  eq: jest.Mock;
  in: jest.Mock;
  gte: jest.Mock;
  lte: jest.Mock;
  limit: jest.Mock;
  then: (resolve: (value: MockResponse) => unknown) => Promise<unknown>;
  __mockResponse: MockResponse;
}

// Supabaseのモック
jest.mock("@/lib/supabase", () => {
  // モックレスポンスを設定
  const __mockResponse: MockResponse = {
    data: null,
    count: null,
    error: null,
  };

  // チェーンメソッドを持つモックオブジェクト
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    // thenメソッドを実装してawaitで__mockResponseを返す
    then: (resolve: (value: typeof __mockResponse) => unknown) =>
      Promise.resolve(resolve(__mockResponse)),
    __mockResponse,
  };

  return mockSupabase;
});

// Supabaseのモックをインポートして型付け
const supabase = jest.requireMock("@/lib/supabase") as MockSupabase;

describe("actionLogCountApi", () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    // デフォルトのモックレスポンスを設定
    supabase.__mockResponse.data = null;
    supabase.__mockResponse.count = 5;
    supabase.__mockResponse.error = null;
  });

  describe("fetchActionLogCount", () => {
    it("正しいパラメータでクエリを実行すること", async () => {
      // テスト実行
      const result = await actionLogCountApi.fetchActionLogCount({
        userId: "test-user",
        status: "add",
        startDate: "2023-01-01",
        endDate: "2023-01-31",
      });

      // アサーション
      expect(supabase.from).toHaveBeenCalledWith("user_link_actions_log");
      expect(supabase.select).toHaveBeenCalledWith("*", {
        count: "exact",
        head: true,
      });
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user");
      expect(supabase.eq).toHaveBeenCalledWith("new_status", "add");
      expect(supabase.gte).toHaveBeenCalledWith("changed_at", "2023-01-01");
      expect(supabase.lte).toHaveBeenCalledWith("changed_at", "2023-01-31");
      expect(result).toBe(5);
    });

    it("日付パラメータが省略された場合、日付フィルタを適用しないこと", async () => {
      // テスト実行
      await actionLogCountApi.fetchActionLogCount({
        userId: "test-user",
        status: "add",
      });

      // アサーション
      expect(supabase.gte).not.toHaveBeenCalled();
      expect(supabase.lte).not.toHaveBeenCalled();
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // エラーのモック
      supabase.__mockResponse.error = new Error("Database error");

      // テスト実行とアサーション
      await expect(
        actionLogCountApi.fetchActionLogCount({
          userId: "test-user",
          status: "add",
        }),
      ).rejects.toThrow("Database error");
    });
  });

  describe("fetchActionLogCountByType", () => {
    it("正しいパラメータでクエリを実行すること", async () => {
      // テスト実行
      const result = await actionLogCountApi.fetchActionLogCountByType({
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: "2023-01-01",
        endDate: "2023-01-31",
      });

      // アサーション
      expect(supabase.from).toHaveBeenCalledWith("user_link_actions_log");
      expect(supabase.select).toHaveBeenCalledWith("*", {
        count: "exact",
        head: true,
      });
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user");
      expect(supabase.in).toHaveBeenCalled(); // ステータスの配列でinが呼ばれること
      expect(supabase.gte).toHaveBeenCalledWith(
        "changed_at",
        "2023-01-01T00:00:00",
      );
      expect(supabase.lte).toHaveBeenCalledWith(
        "changed_at",
        "2023-01-31T23:59:59",
      );
      expect(result).toBe(5);
    });

    it("日付パラメータが省略された場合、日付フィルタを適用しないこと", async () => {
      // テスト実行
      await actionLogCountApi.fetchActionLogCountByType({
        userId: "test-user",
        actionType: ActionType.ADD,
      });

      // アサーション
      expect(supabase.gte).not.toHaveBeenCalled();
      expect(supabase.lte).not.toHaveBeenCalled();
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // エラーのモック
      supabase.__mockResponse.error = new Error("Database error");

      // テスト実行とアサーション
      await expect(
        actionLogCountApi.fetchActionLogCountByType({
          userId: "test-user",
          actionType: ActionType.ADD,
        }),
      ).rejects.toThrow("Database error");
    });
  });

  describe("ActionLogCountRepository", () => {
    it("getActionLogCountメソッドが正しくfetchActionLogCountByTypeを呼び出すこと", async () => {
      // スパイを設定
      const spy = jest.spyOn(actionLogCountApi, "fetchActionLogCountByType");
      spy.mockResolvedValue(5);

      // リポジトリのインスタンスを作成
      const repository = new ActionLogCountRepository();

      // テスト実行
      const result = await repository.getActionLogCount({
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: "2023-01-01",
        endDate: "2023-01-31",
      });

      // アサーション
      expect(spy).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: "2023-01-01",
        endDate: "2023-01-31",
      });
      expect(result).toBe(5);

      // スパイをリストア
      spy.mockRestore();
    });
  });
});
