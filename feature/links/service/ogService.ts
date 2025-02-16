import { getLinkPreview } from "link-preview-js";

import { type OGData } from "../types/links";

type LinkPreviewResult = {
  title?: string;
  description?: string;
  images: string[];
  favicons?: string[];
  url: string;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const TIMEOUT_MS = 5000;
const CACHE_DURATION_SECONDS = 3600; // 1時間

const timeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), ms),
  );
};

export const fetchOGData = async (url: string): Promise<OGData | null> => {
  if (!isValidUrl(url)) {
    return null;
  }

  try {
    const options = {
      headers: {
        "Cache-Control": `max-age=${CACHE_DURATION_SECONDS}`,
      },
      timeout: TIMEOUT_MS,
    };

    const data = (await Promise.race([
      getLinkPreview(url, options),
      timeout(TIMEOUT_MS),
    ])) as LinkPreviewResult;

    const domain = new URL(url).hostname;

    return {
      title: data.title || "",
      image: data.images?.[0] || data.favicons?.[0] || "",
      description: data.description,
      domain: domain,
      url: url,
    };
  } catch (error) {
    console.error("Error fetching OG data:", error);
    return null;
  }
};
