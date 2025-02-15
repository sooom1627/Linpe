import React from "react";
import { View } from "react-native";

interface PaginationDotsProps {
  totalCount: number;
  currentIndex: number;
  accessibilityLabel?: string;
  testID?: string;
}

export const PaginationDots = React.memo(
  ({
    totalCount,
    currentIndex,
    accessibilityLabel = "Page indicator",
    testID,
  }: PaginationDotsProps) => {
    if (totalCount <= 0) throw new Error("totalCount must be positive");
    if (currentIndex < 0 || currentIndex >= totalCount) {
      throw new Error("currentIndex must be >= 0 and < totalCount");
    }

    return (
      <View
        className="flex flex-row justify-center gap-2"
        accessibilityRole="tablist"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {[...new Array(totalCount)].map((_, index) => (
          <View
            key={index}
            accessibilityRole="tab"
            accessibilityState={{ selected: index === currentIndex }}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? "bg-accent" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    );
  },
);

PaginationDots.displayName = "PaginationDots";
