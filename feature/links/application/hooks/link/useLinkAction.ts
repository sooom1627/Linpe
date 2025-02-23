import { useState } from "react";

import { type LinkActionStatus } from "@/feature/links/domain/models/types";
import { linkActionService } from "../../service/linkActionService";

export const useLinkAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateLinkAction = async (
    userId: string,
    linkId: string,
    status: LinkActionStatus,
    swipeCount: number,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await linkActionService.updateLinkAction(
        userId,
        linkId,
        status,
        swipeCount,
      );
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred"),
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateLinkAction,
    isLoading,
    error,
  };
};
