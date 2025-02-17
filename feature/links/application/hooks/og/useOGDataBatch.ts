import { useMemo } from "react";
import useSWR from "swr";

import { type OGData } from "../../../domain/models/types";
import { fetchOGData } from "../../../service/ogService";

type OGDataMap = {
  [key: string]: OGData | null;
};

export const useOGDataBatch = (urls: string[]) => {
  const urlsKey = useMemo(() => urls.sort().join(","), [urls]);
  const cacheKey = urls.length > 0 ? ["og-data", urlsKey] : null;

  const {
    data: dataMap,
    error,
    isLoading,
    mutate,
  } = useSWR<OGDataMap>(
    cacheKey,
    async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          try {
            const data = await fetchOGData(url);
            return data ? { ...data, url } : null;
          } catch (e) {
            console.error(`Error fetching OG data for ${url}:`, e);
            return null;
          }
        }),
      );

      const newMap: OGDataMap = {};
      urls.forEach((url, index) => {
        newMap[url] = results[index];
      });

      return newMap;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000, // 1時間キャッシュ
    },
  );

  return {
    dataMap: dataMap || {},
    loading: isLoading,
    error,
    revalidate: () => mutate(), // 手動で再取得するための関数を追加
  };
};
