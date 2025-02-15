import { Text, TouchableOpacity, View } from "react-native";

interface SwipeFinishCardProps {
  onReload: () => void;
}

export function SwipeFinishCard({ onReload }: SwipeFinishCardProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-4 text-xl font-medium text-gray-800">
        You&apos;ve seen all cards
      </Text>
      <TouchableOpacity
        onPress={onReload}
        className="rounded-xl bg-accent px-8 py-4"
      >
        <Text className="text-base font-medium text-white">View Again</Text>
      </TouchableOpacity>
    </View>
  );
}
