import {
  type LinkActionStatus,
  type UpdateLinkActionParams,
  type UpdateLinkActionResponse,
} from "@/feature/links/domain/models/types";
import { linkActionsApi } from "@/feature/links/infrastructure/api/linkActionsApi";

class LinkActionService {
  async updateLinkAction(
    userId: string,
    linkId: string,
    status: LinkActionStatus,
    swipeCount: number,
  ): Promise<UpdateLinkActionResponse> {
    try {
      // パラメータの整形
      const params: UpdateLinkActionParams = {
        userId,
        linkId,
        status,
        swipeCount,
      };

      // APIの呼び出し
      const response = await linkActionsApi.updateLinkAction(params);

      // レスポンスの検証
      if (!response.success) {
        console.error("Failed to update link action:", response.error);
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
