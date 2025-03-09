import type { UserLink } from "@/feature/links/domain/models/types";
// モックされたsupabaseモジュールをインポート
import supabaseModule from "@/lib/supabase";
import { linkApi } from "../linkApi";

// dateUtilsモジュールをモック
jest.mock("@/feature/links/infrastructure/utils/dateUtils", () => ({
  getDateRanges: jest.fn().mockReturnValue({
    now: "2025-03-04T12:00:00.000Z",
    startOfDay: "2025-03-04T00:00:00.000Z",
    endOfDay: "2025-03-05T00:00:00.000Z",
  }),
}));

// モックSupabaseの型定義
type MockSupabase = {
  from: jest.Mock;
  select: jest.Mock;
  eq: jest.Mock;
  or: jest.Mock;
  order: jest.Mock;
  limit: jest.Mock;
  rpc: jest.Mock;
  __mockResponse: {
    data: UserLink[] | null;
    error: Error | null;
  };
};

// Supabaseのモックを設定
jest.mock("@/lib/supabase", () => {
  // モックレスポンスを保持するオブジェクト
  const mockResponse = { data: null, error: null };

  // チェーンメソッドを持つモックオブジェクト
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockImplementation(() => mockResponse),
  };

  // テスト内からモックレスポンスを変更できるようにする
  return {
    ...mockSupabase,
    __mockResponse: mockResponse,
  };
});

