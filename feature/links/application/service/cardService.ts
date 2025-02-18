import {
  type Card,
  type LinkPreview,
  type OGData,
} from "@/feature/links/domain/models/types";

export const cardService = {
  createCards: (
    links: LinkPreview[],
    dataMap: Record<string, OGData | null>,
  ): Card[] => {
    if (!links || !dataMap) return [];

    return links.map((link, index) => {
      const ogData: OGData | null = dataMap[link.full_url] ?? null;
      const domain = link.full_url ? new URL(link.full_url).hostname : "";
      return {
        id: index,
        title: ogData?.title || link.full_url || "no title available",
        description:
          ogData?.description || ogData?.title || "no description available",
        imageUrl: ogData?.image || "",
        domain,
        full_url: link.full_url,
      };
    });
  },
};
