import { TouchableOpacity, View } from "react-native";

import { SwipeLikeIcon } from "../../../../components/icons/SwipeLikeIcon";
import { SwipeSkipIcon } from "../../../../components/icons/SwipeSkipIcon";

interface SwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeActions({ onSwipeLeft, onSwipeRight }: SwipeActionsProps) {
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
