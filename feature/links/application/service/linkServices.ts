import { type Session } from "@supabase/supabase-js";

import { type LinkPreview } from "@/feature/links/domain/models/types";
import { linkApi } from "@/feature/links/infrastructure/api";
import { parseUrl } from "@/feature/links/infrastructure/utils";

export const getLinksPreview = async (
  limit: number = 5,
): Promise<LinkPreview[]> => {
  try {
    const data = await linkApi.fetchLinks(limit);

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
): Promise<{ status: "registered" | "already_registered" }> {
  if (!url) {
    throw new Error("URL is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const { domain, parameter, cleanUrl } = parseUrl(url);

  try {
    return await linkApi.createLinkAndUser({
      domain,
      full_url: cleanUrl,
      parameter: parameter ?? "",
      userId: userId as string,
    });
  } catch (error) {
    console.error("リンクの追加エラー:", error);
    throw error;
  }
}
