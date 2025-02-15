import supabase from "@/lib/supabase";
import { type LinkPreview } from "../types/links";

export const getTopViewLinks = async (): Promise<LinkPreview[]> => {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("id, domain, full_url")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("リンクの取得エラー:", error);
    throw error;
  }
};
