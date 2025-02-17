import { Text, View } from "react-native";

export function SwipeLoadingState() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Loading...</Text>
    </View>
  );
}

export function SwipeErrorState() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Error loading data</Text>
    </View>
  );
}

export function SwipeEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text className="text-center text-lg font-medium text-gray-700 dark:text-gray-300">
        No Links Found
      </Text>
      <Text className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        Add new links to start swiping
      </Text>
    </View>
  );
}
