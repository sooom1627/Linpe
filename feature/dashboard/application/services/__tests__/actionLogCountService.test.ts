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
  let originalDate: DateConstructor;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();
    // サービスのインスタンスを作成
    service = new ActionLogCountService(mockRepository);
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
      mockRepository.getActionLogCount.mockResolvedValueOnce(10); // ADD
      mockRepository.getActionLogCount.mockResolvedValueOnce(20); // SWIPE
      mockRepository.getActionLogCount.mockResolvedValueOnce(30); // READ

      // 日付をモック - 簡略化したアプローチ
      const mockDateString = "2023-01-15";
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue(`${mockDateString}T00:00:00.000Z`);

      // テスト実行
      const result = await service.getTodayActionLogCount("test-user");

      // アサーション
      expect(mockRepository.getActionLogCount).toHaveBeenCalledTimes(3);

      // 並列処理では呼び出し順序が保証されないため、各呼び出しが行われたことを検証
      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.ADD,
        startDate: mockDateString,
        endDate: mockDateString,
      });

      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.SWIPE,
        startDate: mockDateString,
        endDate: mockDateString,
      });

      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith({
        userId: "test-user",
        actionType: ActionType.READ,
        startDate: mockDateString,
        endDate: mockDateString,
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
      mockRepository.getActionLogCount.mockRejectedValueOnce(testError);
      // 他のリクエストは成功するが、Promise.all全体が失敗するため呼ばれない可能性がある
      mockRepository.getActionLogCount.mockResolvedValueOnce(20);
      mockRepository.getActionLogCount.mockResolvedValueOnce(30);

      // テスト実行とアサーション
      await expect(service.getTodayActionLogCount("test-user")).rejects.toThrow(
        "アクションログカウントの取得に失敗しました",
      );
    });

    it("ユーザーIDが空文字の場合でも正しく処理されること", async () => {
      // モックの設定
      mockRepository.getActionLogCount.mockResolvedValueOnce(0); // ADD
      mockRepository.getActionLogCount.mockResolvedValueOnce(0); // SWIPE
      mockRepository.getActionLogCount.mockResolvedValueOnce(0); // READ

      // 日付をモック - 簡略化したアプローチ
      const mockDateString = "2023-01-15";
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue(`${mockDateString}T00:00:00.000Z`);

      // 空文字のユーザーIDでテスト実行
      const result = await service.getTodayActionLogCount("");

      // アサーション
      expect(mockRepository.getActionLogCount).toHaveBeenCalledTimes(3);

      // 空文字のユーザーIDが正しく渡されていることを確認
      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "",
          startDate: mockDateString,
          endDate: mockDateString,
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
      mockRepository.getActionLogCount.mockResolvedValueOnce(5); // ADD
      mockRepository.getActionLogCount.mockResolvedValueOnce(10); // SWIPE
      mockRepository.getActionLogCount.mockResolvedValueOnce(15); // READ

      // 日付をモック - 簡略化したアプローチ
      const mockDateString = "2023-01-31";
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue(`${mockDateString}T00:00:00.000Z`);

      // テスト実行
      const result = await service.getTodayActionLogCount("test-user");

      // アサーション
      expect(mockRepository.getActionLogCount).toHaveBeenCalledTimes(3);

      // 月末日が正しく渡されていることを確認
      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: mockDateString,
          endDate: mockDateString,
        }),
      );

      // 結果の検証
      expect(result).toEqual({
        add: 5,
        swipe: 10,
        read: 15,
      });
    });

    it("年末日のケースが正しく処理されること", async () => {
      // モックの設定
      mockRepository.getActionLogCount.mockResolvedValueOnce(7); // ADD
      mockRepository.getActionLogCount.mockResolvedValueOnce(14); // SWIPE
      mockRepository.getActionLogCount.mockResolvedValueOnce(21); // READ

      // 日付をモック - 簡略化したアプローチ
      const mockDateString = "2023-12-31";
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue(`${mockDateString}T00:00:00.000Z`);

      // テスト実行
      const result = await service.getTodayActionLogCount("test-user");

      // アサーション
      expect(mockRepository.getActionLogCount).toHaveBeenCalledTimes(3);

      // 年末日が正しく渡されていることを確認
      expect(mockRepository.getActionLogCount).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: mockDateString,
          endDate: mockDateString,
        }),
      );

      // 結果の検証
      expect(result).toEqual({
        add: 7,
        swipe: 14,
        read: 21,
      });
    });

    it("リポジトリから部分的に失敗した場合、一般化されたエラーをスローすること", async () => {
      // モックの設定 - 2番目のリクエストでエラーが発生する場合
      const testError = new Error("Partial repository error");
      mockRepository.getActionLogCount.mockResolvedValueOnce(5); // 最初は成功
      mockRepository.getActionLogCount.mockRejectedValueOnce(testError); // 2番目は失敗
      mockRepository.getActionLogCount.mockResolvedValueOnce(15); // 3番目は成功するが呼ばれない

      // テスト実行とアサーション
      await expect(service.getTodayActionLogCount("test-user")).rejects.toThrow(
        "アクションログカウントの取得に失敗しました",
      );
    });
  });
});
