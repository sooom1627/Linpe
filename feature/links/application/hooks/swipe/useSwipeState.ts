import { useState } from "react";

import {
  swipeService,
  type SwipeState,
} from "@/feature/links/application/service/swipeService";
import { type SwipeDirection } from "@/feature/links/presentation/interactions/swipe/types";

export const useSwipeState = () => {
  const [state, setState] = useState<SwipeState>(
    swipeService.getInitialState(),
  );

  const setDirection = (direction: SwipeDirection) => {
    setState((prev) => ({ ...prev, direction }));
  };

  const handleCardIndexChange = (currentIndex: number, totalCards: number) => {
    const newState = swipeService.handleCardIndexChange(
      currentIndex,
      totalCards,
    );
    setState((prev) => ({ ...prev, ...newState }));
  };

  const resetState = () => {
    setState(swipeService.getInitialState());
  };

  return {
    ...state,
    setDirection,
    handleCardIndexChange,
    resetState,
  };
};
