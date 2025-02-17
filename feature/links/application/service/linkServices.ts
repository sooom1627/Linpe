import { type Session } from "@supabase/supabase-js";

import { type LinkPreview } from "@/feature/links/domain/models/types";
import { parseUrl } from "@/feature/links/infrastructure/utils";
import supabase from "@/lib/supabase";

export const getLinksPreview = async (
  limit: number = 5,
): Promise<LinkPreview[]> => {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("id, full_url")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    if (!data) {
      console.warn(
        "リンクのデータが取得できませんでした。空の配列を返します。",
      );
      return [];
    }

    return data;
  } catch (error) {
    console.error("リンクの取得エラー:", error);
    throw error;
  }
};

export async function addLinkAndUser(
  url: string,
  userId: Session["user"]["id"],
): Promise<string> {
  if (!url) {
    throw new Error("URL is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const { domain, parameter, cleanUrl } = parseUrl(url);

  const { data, error } = await supabase.rpc("add_link_and_user", {
    p_domain: domain,
    p_full_url: cleanUrl,
    p_parameter: parameter,
    p_user_id: userId,
  });

  if (error) {
    console.error("リンクとユーザー情報の登録に失敗しました:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to add link");
  }

  return data;
}
