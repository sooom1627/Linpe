import { View } from "react-native";

import { ActionButton } from "@/components/actions/ActionButton";
import { ThemedText } from "@/components/text/ThemedText";
import { SWIPE_ACTIONS, type SwipeActionsProps } from "./actionTypes";

export const SwipeActions = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeTop,
}: SwipeActionsProps) => {
  const getActionHandler = (type: (typeof SWIPE_ACTIONS)[number]["type"]) => {
    switch (type) {
      case "month":
        return onSwipeLeft;
      case "today":
        return onSwipeTop;
      case "weekend":
        return onSwipeRight;
    }
  };

  return (
    <View className="flex flex-row items-center justify-center gap-2">
      {SWIPE_ACTIONS.map((action) => (
        <View
          key={action.type}
          className="flex w-24 flex-col items-center justify-center gap-1"
        >
          <ActionButton
            onPress={getActionHandler(action.type)}
            accessibilityLabel={action.accessibilityLabel}
            accessibilityHint={action.accessibilityHint}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <action.icon size={24} color="white" strokeWidth={1} />
          </ActionButton>
          <ThemedText
            text={action.label}
            variant="caption"
            weight="normal"
            color="muted"
          />
        </View>
      ))}
    </View>
  );
};
