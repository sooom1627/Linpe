import { type ViewStyle } from "react-native";
import { withSpring } from "react-native-reanimated";

import { OVERLAY_BACKGROUND_COLORS } from "@/feature/links/domain/constants";
import { type SwipeDirection } from "./types";

export const createBackgroundStyle = (
  swipeDirection: SwipeDirection,
): ViewStyle => {
  const backgroundColor = swipeDirection
    ? OVERLAY_BACKGROUND_COLORS[swipeDirection]
    : "transparent";
  return {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: -10,
    backgroundColor,
    opacity: withSpring(swipeDirection ? 1 : 0),
    zIndex: -10,
  };
};
