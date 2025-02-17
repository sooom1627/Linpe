import { View } from "react-native";
import Animated, { withSpring } from "react-native-reanimated";

import { SwipeLikeIcon } from "@/components/icons/SwipeLikeIcon";
import { SwipeSkipIcon } from "@/components/icons/SwipeSkipIcon";
import { SwipeStarIcon } from "@/components/icons/SwipeStarIcon";

type SwipeDirection = "left" | "right" | "top" | null;

interface SwipeDirectionOverlayProps {
  direction: SwipeDirection;
}

export function SwipeDirectionOverlay({
  direction,
}: SwipeDirectionOverlayProps) {
  const animatedStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    opacity: withSpring(direction ? 0.8 : 0),
    zIndex: 100,
  } as const;

  if (!direction) return null;

  return (
    <Animated.View style={animatedStyle}>
      <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-zinc-800/80">
        {direction === "left" && <SwipeSkipIcon />}
        {direction === "right" && <SwipeLikeIcon />}
        {direction === "top" && <SwipeStarIcon />}
      </View>
    </Animated.View>
  );
}
