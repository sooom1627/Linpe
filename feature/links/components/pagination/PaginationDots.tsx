import { View } from "react-native";

interface PaginationDotsProps {
  totalCount: number;
  currentIndex: number;
}

export function PaginationDots({
  totalCount,
  currentIndex,
}: PaginationDotsProps) {
  return (
    <View className="flex flex-row justify-center gap-2">
      {Array.from({ length: totalCount }).map((_, index) => (
        <View
          key={index}
          className={`h-2 w-2 rounded-full ${
            index === currentIndex ? "bg-accent" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );
}
