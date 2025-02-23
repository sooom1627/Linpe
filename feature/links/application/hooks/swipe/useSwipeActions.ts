import { useCallback } from "react";

import { useLinkAction } from "@/feature/links/application/hooks";
import { swipeService } from "@/feature/links/application/service/swipeService";
import { type Card } from "@/feature/links/domain/models/types";
import { type SwipeDirection } from "@/feature/links/presentation/interactions/swipe/types";

interface UseSwipeActionsProps {
  userId: string | null;
  onDirectionChange: (direction: SwipeDirection) => void;
}

export const useSwipeActions = ({
  userId,
  onDirectionChange,
}: UseSwipeActionsProps) => {
  const { updateLinkAction } = useLinkAction();

  const handleSwiping = useCallback(
    (x: number, y: number) => {
      const direction = swipeService.calculateSwipeDirection(x, y);
      onDirectionChange(direction);
    },
    [onDirectionChange],
  );

  const handleSwipeAborted = useCallback(() => {
    onDirectionChange(null);
  }, [onDirectionChange]);

  const handleSwipeComplete = useCallback(
    async (direction: SwipeDirection, card: Card) => {
      if (!userId || !card) return;

      try {
        const status = swipeService.getStatusFromDirection(direction);
        const response = await updateLinkAction(
          userId,
          card.link_id,
          status,
          card.swipe_count,
        );

        if (!response.success) {
          console.error("Failed to update link action:", response.error);
        }
      } catch (err) {
        console.error("Error in handleSwipeComplete:", err);
      } finally {
        onDirectionChange(null);
      }
    },
    [userId, updateLinkAction, onDirectionChange],
  );

  return {
    handleSwiping,
    handleSwipeAborted,
    handleSwipeComplete,
  };
};
