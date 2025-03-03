import supabaseModule from "@/lib/supabase";
import { linkApi } from "../linkApi";

// Supabaseのモックを設定
jest.mock("@/lib/supabase", () => {
  const mockFrom = jest.fn();
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOr = jest.fn();
  const mockOrder = jest.fn();
  const mockLimit = jest.fn();

  // モックのチェーンを設定
  mockFrom.mockImplementation(() => ({
    select: mockSelect.mockImplementation(() => ({
      eq: mockEq.mockImplementation(() => ({
        or: mockOr.mockImplementation(() => ({
          eq: mockEq.mockImplementation(() => ({
            order: mockOrder.mockImplementation(() => ({
              limit: mockLimit,
            })),
          })),
          order: mockOrder.mockImplementation(() => ({
            limit: mockLimit,
          })),
        })),
        order: mockOrder.mockImplementation(() => ({
          limit: mockLimit,
        })),
      })),
    })),
  }));

  // デフォルトのレスポンスを設定
  mockLimit.mockResolvedValue({
    data: [],
    error: null,
  });

  return {
    from: mockFrom,
  };
});

describe("linkApi", () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUserLinks", () => {
    // 基本的なケース: 正常にデータを取得できる場合
    it("正常にデータを取得できること", async () => {
      // モックデータ
      const mockData = [
        {
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
        },
      ];

      // Supabaseのレスポンスをモック
      const mockLimit = jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });

      // モックチェーンを再設定
      (supabaseModule.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: mockLimit,
      }));

      // テスト実行
      const result = await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
      });

      // アサーション
      expect(supabaseModule.from).toHaveBeenCalledWith(
        "user_links_with_actions",
      );
      expect(result).toEqual(mockData);
    });

    // エラーケース: Supabaseからエラーが返される場合
    it("Supabaseからエラーが返される場合、エラーをスローすること", async () => {
      // エラーをモック
      const mockError = new Error("Database error");
      const mockLimit = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      // モックチェーンを再設定
      (supabaseModule.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: mockLimit,
      }));

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
      // Supabaseのモックを設定
      const mockOr = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      // モックチェーンを再設定
      (supabaseModule.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: mockOr,
        order: jest.fn().mockReturnThis(),
        limit: mockLimit,
      }));

      // テスト実行
      await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
        includeReadyToRead: true,
      });

      // アサーション
      expect(mockOr).toHaveBeenCalledWith(
        "scheduled_read_at.is.null,and(scheduled_read_at.lt.now())",
      );
    });

    // オプションパラメータのテスト: statusが指定される場合
    it("statusが指定される場合、正しいクエリが構築されること", async () => {
      // Supabaseのモックを設定
      const mockEq = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      // モックチェーンを再設定
      (supabaseModule.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: mockEq,
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: mockLimit,
      }));

      // テスト実行
      await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
        status: "add",
      });

      // アサーション
      expect(mockEq).toHaveBeenCalledWith("user_id", "test-user");
      expect(mockEq).toHaveBeenCalledWith("status", "add");
    });

    // オプションパラメータのテスト: orderByとascendingが指定される場合
    it("orderByとascendingが指定される場合、正しいクエリが構築されること", async () => {
      // Supabaseのモックを設定
      const mockOrder = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      // モックチェーンを再設定
      (supabaseModule.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: mockOrder,
        limit: mockLimit,
      }));

      // テスト実行
      await linkApi.fetchUserLinks({
        userId: "test-user",
        limit: 10,
        orderBy: "added_at",
        ascending: true,
      });

      // アサーション
      expect(mockOrder).toHaveBeenCalledWith("added_at", { ascending: true });
    });
  });
});
