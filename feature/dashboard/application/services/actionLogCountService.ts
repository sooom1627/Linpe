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
    // タイムゾーンを考慮した日付処理
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = today.toISOString().split("T")[0]; // YYYY-MM-DD形式
    const endDate = startDate;

    try {
      // 並列処理で各アクションタイプごとのカウントを取得
      const actionTypes = [ActionType.ADD, ActionType.SWIPE, ActionType.READ];
      const counts = await Promise.all(
        actionTypes.map((actionType) =>
          this.actionLogCountRepository.getActionLogCount({
            userId,
            actionType,
            startDate,
            endDate,
          }),
        ),
      );

      const [addCount, swipeCount, readCount] = counts;

      const result = {
        add: addCount,
        swipe: swipeCount,
        read: readCount,
      };

      return result;
    } catch (error) {
      console.error("アクションログカウントの取得に失敗しました:", error);
      // 詳細なエラー情報をログに残しつつ、ユーザーに表示するエラーは一般化
      throw new Error("アクションログカウントの取得に失敗しました");
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
