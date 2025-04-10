import { useCallback } from "react";

import { swipeService } from "@/feature/links/application/service/swipeService";
import { type Card } from "@/feature/links/domain/models/types";
import { type SwipeDirection } from "@/feature/links/presentation/interactions/swipe/types";
import { useLinkAction } from "../link/useLinkAction";

interface UseSwipeActionsProps {
  userId: string | null;
  onDirectionChange: (direction: SwipeDirection) => void;
}

export const useSwipeActions = ({
  userId,
  onDirectionChange,
}: UseSwipeActionsProps) => {
  const { updateLinkActionBySwipe } = useLinkAction();

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

        // スワイプステータス（Today, inWeekend, Skip）の場合のみ処理
        if (status === "Today" || status === "inWeekend" || status === "Skip") {
          const response = await updateLinkActionBySwipe(
            userId,
            card.link_id,
            status,
            card.swipe_count,
          );

          if (!response.success) {
            console.error("Failed to update link action:", response.error);
          }
        }
        // addステータスは処理しない（addステータスはaddLinkAndUserでのみ使用される）
      } catch (err) {
        console.error("Error in handleSwipeComplete:", err);
      } finally {
        onDirectionChange(null);
      }
    },
    [userId, updateLinkActionBySwipe, onDirectionChange],
  );

  return {
    handleSwiping,
    handleSwipeAborted,
    handleSwipeComplete,
  };
};
