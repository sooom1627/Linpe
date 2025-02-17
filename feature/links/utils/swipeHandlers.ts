import type Swiper from "react-native-deck-swiper";

import type { Card } from "../types/card";

type SwipeDirection = "left" | "right" | "top" | null;

interface SwipeHandlers {
  setSwipeDirection: (direction: SwipeDirection) => void;
  setActiveIndex: (index: number) => void;
  setIsFinished: (isFinished: boolean) => void;
  swiperRef: React.RefObject<Swiper<Card>>;
}

export const createSwipeHandlers = ({
  setSwipeDirection,
  setActiveIndex,
  setIsFinished,
  swiperRef,
}: SwipeHandlers) => {
  const handleSwiping = (x: number, y: number) => {
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 15) {
      setSwipeDirection(x > 0 ? "right" : "left");
    } else if (y < -15) {
      setSwipeDirection("top");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleSwipedAborted = () => {
    setSwipeDirection(null);
  };

  const handleSwiped = (cardIndex: number) => {
    setSwipeDirection(null);
    setActiveIndex(cardIndex + 1);
  };

  const handleSwipedAll = () => {
    setSwipeDirection(null);
    setIsFinished(true);
  };

  const handleTapCard = () => {
    setSwipeDirection(null);
  };

  const handleSwipeButtonPress = (direction: SwipeDirection) => {
    if (!direction) return;
    if (!swiperRef.current) return;

    setSwipeDirection(direction);
    switch (direction) {
      case "left":
        swiperRef.current.swipeLeft();
        break;
      case "right":
        swiperRef.current.swipeRight();
        break;
      case "top":
        swiperRef.current.swipeTop();
        break;
    }
  };

  return {
    handleSwiping,
    handleSwipedAborted,
    handleSwiped,
    handleSwipedAll,
    handleTapCard,
    handleSwipeButtonPress,
  };
};
