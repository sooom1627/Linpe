import { Text, View } from "react-native";

import { useUserContext } from "@/feature/user/contexts/UserContext";

export const Header = () => {
  const { user } = useUserContext();

  return (
    <View className="items-left justify-left h-16 flex-row border-b border-zinc-200 px-6 py-4">
      <View className="flex-row items-center justify-center gap-4">
        <View className="h-10 w-10 rounded-full bg-gray-500"></View>
        <Text className="font-medium text-2xl leading-none">
          Hi, {user?.username ?? "Guest"}.
        </Text>
      </View>
    </View>
  );
};
