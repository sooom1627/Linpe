export type SwipeDirection = "left" | "right" | "top" | null;

interface SwipeState {
  direction: SwipeDirection;
  activeIndex: number;
  isFinished: boolean;
}

export const swipeHandleService = {
  calculateSwipeDirection: (x: number, y: number): SwipeDirection => {
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 15) {
      return x > 0 ? "right" : "left";
    } else if (y < -15) {
      return "top";
    }
    return null;
  },

  getInitialState: (): SwipeState => ({
    direction: null,
    activeIndex: 0,
    isFinished: false,
  }),

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
};