describe("linkApi", () => {
  // supabaseモジュールへの参照
  let supabase: MockSupabase;

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();

    // モックレスポンスへの参照を更新
    supabase = supabaseModule as unknown as MockSupabase;

    // デフォルトのレスポンスを設定
    supabase.__mockResponse.data = [];
    supabase.__mockResponse.error = null;
  });

  // モックリンクデータを作成するヘルパー関数
  const createMockLink = (overrides = {}): UserLink => ({
    link_id: "1",
    full_url: "https://example.com",
    domain: "example.com",
    parameter: "",
    link_created_at: "2023-01-01T00:00:00.000Z",
    status: "add",
    added_at: "2023-01-01T00:00:00.000Z",
    scheduled_read_at: null,
    read_at: null,
    read_count: 0,
    swipe_count: 0,
    user_id: "test-user",
    ...overrides,
  });

  // 共通のクエリ実行パターンをテスト
  describe("共通のクエリ実行パターン", () => {
    it("すべてのメソッドで同じクエリ実行パターンが使用されていること", async () => {
      // モックデータ
      const mockData = [createMockLink()];
      supabase.__mockResponse.data = mockData;

      // 各メソッドを実行
      await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
        orderBy: "added_at",
        ascending: true,
      });

      await linkApi.fetchUserLinksByStatus({
        userId: "test-user",
        status: "Today",
        limit: 10,
        orderBy: "added_at",
        ascending: true,
      });

      await linkApi.fetchUserLinksWithCustomQuery({
        userId: "test-user",
        limit: 10,
        queryBuilder: (query) => query,
        orderBy: "added_at",
        ascending: true,
      });

      // 各メソッドで同じパターンのクエリが実行されていることを確認
      expect(supabase.order).toHaveBeenCalledTimes(3);
      expect(supabase.limit).toHaveBeenCalledTimes(3);

      // すべての呼び出しで同じパラメータが使用されていることを確認
      for (let i = 0; i < 3; i++) {
        expect(supabase.order.mock.calls[i][0]).toBe("added_at");
        expect(supabase.order.mock.calls[i][1]).toEqual({ ascending: true });
        expect(supabase.limit.mock.calls[i][0]).toBe(10);
      }
    });

    it("エラーハンドリングが一貫していること", async () => {
      // エラーをモック
      const mockError = new Error("Database error");
      supabase.__mockResponse.data = null;
      supabase.__mockResponse.error = mockError;

      // 各メソッドでエラーがスローされることを確認
      await expect(
        linkApi.fetchUserLinks({
          userId: "test-user",
          limit: 10,
        }),
      ).rejects.toThrow("Database error");

      await expect(
        linkApi.fetchUserLinksByStatus({
          userId: "test-user",
          status: "Today",
          limit: 10,
        }),
      ).rejects.toThrow("Database error");

      await expect(
        linkApi.fetchUserLinksWithCustomQuery({
          userId: "test-user",
          limit: 10,
          queryBuilder: (query) => query,
        }),
      ).rejects.toThrow("Database error");
    });
  });

  describe("fetchUserLinks", () => {
    // 基本的なケース: 正常にデータを取得できる場合
    it("正常にデータを取得できること", async () => {
      // モックデータ
      const mockData = [createMockLink()];

      // モックレスポンスを設定
      supabase.__mockResponse.data = mockData;

      // テスト実行
      const result = await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
      });

      // アサーション
      expect(supabase.from).toHaveBeenCalledWith("user_links_with_actions");
      expect(supabase.select).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user");
      expect(supabase.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockData);
    });

    // エラーケース: Supabaseからエラーが返される場合
    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // エラーをモック
      const mockError = new Error("Database error");
      supabase.__mockResponse.data = null;
      supabase.__mockResponse.error = mockError;

      // テスト実行とアサーション
      await expect(
        linkApi.fetchUserLinks({
          userId: "test-user",
          limit: 10,
        }),
      ).rejects.toThrow("Database error");
    });

    // オプションパラメータのテスト: includeReadyToReadが指定される場合
    it("includeReadyToReadが指定される場合、正しいクエリが構築されること", async () => {
      // テスト実行
      await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
        includeReadyToRead: true,
      });

      // アサーション
      expect(supabase.or).toHaveBeenCalledWith(
        expect.stringContaining("scheduled_read_at.is.null"),
      );
    });

    // オプションパラメータのテスト: statusが指定される場合
    it("statusが指定される場合、正しいクエリが構築されること", async () => {
      // テスト実行
      await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
        status: "add",
      });

      // アサーション
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user");
      expect(supabase.eq).toHaveBeenCalledWith("status", "add");
    });

    // オプションパラメータのテスト: orderByとascendingが指定される場合
    it("orderByとascendingが指定される場合、正しいクエリが構築されること", async () => {
      // テスト実行
      await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
        orderBy: "added_at",
        ascending: true,
      });

      // アサーション
      expect(supabase.order).toHaveBeenCalledWith("added_at", {
        ascending: true,
      });
    });
  });

  describe("fetchUserLinksByStatus", () => {
    it("正常にデータを取得できること", async () => {
      // モックデータ
      const mockData = [createMockLink({ status: "Today" })];

      // モックレスポンスを設定
      supabase.__mockResponse.data = mockData;

      // テスト実行
      const result = await linkApi.fetchUserLinksByStatus({
        userId: "test-user",
        status: "Today",
        limit: 10,
        orderBy: "link_created_at",
        ascending: false,
      });

      // アサーション
      expect(supabase.from).toHaveBeenCalledWith("user_links_with_actions");
      expect(supabase.select).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user");
      expect(supabase.eq).toHaveBeenCalledWith("status", "Today");
      expect(supabase.order).toHaveBeenCalledWith("link_created_at", {
        ascending: false,
      });
      expect(supabase.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockData);
    });

    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // エラーをモック
      const mockError = new Error("Database error");
      supabase.__mockResponse.data = null;
      supabase.__mockResponse.error = mockError;

      // テスト実行とアサーション
      await expect(
        linkApi.fetchUserLinksByStatus({
          userId: "test-user",
          status: "Today",
          limit: 10,
        }),
      ).rejects.toThrow("Database error");
    });
  });

  describe("fetchUserLinksWithCustomQuery", () => {
    it("正常にデータを取得できること", async () => {
      // モックデータ
      const mockData = [createMockLink()];

      // モックレスポンスを設定
      supabase.__mockResponse.data = mockData;

      // テスト実行
      const result = await linkApi.fetchUserLinksWithCustomQuery({
        userId: "test-user",
        limit: 10,
        queryBuilder: (query) => query.or("scheduled_read_at.is.null"),
        orderBy: "link_created_at",
        ascending: true,
      });

      // アサーション
      expect(supabase.from).toHaveBeenCalledWith("user_links_with_actions");
      expect(supabase.select).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user");
      expect(supabase.or).toHaveBeenCalledWith("scheduled_read_at.is.null");
      expect(supabase.order).toHaveBeenCalledWith("link_created_at", {
        ascending: true,
      });
      expect(supabase.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockData);
    });

    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // エラーをモック
      const mockError = new Error("Database error");
      supabase.__mockResponse.data = null;
      supabase.__mockResponse.error = mockError;

      // テスト実行とアサーション
      await expect(
        linkApi.fetchUserLinksWithCustomQuery({
          userId: "test-user",
          limit: 10,
          queryBuilder: (query) => query,
        }),
      ).rejects.toThrow("Database error");
    });
  });

  describe("createLinkAndUser", () => {
    it("正常にリンクとユーザーアクションを作成できること", async () => {
      // RPCモックを設定
      const mockRpc = jest.fn().mockResolvedValue({
        data: "registered",
        error: null,
      });
      supabase.rpc = mockRpc;

      // テスト実行
      const result = await linkApi.createLinkAndUser({
        domain: "example.com",
        parameter: "",
        full_url: "https://example.com",
        userId: "test-user",
      });

      // アサーション
      expect(mockRpc).toHaveBeenCalledWith("add_link_and_user_action", {
        p_domain: "example.com",
        p_full_url: "https://example.com",
        p_parameter: "",
        p_user_id: "test-user",
        p_status: "add",
      });
      expect(result).toEqual({ status: "registered" });
    });

    it("statusパラメータが指定された場合、正しく渡されること", async () => {
      // RPCモックを設定
      const mockRpc = jest.fn().mockResolvedValue({
        data: "registered",
        error: null,
      });
      supabase.rpc = mockRpc;

      // テスト実行
      await linkApi.createLinkAndUser({
        domain: "example.com",
        parameter: "",
        full_url: "https://example.com",
        userId: "test-user",
        status: "Today",
      });

      // アサーション
      expect(mockRpc).toHaveBeenCalledWith(
        "add_link_and_user_action",
        expect.objectContaining({
          p_status: "Today",
        }),
      );
    });

    it("エラーが発生した場合、エラーをスローすること", async () => {
      // エラーをモック
      const mockError = new Error("Database error");
      const mockRpc = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });
      supabase.rpc = mockRpc;

      // テスト実行とアサーション
      await expect(
        linkApi.createLinkAndUser({
          domain: "example.com",
          parameter: "",
          full_url: "https://example.com",
          userId: "test-user",
        }),
      ).rejects.toThrow("Database error");
    });
  });
});
