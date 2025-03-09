import {
  type DeleteLinkActionResponse,
  type LinkActionStatus,
  type UpdateLinkActionParams,
  type UpdateLinkActionResponse,
} from "@/feature/links/domain/models/types";
import { linkActionsApi } from "@/feature/links/infrastructure/api/linkActionsApi";
import { calculateScheduledDate } from "@/feature/links/infrastructure/utils/scheduledDateUtils";

class LinkActionService {
  /**
   * リンクアクションを更新する
   * @deprecated 代わりに updateLinkActionBySwipe または updateLinkActionByReadStatus を使用してください
   * @param userId ユーザーID
   * @param linkId リンクID
   * @param status アクションステータス
   * @param swipeCount スワイプカウント
   * @param read_at 読んだ日時（省略可）
   * @returns 更新結果
   */
  async updateLinkAction(
    userId: string,
    linkId: string,
    status: LinkActionStatus,
    swipeCount: number,
    read_at?: string | null,
  ): Promise<UpdateLinkActionResponse> {
    try {
      // 基本パラメータの作成
      const baseParams = {
        userId,
        linkId,
        status,
        swipeCount,
      };

      // read_atが明示的に指定されていない場合、statusに基づいて自動設定
      // Readingの場合はread_atを更新しない
      const finalReadAt =
        read_at !== undefined
          ? read_at
          : status !== "Reading"
            ? new Date().toISOString()
            : null;

      // スケジュール日時の計算と更新パラメータの作成
      // undefinedの場合、APIで更新対象から除外される
      const params: UpdateLinkActionParams = {
        ...baseParams,
        scheduled_read_at:
          status !== "add" && status !== "Read"
            ? calculateScheduledDate(status).toISOString()
            : undefined,
        read_at: finalReadAt,
      };

      return await this._callUpdateLinkActionApi(params);
    } catch (error) {
      return this._handleServiceError(error, "updateLinkAction");
    }
  }

  /**
   * スワイプ操作によるリンクアクションの更新
   * @param userId ユーザーID
   * @param linkId リンクID
   * @param status スワイプ後のステータス（Today, inWeekend, inMonth）
   * @param swipeCount スワイプカウント
   * @returns 更新結果
   */
  async updateLinkActionBySwipe(
    userId: string,
    linkId: string,
    status: "Today" | "inWeekend" | "inMonth",
    swipeCount: number,
  ): Promise<UpdateLinkActionResponse> {
    try {
      const params: UpdateLinkActionParams = {
        userId,
        linkId,
        status,
        swipeCount,
        scheduled_read_at: calculateScheduledDate(status).toISOString(),
        // read_atは指定しない（undefinedの場合、APIで更新対象から除外される）
      };

      return await this._callUpdateLinkActionApi(params);
    } catch (error) {
      return this._handleServiceError(error, "updateLinkActionBySwipe");
    }
  }

  /**
   * 読書状態によるリンクアクションの更新
   * @param userId ユーザーID
   * @param linkId リンクID
   * @param status 読書状態（Read, Reading, Re-Read, Bookmark）
   * @param swipeCount 現在のスワイプカウント
   * @returns 更新結果
   */
  async updateLinkActionByReadStatus(
    userId: string,
    linkId: string,
    status: "Read" | "Reading" | "Re-Read" | "Bookmark",
    swipeCount: number,
  ): Promise<UpdateLinkActionResponse> {
    try {
      // Readingの場合はread_atを更新しない
      const read_at = status !== "Reading" ? new Date().toISOString() : null;

      const params: UpdateLinkActionParams = {
        userId,
        linkId,
        status,
        swipeCount,
        read_at,
        // Read状態の場合はscheduled_read_atを設定しない
        scheduled_read_at:
          status !== "Read"
            ? calculateScheduledDate(status).toISOString()
            : undefined,
      };

      return await this._callUpdateLinkActionApi(params);
    } catch (error) {
      return this._handleServiceError(error, "updateLinkActionByReadStatus");
    }
  }

  /**
   * リンクアクション更新APIの共通呼び出し処理
   * @param params 更新パラメータ
   * @returns API応答
   * @private
   */
  private async _callUpdateLinkActionApi(
    params: UpdateLinkActionParams,
  ): Promise<UpdateLinkActionResponse> {
    const response = await linkActionsApi.updateLinkAction(params);

    // レスポンスの検証
    if (!response.success || !response.data) {
      console.error("Failed to update link action:", {
        success: response.success,
        error: response.error,
        data: response.data,
        params,
      });
    }

    return response;
  }

  /**
   * サービス層のエラーハンドリング共通処理
   * @param error 発生したエラー
   * @param methodName エラーが発生したメソッド名
   * @returns エラーレスポンス
   * @private
   */
  private _handleServiceError(
    error: unknown,
    methodName: string,
  ): UpdateLinkActionResponse {
    console.error(`Error in linkActionService.${methodName}:`, error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error(`Unknown error in service layer (${methodName})`),
    };
  }

  async deleteLinkAction(
    userId: string,
    linkId: string,
  ): Promise<DeleteLinkActionResponse> {
    try {
      // APIの呼び出し
      const response = await linkActionsApi.deleteLinkAction({
        userId,
        linkId,
      });

      // レスポンスの検証
      if (!response.success) {
        console.error("Failed to delete link action:", {
          success: response.success,
          error: response.error,
          params: { userId, linkId },
        });
      }

      // 成功時の処理
      return response;
    } catch (error) {
      console.error("Error in linkActionService.deleteLinkAction:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Unknown error in service layer"),
      };
    }
  }
}

export const linkActionService = new LinkActionService();
