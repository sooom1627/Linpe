import { getLinkPreview } from "link-preview-js";

type OGData = {
  title: string;
  image: string;
  description?: string;
  domain: string;
};

type LinkPreviewResult = {
  title?: string;
  description?: string;
  images: string[];
  favicons?: string[];
  url: string;
};

export const fetchOGData = async (url: string): Promise<OGData> => {
  try {
    const data = (await getLinkPreview(url)) as LinkPreviewResult;

    const domain = new URL(url).hostname;

    return {
      title: data.title || "",
      image: data.images?.[0] || data.favicons?.[0] || "",
      description: data.description,
      domain: domain,
    };
  } catch (error) {
    console.error("OG情報の取得エラー:", error);
    throw error;
  }
};
