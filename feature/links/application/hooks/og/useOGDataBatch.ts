import { useMemo } from "react";
import useSWR from "swr";

import { type OGData } from "../../../domain/models/types";
import { LINK_CACHE_KEYS } from "../../cache/linkCacheKeys";
import { fetchOGData } from "../../service/ogService";

type OGDataMap = {
  [key: string]: OGData | null;
};

export const useOGDataBatch = (urls: string[]) => {
  const urlsKey = useMemo(() => urls.sort().join(","), [urls]);

  // 入力値のバリデーション
  const validationError = useMemo(() => {
    if (!Array.isArray(urls)) {
      return new Error("Invalid input: urls must be an array");
    }

    // URLの形式チェック
    const invalidUrls = urls.filter((url) => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      return new Error(`Invalid URLs detected: ${invalidUrls.join(", ")}`);
    }

    return null;
  }, [urls]);

  const cacheKey = validationError
    ? null
    : urls.length > 0
      ? LINK_CACHE_KEYS.OG_DATA(urlsKey)
      : null;

  const {
    data: dataMap,
    error: swrError,
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
      revalidateIfStale: false,
      dedupingInterval: 30 * 24 * 3600 * 1000, // 30日間
    },
  );

  if (validationError) {
    console.error("useOGDataBatch:", validationError.message);
  }

  return {
    dataMap: dataMap || {},
    loading: isLoading,
    error: validationError || swrError,
    revalidate: () => mutate(),
  };
};
