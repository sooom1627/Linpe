import {
  type LinkActionStatus,
  type UpdateLinkActionParams,
  type UpdateLinkActionResponse,
} from "@/feature/links/domain/models/types";
import { linkActionsApi } from "@/feature/links/infrastructure/api/linkActionsApi";
import { calculateScheduledDate } from "@/feature/links/infrastructure/utils/scheduledDateUtils";

class LinkActionService {
  async updateLinkAction(
    userId: string,
    linkId: string,
    status: LinkActionStatus,
    swipeCount: number,
  ): Promise<UpdateLinkActionResponse> {
    try {
      // 基本パラメータの作成
      const baseParams = {
        userId,
        linkId,
        status,
        swipeCount,
      };

      // スケジュール日時の計算と更新パラメータの作成
      // undefinedの場合、APIで更新対象から除外される
      const params: UpdateLinkActionParams = {
        ...baseParams,
        scheduled_read_at:
          status !== "add" && status !== "Read"
            ? calculateScheduledDate(status).toISOString()
            : undefined,
      };

      // APIの呼び出し
      const response = await linkActionsApi.updateLinkAction(params);

      // レスポンスの検証
      if (!response.success || !response.data) {
        console.error("Failed to update link action:", {
          success: response.success,
          error: response.error,
          data: response.data,
          params,
        });
        return response;
      }

      // 成功時の処理
      return response;
    } catch (error) {
      console.error("Error in linkActionService.updateLinkAction:", error);
      return {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error("Unknown error in service layer"),
      };
    }
  }
}

export const linkActionService = new LinkActionService();
