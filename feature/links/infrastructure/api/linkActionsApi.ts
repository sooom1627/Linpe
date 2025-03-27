import { type PostgrestError } from "@supabase/supabase-js";

import {
  type DeleteLinkActionParams,
  type DeleteLinkActionResponse,
  type UpdateLinkActionParams,
  type UpdateLinkActionResponse,
  type UserLinkActionsRow,
} from "@/feature/links/domain/models/types";
import { getCurrentISOTime } from "@/feature/links/infrastructure/utils/dateUtils";
import supabase from "@/lib/supabase";

class LinkActionsApi {
  /**
   * ユーザーIDとリンクIDの共通バリデーション
   * @param userId ユーザーID
   * @param linkId リンクID
   */
  private static validateCommonParams(userId: string, linkId: string): void {
    if (!userId) throw new Error("userId is required");
    if (!linkId) throw new Error("linkId is required");
  }

  private static validateParams(params: UpdateLinkActionParams): void {
    LinkActionsApi.validateCommonParams(params.userId, params.linkId);

    if (!params.status) throw new Error("status is required");
    if (typeof params.swipeCount !== "number")
      throw new Error("swipeCount must be a number");
    if (
      params.scheduled_read_at !== null &&
      params.scheduled_read_at !== undefined &&
      typeof params.scheduled_read_at !== "string"
    )
      throw new Error("scheduled_read_at must be a string or null");
    if (
      params.read_at !== null &&
      params.read_at !== undefined &&
      typeof params.read_at !== "string"
    )
      throw new Error("read_at must be a string or null");
  }

  /**
   * Supabaseエラーを処理する共通関数（UpdateLinkActionResponse用）
   * @param error Supabaseエラーオブジェクト
   * @param methodName エラーが発生したメソッド名
   * @returns エラーレスポンスオブジェクト
   */
  private handleUpdateSupabaseError(
    error: PostgrestError,
    methodName: string,
  ): UpdateLinkActionResponse {
    console.error(`Supabase error in ${methodName}:`, {
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

  /**
   * Supabaseエラーを処理する共通関数（DeleteLinkActionResponse用）
   * @param error Supabaseエラーオブジェクト
   * @param methodName エラーが発生したメソッド名
   * @returns エラーレスポンスオブジェクト
   */
  private handleDeleteSupabaseError(
    error: PostgrestError,
    methodName: string,
  ): DeleteLinkActionResponse {
    console.error(`Supabase error in ${methodName}:`, {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return {
      success: false,
      error: new Error(error.message),
    };
  }

  async updateLinkAction(
    params: UpdateLinkActionParams,
  ): Promise<UpdateLinkActionResponse> {
    try {
      LinkActionsApi.validateParams(params);

      // 更新対象のデータを準備
      const updateData: {
        status: string;
        updated_at: string;
        swipe_count: number;
        scheduled_read_at?: string | null;
        read_at?: string | null;
        read_count?: number;
        re_read?: boolean;
      } = {
        status: params.status,
        updated_at: getCurrentISOTime(),
        swipe_count: params.swipeCount + 1,
      };

      // scheduled_read_atが指定されている場合のみ更新対象に含める
      if (params.scheduled_read_at !== undefined) {
        updateData.scheduled_read_at = params.scheduled_read_at;
      }

      // read_atが指定されている場合のみ更新対象に含める
      if (params.read_at !== undefined) {
        updateData.read_at = params.read_at;
      }

      // re_readが指定されている場合、更新データに含める
      if (params.re_read !== undefined) {
        updateData.re_read = params.re_read;
      }

      // read_count_incrementフラグが指定されている場合、read_countをインクリメントする
      if (params.read_count_increment) {
        // supabaseのSQL関数を使用してインクリメント
        // 現在のread_countに1を加算するRaw SQL式
        const { data: currentData, error: fetchError } = await supabase
          .from("user_link_actions")
          .select("read_count")
          .eq("link_id", params.linkId)
          .eq("user_id", params.userId)
          .single();

        if (fetchError) {
          return this.handleUpdateSupabaseError(fetchError, "fetchReadCount");
        }

        // 現在のread_countに1を加算
        updateData.read_count = (currentData?.read_count || 0) + 1;
      }

      const { data, error } = await supabase
        .from("user_link_actions")
        .update(updateData)
        .eq("link_id", params.linkId)
        .eq("user_id", params.userId)
        .select()
        .single();

      if (error) {
        return this.handleUpdateSupabaseError(error, "updateLinkAction");
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

  private static validateDeleteParams(params: DeleteLinkActionParams): void {
    LinkActionsApi.validateCommonParams(params.userId, params.linkId);
  }

  async deleteLinkAction(
    params: DeleteLinkActionParams,
  ): Promise<DeleteLinkActionResponse> {
    try {
      LinkActionsApi.validateDeleteParams(params);

      const { error } = await supabase
        .from("user_link_actions")
        .delete()
        .eq("link_id", params.linkId)
        .eq("user_id", params.userId);

      if (error) {
        return this.handleDeleteSupabaseError(error, "deleteLinkAction");
      }

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error("Error in deleteLinkAction:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      };
    }
  }
}

export const linkActionsApi = new LinkActionsApi();
