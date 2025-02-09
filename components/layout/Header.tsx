import { Text, View } from "react-native";

export const Header = () => {
  return (
    <View className="items-left h-16 flex-row justify-between px-6 py-4">
      <View className="items-left flex-row justify-center gap-2">
        <View className="h-8 w-8 rounded-full bg-gray-500"></View>
        <Text className="line-height-1 text-base"> User Name</Text>
      </View>
    </View>
  );
};
