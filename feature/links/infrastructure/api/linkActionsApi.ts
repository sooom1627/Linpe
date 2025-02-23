import {
  type UpdateLinkActionParams,
  type UpdateLinkActionResponse,
  type UserLinkActionsRow,
} from "@/feature/links/domain/models/types";
import supabase from "@/lib/supabase";

class LinkActionsApi {
  private static validateParams(params: UpdateLinkActionParams): void {
    if (!params.userId) throw new Error("userId is required");
    if (!params.linkId) throw new Error("linkId is required");
    if (!params.status) throw new Error("status is required");
    if (typeof params.swipeCount !== "number")
      throw new Error("swipeCount must be a number");
    if (
      params.scheduled_read_at !== null &&
      typeof params.scheduled_read_at !== "string"
    )
      throw new Error("scheduled_read_at must be a string or null");
  }

  async updateLinkAction(
    params: UpdateLinkActionParams,
  ): Promise<UpdateLinkActionResponse> {
    try {
      LinkActionsApi.validateParams(params);

      const { data, error } = await supabase
        .from("user_link_actions")
        .update({
          status: params.status,
          updated_at: new Date().toISOString(),
          scheduled_read_at: params.scheduled_read_at,
          swipe_count: params.swipeCount + 1,
        })
        .eq("link_id", params.linkId)
        .eq("user_id", params.userId)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        return {
          success: false,
          data: null,
          error: new Error(error.message),
        };
      }

      return {
        success: true,
        data: data as UserLinkActionsRow,
        error: null,
      };
    } catch (error) {
      console.error("Error in updateLinkAction:", error);
      return {
        success: false,
        data: null,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      };
    }
  }
}

export const linkActionsApi = new LinkActionsApi();
