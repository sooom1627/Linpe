import type {
  DeleteLinkActionParams,
  LinkActionStatus,
  UpdateLinkActionParams,
} from "@/feature/links/domain/models/types";
import supabaseModule from "@/lib/supabase";
import { linkActionsApi } from "../linkActionsApi";

// モックSupabaseの型定義
type MockSupabase = {
  from: jest.Mock;
  delete: jest.Mock;
  update: jest.Mock;
  select: jest.Mock;
  single: jest.Mock;
  eq: jest.Mock;
  __mockResponse: {
    data: unknown | null;
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
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnValue(mockResponse),
    eq: jest.fn().mockImplementation(() => {
      // 2回目のeq呼び出し後にモックレスポンスを返す
      if (mockSupabase.eq.mock.calls.length % 2 === 0) {
        return mockResponse;
      }
      return mockSupabase;
    }),
    __mockResponse: mockResponse,
  };

  return mockSupabase;
});

describe("linkActionsApi", () => {
  // supabaseモジュールへの参照
  let supabase: MockSupabase;

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
    supabase = supabaseModule as unknown as MockSupabase;
    supabase.__mockResponse.data = null;
    supabase.__mockResponse.error = null;
  });

  // updateLinkActionのテストを追加
  describe("updateLinkAction", () => {
    const validParams: UpdateLinkActionParams = {
      userId: "test-user-id",
      linkId: "test-link-id",
      status: "Read" as LinkActionStatus,
      swipeCount: 1,
      read_at: new Date().toISOString(),
    };

    it("read_count_incrementがtrueの場合、read_countを更新すること", async () => {
      // 準備
      const mockCurrentData = { read_count: 5 };
      supabase.__mockResponse.data = mockCurrentData;
      supabase.__mockResponse.error = null;

      // モックがクリーンに動作するように設定
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockReturnValue({ data: mockCurrentData, error: null });

      // 2回目のfromの呼び出しでは異なる結果を返す
      supabase.from
        .mockImplementationOnce(() => {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest
              .fn()
              .mockReturnValue({ data: mockCurrentData, error: null }),
          };
        })
        .mockImplementationOnce(() => {
          return {
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnValue({ data: { id: 1 }, error: null }),
          };
        });

      // read_count_incrementフラグを含むパラメータ
      const paramsWithIncrement: UpdateLinkActionParams = {
        ...validParams,
        read_count_increment: true,
      };

      // 実行
      await linkActionsApi.updateLinkAction(paramsWithIncrement);

      // 基本的な検証
      expect(supabase.from).toHaveBeenCalledWith("user_link_actions");
    });
  });

  describe("deleteLinkAction", () => {
    // 有効なパラメータ
    const validParams: DeleteLinkActionParams = {
      userId: "test-user-id",
      linkId: "test-link-id",
    };

    beforeEach(() => {
      // モックの挙動を初期化
      supabase.from = jest.fn().mockReturnThis();
      supabase.delete = jest.fn().mockReturnThis();
      supabase.eq = jest.fn().mockImplementation(() => {
        // 2回目のeq呼び出し後にモックレスポンスを返す
        if (supabase.eq.mock.calls.length % 2 === 0) {
          return supabase.__mockResponse;
        }
        return supabase;
      });
    });

    it("正しいパラメータでSupabaseのdeleteメソッドを呼び出すこと", async () => {
      // 準備
      supabase.__mockResponse.error = null;

      // 実行
      await linkActionsApi.deleteLinkAction(validParams);

      // 検証
      expect(supabase.from).toHaveBeenCalledWith("user_link_actions");
      expect(supabase.delete).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith("link_id", "test-link-id");
      expect(supabase.eq).toHaveBeenCalledWith("user_id", "test-user-id");
    });

    it("削除が成功した場合、success: trueを返すこと", async () => {
      // 準備
      supabase.__mockResponse.error = null;

      // 実行
      const result = await linkActionsApi.deleteLinkAction(validParams);

      // 検証
      expect(result).toEqual({
        success: true,
        error: null,
      });
    });

    it("Supabaseからエラーが返された場合、success: falseとエラーを返すこと", async () => {
      // 準備
      const mockError = {
        code: "23505",
        message: "削除に失敗しました",
        details: "詳細エラー",
        hint: "ヒント",
        name: "Error",
      };
      supabase.__mockResponse.error = mockError;

      // 実行
      const result = await linkActionsApi.deleteLinkAction(validParams);

      // 検証
      expect(result).toEqual({
        success: false,
        error: new Error("削除に失敗しました"),
      });
    });

    it("userIdが指定されていない場合、エラーをスローすること", async () => {
      // 準備
      const invalidParams = {
        linkId: "test-link-id",
      } as DeleteLinkActionParams;

      // 実行と検証
      await expect(
        linkActionsApi.deleteLinkAction(invalidParams),
      ).resolves.toEqual({
        success: false,
        error: new Error("userId is required"),
      });
    });

    it("linkIdが指定されていない場合、エラーをスローすること", async () => {
      // 準備
      const invalidParams = {
        userId: "test-user-id",
      } as DeleteLinkActionParams;

      // 実行と検証
      await expect(
        linkActionsApi.deleteLinkAction(invalidParams),
      ).resolves.toEqual({
        success: false,
        error: new Error("linkId is required"),
      });
    });

    it("予期しない例外が発生した場合、success: falseとエラーを返すこと", async () => {
      // 準備
      supabase.from.mockImplementationOnce(() => {
        throw new Error("予期しないエラー");
      });

      // 実行
      const result = await linkActionsApi.deleteLinkAction(validParams);

      // 検証
      expect(result).toEqual({
        success: false,
        error: new Error("予期しないエラー"),
      });
    });
  });
});
