import { memo } from "react";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { MARK_ACTIONS, type MarkActionsProps } from "./actionTypes";

export const MarkActions = memo(function MarkActionButton({
  selectedMark,
  onSelect,
}: MarkActionsProps) {
  return (
    <View className="w-full flex-row justify-between gap-4">
      {MARK_ACTIONS.map((action) => (
        <Pressable
          key={action.type}
          onPress={() => onSelect(action.type)}
          className="flex-1 flex-col items-center gap-1"
        >
          <View
            className={`flex-1 rounded-lg p-6 ${
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
