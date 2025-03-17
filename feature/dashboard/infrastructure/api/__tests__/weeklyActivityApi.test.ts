import supabaseModule from "@/lib/supabase";
import { weeklyActivityRepository } from "../weeklyActivityApi";

// dateUtilsのモック
jest.mock("@/lib/utils/dateUtils", () => ({
  dateUtils: {
    getUTCDateRange: jest.fn().mockImplementation(() => {
      return {
        startUTC: "2023-12-31T15:00:00.000Z",
        endUTC: "2024-01-07T14:59:59.999Z",
      };
    }),
    getUserTimezone: jest.fn().mockReturnValue("mock"),
  },
}));

// モックの型定義
interface MockResponse {
  data: Array<{ changed_at: string; new_status: string }> | null;
  error: Error | null;
}

// モックSupabaseの型定義
interface MockSupabase {
  from: jest.Mock;
  select: jest.Mock;
  eq: jest.Mock;
  gte: jest.Mock;
  lte: jest.Mock;
  __mockResponse: MockResponse;
}

// Supabaseのモック
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

describe("weeklyActivityRepository", () => {
  const mockUserId = "test-user-id";
  const mockStartDate = new Date("2024-01-01");
  const mockEndDate = new Date("2024-01-07");
  let supabase: MockSupabase;

  beforeEach(() => {
    jest.clearAllMocks();

    // モックレスポンスへの参照を更新
    supabase = supabaseModule as unknown as MockSupabase;

    // デフォルトのレスポンスを設定
    supabase.__mockResponse.data = [];
    supabase.__mockResponse.error = null;
  });

  it("正常系: アクティビティログを取得できる", async () => {
    const mockData = [
      { changed_at: "2024-01-01", new_status: "read" },
      { changed_at: "2024-01-02", new_status: "swipe" },
    ];

    // モックレスポンスを設定
    supabase.__mockResponse.data = mockData;

    const result = await weeklyActivityRepository.fetchActivityLogs(
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
      "2023-12-31T15:00:00.000Z",
    );
    expect(supabase.lte).toHaveBeenCalledWith(
      "changed_at",
      "2024-01-07T14:59:59.999Z",
    );
  });

  it("異常系: エラーが発生した場合、エラーをスローする", async () => {
    const mockError = new Error("週間アクティビティの取得に失敗しました");
    supabase.__mockResponse.data = null;
    supabase.__mockResponse.error = mockError;

    await expect(
      weeklyActivityRepository.fetchActivityLogs(
        mockUserId,
        mockStartDate,
        mockEndDate,
      ),
    ).rejects.toThrow("週間アクティビティの取得に失敗しました");
  });

  it("正常系: データが空の場合、空配列を返す", async () => {
    supabase.__mockResponse.data = null;
    supabase.__mockResponse.error = null;

    const result = await weeklyActivityRepository.fetchActivityLogs(
      mockUserId,
      mockStartDate,
      mockEndDate,
    );

    expect(result).toEqual([]);
  });
});
