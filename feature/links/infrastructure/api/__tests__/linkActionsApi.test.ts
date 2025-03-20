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

    it("read_count_incrementがtrueの場合、read_countを現在の値から1増加させること", async () => {
      // 準備
      const mockCurrentData = { read_count: 5 };

      // 最初のデータ取得用のモック
      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockReturnValue({ data: mockCurrentData, error: null }),
      };

      // 更新用のモック
      const mockUpdateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockReturnValue({ data: { id: 1, read_count: 6 }, error: null }),
      };

      // fromの呼び出しで異なるチェーンを返す
      supabase.from = jest
        .fn()
        .mockImplementationOnce(() => mockSelectChain)
        .mockImplementationOnce(() => mockUpdateChain);

      // read_count_incrementフラグを含むパラメータ
      const paramsWithIncrement: UpdateLinkActionParams = {
        ...validParams,
        read_count_increment: true,
      };

      // 実行
      const result = await linkActionsApi.updateLinkAction(paramsWithIncrement);

      // 検証
      // 最初のfrom呼び出しでread_countを取得
      expect(supabase.from).toHaveBeenNthCalledWith(1, "user_link_actions");
      expect(mockSelectChain.select).toHaveBeenCalledWith("read_count");
      expect(mockSelectChain.eq).toHaveBeenCalledWith(
        "link_id",
        "test-link-id",
      );
      expect(mockSelectChain.eq).toHaveBeenCalledWith(
        "user_id",
        "test-user-id",
      );

      // 2回目のfrom呼び出しで更新
      expect(supabase.from).toHaveBeenNthCalledWith(2, "user_link_actions");
      expect(mockUpdateChain.update).toHaveBeenCalledWith(
        expect.objectContaining({
          read_count: 6, // 5 + 1
        }),
      );

      // 成功レスポンス
      expect(result.success).toBe(true);
    });

    it("read_count_incrementフラグがない場合、read_countは更新されないこと", async () => {
      // 準備
      // 更新用のモック
      const mockUpdateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: { id: 1 }, error: null }),
      };

      supabase.from = jest.fn().mockReturnValue(mockUpdateChain);

      // read_count_incrementフラグを含まないパラメータ
      const params: UpdateLinkActionParams = {
        ...validParams,
      };

      // 実行
      await linkActionsApi.updateLinkAction(params);

      // 検証
      // fromは1回だけ呼び出される
      expect(supabase.from).toHaveBeenCalledTimes(1);
      expect(supabase.from).toHaveBeenCalledWith("user_link_actions");

      // updateの呼び出しでread_countが含まれていないことを確認
      const updateArg = mockUpdateChain.update.mock.calls[0][0];
      expect(updateArg).not.toHaveProperty("read_count");
    });

    it("read_count_incrementフラグがtrueでもデータ取得エラーが発生した場合、エラーを返すこと", async () => {
      // 準備
      const mockError = {
        code: "23505",
        message: "データ取得に失敗しました",
        details: "詳細エラー",
        hint: "ヒント",
        name: "Error",
      };

      // データ取得エラーのモック
      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({ data: null, error: mockError }),
      };

      supabase.from = jest.fn().mockReturnValue(mockSelectChain);

      // read_count_incrementフラグを含むパラメータ
      const paramsWithIncrement: UpdateLinkActionParams = {
        ...validParams,
        read_count_increment: true,
      };

      // 実行
      const result = await linkActionsApi.updateLinkAction(paramsWithIncrement);

      // 検証
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe("データ取得に失敗しました");
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
