import { TouchableOpacity, View } from "react-native";

import { SwipeBackIcon } from "../../../../components/icons/SwipeBackIcon";
import { SwipeLikeIcon } from "../../../../components/icons/SwipeLikeIcon";
import { SwipeSkipIcon } from "../../../../components/icons/SwipeSkipIcon";

interface SwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeBack: () => void;
  onSwipeRight: () => void;
  canSwipeBack: boolean;
}

export function SwipeActions({
  onSwipeLeft,
  onSwipeBack,
  onSwipeRight,
  canSwipeBack,
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
        onPress={onSwipeBack}
        disabled={!canSwipeBack}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        accessibilityHint="Return to the previous card"
        className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-zinc-700 shadow-sm active:opacity-90 disabled:opacity-40"
      >
        <SwipeBackIcon />
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
