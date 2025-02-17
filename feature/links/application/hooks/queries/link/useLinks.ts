import { getLinksPreview } from "feature/links/application/services";
import { type LinkPreview } from "feature/links/types/links";
import useSWR from "swr";

type Purpose = "top-view" | "swipe";

export const useGetLinks = (
  limit: number = 5,
  purpose: Purpose = "top-view",
): {
  links: LinkPreview[];
  isError: Error | null;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR(
    [`links-${purpose}`, limit],
    async () => {
      try {
        return await getLinksPreview(limit);
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
