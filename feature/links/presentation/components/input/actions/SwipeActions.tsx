import { View } from "react-native";
import { ArrowUpFromLine, ListEnd, ListPlus } from "lucide-react-native";

import { ActionButton } from "@/components/actions/ActionButton";
import { ThemedText } from "@/components/text/ThemedText";

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
    <View className="flex flex-row items-center justify-center gap-2">
      <View className="flex w-24 flex-col items-center justify-center gap-1">
        <ActionButton
          onPress={onSwipeLeft}
          accessibilityLabel="Skip"
          accessibilityHint="Skip this card"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <ListEnd size={24} color="white" strokeWidth={1} />
        </ActionButton>
        <ThemedText
          text="In month"
          variant="caption"
          weight="normal"
          color="muted"
        />
      </View>
      <View className="flex w-24 flex-col items-center justify-center gap-1">
        <ActionButton
          onPress={onSwipeTop}
          accessibilityLabel="Star"
          accessibilityHint="Star this card"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <ArrowUpFromLine size={24} color="white" strokeWidth={1} />
        </ActionButton>
        <ThemedText
          text="Today"
          variant="caption"
          weight="normal"
          color="muted"
        />
      </View>
      <View className="flex w-24 flex-col items-center justify-center gap-1">
        <ActionButton
          onPress={onSwipeRight}
          accessibilityLabel="Like"
          accessibilityHint="Like this card"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <ListPlus size={24} color="white" strokeWidth={1} />
        </ActionButton>
        <ThemedText
          text="In weekend"
          variant="caption"
          weight="normal"
          color="muted"
        />
      </View>
    </View>
  );
};
