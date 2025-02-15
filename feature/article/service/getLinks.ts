import supabase from "@/lib/supabase";
import { type ArticlePreview } from "../types/links";

export const getLinks = async (): Promise<ArticlePreview[]> => {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("id, domain, full_url")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("リンクの取得エラー:", error);
    throw error;
  }
};
