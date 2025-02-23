import {
  type Card,
  type OGData,
  type UserLink,
} from "@/feature/links/domain/models/types";

export const cardService = {
  createCards: (
    links: UserLink[],
    dataMap: Record<string, OGData | null>,
  ): Card[] => {
    if (!links || !dataMap) return [];

    return links.map((link, index) => {
      const ogData: OGData | null = dataMap[link.full_url] ?? null;
      const domain = link.full_url
        ? (() => {
            try {
              return new URL(link.full_url).hostname;
            } catch {
              return "no domain";
            }
          })()
        : "no domain";

      return {
        id: index,
        link_id: link.link_id,
        swipe_count: link.swipe_count,
        title: ogData?.title || link.full_url || "no title available",
        description:
          ogData?.description || ogData?.title || "no description available",
        imageUrl: ogData?.image || "",
        domain: domain || "no domain",
        full_url: link.full_url,
      };
    });
  },
};
