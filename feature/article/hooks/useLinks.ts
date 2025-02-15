import useSWR from "swr";

import { getTopViewLinks } from "../service/getLinks";
import { type ArticlePreview } from "../types/links";

export const useTopViewLinks = (): {
  links: ArticlePreview[];
  isError: Error | null;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    "top-view-links",
    async () => {
      try {
        return await getTopViewLinks();
      } catch (error) {
        console.error("リンクの取得エラー:", error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    links: data || [],
    isError: error,
    isLoading,
  };
};
