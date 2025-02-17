import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLinkPreview } from "link-preview-js";

import { type OGData } from "../../domain/models/types";

type LinkPreviewResult = {
  title?: string;
  description?: string;
  images: string[];
  favicons?: string[];
  url: string;
};

interface CacheEntry {
  data: OGData;
  timestamp: number;
}

const CACHE_KEY_PREFIX = "og_cache_";
const CACHE_DURATION_MS = 3600 * 1000; // 1時間
const TIMEOUT_MS = 5000;
const ALLOWED_PROTOCOLS = ["http:", "https:"];
const MAX_URL_LENGTH = 2048;

const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return (
      ALLOWED_PROTOCOLS.includes(parsedUrl.protocol) &&
      url.length <= MAX_URL_LENGTH &&
      !parsedUrl.hostname.includes("localhost") &&
      !parsedUrl.hostname.includes("127.0.0.1")
    );
  } catch {
    return false;
  }
};

const timeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), ms),
  );
};

const getCachedData = async (url: string): Promise<OGData | null> => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${url}`;
    const cached = await AsyncStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp }: CacheEntry = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION_MS) {
        return data;
      }
      // キャッシュ期限切れの場合は削除
      await AsyncStorage.removeItem(cacheKey);
    }
    return null;
  } catch (error) {
    console.error("キャッシュの取得に失敗しました:", error);
    return null;
  }
};

const setCachedData = async (url: string, data: OGData): Promise<void> => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${url}`;
    const cacheEntry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error("キャッシュの保存に失敗しました:", error);
  }
};

const sanitizeOGData = (data: OGData): OGData => {
  return {
    title: data.title ? data.title.slice(0, 200) : "",
    description: data.description ? data.description.slice(0, 500) : "",
    image: data.image || "",
    domain: data.domain,
    url: data.url,
  };
};

export const fetchOGData = async (url: string): Promise<OGData | null> => {
  if (!isValidUrl(url)) {
    throw new Error("無効なURLです");
  }

  try {
    // キャッシュをチェック
    const cachedData = await getCachedData(url);
    if (cachedData) {
      return cachedData;
    }

    const options = {
      headers: {
        "User-Agent": "Linpe-App/1.0",
      },
      timeout: TIMEOUT_MS,
    };

    const data = (await Promise.race([
      getLinkPreview(url, options),
      timeout(TIMEOUT_MS),
    ])) as LinkPreviewResult;

    const domain = new URL(url).hostname;

    const ogData: OGData = sanitizeOGData({
      title: data.title || "",
      image: data.images?.[0] || data.favicons?.[0] || "",
      description: data.description,
      domain: domain,
      url: url,
    });

    // 結果をキャッシュに保存
    await setCachedData(url, ogData);

    return ogData;
  } catch (error) {
    if (error instanceof Error) {
      console.error("OGデータの取得に失敗しました:", error.message);
      throw new Error(`OGデータの取得に失敗しました: ${error.message}`);
    }
    throw error;
  }
};
