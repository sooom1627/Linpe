import { dateUtils } from "@/lib/utils/dateUtils";
import { ActionType } from "../../../domain/models/ActionLogCount";
import { actionLogCountService } from "../actionLogCountService";

// リポジトリのモック
jest.mock("../../../infrastructure/api/actionLogCountApi", () => ({
  actionLogCountRepository: {
    getActionLogCount: jest.fn(),
  },
}));

// dateUtilsのモック
jest.mock("@/lib/utils/dateUtils", () => ({
  dateUtils: {
    getLocalDate: jest.fn().mockImplementation(() => new Date("2023-01-15")),
    getDateRangeForFetch: jest.fn().mockImplementation(() => ({
      startUTC: "2023-01-15T00:00:00.000Z",
      endUTC: "2023-01-15T23:59:59.999Z",
      timezone: "mock",
    })),
    getUserTimezone: jest.fn().mockReturnValue("mock"),
  },
}));

// モックされたリポジトリをインポート
const { actionLogCountRepository } = jest.requireMock(
  "../../../infrastructure/api/actionLogCountApi",
);

describe("actionLogCountService", () => {
  let originalDate: DateConstructor;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    // 元のDateコンストラクタを保存
    originalDate = global.Date;
  });

  afterEach(() => {
    // テスト後にDateをリストア
    global.Date = originalDate;
  });

  describe("getTodayActionLogCount", () => {
    it("正しいパラメータでリポジトリを呼び出すこと", async () => {
      // モックの設定
      actionLogCountRepository.getActionLogCount
        .mockResolvedValueOnce(10) // ADD
        .mockResolvedValueOnce(20) // SWIPE
        .mockResolvedValueOnce(30); // READ

      // テスト実行
      const result =
        await actionLogCountService.getTodayActionLogCount("test-user");

      // アサーション
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledTimes(
        3,
      );

      // 並列処理では呼び出し順序が保証されないため、各呼び出しが行われたことを検証
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: "2023-01-15T00:00:00.000Z",
        endDate: "2023-01-15T23:59:59.999Z",
      });

      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.SWIPE,
        startDate: "2023-01-15T00:00:00.000Z",
        endDate: "2023-01-15T23:59:59.999Z",
      });

      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.READ,
        startDate: "2023-01-15T00:00:00.000Z",
        endDate: "2023-01-15T23:59:59.999Z",
      });

      // 結果の検証
      expect(result).toEqual({
        add: 10,
        swipe: 20,
        read: 30,
      });
    });

    it("リポジトリがエラーをスローした場合、一般化されたエラーをスローすること", async () => {
      // モックの設定
      const testError = new Error("Repository error");
      // Promise.allでは最初にrejectされたPromiseのエラーが返される
      actionLogCountRepository.getActionLogCount.mockRejectedValueOnce(
        testError,
      );
      // 他のリクエストは成功するが、Promise.all全体が失敗するため呼ばれない可能性がある
      actionLogCountRepository.getActionLogCount.mockResolvedValueOnce(20);
      actionLogCountRepository.getActionLogCount.mockResolvedValueOnce(30);

      // テスト実行とアサーション
      await expect(
        actionLogCountService.getTodayActionLogCount("test-user"),
      ).rejects.toThrow("アクションログカウントの取得に失敗しました");
    });

    it("ユーザーIDが空文字の場合でも正しく処理されること", async () => {
      // モックの設定
      actionLogCountRepository.getActionLogCount
        .mockResolvedValueOnce(0) // ADD
        .mockResolvedValueOnce(0) // SWIPE
        .mockResolvedValueOnce(0); // READ

      // 空文字のユーザーIDでテスト実行
      const result = await actionLogCountService.getTodayActionLogCount("");

      // アサーション
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledTimes(
        3,
      );

      // 空文字のユーザーIDが正しく渡されていることを確認
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "",
          startDate: "2023-01-15T00:00:00.000Z",
          endDate: "2023-01-15T23:59:59.999Z",
        }),
      );

      // 結果の検証
      expect(result).toEqual({
        add: 0,
        swipe: 0,
        read: 0,
      });
    });

    it("月末日のケースが正しく処理されること", async () => {
      // モックの設定
      actionLogCountRepository.getActionLogCount
        .mockResolvedValueOnce(5) // ADD
        .mockResolvedValueOnce(10) // SWIPE
        .mockResolvedValueOnce(15); // READ

      // dateUtilsのモックを月末日用に上書き
      (dateUtils.getLocalDate as jest.Mock).mockReturnValueOnce(
        new Date("2023-01-31"),
      );
      (dateUtils.getDateRangeForFetch as jest.Mock).mockReturnValueOnce({
        startUTC: "2023-01-31T00:00:00.000Z",
        endUTC: "2023-01-31T23:59:59.999Z",
        timezone: "mock",
      });

      // テスト実行
      const result =
        await actionLogCountService.getTodayActionLogCount("test-user");

      // アサーション
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledTimes(
        3,
      );

      // 月末日が正しく渡されていることを確認
      expect(actionLogCountRepository.getActionLogCount).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: "2023-01-31T00:00:00.000Z",
          endDate: "2023-01-31T23:59:59.999Z",
        }),
      );

      // 結果の検証
      expect(result).toEqual({
        add: 5,
        swipe: 10,
        read: 15,
      });
    });

    it("リポジトリから部分的に失敗した場合、一般化されたエラーをスローすること", async () => {
      // モックの設定 - 2番目のリクエストでエラーが発生する場合
      const testError = new Error("Partial repository error");
      actionLogCountRepository.getActionLogCount
        .mockResolvedValueOnce(5) // 最初は成功
        .mockRejectedValueOnce(testError) // 2番目は失敗
        .mockResolvedValueOnce(15); // 3番目は成功するが呼ばれない

      // テスト実行とアサーション
      await expect(
        actionLogCountService.getTodayActionLogCount("test-user"),
      ).rejects.toThrow("アクションログカウントの取得に失敗しました");
    });
  });
});
