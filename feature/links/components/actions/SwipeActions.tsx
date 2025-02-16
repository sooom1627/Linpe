import { TouchableOpacity, View } from "react-native";

import { SwipeLikeIcon } from "../../../../components/icons/SwipeLikeIcon";
import { SwipeSkipIcon } from "../../../../components/icons/SwipeSkipIcon";
import { SwipeStarIcon } from "../../../../components/icons/SwipeStarIcon";

interface SwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeTop: () => void;
}

export function SwipeActions({
  onSwipeLeft,
  onSwipeRight,
  onSwipeTop,
}: SwipeActionsProps) {
  return (
    <View className="flex flex-row justify-center gap-6 px-4">
      <TouchableOpacity
        onPress={onSwipeLeft}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Skip"
        accessibilityHint="Skip this card"
        className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-zinc-700 shadow-sm active:opacity-90"
      >
        <SwipeSkipIcon />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSwipeTop}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Star"
        accessibilityHint="Star this card"
        className="h-12 w-12 items-center justify-center rounded-full bg-zinc-700 shadow-sm active:opacity-90"
      >
        <SwipeStarIcon />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSwipeRight}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Like"
        accessibilityHint="Like this card"
        className="h-12 w-12 items-center justify-center rounded-full bg-zinc-700 shadow-sm active:opacity-90"
      >
        <SwipeLikeIcon />
      </TouchableOpacity>
    </View>
  );
}
