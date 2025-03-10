import { type LinkActionStatus } from "@/feature/links/domain/models/types";
import { type SwipeDirection } from "@/feature/links/presentation/interactions/swipe/types";

export interface SwipeState {
  direction: SwipeDirection;
  activeIndex: number;
  isFinished: boolean;
}

export const swipeService = {
  calculateSwipeDirection: (x: number, y: number): SwipeDirection => {
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 15) {
      return x > 0 ? "right" : "left";
    } else if (y < -15) {
      return "top";
    }
    return null;
  },

  getStatusFromDirection: (direction: SwipeDirection): LinkActionStatus => {
    switch (direction) {
      case "left":
        return "Skip";
      case "right":
        return "inWeekend";
      case "top":
        return "Today";
      default:
        return "add";
    }
  },

  handleCardIndexChange: (
    currentIndex: number,
    totalCards: number,
  ): Partial<SwipeState> => {
    const isFinished = currentIndex >= totalCards - 1;
    return {
      activeIndex: currentIndex + 1,
      isFinished,
    };
  },

  getInitialState: (): SwipeState => ({
    direction: null,
    activeIndex: 0,
    isFinished: false,
  }),
};
