import { ActionType } from "../../../domain/models/ActionLogCount";
import {
  ActionLogCountService,
  type IActionLogCountRepository,
} from "../actionLogCountService";

// リポジトリのモック
const mockRepository: jest.Mocked<IActionLogCountRepository> = {
  getActionLogCount: jest.fn(),
};

describe("ActionLogCountService", () => {
  let service: ActionLogCountService;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    // サービスのインスタンスを作成
    service = new ActionLogCountService(mockRepository);
  });

  describe("getTodayActionLogCount", () => {
    it("正しいパラメータでリポジトリを呼び出すこと", async () => {
      // モックの設定
      mockRepository.getActionLogCount.mockResolvedValueOnce(10); // ADD
      mockRepository.getActionLogCount.mockResolvedValueOnce(20); // SWIPE
      mockRepository.getActionLogCount.mockResolvedValueOnce(30); // READ

      // 日付をモック
      const originalDate = global.Date;
      const mockDate = new Date("2023-01-15");
      global.Date = jest.fn(() => mockDate) as unknown as DateConstructor;

      // テスト実行
      const result = await service.getTodayActionLogCount("test-user");

      // アサーション
      expect(mockRepository.getActionLogCount).toHaveBeenCalledTimes(3);

      // 並列処理では呼び出し順序が保証されないため、各呼び出しが行われたことを検証
      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: "2023-01-15",
        endDate: "2023-01-15",
      });

      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.SWIPE,
        startDate: "2023-01-15",
        endDate: "2023-01-15",
      });

      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.READ,
        startDate: "2023-01-15",
        endDate: "2023-01-15",
      });

      // 結果の検証
      expect(result).toEqual({
        add: 10,
        swipe: 20,
        read: 30,
      });

      // モックをリストア
      global.Date = originalDate;
    });

    it("リポジトリがエラーをスローした場合、エラーをスローすること", async () => {
      // モックの設定
      const testError = new Error("Repository error");
      // Promise.allでは最初にrejectされたPromiseのエラーが返される
      mockRepository.getActionLogCount.mockRejectedValueOnce(testError);
      // 他のリクエストは成功するが、Promise.all全体が失敗するため呼ばれない可能性がある
      mockRepository.getActionLogCount.mockResolvedValueOnce(20);
      mockRepository.getActionLogCount.mockResolvedValueOnce(30);

      // テスト実行とアサーション
      await expect(service.getTodayActionLogCount("test-user")).rejects.toThrow(
        "Repository error",
      );
    });
  });
});
