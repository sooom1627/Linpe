import { View } from "react-native";

import { ActionButton } from "@/components/actions/ActionButton";
import { SwipeLikeIcon } from "@/components/icons/SwipeLikeIcon";
import { SwipeSkipIcon } from "@/components/icons/SwipeSkipIcon";
import { SwipeStarIcon } from "@/components/icons/SwipeStarIcon";

interface SwipeActionsProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeTop?: () => void;
}

export const SwipeActions = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeTop,
}: SwipeActionsProps) => {
  return (
    <View className="flex flex-row items-center justify-center gap-6">
      <ActionButton
        onPress={onSwipeRight}
        accessibilityLabel="Like"
        accessibilityHint="Like this card"
      >
        <SwipeLikeIcon />
      </ActionButton>

      <ActionButton
        onPress={onSwipeTop}
        accessibilityLabel="Star"
        accessibilityHint="Star this card"
      >
        <SwipeStarIcon />
      </ActionButton>

      <ActionButton
        onPress={onSwipeLeft}
        accessibilityLabel="Skip"
        accessibilityHint="Skip this card"
      >
        <SwipeSkipIcon />
      </ActionButton>
    </View>
  );
};
