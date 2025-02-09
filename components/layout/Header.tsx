import { Text, View } from "react-native";

export const Header = () => {
  return (
    <View className="items-left justify-left h-16 flex-row border-b border-zinc-200 px-6 py-4">
      <View className="items-left flex-row items-center justify-center gap-2">
        <View className="h-8 w-8 rounded-full bg-gray-500"></View>
        <Text className="font-medium text-base leading-none">Hi, Soma.</Text>
      </View>
    </View>
  );
};
