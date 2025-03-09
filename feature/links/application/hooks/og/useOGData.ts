import { useMemo } from "react";
import useSWR from "swr";

import { LINK_CACHE_KEYS } from "../../cache/linkCacheKeys";
import { fetchOGData } from "../../service/ogService";

export const useOGData = (url: string) => {
  const memoizedFetchOGData = useMemo(() => {
    return async () => await fetchOGData(url);
  }, [url]);

  const { data, error, isLoading } = useSWR(
    url ? LINK_CACHE_KEYS.OG_DATA(url) : null,
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
      revalidateIfStale: false,
      dedupingInterval: 30 * 24 * 3600 * 1000, // 30日間
    },
  );

  return {
    ogData: data,
    isError: error,
    isLoading,
  };
};
