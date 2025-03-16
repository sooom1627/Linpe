import supabaseModule from "@/lib/supabase";
import { WeeklyActivityRepository } from "../weeklyActivityApi";

// モックSupabaseの型定義
type MockSupabase = {
  from: jest.Mock;
  select: jest.Mock;
  eq: jest.Mock;
  gte: jest.Mock;
  lte: jest.Mock;
  __mockResponse: {
    data: Array<{ changed_at: string; new_status: string }> | null;
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
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockImplementation(() => mockResponse),
  };

  // テスト内からモックレスポンスを変更できるようにする
  return {
    ...mockSupabase,
    __mockResponse: mockResponse,
  };
});

describe("WeeklyActivityRepository", () => {
  let repository: WeeklyActivityRepository;
  let supabase: MockSupabase;
  const mockUserId = "test-user-id";
  const mockStartDate = new Date("2024-01-01");
  const mockEndDate = new Date("2024-01-07");

  beforeEach(() => {
    repository = new WeeklyActivityRepository();
    jest.clearAllMocks();

    // モックレスポンスへの参照を更新
    supabase = supabaseModule as unknown as MockSupabase;

    // デフォルトのレスポンスを設定
    supabase.__mockResponse.data = [];
    supabase.__mockResponse.error = null;
  });

  describe("fetchActivityLogs", () => {
    it("正常系: アクティビティログを取得できること", async () => {
      const mockData = [
        { changed_at: "2024-01-01T10:00:00Z", new_status: "added" },
        { changed_at: "2024-01-02T15:00:00Z", new_status: "read" },
      ];

      // モックレスポンスを設定
      supabase.__mockResponse.data = mockData;

      const result = await repository.fetchActivityLogs(
        mockUserId,
        mockStartDate,
        mockEndDate,
      );

      expect(result).toEqual(mockData);
      expect(supabase.from).toHaveBeenCalledWith("user_link_actions_log");
      expect(supabase.select).toHaveBeenCalledWith("changed_at, new_status");
      expect(supabase.eq).toHaveBeenCalledWith("user_id", mockUserId);
      expect(supabase.gte).toHaveBeenCalledWith(
        "changed_at",
        mockStartDate.toISOString(),
      );
      expect(supabase.lte).toHaveBeenCalledWith(
        "changed_at",
        mockEndDate.toISOString(),
      );
    });

    it("異常系: エラー発生時に例外をスローすること", async () => {
      // エラーをモック
      const mockError = new Error("Database error");
      supabase.__mockResponse.data = null;
      supabase.__mockResponse.error = mockError;

      await expect(
        repository.fetchActivityLogs(mockUserId, mockStartDate, mockEndDate),
      ).rejects.toThrow("週間アクティビティの取得に失敗しました");
    });

    it("日付範囲が正しく設定されること", async () => {
      await repository.fetchActivityLogs(
        mockUserId,
        mockStartDate,
        mockEndDate,
      );

      expect(supabase.gte).toHaveBeenCalledWith(
        "changed_at",
        mockStartDate.toISOString(),
      );
      expect(supabase.lte).toHaveBeenCalledWith(
        "changed_at",
        mockEndDate.toISOString(),
      );
    });
  });
});
