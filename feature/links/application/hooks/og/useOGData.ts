import { useMemo } from "react";
import useSWR from "swr";

import { fetchOGData } from "../../service/ogService";

export const useOGData = (url: string) => {
  const memoizedFetchOGData = useMemo(() => {
    return async () => await fetchOGData(url);
  }, [url]);

  const { data, error, isLoading } = useSWR(
    url ? `og-data-${url}` : null,
    async () => {
      try {
        return await memoizedFetchOGData();
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
