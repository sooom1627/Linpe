import supabase from "@/lib/supabase";
import { type LinkPreview } from "../types/links";

const parseUrl = (
  url: string,
): { domain: string; parameter: string | null; cleanUrl: string } => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const parameter = urlObj.search || null;

    // パラメーターを除いたURLを生成
    urlObj.search = "";
    const cleanUrl = urlObj.toString();

    return {
      domain,
      parameter,
      cleanUrl,
    };
  } catch (_error) {
    throw new Error("無効なURLです");
    console.error(_error);
  }
};

const checkUrlExists = async (url: string): Promise<boolean> => {
  const { data: existingLink, error: checkError } = await supabase
    .from("links")
    .select("id")
    .eq("full_url", url)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error("リンクの重複チェックに失敗しました");
  }

  return !!existingLink;
};

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

export const addLink = async (url: string) => {
  if (!url) {
    throw new Error("URLが指定されていません");
  }

  try {
    const { domain, parameter, cleanUrl } = parseUrl(url);

    const exists = await checkUrlExists(cleanUrl);
    if (exists) {
      throw new Error("このURLは既に登録されています");
    }

    // 新しいリンクを追加
    const { error: insertError } = await supabase
      .from("links")
      .insert({ full_url: cleanUrl, domain, parameter });

    if (insertError) {
      throw new Error("リンクの追加に失敗しました");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("予期せぬエラーが発生しました");
  }
};
