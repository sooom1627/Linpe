import { View } from "react-native";
import Animated, { withSpring } from "react-native-reanimated";
import {
  CircleArrowLeft,
  CircleArrowRight,
  CircleCheck,
} from "lucide-react-native";

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
      <View
        className={`mt-6 h-[40px] w-[40px] items-center justify-center rounded-full ${
          direction === "top" ? "bg-accent-400" : "bg-zinc-800/80"
        }`}
      >
        {direction === "left" && <CircleArrowLeft color="white" size={24} />}
        {direction === "right" && <CircleArrowRight color="white" size={24} />}
        {direction === "top" && <CircleCheck color="white" size={24} />}
      </View>
    </Animated.View>
  );
}
