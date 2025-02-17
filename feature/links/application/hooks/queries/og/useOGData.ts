import useSWR from "swr";

import { fetchOGData } from "../../../services/ogService";

export const useOGData = (url: string) => {
  const { data, error, isLoading } = useSWR(
    url ? `og-data-${url}` : null,
    async () => {
      try {
        return await fetchOGData(url);
      } catch (error) {
        console.error("OG情報の取得エラー:", error);
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    ogData: data,
    isError: error,
    isLoading,
  };
};
