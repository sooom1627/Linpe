import { withSpring } from "react-native-reanimated";

import { OVERLAY_BACKGROUND_COLORS } from "../../../constants/swipe";

type SwipeDirection = "left" | "right" | "top" | null;

export const createBackgroundStyle = (swipeDirection: SwipeDirection) => {
  const backgroundColor = swipeDirection
    ? OVERLAY_BACKGROUND_COLORS[swipeDirection]
    : "transparent";

  return {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -10,
    backgroundColor,
    opacity: withSpring(swipeDirection ? 1 : 0),
    zIndex: -10,
  } as const;
};
