import { linkActionsApi } from "@/feature/links/infrastructure/api/linkActionsApi";

export const linkActionService = {
  updateLinkAction: async (
    userId: string,
    linkId: string,
    status: "add" | "inMonth" | "inWeekend" | "Today" | "Read",
    swipeCount: number,
  ) => {
    try {
      const result = await linkActionsApi.updateLinkAction({
        userId,
        linkId,
        status,
        swipeCount,
      });
      return result;
    } catch (error) {
      console.error("Error updating link action:", error);
      throw error;
    }
  },
};
