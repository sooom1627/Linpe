import {
  ActionType,
  type ActionLogCount,
} from "../../domain/models/ActionLogCount";

/**
 * アクションログカウントサービスのインターフェース
 */
export interface IActionLogCountService {
  /**
   * 今日のアクションログカウントを取得する
   * @param userId ユーザーID
   * @returns アクションログカウント
   */
  getTodayActionLogCount(userId: string): Promise<ActionLogCount>;
}

/**
 * アクションログカウントサービスの実装
 */
export class ActionLogCountService implements IActionLogCountService {
  constructor(
    private readonly actionLogCountRepository: IActionLogCountRepository,
  ) {}

  /**
   * 今日のアクションログカウントを取得する
   * @param userId ユーザーID
   * @returns アクションログカウント
   */
  async getTodayActionLogCount(userId: string): Promise<ActionLogCount> {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0]; // YYYY-MM-DD形式
    const endDate = startDate;

    try {
      // 各アクションタイプごとのカウントを取得
      const addCount = await this.actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.ADD,
        startDate,
        endDate,
      });

      const swipeCount = await this.actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.SWIPE,
        startDate,
        endDate,
      });

      const readCount = await this.actionLogCountRepository.getActionLogCount({
        userId,
        actionType: ActionType.READ,
        startDate,
        endDate,
      });

      const result = {
        add: addCount,
        swipe: swipeCount,
        read: readCount,
      };

      return result;
    } catch (error) {
      console.error("アクションログカウントの取得に失敗しました:", error);
      throw error;
    }
  }
}

/**
 * アクションログカウントリポジトリのインターフェース
 */
export interface IActionLogCountRepository {
  /**
   * アクションログのカウントを取得する
   * @param params 検索パラメータ
   * @returns カウント結果
   */
  getActionLogCount(params: {
    userId: string;
    actionType: ActionType;
    startDate?: string;
    endDate?: string;
  }): Promise<number>;
}
