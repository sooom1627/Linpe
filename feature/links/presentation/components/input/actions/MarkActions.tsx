import { memo } from "react";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { MARK_ACTIONS, type MarkActionsProps } from "./actionTypes";

export const MarkActions = memo(function MarkActions({
  selectedMark,
  onSelect,
}: MarkActionsProps) {
  return (
    <View className="w-full flex-row justify-around gap-4">
      {MARK_ACTIONS.map((action) => (
        <Pressable
          key={action.type}
          onPress={() => onSelect(action.type)}
          className="flex-1 flex-col items-center gap-1"
        >
          <View
            testID={`mark-action-${action.type}`}
            className={`flex-1 items-center justify-center rounded-lg px-8 py-6 ${
              selectedMark === action.type
                ? "bg-zinc-700 dark:bg-zinc-100"
                : "bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <action.icon
              strokeWidth={1.5}
              size={16}
              color={selectedMark === action.type ? "white" : "black"}
            />
          </View>
          <ThemedText
            testID={`mark-action-text-${action.type}`}
            text={action.label}
            variant="caption"
            weight={selectedMark === action.type ? "semibold" : "medium"}
            color="default"
          />
        </Pressable>
      ))}
    </View>
  );
});
